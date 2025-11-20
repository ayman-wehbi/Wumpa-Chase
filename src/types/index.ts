/**
 * TypeScript types and interfaces for Crash Bandicoot 4 Tracker
 */

/**
 * Represents the 6 gem checkboxes for each mode (Normal/N.Verted)
 */
export interface GemCheckboxes {
  allBoxes: boolean;
  wumpa80: boolean;
  deaths3OrLess: boolean;
  hiddenGem: boolean;
  nVertedAllBoxes: boolean;
  nVertedHiddenGem: boolean;
}

/**
 * Platinum Time Trial data
 */
export interface PlatinumTimeTrial {
  completed: boolean;
  time?: string; // Optional time in format "MM:SS.mmm"
  completionDate?: string; // ISO date string
  attempts: number;
}

/**
 * N.Sanely Perfect Relic data
 */
export interface NSanelyPerfectRelic {
  completed: boolean;
  completionDate?: string; // ISO date string
  attempts: number;
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
