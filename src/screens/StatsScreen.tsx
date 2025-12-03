import React, { useMemo, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Dimensions } from 'react-native';
import { Appbar, Card, Text, useTheme, ProgressBar } from 'react-native-paper';
import { BarChart, PieChart } from 'react-native-chart-kit';
import Animated, {
  FadeInDown,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  runOnJS,
  withTiming,
  withSpring,
  Easing,
  LinearTransition,
} from 'react-native-reanimated';
import { useProgress } from '../context/ProgressContext';
import { DIMENSIONS, getLevelsByDimension } from '../data/levels';
import { CompletionStats, DimensionStats } from '../types';
import { MD3_TEXT_VARIANTS } from '../constants/typography';

const screenWidth = Dimensions.get('window').width;

export const StatsScreen: React.FC = () => {
  const theme = useTheme();
  const { levels } = useProgress();

  // State for displaying animated values
  const [displayOverallPercentage, setDisplayOverallPercentage] = useState(0);
  const [displayGemPercentage, setDisplayGemPercentage] = useState(0);
  const [displayPlatinumCount, setDisplayPlatinumCount] = useState(0);
  const [displayNsanelyCount, setDisplayNsanelyCount] = useState(0);
  const [displayOverallProgress, setDisplayOverallProgress] = useState(0);
  const [displayGemProgress, setDisplayGemProgress] = useState(0);

  const stats = useMemo((): CompletionStats => {
    let totalGems = 0;
    let collectedGems = 0;
    let platinumCompletions = 0;
    let nsanelyCompletions = 0;

    levels.forEach(level => {
      // Normal mode gems (6 per level)
      const normalGems = Object.values(level.progress.normalMode).filter(Boolean).length;
      collectedGems += normalGems;
      totalGems += 6;

      // N.Verted mode gems (6 per level)
      const nvertedGems = Object.values(level.progress.nVertedMode).filter(Boolean).length;
      collectedGems += nvertedGems;
      totalGems += 6;

      // Platinum completions
      if (level.progress.platinumTimeTrial.completed) {
        platinumCompletions += 1;
      }

      // N.Sanely completions
      if (level.progress.nsanelyPerfectRelic.completed) {
        nsanelyCompletions += 1;
      }
    });

    const gemPercentage = totalGems > 0 ? (collectedGems / totalGems) * 100 : 0;

    // Overall completion: gems + platinum + nsanely
    const totalItems = totalGems + levels.length * 2; // +2 for platinum and nsanely per level
    const completedItems = collectedGems + platinumCompletions + nsanelyCompletions;
    const overallPercentage = (completedItems / totalItems) * 100;

    return {
      totalGems,
      collectedGems,
      gemPercentage,
      platinumCompletions,
      nsanelyCompletions,
      overallPercentage,
    };
  }, [levels]);

  const dimensionStats = useMemo((): DimensionStats[] => {
    return DIMENSIONS.map(dimension => {
      const dimensionLevels = getLevelsByDimension(levels, dimension);
      let totalGems = 0;
      let collectedGems = 0;

      dimensionLevels.forEach(level => {
        const normalGems = Object.values(level.progress.normalMode).filter(Boolean).length;
        const nvertedGems = Object.values(level.progress.nVertedMode).filter(Boolean).length;
        collectedGems += normalGems + nvertedGems;
        totalGems += 12; // 6 normal + 6 nverted
      });

      return {
        dimension,
        totalGems,
        collectedGems,
        completionPercentage: totalGems > 0 ? (collectedGems / totalGems) * 100 : 0,
      };
    });
  }, [levels]);

  // Difficulty & Attempts Statistics
  const difficultyAttemptsStats = useMemo(() => {
    const platinumWithDifficulty = levels
      .filter(l => l.progress.platinumTimeTrial.completed && l.progress.platinumTimeTrial.difficulty)
      .map(l => ({ name: l.name, difficulty: l.progress.platinumTimeTrial.difficulty!, attempts: l.progress.platinumTimeTrial.attempts }));

    const nsanelyWithDifficulty = levels
      .filter(l => l.progress.nsanelyPerfectRelic.completed && l.progress.nsanelyPerfectRelic.difficulty)
      .map(l => ({ name: l.name, difficulty: l.progress.nsanelyPerfectRelic.difficulty!, attempts: l.progress.nsanelyPerfectRelic.attempts }));

    const allCompletedWithAttempts = levels
      .filter(l => l.progress.platinumTimeTrial.completed || l.progress.nsanelyPerfectRelic.completed)
      .map(l => ({
        name: l.name,
        platinumAttempts: l.progress.platinumTimeTrial.completed ? l.progress.platinumTimeTrial.attempts : 0,
        nsanelyAttempts: l.progress.nsanelyPerfectRelic.completed ? l.progress.nsanelyPerfectRelic.attempts : 0,
        totalAttempts: (l.progress.platinumTimeTrial.completed ? l.progress.platinumTimeTrial.attempts : 0) +
                      (l.progress.nsanelyPerfectRelic.completed ? l.progress.nsanelyPerfectRelic.attempts : 0)
      }));

    const topHardestPlatinum = [...platinumWithDifficulty]
      .sort((a, b) => b.difficulty - a.difficulty)
      .slice(0, 5);

    const topHardestNsanely = [...nsanelyWithDifficulty]
      .sort((a, b) => b.difficulty - a.difficulty)
      .slice(0, 5);

    const topMostTried = [...allCompletedWithAttempts]
      .sort((a, b) => b.totalAttempts - a.totalAttempts)
      .slice(0, 5);

    const completedPlatinum = levels.filter(l => l.progress.platinumTimeTrial.completed);
    const completedNsanely = levels.filter(l => l.progress.nsanelyPerfectRelic.completed);

    const avgPlatinumAttempts = completedPlatinum.length > 0
      ? completedPlatinum.reduce((sum, l) => sum + l.progress.platinumTimeTrial.attempts, 0) / completedPlatinum.length
      : 0;

    const avgNsanelyAttempts = completedNsanely.length > 0
      ? completedNsanely.reduce((sum, l) => sum + l.progress.nsanelyPerfectRelic.attempts, 0) / completedNsanely.length
      : 0;

    return {
      topHardestPlatinum,
      topHardestNsanely,
      topMostTried,
      avgPlatinumAttempts,
      avgNsanelyAttempts,
    };
  }, [levels]);

  // Time Trial Performance Statistics
  const timeTrialStats = useMemo(() => {
    const parseTime = (timeStr: string): number => {
      // Parse MM:SS.mmm format to milliseconds
      if (!timeStr || typeof timeStr !== 'string') return Infinity;

      const parts = timeStr.split(':');
      if (parts.length !== 2) return Infinity;

      const minutes = parseInt(parts[0]);
      const secondsParts = parts[1].split('.');
      const seconds = parseInt(secondsParts[0]);
      const milliseconds = parseInt(secondsParts[1] || '0');

      // Validate parsed values
      if (isNaN(minutes) || isNaN(seconds) || isNaN(milliseconds)) return Infinity;
      if (minutes < 0 || seconds < 0 || seconds >= 60 || milliseconds < 0 || milliseconds >= 1000) {
        return Infinity;
      }

      return minutes * 60000 + seconds * 1000 + milliseconds;
    };

    const formatTime = (ms: number): string => {
      if (!isFinite(ms) || ms < 0) return 'N/A';
      const minutes = Math.floor(ms / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      const millis = ms % 1000;
      return `${minutes}:${seconds.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`;
    };

    const completedWithTimes = levels
      .filter(l => l.progress.platinumTimeTrial.completed && l.progress.platinumTimeTrial.time)
      .map(l => ({
        name: l.name,
        time: l.progress.platinumTimeTrial.time!,
        timeMs: parseTime(l.progress.platinumTimeTrial.time!)
      }));

    const subMinuteCount = completedWithTimes.filter(l => l.timeMs < 60000).length;

    const avgTime = completedWithTimes.length > 0
      ? completedWithTimes.reduce((sum, l) => sum + l.timeMs, 0) / completedWithTimes.length
      : 0;

    return {
      subMinuteCount,
      avgTime,
      avgTimeFormatted: avgTime > 0 ? formatTime(avgTime) : 'N/A',
    };
  }, [levels]);

  // Achievement/Milestone Statistics
  const achievementStats = useMemo(() => {
    const firstTryPlatinum = levels
      .filter(l => l.progress.platinumTimeTrial.completed && l.progress.platinumTimeTrial.attempts === 1)
      .map(l => l.name);

    const firstTryNsanely = levels
      .filter(l => l.progress.nsanelyPerfectRelic.completed && l.progress.nsanelyPerfectRelic.attempts === 1)
      .map(l => l.name);

    const levelsWithAttempts = levels
      .filter(l => l.progress.platinumTimeTrial.completed || l.progress.nsanelyPerfectRelic.completed)
      .map(l => ({
        name: l.name,
        attempts: l.progress.platinumTimeTrial.attempts + l.progress.nsanelyPerfectRelic.attempts
      }))
      .filter(l => l.attempts > 0);

    const mostPersistent = levelsWithAttempts.length > 0
      ? levelsWithAttempts.reduce((max, l) => l.attempts > max.attempts ? l : max)
      : null;

    const perfectLevels = levels.filter(l => {
      const normalGems = Object.values(l.progress.normalMode).filter(Boolean).length;
      const nvertedGems = Object.values(l.progress.nVertedMode).filter(Boolean).length;
      return normalGems === 6 && nvertedGems === 6 &&
             l.progress.platinumTimeTrial.completed &&
             l.progress.nsanelyPerfectRelic.completed;
    }).map(l => l.name);

    return {
      firstTryPlatinum,
      firstTryNsanely,
      firstTryTotal: firstTryPlatinum.length + firstTryNsanely.length,
      mostPersistent,
      perfectLevels,
      perfectCount: perfectLevels.length,
    };
  }, [levels]);

  // Gap Analysis - What's Remaining
  const gapAnalysis = useMemo(() => {
    // Levels with no progress at all
    const untouchedLevels = levels.filter(l => {
      const normalGems = Object.values(l.progress.normalMode).filter(Boolean).length;
      const nvertedGems = Object.values(l.progress.nVertedMode).filter(Boolean).length;
      return normalGems === 0 && nvertedGems === 0 &&
             !l.progress.platinumTimeTrial.completed &&
             !l.progress.nsanelyPerfectRelic.completed;
    });

    // Levels with partial gem completion (at least 1 gem, but not all 12)
    const partialGemLevels = levels.filter(l => {
      const normalGems = Object.values(l.progress.normalMode).filter(Boolean).length;
      const nvertedGems = Object.values(l.progress.nVertedMode).filter(Boolean).length;
      const totalGems = normalGems + nvertedGems;
      return totalGems > 0 && totalGems < 12;
    });

    // Levels missing platinum
    const missingPlatinum = levels.filter(l => !l.progress.platinumTimeTrial.completed);

    // Levels missing N.Sanely
    const missingNsanely = levels.filter(l => !l.progress.nsanelyPerfectRelic.completed);

    // Easiest remaining platinum challenges (by difficulty rating)
    const easiestRemainingPlatinum = missingPlatinum
      .filter(l => l.progress.platinumTimeTrial.difficulty && l.progress.platinumTimeTrial.difficulty > 0)
      .sort((a, b) => (a.progress.platinumTimeTrial.difficulty || 10) - (b.progress.platinumTimeTrial.difficulty || 10))
      .slice(0, 5);

    // Easiest remaining N.Sanely challenges (by difficulty rating)
    const easiestRemainingNsanely = missingNsanely
      .filter(l => l.progress.nsanelyPerfectRelic.difficulty && l.progress.nsanelyPerfectRelic.difficulty > 0)
      .sort((a, b) => (a.progress.nsanelyPerfectRelic.difficulty || 10) - (b.progress.nsanelyPerfectRelic.difficulty || 10))
      .slice(0, 5);

    return {
      untouchedLevels: untouchedLevels.map(l => l.name),
      untouchedCount: untouchedLevels.length,
      partialGemLevels: partialGemLevels.map(l => ({
        name: l.name,
        gemsCollected: Object.values(l.progress.normalMode).filter(Boolean).length +
                       Object.values(l.progress.nVertedMode).filter(Boolean).length
      })),
      partialGemCount: partialGemLevels.length,
      missingPlatinumCount: missingPlatinum.length,
      missingNsanelyCount: missingNsanely.length,
      easiestRemainingPlatinum,
      easiestRemainingNsanely,
    };
  }, [levels]);

  // Enhanced Dimension Analysis
  const dimensionAnalysis = useMemo(() => {
    const dimensionData = DIMENSIONS.map(dimension => {
      const dimensionLevels = getLevelsByDimension(levels, dimension);

      const platinumCompleted = dimensionLevels.filter(l => l.progress.platinumTimeTrial.completed);
      const nsanelyCompleted = dimensionLevels.filter(l => l.progress.nsanelyPerfectRelic.completed);

      const avgPlatinumDifficulty = platinumCompleted.length > 0
        ? platinumCompleted
            .filter(l => l.progress.platinumTimeTrial.difficulty)
            .reduce((sum, l) => sum + (l.progress.platinumTimeTrial.difficulty || 0), 0) /
            platinumCompleted.filter(l => l.progress.platinumTimeTrial.difficulty).length
        : 0;

      const avgNsanelyDifficulty = nsanelyCompleted.length > 0
        ? nsanelyCompleted
            .filter(l => l.progress.nsanelyPerfectRelic.difficulty)
            .reduce((sum, l) => sum + (l.progress.nsanelyPerfectRelic.difficulty || 0), 0) /
            nsanelyCompleted.filter(l => l.progress.nsanelyPerfectRelic.difficulty).length
        : 0;

      const totalAttempts = dimensionLevels.reduce((sum, l) =>
        sum + l.progress.platinumTimeTrial.attempts + l.progress.nsanelyPerfectRelic.attempts, 0);

      const completionPercentage = dimensionLevels.length > 0
        ? ((platinumCompleted.length + nsanelyCompleted.length) / (dimensionLevels.length * 2)) * 100
        : 0;

      return {
        dimension,
        avgDifficulty: (avgPlatinumDifficulty + avgNsanelyDifficulty) / 2 || 0,
        totalAttempts,
        completionPercentage,
        levelCount: dimensionLevels.length
      };
    });

    const toughestDimension = dimensionData
      .filter(d => d.avgDifficulty > 0)
      .sort((a, b) => b.avgDifficulty - a.avgDifficulty)[0];

    const mostAttemptedDimension = dimensionData
      .sort((a, b) => b.totalAttempts - a.totalAttempts)[0];

    return {
      dimensionData,
      toughestDimension,
      mostAttemptedDimension,
    };
  }, [levels]);

  // Timeline & Streak Statistics
  const timelineStats = useMemo(() => {
    const allCompletions = levels.flatMap(l => {
      const completions = [];
      if (l.progress.platinumTimeTrial.completed && l.progress.platinumTimeTrial.completionDate) {
        completions.push({
          date: new Date(l.progress.platinumTimeTrial.completionDate),
          level: l.name,
          type: 'Platinum'
        });
      }
      if (l.progress.nsanelyPerfectRelic.completed && l.progress.nsanelyPerfectRelic.completionDate) {
        completions.push({
          date: new Date(l.progress.nsanelyPerfectRelic.completionDate),
          level: l.name,
          type: 'N.Sanely'
        });
      }
      return completions;
    }).sort((a, b) => a.date.getTime() - b.date.getTime());

    const firstCompletion = allCompletions[0];
    const mostRecentCompletion = allCompletions[allCompletions.length - 1];

    // Calculate longest streak
    // Helper function to normalize dates (date only, no time)
    const getDateOnly = (date: Date): Date => {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    // Get unique dates as normalized date objects, then sort
    const uniqueDateStrings = [...new Set(allCompletions.map(c =>
      getDateOnly(c.date).toISOString()
    ))].sort();

    let longestStreak = 0;
    let currentStreak = 0;

    for (let i = 0; i < uniqueDateStrings.length; i++) {
      if (i === 0) {
        currentStreak = 1;
      } else {
        const prevDate = new Date(uniqueDateStrings[i - 1]);
        const currDate = new Date(uniqueDateStrings[i]);
        const dayDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / 86400000);

        if (dayDiff === 1) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
      }
      longestStreak = Math.max(longestStreak, currentStreak);
    }

    // Find most productive day
    const completionsByDate = allCompletions.reduce((acc, c) => {
      const dateStr = c.date.toDateString();
      acc[dateStr] = (acc[dateStr] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostProductiveDay = Object.entries(completionsByDate)
      .sort(([, a], [, b]) => b - a)[0];

    return {
      allCompletions,
      firstCompletion,
      mostRecentCompletion,
      longestStreak,
      mostProductiveDay: mostProductiveDay ? {
        date: mostProductiveDay[0],
        count: mostProductiveDay[1]
      } : null,
      totalCompletionDays: uniqueDateStrings.length,
    };
  }, [levels]);

  // Animated values for count-up animations
  const animatedOverallPercentage = useSharedValue(0);
  const animatedGemPercentage = useSharedValue(0);
  const animatedPlatinumCount = useSharedValue(0);
  const animatedNsanelyCount = useSharedValue(0);

  // Animated values for progress bars
  const animatedOverallProgress = useSharedValue(0);
  const animatedGemProgress = useSharedValue(0);

  // Animated values for achievement number bounce
  const platinumScale = useSharedValue(1);
  const nsanelyScale = useSharedValue(1);

  // Trigger animations when stats change
  useEffect(() => {
    animatedOverallPercentage.value = withTiming(stats.overallPercentage, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
    animatedGemPercentage.value = withTiming(stats.gemPercentage, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
    animatedPlatinumCount.value = withTiming(stats.platinumCompletions, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
    animatedNsanelyCount.value = withTiming(stats.nsanelyCompletions, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
    animatedOverallProgress.value = withTiming(stats.overallPercentage / 100, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
    animatedGemProgress.value = withTiming(stats.gemPercentage / 100, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
  }, [stats]);

  // Bounce animation when achievement counts change
  useEffect(() => {
    if (stats.platinumCompletions > 0) {
      platinumScale.value = withSpring(1.2, { damping: 50, stiffness: 1000 }, () => {
        platinumScale.value = withSpring(1, { damping: 50, stiffness: 3000 });
      });
    }
  }, [stats.platinumCompletions]);

  useEffect(() => {
    if (stats.nsanelyCompletions > 0) {
      nsanelyScale.value = withSpring(1.2, { damping: 50, stiffness: 1000 }, () => {
        nsanelyScale.value = withSpring(1, { damping: 50, stiffness: 3000 });
      });
    }
  }, [stats.nsanelyCompletions]);

  // Update display values when animated values change
  useAnimatedReaction(
    () => Math.round(animatedOverallPercentage.value),
    (value) => {
      runOnJS(setDisplayOverallPercentage)(value);
    }
  );

  useAnimatedReaction(
    () => Math.round(animatedGemPercentage.value),
    (value) => {
      runOnJS(setDisplayGemPercentage)(value);
    }
  );

  useAnimatedReaction(
    () => Math.round(animatedPlatinumCount.value),
    (value) => {
      runOnJS(setDisplayPlatinumCount)(value);
    }
  );

  useAnimatedReaction(
    () => Math.round(animatedNsanelyCount.value),
    (value) => {
      runOnJS(setDisplayNsanelyCount)(value);
    }
  );

  useAnimatedReaction(
    () => animatedOverallProgress.value,
    (value) => {
      runOnJS(setDisplayOverallProgress)(value);
    }
  );

  useAnimatedReaction(
    () => animatedGemProgress.value,
    (value) => {
      runOnJS(setDisplayGemProgress)(value);
    }
  );

  // Animated styles for achievement number bounce
  const platinumScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: platinumScale.value }],
  }));

  const nsanelyScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: nsanelyScale.value }],
  }));

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 111, 0, ${opacity})`,
    labelColor: (opacity = 1) => theme.colors.onSurface,
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 10,
    },
  };

  const pieData = [
    {
      name: 'Platinum',
      population: stats.platinumCompletions,
      color: theme.colors.secondary,
      legendFontColor: theme.colors.onSurface,
    },
    {
      name: 'N.Sanely',
      population: stats.nsanelyCompletions,
      color: theme.colors.tertiary,
      legendFontColor: theme.colors.onSurface,
    },
    {
      name: 'Remaining',
      population: levels.length - Math.max(stats.platinumCompletions, stats.nsanelyCompletions),
      color: theme.colors.surfaceVariant,
      legendFontColor: theme.colors.onSurface,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.Content title="Statistics" />
      </Appbar.Header>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(300)} layout={LinearTransition.duration(200)}>
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              <Text
                variant="headlineSmall"
                style={[
                  MD3_TEXT_VARIANTS.headlineSmall,
                  styles.cardTitle,
                  { color: theme.colors.primary }
                ]}
              >
                Overall Completion
              </Text>
              <View style={styles.statRow}>
                <Text variant="displayMedium" style={[styles.bigNumber, { color: theme.colors.primary }]}>
                  {displayOverallPercentage}%
                </Text>
              </View>
              <ProgressBar
                progress={displayOverallProgress}
                color={theme.colors.primary}
                style={styles.progressBar}
              />
            </Card.Content>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(300)} layout={LinearTransition.duration(200)}>
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              <Text
                variant="titleLarge"
                style={[
                  MD3_TEXT_VARIANTS.titleLarge,
                  styles.cardTitle,
                  { color: theme.colors.primary }
                ]}
              >
                Gem Collection
              </Text>
              <View style={styles.statRow}>
                <Text variant="titleMedium">
                  {stats.collectedGems} / {stats.totalGems} gems
                </Text>
                <Text variant="titleMedium" style={{ color: theme.colors.primary }}>
                  {displayGemPercentage}%
                </Text>
              </View>
              <ProgressBar
                progress={displayGemProgress}
                color={theme.colors.primary}
                style={styles.progressBar}
              />
            </Card.Content>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(300)} layout={LinearTransition.duration(200)}>
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              <Text
                variant="titleLarge"
                style={[
                  MD3_TEXT_VARIANTS.titleLarge,
                  styles.cardTitle,
                  { color: theme.colors.primary }
                ]}
              >
                Special Completions
              </Text>
              <View style={styles.specialStats}>
                <View style={styles.specialStat}>
                  <Animated.View style={platinumScaleStyle}>
                    <Text variant="headlineMedium" style={{ color: theme.colors.secondary }}>
                      {displayPlatinumCount}
                    </Text>
                  </Animated.View>
                  <Text variant="bodyMedium">Platinum Time Trials</Text>
                  <Text variant="labelSmall" style={{ color: theme.colors.outline }}>
                    of {levels.length} levels
                  </Text>
                </View>
                <View style={styles.specialStat}>
                  <Animated.View style={nsanelyScaleStyle}>
                    <Text variant="headlineMedium" style={{ color: theme.colors.tertiary }}>
                      {displayNsanelyCount}
                    </Text>
                  </Animated.View>
                  <Text variant="bodyMedium">N.Sanely Perfect</Text>
                  <Text variant="labelSmall" style={{ color: theme.colors.outline }}>
                    of {levels.length} levels
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </Animated.View>

        {/* Average Attempts Stats */}
        <Animated.View entering={FadeInDown.delay(400).duration(300)} layout={LinearTransition.duration(200)}>
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              <Text
                variant="titleLarge"
                style={[
                  MD3_TEXT_VARIANTS.titleLarge,
                  styles.cardTitle,
                  { color: theme.colors.primary }
                ]}
              >
                Average Attempts
              </Text>
              <View style={styles.specialStats}>
                <View style={styles.specialStat}>
                  <Text variant="headlineMedium" style={{ color: theme.colors.secondary }}>
                    {difficultyAttemptsStats.avgPlatinumAttempts.toFixed(1)}
                  </Text>
                  <Text variant="bodyMedium">Platinum Avg</Text>
                </View>
                <View style={styles.specialStat}>
                  <Text variant="headlineMedium" style={{ color: theme.colors.tertiary }}>
                    {difficultyAttemptsStats.avgNsanelyAttempts.toFixed(1)}
                  </Text>
                  <Text variant="bodyMedium">N.Sanely Avg</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </Animated.View>

        {/* Top 5 Hardest Platinum Levels */}
        {difficultyAttemptsStats.topHardestPlatinum.length > 0 && (
          <Animated.View entering={FadeInDown.delay(500).duration(300)} layout={LinearTransition.duration(200)}>
            <Card style={styles.card} mode="elevated">
              <Card.Content>
                <Text
                  variant="titleLarge"
                  style={[
                    MD3_TEXT_VARIANTS.titleLarge,
                    styles.cardTitle,
                    { color: theme.colors.primary }
                  ]}
                >
                  Hardest Platinum Levels
                </Text>
                {difficultyAttemptsStats.topHardestPlatinum.map((level, index) => (
                  <View key={level.name} style={styles.levelStatRow}>
                    <Text variant="bodyMedium" style={{ flex: 1 }}>{index + 1}. {level.name}</Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.secondary, fontWeight: 'bold' }}>
                      {level.difficulty}/10
                    </Text>
                  </View>
                ))}
              </Card.Content>
            </Card>
          </Animated.View>
        )}

        {/* Top 5 Hardest N.Sanely Levels */}
        {difficultyAttemptsStats.topHardestNsanely.length > 0 && (
          <Animated.View entering={FadeInDown.delay(600).duration(300)} layout={LinearTransition.duration(200)}>
            <Card style={styles.card} mode="elevated">
              <Card.Content>
                <Text
                  variant="titleLarge"
                  style={[
                    MD3_TEXT_VARIANTS.titleLarge,
                    styles.cardTitle,
                    { color: theme.colors.primary }
                  ]}
                >
                  Hardest N.Sanely Levels
                </Text>
                {difficultyAttemptsStats.topHardestNsanely.map((level, index) => (
                  <View key={level.name} style={styles.levelStatRow}>
                    <Text variant="bodyMedium" style={{ flex: 1 }}>{index + 1}. {level.name}</Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.tertiary, fontWeight: 'bold' }}>
                      {level.difficulty}/10
                    </Text>
                  </View>
                ))}
              </Card.Content>
            </Card>
          </Animated.View>
        )}

        {/* Top 5 Most Tried Levels */}
        {difficultyAttemptsStats.topMostTried.length > 0 && (
          <Animated.View entering={FadeInDown.delay(700).duration(300)} layout={LinearTransition.duration(200)}>
            <Card style={styles.card} mode="elevated">
              <Card.Content>
                <Text
                  variant="titleLarge"
                  style={[
                    MD3_TEXT_VARIANTS.titleLarge,
                    styles.cardTitle,
                    { color: theme.colors.primary }
                  ]}
                >
                  Most Tried Levels
                </Text>
                {difficultyAttemptsStats.topMostTried.map((level, index) => (
                  <View key={level.name} style={styles.levelStatRow}>
                    <Text variant="bodyMedium" style={{ flex: 1 }}>{index + 1}. {level.name}</Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                      {level.totalAttempts} attempts
                    </Text>
                  </View>
                ))}
              </Card.Content>
            </Card>
          </Animated.View>
        )}

        {/* Time Trial Achievements */}
        <Animated.View entering={FadeInDown.delay(800).duration(300)} layout={LinearTransition.duration(200)}>
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              <Text
                variant="titleLarge"
                style={[
                  MD3_TEXT_VARIANTS.titleLarge,
                  styles.cardTitle,
                  { color: theme.colors.primary }
                ]}
              >
                Time Trial Average
              </Text>
              <View style={styles.specialStats}>
                <View style={styles.specialStat}>
                  <Text variant="headlineMedium" style={{ color: theme.colors.tertiary }}>
                    {timeTrialStats.avgTimeFormatted}
                  </Text>
                  <Text variant="bodyMedium">Avg Time</Text>
                  <Text variant="labelSmall" style={{ color: theme.colors.outline }}>
                    Speed Demon
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </Animated.View>

        {/* Achievements & Milestones */}
        <Animated.View entering={FadeInDown.delay(900).duration(300)} layout={LinearTransition.duration(200)}>
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              <Text
                variant="titleLarge"
                style={[
                  MD3_TEXT_VARIANTS.titleLarge,
                  styles.cardTitle,
                  { color: theme.colors.primary }
                ]}
              >
                Achievements
              </Text>
              <View style={styles.achievementRow}>
                <Text variant="titleMedium" style={{ color: theme.colors.secondary }}>
                  First Try Legends: {achievementStats.firstTryTotal}
                </Text>
              </View>
              <View style={styles.achievementRow}>
                <Text variant="titleMedium" style={{ color: theme.colors.tertiary }}>
                  Perfect Levels: {achievementStats.perfectCount}
                </Text>
              </View>
              {achievementStats.mostPersistent && achievementStats.mostPersistent.attempts > 0 && (
                <View style={styles.achievementRow}>
                  <Text variant="titleMedium" style={{ color: theme.colors.primary }}>
                    Most Persistent: {achievementStats.mostPersistent.name} ({achievementStats.mostPersistent.attempts} attempts)
                  </Text>
                </View>
              )}
            </Card.Content>
          </Card>
        </Animated.View>

        {/* Dimension Difficulty Ranking */}
        {dimensionAnalysis.toughestDimension && (
          <Animated.View entering={FadeInDown.delay(1000).duration(300)} layout={LinearTransition.duration(200)}>
            <Card style={styles.card} mode="elevated">
              <Card.Content>
                <Text
                  variant="titleLarge"
                  style={[
                    MD3_TEXT_VARIANTS.titleLarge,
                    styles.cardTitle,
                    { color: theme.colors.primary }
                  ]}
                >
                  Dimension Analysis
                </Text>
                <View style={styles.achievementRow}>
                  <Text variant="titleMedium">
                    Toughest: <Text style={{ color: theme.colors.secondary, fontWeight: 'bold' }}>
                      {dimensionAnalysis.toughestDimension.dimension}
                    </Text>
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                    Avg Difficulty: {dimensionAnalysis.toughestDimension.avgDifficulty.toFixed(1)}/10
                  </Text>
                </View>
                <View style={styles.achievementRow}>
                  <Text variant="titleMedium">
                    Most Attempted: <Text style={{ color: theme.colors.tertiary, fontWeight: 'bold' }}>
                      {dimensionAnalysis.mostAttemptedDimension.dimension}
                    </Text>
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                    Total Attempts: {dimensionAnalysis.mostAttemptedDimension.totalAttempts}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          </Animated.View>
        )}

        {/* Timeline & Streaks */}
        {timelineStats.allCompletions.length > 0 && (
          <Animated.View entering={FadeInDown.delay(1100).duration(300)} layout={LinearTransition.duration(200)}>
            <Card style={styles.card} mode="elevated">
              <Card.Content>
                <Text
                  variant="titleLarge"
                  style={[
                    MD3_TEXT_VARIANTS.titleLarge,
                    styles.cardTitle,
                    { color: theme.colors.primary }
                  ]}
                >
                  Timeline Highlights
                </Text>
                {timelineStats.longestStreak > 0 && (
                  <View style={styles.achievementRow}>
                    <Text variant="titleMedium" style={{ color: theme.colors.secondary }}>
                      Longest Streak: {timelineStats.longestStreak} days
                    </Text>
                  </View>
                )}
                {timelineStats.mostProductiveDay && (
                  <View style={styles.achievementRow}>
                    <Text variant="bodyMedium">
                      Most Productive Day: {timelineStats.mostProductiveDay.count} completions
                    </Text>
                  </View>
                )}
                {timelineStats.firstCompletion && (
                  <View style={styles.achievementRow}>
                    <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                      First: {timelineStats.firstCompletion.level} ({timelineStats.firstCompletion.date.toLocaleDateString()})
                    </Text>
                  </View>
                )}
              </Card.Content>
            </Card>
          </Animated.View>
        )}

        {/* Gap Analysis - What's Remaining */}
        <Animated.View entering={FadeInDown.delay(1200).duration(300)} layout={LinearTransition.duration(200)}>
          <Card style={styles.card} mode="elevated">
            <Card.Content>
              <Text
                variant="titleLarge"
                style={[
                  MD3_TEXT_VARIANTS.titleLarge,
                  styles.cardTitle,
                  { color: theme.colors.primary }
                ]}
              >
                What's Remaining
              </Text>

              <View style={styles.achievementRow}>
                <Text variant="titleMedium" style={{ color: theme.colors.primary }}>
                  Missing Completions
                </Text>
              </View>

              <View style={styles.levelStatRow}>
                <Text variant="bodyMedium">Platinum Time Trials</Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.secondary, fontWeight: 'bold' }}>
                  {gapAnalysis.missingPlatinumCount} remaining
                </Text>
              </View>

              <View style={styles.levelStatRow}>
                <Text variant="bodyMedium">N.Sanely Perfect Relics</Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.tertiary, fontWeight: 'bold' }}>
                  {gapAnalysis.missingNsanelyCount} remaining
                </Text>
              </View>

              {gapAnalysis.untouchedCount > 0 && (
                <>
                  <View style={styles.achievementRow}>
                    <Text variant="titleMedium" style={{ color: theme.colors.error, marginTop: 12 }}>
                      Untouched Levels: {gapAnalysis.untouchedCount}
                    </Text>
                  </View>
                  {gapAnalysis.untouchedLevels.slice(0, 5).map((levelName, index) => (
                    <View key={levelName} style={styles.levelStatRow}>
                      <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                        {index + 1}. {levelName}
                      </Text>
                    </View>
                  ))}
                  {gapAnalysis.untouchedCount > 5 && (
                    <Text variant="bodySmall" style={{ color: theme.colors.outline, marginTop: 4 }}>
                      ... and {gapAnalysis.untouchedCount - 5} more
                    </Text>
                  )}
                </>
              )}

              {gapAnalysis.partialGemCount > 0 && (
                <>
                  <View style={styles.achievementRow}>
                    <Text variant="titleMedium" style={{ marginTop: 12 }}>
                      Partial Gem Collection: {gapAnalysis.partialGemCount}
                    </Text>
                  </View>
                  {gapAnalysis.partialGemLevels.slice(0, 5).map((level, index) => (
                    <View key={level.name} style={styles.levelStatRow}>
                      <Text variant="bodySmall" style={{ flex: 1 }}>
                        {index + 1}. {level.name}
                      </Text>
                      <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                        {level.gemsCollected}/12 gems
                      </Text>
                    </View>
                  ))}
                  {gapAnalysis.partialGemCount > 5 && (
                    <Text variant="bodySmall" style={{ color: theme.colors.outline, marginTop: 4 }}>
                      ... and {gapAnalysis.partialGemCount - 5} more
                    </Text>
                  )}
                </>
              )}

              {gapAnalysis.easiestRemainingPlatinum.length > 0 && (
                <>
                  <View style={styles.achievementRow}>
                    <Text variant="titleMedium" style={{ marginTop: 12 }}>
                      Easiest Remaining Platinum
                    </Text>
                  </View>
                  {gapAnalysis.easiestRemainingPlatinum.map((level, index) => (
                    <View key={level.name} style={styles.levelStatRow}>
                      <Text variant="bodySmall" style={{ flex: 1 }}>
                        {index + 1}. {level.name}
                      </Text>
                      <Text variant="bodySmall" style={{ color: theme.colors.secondary }}>
                        {level.progress.platinumTimeTrial.difficulty}/10
                      </Text>
                    </View>
                  ))}
                </>
              )}

              {gapAnalysis.easiestRemainingNsanely.length > 0 && (
                <>
                  <View style={styles.achievementRow}>
                    <Text variant="titleMedium" style={{ marginTop: 12 }}>
                      Easiest Remaining N.Sanely
                    </Text>
                  </View>
                  {gapAnalysis.easiestRemainingNsanely.map((level, index) => (
                    <View key={level.name} style={styles.levelStatRow}>
                      <Text variant="bodySmall" style={{ flex: 1 }}>
                        {index + 1}. {level.name}
                      </Text>
                      <Text variant="bodySmall" style={{ color: theme.colors.tertiary }}>
                        {level.progress.nsanelyPerfectRelic.difficulty}/10
                      </Text>
                    </View>
                  ))}
                </>
              )}
            </Card.Content>
          </Card>
        </Animated.View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  cardTitle: {
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bigNumber: {
    fontWeight: '700',
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
  },
  specialStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  specialStat: {
    alignItems: 'center',
    gap: 4,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  levelStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  achievementRow: {
    marginBottom: 12,
  },
  bottomPadding: {
    height: 24,
  },
});
