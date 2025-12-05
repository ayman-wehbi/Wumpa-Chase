import { AppState } from './index';
import { ThemeMode } from '../context/ThemeContext';

export interface BackupMetadata {
  version: string;
  appVersion: string;
  timestamp: string;
  platform: 'android';
  backupType: 'automatic' | 'manual';
  totalLevels: number;
  totalGems: number;
  collectedGems: number;
}

export interface BackupData {
  metadata: BackupMetadata;
  progress: AppState;
  theme: ThemeMode;
}

export interface BackupFileInfo {
  filename: string;
  filepath: string;
  timestamp: string;
  displayDate: string;
  backupType: 'automatic' | 'manual';
  size?: number;
  metadata?: BackupMetadata;
}

export interface BackupStats {
  totalGems: number;
  collectedGems: number;
  completionPercentage: number;
  platinumCount: number;
  nsanelyCount: number;
  lastUpdated: string;
}
