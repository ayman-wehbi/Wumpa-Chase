import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Share from 'react-native-share';
import { AppState, BackupData, BackupMetadata, BackupFileInfo, BackupStats } from '../types';
import { ThemeMode } from '../context/ThemeContext';

const BACKUP_DIR = `${RNFS.DocumentDirectoryPath}/CrashTracker/backups/auto`;
const LAST_BACKUP_KEY = '@CrashTracker:lastBackupTime';
const MAX_AUTO_BACKUPS = 7;

class BackupService {
  /**
   * Initialize backup directory on app start
   */
  async initialize(): Promise<void> {
    try {
      const exists = await RNFS.exists(BACKUP_DIR);
      if (!exists) {
        await RNFS.mkdir(BACKUP_DIR);
        console.log('Backup directory created:', BACKUP_DIR);
      }
    } catch (error) {
      console.error('Failed to initialize backup directory:', error);
    }
  }

  /**
   * Check if automatic backup is needed (once per day)
   */
  async shouldCreateAutoBackup(): Promise<boolean> {
    try {
      const lastBackupTime = await AsyncStorage.getItem(LAST_BACKUP_KEY);
      if (!lastBackupTime) {
        return true;
      }

      const lastBackup = new Date(lastBackupTime);
      const now = new Date();
      const hoursSinceLastBackup =
        (now.getTime() - lastBackup.getTime()) / (1000 * 60 * 60);

      // Backup once per day (24 hours)
      return hoursSinceLastBackup >= 24;
    } catch (error) {
      console.error('Error checking backup time:', error);
      return true; // Backup if we can't check
    }
  }

  /**
   * Count collected gems from progress data
   */
  private countCollectedGems(progressData: AppState): number {
    let count = 0;
    progressData.levels.forEach(level => {
      const normalGems = Object.values(level.progress.normalMode).filter(
        Boolean,
      ).length;
      const nVertedGems = Object.values(level.progress.nVertedMode).filter(
        Boolean,
      ).length;
      count += normalGems + nVertedGems;
    });
    return count;
  }

  /**
   * Create automatic backup
   */
  async createAutomaticBackup(
    progressData: AppState,
    themeMode: ThemeMode,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Ensure directory exists
      await this.initialize();

      // Create backup data
      const metadata: BackupMetadata = {
        version: '1.0.0',
        appVersion: '1.0.0',
        timestamp: new Date().toISOString(),
        platform: 'android',
        backupType: 'automatic',
        totalLevels: 38,
        totalGems: 38 * 12, // 38 levels × 12 gems per level
        collectedGems: this.countCollectedGems(progressData),
      };

      const backupData: BackupData = {
        metadata,
        progress: progressData,
        theme: themeMode,
      };

      // Generate filename
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, '-')
        .slice(0, -5);
      const filename = `crash_backup_auto_${timestamp}.crashbackup`;
      const filepath = `${BACKUP_DIR}/${filename}`;

      // Write file
      await RNFS.writeFile(filepath, JSON.stringify(backupData, null, 2), 'utf8');

      // Update last backup time
      await AsyncStorage.setItem(LAST_BACKUP_KEY, new Date().toISOString());

      // Cleanup old backups
      await this.cleanupOldBackups();

      console.log('Automatic backup created:', filename);
      return { success: true };
    } catch (error) {
      console.error('Auto backup failed:', error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * Create manual backup and trigger share sheet
   */
  async exportBackup(
    progressData: AppState,
    themeMode: ThemeMode,
  ): Promise<{ success: boolean; filepath?: string; error?: string }> {
    try {
      // Create backup data
      const metadata: BackupMetadata = {
        version: '1.0.0',
        appVersion: '1.0.0',
        timestamp: new Date().toISOString(),
        platform: 'android',
        backupType: 'manual',
        totalLevels: 38,
        totalGems: 38 * 12,
        collectedGems: this.countCollectedGems(progressData),
      };

      const backupData: BackupData = {
        metadata,
        progress: progressData,
        theme: themeMode,
      };

      // Create in cache directory for sharing (FileProvider compatible)
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, '-')
        .slice(0, -5);
      const filename = `crash_backup_manual_${timestamp}.crashbackup`;
      const tempPath = `${RNFS.CachesDirectoryPath}/${filename}`;

      await RNFS.writeFile(tempPath, JSON.stringify(backupData, null, 2), 'utf8');

      // Trigger share sheet using react-native-share
      const shareOptions = {
        title: 'Export Crash Tracker Backup',
        message: 'Save your Crash Bandicoot 4 progress backup',
        url: `file://${tempPath}`,
        type: 'application/json',
        filename: filename,
        subject: 'Crash Tracker Backup',
        failOnCancel: false,
      };

      try {
        await Share.open(shareOptions);
        console.log('Manual backup exported:', filename);
        return { success: true, filepath: tempPath };
      } catch (error: any) {
        // User cancelled - still consider it successful
        if (error.message && error.message.includes('User did not share')) {
          console.log('User cancelled backup export');
          return { success: true, filepath: tempPath };
        }
        throw error;
      }
    } catch (error) {
      console.error('Export failed:', error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * Get list of available automatic backups
   */
  async getAutoBackupList(): Promise<BackupFileInfo[]> {
    try {
      const exists = await RNFS.exists(BACKUP_DIR);
      if (!exists) {
        return [];
      }

      const files = await RNFS.readDir(BACKUP_DIR);
      const backupFiles = files
        .filter(f => f.name.endsWith('.crashbackup'))
        .sort((a, b) => (b.mtime?.getTime() ?? 0) - (a.mtime?.getTime() ?? 0)); // Newest first

      const backupInfos: BackupFileInfo[] = [];
      for (const file of backupFiles) {
        try {
          const content = await RNFS.readFile(file.path, 'utf8');
          const data: BackupData = JSON.parse(content);

          backupInfos.push({
            filename: file.name,
            filepath: file.path,
            timestamp: data.metadata.timestamp,
            displayDate: new Date(data.metadata.timestamp).toLocaleString(),
            backupType: data.metadata.backupType,
            size: file.size,
            metadata: data.metadata,
          });
        } catch {
          // Skip corrupted files
          continue;
        }
      }

      return backupInfos;
    } catch (error) {
      console.error('Failed to list backups:', error);
      return [];
    }
  }

  /**
   * Get list of manual backups from Downloads folder
   */
  async getDownloadsBackupList(): Promise<BackupFileInfo[]> {
    try {
      const downloadsPath = `${RNFS.DownloadDirectoryPath}`;
      const exists = await RNFS.exists(downloadsPath);
      if (!exists) {
        return [];
      }

      const files = await RNFS.readDir(downloadsPath);
      const backupFiles = files
        .filter(f => f.name.endsWith('.crashbackup'))
        .sort((a, b) => (b.mtime?.getTime() ?? 0) - (a.mtime?.getTime() ?? 0)); // Newest first

      const backupInfos: BackupFileInfo[] = [];
      for (const file of backupFiles) {
        try {
          const content = await RNFS.readFile(file.path, 'utf8');
          const data: BackupData = JSON.parse(content);

          backupInfos.push({
            filename: file.name,
            filepath: file.path,
            timestamp: data.metadata.timestamp,
            displayDate: new Date(data.metadata.timestamp).toLocaleString(),
            backupType: 'manual',
            size: file.size,
            metadata: data.metadata,
          });
        } catch {
          // Skip corrupted files
          continue;
        }
      }

      return backupInfos;
    } catch (error) {
      console.error('Failed to list downloads backups:', error);
      return [];
    }
  }

  /**
   * Load and parse a backup file
   */
  async loadBackup(filepath: string): Promise<BackupData | null> {
    try {
      const content = await RNFS.readFile(filepath, 'utf8');
      const data: BackupData = JSON.parse(content);
      return data;
    } catch (error) {
      console.error('Failed to load backup:', error);
      return null;
    }
  }

  /**
   * Import backup from external file (content:// or file:// URI)
   */
  async importExternalBackup(uri: string): Promise<BackupData | null> {
    try {
      // Handle both content:// and file:// URIs
      const filePath = uri.replace('file://', '');
      const content = await RNFS.readFile(filePath, 'utf8');
      const data: BackupData = JSON.parse(content);
      return data;
    } catch (error) {
      console.error('Failed to import external backup:', error);
      return null;
    }
  }

  /**
   * Validate backup data structure
   */
  validateBackup(data: any): boolean {
    try {
      // Check required structure
      if (!data.metadata || !data.progress || !data.theme) {
        return false;
      }

      // Check metadata
      if (!data.metadata.version || !data.metadata.timestamp) {
        return false;
      }

      // Check progress structure
      if (!Array.isArray(data.progress.levels)) {
        return false;
      }
      if (data.progress.levels.length === 0) {
        return false;
      }

      // Validate first level structure
      const firstLevel = data.progress.levels[0];
      if (!firstLevel.id || !firstLevel.name || !firstLevel.progress) {
        return false;
      }

      // Check theme
      if (!['light', 'dark', 'auto'].includes(data.theme)) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Calculate backup statistics for preview
   */
  calculateBackupStats(data: BackupData): BackupStats {
    let platinumCount = 0;
    let nsanelyCount = 0;

    data.progress.levels.forEach(level => {
      if (level.progress.platinumTimeTrial.completed) {
        platinumCount++;
      }
      if (level.progress.nsanelyPerfectRelic.completed) {
        nsanelyCount++;
      }
    });

    const totalGems = data.metadata.totalGems;
    const collectedGems = data.metadata.collectedGems;
    const gemPercentage = (collectedGems / totalGems) * 100;
    const platinumPercentage = (platinumCount / 38) * 100;
    const nsanelyPercentage = (nsanelyCount / 38) * 100;
    const completionPercentage =
      (gemPercentage + platinumPercentage + nsanelyPercentage) / 3;

    return {
      totalGems,
      collectedGems,
      completionPercentage,
      platinumCount,
      nsanelyCount,
      lastUpdated: data.progress.lastUpdated || data.metadata.timestamp,
    };
  }

  /**
   * Delete old automatic backups (keep only last 7)
   */
  async cleanupOldBackups(): Promise<void> {
    try {
      const backupList = await this.getAutoBackupList();
      const autoBackups = backupList.filter(b => b.backupType === 'automatic');

      if (autoBackups.length > MAX_AUTO_BACKUPS) {
        const toDelete = autoBackups.slice(MAX_AUTO_BACKUPS);
        for (const backup of toDelete) {
          await RNFS.unlink(backup.filepath);
          console.log('Deleted old backup:', backup.filename);
        }
      }
    } catch (error) {
      console.error('Failed to cleanup old backups:', error);
    }
  }

  /**
   * Delete specific backup file
   */
  async deleteBackup(filepath: string): Promise<boolean> {
    try {
      await RNFS.unlink(filepath);
      return true;
    } catch (error) {
      console.error('Failed to delete backup:', error);
      return false;
    }
  }
}

export default new BackupService();
