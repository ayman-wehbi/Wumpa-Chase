import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, LevelData, GemCheckboxes } from '../types';
import { INITIAL_LEVELS } from '../data/levels';

const STORAGE_KEY = '@CrashTracker:progress';

interface ProgressContextType {
  levels: LevelData[];
  loading: boolean;
  updateGemCheckbox: (
    levelId: string,
    mode: 'normalMode' | 'nVertedMode',
    gemType: keyof GemCheckboxes,
    value: boolean,
  ) => void;
  updatePlatinumCompletion: (levelId: string, completed: boolean) => void;
  updatePlatinumTime: (levelId: string, time: string) => void;
  updatePlatinumAttempts: (levelId: string, increment: boolean) => void;
  updatePlatinumDifficulty: (levelId: string, difficulty: number) => void;
  updatePlatinumDate: (levelId: string, date: string) => void;
  updatePlatinumNote: (levelId: string, note: string) => void;
  deletePlatinumNote: (levelId: string) => void;
  resetPlatinum: (levelId: string) => void;
  updateNSanelyCompletion: (levelId: string, completed: boolean) => void;
  updateNSanelyAttempts: (levelId: string, increment: boolean) => void;
  updateNSanelyDifficulty: (levelId: string, difficulty: number) => void;
  updateNSanelyDate: (levelId: string, date: string) => void;
  updateNSanelyNote: (levelId: string, note: string) => void;
  deleteNSanelyNote: (levelId: string) => void;
  resetNSanely: (levelId: string) => void;
  resetAllProgress: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(
  undefined,
);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

interface ProgressProviderProps {
  children: ReactNode;
}

export const ProgressProvider: React.FC<ProgressProviderProps> = ({
  children,
}) => {
  const [levels, setLevels] = useState<LevelData[]>(INITIAL_LEVELS);
  const [loading, setLoading] = useState(true);

  // Load progress from AsyncStorage on mount
  useEffect(() => {
    loadProgress();
  }, []);

  // Save progress to AsyncStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      saveProgress();
    }
  }, [levels, loading]);

  const loadProgress = async () => {
    try {
      const savedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const appState: AppState = JSON.parse(savedData);
        setLevels(appState.levels);
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async () => {
    try {
      const appState: AppState = {
        levels,
        lastUpdated: new Date().toISOString(),
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const updateLevel = (levelId: string, updater: (level: LevelData) => LevelData) => {
    setLevels(prevLevels =>
      prevLevels.map(level =>
        level.id === levelId ? updater(level) : level,
      ),
    );
  };

  const updateGemCheckbox = (
    levelId: string,
    mode: 'normalMode' | 'nVertedMode',
    gemType: keyof GemCheckboxes,
    value: boolean,
  ) => {
    updateLevel(levelId, level => ({
      ...level,
      progress: {
        ...level.progress,
        [mode]: {
          ...level.progress[mode],
          [gemType]: value,
        },
      },
    }));
  };

  const updatePlatinumCompletion = (levelId: string, completed: boolean) => {
    updateLevel(levelId, level => ({
      ...level,
      progress: {
        ...level.progress,
        platinumTimeTrial: {
          ...level.progress.platinumTimeTrial,
          completed,
          completionDate: completed ? new Date().toISOString() : undefined,
        },
      },
    }));
  };

  const updatePlatinumTime = (levelId: string, time: string) => {
    updateLevel(levelId, level => ({
      ...level,
      progress: {
        ...level.progress,
        platinumTimeTrial: {
          ...level.progress.platinumTimeTrial,
          time,
        },
      },
    }));
  };

  const updatePlatinumAttempts = (levelId: string, increment: boolean) => {
    updateLevel(levelId, level => ({
      ...level,
      progress: {
        ...level.progress,
        platinumTimeTrial: {
          ...level.progress.platinumTimeTrial,
          attempts: Math.max(
            0,
            level.progress.platinumTimeTrial.attempts + (increment ? 1 : -1),
          ),
        },
      },
    }));
  };

  const updateNSanelyCompletion = (levelId: string, completed: boolean) => {
    updateLevel(levelId, level => ({
      ...level,
      progress: {
        ...level.progress,
        nsanelyPerfectRelic: {
          ...level.progress.nsanelyPerfectRelic,
          completed,
          completionDate: completed ? new Date().toISOString() : undefined,
        },
      },
    }));
  };

  const updateNSanelyAttempts = (levelId: string, increment: boolean) => {
    updateLevel(levelId, level => ({
      ...level,
      progress: {
        ...level.progress,
        nsanelyPerfectRelic: {
          ...level.progress.nsanelyPerfectRelic,
          attempts: Math.max(
            0,
            level.progress.nsanelyPerfectRelic.attempts + (increment ? 1 : -1),
          ),
        },
      },
    }));
  };

  const updatePlatinumDifficulty = (levelId: string, difficulty: number) => {
    updateLevel(levelId, level => ({
      ...level,
      progress: {
        ...level.progress,
        platinumTimeTrial: {
          ...level.progress.platinumTimeTrial,
          difficulty,
        },
      },
    }));
  };

  const updatePlatinumDate = (levelId: string, date: string) => {
    updateLevel(levelId, level => ({
      ...level,
      progress: {
        ...level.progress,
        platinumTimeTrial: {
          ...level.progress.platinumTimeTrial,
          completionDate: date,
        },
      },
    }));
  };

  const updateNSanelyDifficulty = (levelId: string, difficulty: number) => {
    updateLevel(levelId, level => ({
      ...level,
      progress: {
        ...level.progress,
        nsanelyPerfectRelic: {
          ...level.progress.nsanelyPerfectRelic,
          difficulty,
        },
      },
    }));
  };

  const updateNSanelyDate = (levelId: string, date: string) => {
    updateLevel(levelId, level => ({
      ...level,
      progress: {
        ...level.progress,
        nsanelyPerfectRelic: {
          ...level.progress.nsanelyPerfectRelic,
          completionDate: date,
        },
      },
    }));
  };

  const updatePlatinumNote = (levelId: string, note: string) => {
    updateLevel(levelId, level => ({
      ...level,
      progress: {
        ...level.progress,
        platinumTimeTrial: {
          ...level.progress.platinumTimeTrial,
          note,
        },
      },
    }));
  };

  const deletePlatinumNote = (levelId: string) => {
    updateLevel(levelId, level => ({
      ...level,
      progress: {
        ...level.progress,
        platinumTimeTrial: {
          ...level.progress.platinumTimeTrial,
          note: undefined,
        },
      },
    }));
  };

  const resetPlatinum = (levelId: string) => {
    updateLevel(levelId, level => ({
      ...level,
      progress: {
        ...level.progress,
        platinumTimeTrial: {
          completed: false,
          attempts: 0,
        },
      },
    }));
  };

  const updateNSanelyNote = (levelId: string, note: string) => {
    updateLevel(levelId, level => ({
      ...level,
      progress: {
        ...level.progress,
        nsanelyPerfectRelic: {
          ...level.progress.nsanelyPerfectRelic,
          note,
        },
      },
    }));
  };

  const deleteNSanelyNote = (levelId: string) => {
    updateLevel(levelId, level => ({
      ...level,
      progress: {
        ...level.progress,
        nsanelyPerfectRelic: {
          ...level.progress.nsanelyPerfectRelic,
          note: undefined,
        },
      },
    }));
  };

  const resetNSanely = (levelId: string) => {
    updateLevel(levelId, level => ({
      ...level,
      progress: {
        ...level.progress,
        nsanelyPerfectRelic: {
          completed: false,
          attempts: 0,
        },
      },
    }));
  };

  const resetAllProgress = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setLevels(INITIAL_LEVELS);
    } catch (error) {
      console.error('Failed to reset progress:', error);
    }
  };

  const value: ProgressContextType = {
    levels,
    loading,
    updateGemCheckbox,
    updatePlatinumCompletion,
    updatePlatinumTime,
    updatePlatinumAttempts,
    updatePlatinumDifficulty,
    updatePlatinumDate,
    updatePlatinumNote,
    deletePlatinumNote,
    resetPlatinum,
    updateNSanelyCompletion,
    updateNSanelyAttempts,
    updateNSanelyDifficulty,
    updateNSanelyDate,
    updateNSanelyNote,
    deleteNSanelyNote,
    resetNSanely,
    resetAllProgress,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};
