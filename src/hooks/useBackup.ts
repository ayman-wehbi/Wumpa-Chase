import { useState, useCallback } from 'react';
import BackupService from '../services/BackupService';
import { useProgress } from '../context/ProgressContext';
import { useTheme } from '../context/ThemeContext';
import { BackupFileInfo, BackupData } from '../types';

export const useBackup = () => {
  const [loading, setLoading] = useState(false);
  const [backupList, setBackupList] = useState<BackupFileInfo[]>([]);
  const { levels, loadProgressFromBackup } = useProgress();
  const { themeMode, setThemeMode } = useTheme();

  // Refresh list of available backups
  const refreshBackupList = useCallback(async () => {
    setLoading(true);
    try {
      const list = await BackupService.getAutoBackupList();
      setBackupList(list);
    } catch (error) {
      console.error('Failed to refresh backup list:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create automatic backup
  const createAutoBackup = useCallback(async () => {
    const progressData = { levels, lastUpdated: new Date().toISOString() };
    return await BackupService.createAutomaticBackup(progressData, themeMode);
  }, [levels, themeMode]);

  // Export manual backup
  const exportBackup = useCallback(async () => {
    setLoading(true);
    try {
      const progressData = { levels, lastUpdated: new Date().toISOString() };
      const result = await BackupService.exportBackup(progressData, themeMode);
      return result;
    } catch (error) {
      console.error('Export failed:', error);
      return { success: false, error: String(error) };
    } finally {
      setLoading(false);
    }
  }, [levels, themeMode]);

  // Restore from backup file
  const restoreBackup = useCallback(
    async (filepath: string) => {
      setLoading(true);
      try {
        const backupData = await BackupService.loadBackup(filepath);
        if (!backupData) {
          return { success: false, error: 'Failed to load backup' };
        }

        if (!BackupService.validateBackup(backupData)) {
          return { success: false, error: 'Invalid backup file' };
        }

        // Restore progress and theme
        await loadProgressFromBackup(backupData.progress);
        setThemeMode(backupData.theme);

        return { success: true };
      } catch (error) {
        console.error('Restore failed:', error);
        return { success: false, error: String(error) };
      } finally {
        setLoading(false);
      }
    },
    [loadProgressFromBackup, setThemeMode],
  );

  // Get backup stats for preview
  const getBackupStats = useCallback((backupData: BackupData) => {
    return BackupService.calculateBackupStats(backupData);
  }, []);

  return {
    loading,
    backupList,
    refreshBackupList,
    createAutoBackup,
    exportBackup,
    restoreBackup,
    getBackupStats,
  };
};
