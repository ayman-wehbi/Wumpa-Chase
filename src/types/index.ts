/**
 * TypeScript types and interfaces for Crash Bandicoot 4 Tracker
 */

/**
 * Represents the 6 gems for each mode (Normal/N.Verted)
 * Each gem is earned by completing specific challenges
 */
export interface GemCheckboxes {
  wumpa40: boolean;  // Collect 40% of Wumpa fruit
  wumpa60: boolean;  // Collect 60% of Wumpa fruit
  wumpa80: boolean;  // Collect 80% of Wumpa fruit
  allCrates: boolean;  // Break all crates
  deaths3OrLess: boolean;  // Die 3 times or less
  hiddenGem: boolean;  // Find the hidden gem
}

/**
 * Platinum Time Trial data
 */
export interface PlatinumTimeTrial {
  completed: boolean;
  time?: string; // Optional time in format "MM:SS.mmm"
  completionDate?: string; // ISO date string
  attempts: number;
  difficulty?: number; // Optional difficulty rating (1-10)
  note?: string; // Optional note from user
}

/**
 * N.Sanely Perfect Relic data
 */
export interface NSanelyPerfectRelic {
  completed: boolean;
  completionDate?: string; // ISO date string
  attempts: number;
  difficulty?: number; // Optional difficulty rating (1-10)
  note?: string; // Optional note from user
}

/**
 * Progress data for a single level
 */
export interface LevelProgress {
  normalMode: GemCheckboxes;
  nVertedMode: GemCheckboxes;
  platinumTimeTrial: PlatinumTimeTrial;
  nsanelyPerfectRelic: NSanelyPerfectRelic;
}

/**
 * Complete level data including metadata and progress
 */
export interface LevelData {
  id: string;
  name: string;
  dimension: string;
  progress: LevelProgress;
}

/**
 * Complete app state with all levels
 */
export interface AppState {
  levels: LevelData[];
  lastUpdated?: string; // ISO date string
}

/**
 * Stats calculation results
 */
export interface CompletionStats {
  totalGems: number;
  collectedGems: number;
  gemPercentage: number;
  platinumCompletions: number;
  nsanelyCompletions: number;
  overallPercentage: number;
}

/**
 * Progress over time data point for charts
 */
export interface ProgressDataPoint {
  date: string;
  completionPercentage: number;
  gemsCollected: number;
}

/**
 * Dimension-specific stats
 */
export interface DimensionStats {
  dimension: string;
  totalGems: number;
  collectedGems: number;
  completionPercentage: number;
}

/**
 * Share level data (subset of LevelData for sharing)
 */
export interface ShareLevelData {
  name: string;
  dimension: string;
  platinum: {
    completed: boolean;
    attempts: number;
    difficulty?: number;
    time?: string;
    completionDate?: string;
  };
  nsanely: {
    completed: boolean;
    attempts: number;
    difficulty?: number;
    completionDate?: string;
  };
}

/**
 * Share result
 */
export interface ShareResult {
  success: boolean;
  error?: string;
  cancelled?: boolean;
}

/**
 * Backup-related types
 */
export * from './backup';
