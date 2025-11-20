import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Text, ActivityIndicator, useTheme } from 'react-native-paper';
import { useProgress } from '../context/ProgressContext';
import { LevelCard } from '../components/level/LevelCard';
import { DIMENSIONS, getLevelsByDimension } from '../data/levels';

export const LevelsScreen: React.FC = () => {
  const theme = useTheme();
  const { levels, loading } = useProgress();

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyLarge" style={styles.loadingText}>
          Loading progress...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.Content title="Crash Bandicoot 4" />
      </Appbar.Header>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {DIMENSIONS.map(dimension => {
          const dimensionLevels = getLevelsByDimension(levels, dimension);

          return (
            <View key={dimension} style={styles.dimensionSection}>
              <View
                style={[
                  styles.dimensionHeader,
                  { backgroundColor: theme.colors.primaryContainer },
                ]}
              >
                <Text
                  variant="titleMedium"
                  style={[
                    styles.dimensionTitle,
                    { color: theme.colors.onPrimaryContainer },
                  ]}
                >
                  {dimension}
                </Text>
                <Text
                  variant="labelMedium"
                  style={[
                    styles.dimensionCount,
                    { color: theme.colors.onPrimaryContainer },
                  ]}
                >
                  {dimensionLevels.length} levels
                </Text>
              </View>

              {dimensionLevels.map(level => (
                <LevelCard key={level.id} level={level} />
              ))}
            </View>
          );
        })}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
  },
  dimensionSection: {
    marginBottom: 16,
  },
  dimensionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 4,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dimensionTitle: {
    fontWeight: '700',
  },
  dimensionCount: {
    opacity: 0.8,
  },
  bottomPadding: {
    height: 24,
  },
});
