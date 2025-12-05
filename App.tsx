/**
 * Crash Bandicoot 4 Progress Tracker
 * A React Native app to track completion progress for Crash Bandicoot 4
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { ProgressProvider, useProgress } from './src/context/ProgressContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import BackupService from './src/services/BackupService';

function AppWithBackup() {
  const { currentTheme, isDarkMode, themeMode } = useTheme();
  const { levels, loading } = useProgress();

  // Initialize backup system and create automatic backup if needed
  useEffect(() => {
    const initializeBackups = async () => {
      try {
        await BackupService.initialize();

        // Only create backup if data is loaded
        if (!loading) {
          const shouldBackup = await BackupService.shouldCreateAutoBackup();
          if (shouldBackup) {
            const progressData = {
              levels,
              lastUpdated: new Date().toISOString(),
            };
            const result = await BackupService.createAutomaticBackup(
              progressData,
              themeMode,
            );

            if (result.success) {
              console.log('Automatic backup created successfully');
            } else {
              console.error('Automatic backup failed:', result.error);
            }
          }
        }
      } catch (error) {
        console.error('Backup initialization failed:', error);
      }
    };

    initializeBackups();
  }, [loading, levels, themeMode]);

  return (
    <PaperProvider theme={currentTheme}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={currentTheme.colors.surface}
      />
      <AppNavigator />
    </PaperProvider>
  );
}

function AppContent() {
  return (
    <ProgressProvider>
      <AppWithBackup />
    </ProgressProvider>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
