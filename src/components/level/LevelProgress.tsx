import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ProgressBar, Text, useTheme } from 'react-native-paper';
import { LevelProgress as LevelProgressType } from '../../types';

interface LevelProgressProps {
  progress: LevelProgressType;
}

export const LevelProgress: React.FC<LevelProgressProps> = ({ progress }) => {
  const theme = useTheme();

  const calculateProgress = (): number => {
    let completed = 0;
    const total = 14; // 6 normal + 6 nverted + 1 platinum + 1 nsanely

    // Count normal mode gems (6)
    const normalGems = Object.values(progress.normalMode).filter(Boolean).length;
    completed += normalGems;

    // Count nverted mode gems (6)
    const nvertedGems = Object.values(progress.nVertedMode).filter(Boolean).length;
    completed += nvertedGems;

    // Count platinum (1)
    if (progress.platinumTimeTrial.completed) {
      completed += 1;
    }

    // Count nsanely (1)
    if (progress.nsanelyPerfectRelic.completed) {
      completed += 1;
    }

    return completed / total;
  };

  const progressValue = calculateProgress();
  const percentage = Math.round(progressValue * 100);

  const getProgressColor = (): string => {
    if (progressValue === 1) {
      return theme.colors.tertiary;
    } else if (progressValue >= 0.5) {
      return theme.colors.secondary;
    } else if (progressValue > 0) {
      return theme.colors.primary;
    }
    return theme.colors.surfaceVariant;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
          Completion
        </Text>
        <Text
          variant="labelMedium"
          style={[styles.percentage, { color: getProgressColor() }]}
        >
          {percentage}%
        </Text>
      </View>
      <ProgressBar
        progress={progressValue}
        color={getProgressColor()}
        style={styles.progressBar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  percentage: {
    fontWeight: '700',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
});
