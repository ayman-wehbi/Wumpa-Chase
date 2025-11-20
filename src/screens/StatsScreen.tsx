import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View, Dimensions } from 'react-native';
import { Appbar, Card, Text, useTheme, ProgressBar } from 'react-native-paper';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { useProgress } from '../context/ProgressContext';
import { DIMENSIONS, getLevelsByDimension } from '../data/levels';
import { CompletionStats, DimensionStats } from '../types';

const screenWidth = Dimensions.get('window').width;

export const StatsScreen: React.FC = () => {
  const theme = useTheme();
  const { levels } = useProgress();

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
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text variant="headlineSmall" style={styles.cardTitle}>
              Overall Completion
            </Text>
            <View style={styles.statRow}>
              <Text variant="displayMedium" style={[styles.bigNumber, { color: theme.colors.primary }]}>
                {Math.round(stats.overallPercentage)}%
              </Text>
            </View>
            <ProgressBar
              progress={stats.overallPercentage / 100}
              color={theme.colors.primary}
              style={styles.progressBar}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>
              Gem Collection
            </Text>
            <View style={styles.statRow}>
              <Text variant="titleMedium">
                {stats.collectedGems} / {stats.totalGems} gems
              </Text>
              <Text variant="titleMedium" style={{ color: theme.colors.primary }}>
                {Math.round(stats.gemPercentage)}%
              </Text>
            </View>
            <ProgressBar
              progress={stats.gemPercentage / 100}
              color={theme.colors.primary}
              style={styles.progressBar}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>
              Special Completions
            </Text>
            <View style={styles.specialStats}>
              <View style={styles.specialStat}>
                <Text variant="headlineMedium" style={{ color: theme.colors.secondary }}>
                  {stats.platinumCompletions}
                </Text>
                <Text variant="bodyMedium">Platinum Time Trials</Text>
                <Text variant="labelSmall" style={{ color: theme.colors.outline }}>
                  of {levels.length} levels
                </Text>
              </View>
              <View style={styles.specialStat}>
                <Text variant="headlineMedium" style={{ color: theme.colors.tertiary }}>
                  {stats.nsanelyCompletions}
                </Text>
                <Text variant="bodyMedium">N.Sanely Perfect</Text>
                <Text variant="labelSmall" style={{ color: theme.colors.outline }}>
                  of {levels.length} levels
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>
              Completion Breakdown
            </Text>
            <PieChart
              data={pieData}
              width={screenWidth - 64}
              height={200}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="0"
              absolute
            />
          </Card.Content>
        </Card>

        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>
              Gems by Dimension
            </Text>
            <BarChart
              data={{
                labels: dimensionStats.map(d => {
                  const words = d.dimension.split(' ');
                  return words.length > 2 ? words.slice(-2).join(' ') : d.dimension;
                }),
                datasets: [
                  {
                    data: dimensionStats.map(d => d.completionPercentage),
                  },
                ],
              }}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              yAxisLabel=""
              yAxisSuffix="%"
              fromZero
              showBarTops={false}
              withInnerLines={false}
              style={styles.chart}
            />
          </Card.Content>
        </Card>

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
  },
  cardTitle: {
    fontWeight: '700',
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
  bottomPadding: {
    height: 24,
  },
});
