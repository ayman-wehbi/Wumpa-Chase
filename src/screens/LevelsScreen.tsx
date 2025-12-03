import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Text, ActivityIndicator, useTheme, Surface } from 'react-native-paper';
import { useProgress } from '../context/ProgressContext';
import { LevelCard } from '../components/level/LevelCard';
import { DIMENSIONS, getLevelsByDimension } from '../data/levels';
import { MD3_TEXT_VARIANTS } from '../constants/typography';

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
        <Appbar.Content title="Wumpa Platter" />
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
              {/* Dimension header with Material Surface and subtle gradient */}
              <Surface
                elevation={2}
                style={[
                  styles.dimensionHeaderContainer,
                  { backgroundColor: theme.colors.surface }
                ]}
              >
                {/* Subtle gradient overlay using user's blue colors */}
                <View style={[StyleSheet.absoluteFill, styles.gradientBase]} />
                <View
                  style={[
                    StyleSheet.absoluteFill,
                    styles.gradientTop,
                    { backgroundColor: theme.colors.primaryContainer, opacity: 0.3 }
                  ]}
                />
                <View
                  style={[
                    StyleSheet.absoluteFill,
                    styles.gradientOverlay,
                    { backgroundColor: theme.colors.background, opacity: 0.15 }
                  ]}
                />

                {/* Content */}
                <View style={styles.dimensionHeader}>
                  <Text
                    variant="headlineSmall"
                    style={[
                      MD3_TEXT_VARIANTS.headlineSmall,
                      { color: theme.colors.primary }
                    ]}
                  >
                    {dimension}
                  </Text>
                  <Text
                    variant="labelMedium"
                    style={[
                      styles.dimensionCount,
                      { color: theme.colors.onSurfaceVariant }
                    ]}
                  >
                    {dimensionLevels.length} levels
                  </Text>
                </View>
              </Surface>

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
  dimensionHeaderContainer: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientBase: {
    // Base layer for gradient
  },
  gradientTop: {
    // Top gradient layer (primaryContainer)
  },
  gradientOverlay: {
    // Subtle overlay layer (background)
  },
  dimensionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  dimensionCount: {
    opacity: 0.8,
  },
  bottomPadding: {
    height: 24,
  },
});
