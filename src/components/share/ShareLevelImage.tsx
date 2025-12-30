import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ShareLevelData } from '../../types';

interface ShareLevelImageProps {
  levelData: ShareLevelData;
  onLayout?: () => void;
}

/**
 * ShareLevelImage Component
 *
 * Renders a 1080x1080 square image for sharing level completion stats.
 * This component is rendered off-screen and captured as an image.
 *
 * Layout:
 * - Header: "Wumpletion" title + level name/dimension
 * - Platinum Time Trial section: attempts, difficulty, time, date
 * - N.Sanely Perfect Relic section: attempts, difficulty, date
 * - Footer: Latest completion date
 */
export const ShareLevelImage = React.forwardRef<View, ShareLevelImageProps>(
  ({ levelData, onLayout }, ref) => {
    const theme = useTheme();

    // Format date helper
    const formatDate = (dateString?: string): string => {
      if (!dateString) return 'Not set';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      } catch {
        return 'Invalid date';
      }
    };

    // Format short date for footer
    const formatShortDate = (dateString?: string): string => {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: '2-digit',
        });
      } catch {
        return '';
      }
    };

    // Get the latest completion date for footer
    const getLatestDate = (): string => {
      const dates = [
        levelData.platinum.completionDate,
        levelData.nsanely.completionDate,
      ].filter(Boolean);

      if (dates.length === 0) return formatShortDate(new Date().toISOString());

      const latest = dates.reduce((a, b) => {
        return new Date(a!) > new Date(b!) ? a : b;
      });

      return formatShortDate(latest);
    };

    // Render difficulty with wumpa fruits
    const renderDifficulty = (difficulty?: number, isCompleted: boolean = true) => {
      if (!difficulty || !isCompleted) {
        return (
          <View collapsable={false}>
            <Text style={[styles.dataValue, { color: '#101E41', opacity: 0.4 }]}>
              ?/10
            </Text>
          </View>
        );
      }

      return (
        <View collapsable={false} style={{ alignItems: 'center' }}>
          <View collapsable={false} style={styles.wumpaContainer}>
            {Array.from({ length: 10 }).map((_, index) => (
              <View collapsable={false} key={index}>
                <Text style={{ fontSize: 22, opacity: index < difficulty ? 1 : 0.25 }}>
                  🥭
                </Text>
              </View>
            ))}
          </View>
          <View collapsable={false}>
            <Text style={[styles.difficultyText, { color: '#101E41' }]}>
              {difficulty}/10!
            </Text>
          </View>
        </View>
      );
    };

    const platinumCompleted = levelData.platinum.completed || levelData.platinum.attempts > 0;
    const nsanelyCompleted = levelData.nsanely.completed || levelData.nsanely.attempts > 0;

    return (
      <View
        ref={ref}
        onLayout={onLayout}
        collapsable={false}
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {/* Header */}
        <View style={styles.header} collapsable={false}>
          <View collapsable={false}>
            <Text style={[styles.title, { color: '#D4E1F7' }]}>
              WUMPLETION!
            </Text>
          </View>
          <View collapsable={false}>
            <Text style={[styles.subtitle, { color: '#E6FFFF' }]}>
              {levelData.name} • {levelData.dimension}
            </Text>
          </View>
        </View>

        {/* Platinum Time Trial Section */}
        <View collapsable={false} style={[styles.mainBlock, { backgroundColor: '#2055A9' }]}>
          {/* Title */}
          <View style={styles.blockHeader} collapsable={false}>
            <Icon name="trophy" size={44} color="#FFD700" />
            <View collapsable={false}>
              <Text style={[styles.blockTitle, { color: '#E6FFFF' }]}>
                PLATINUM TIME TRIAL!
              </Text>
            </View>
          </View>

          {/* Data Blocks */}
          <View style={styles.dataBlocksContainer} collapsable={false}>
            {/* Attempts Block */}
            <View collapsable={false} style={[styles.dataBlock, { backgroundColor: '#D4E1F7' }]}>
              <View collapsable={false}>
                <Text style={[styles.dataLabel, { color: '#101E41' }]}>
                  ATTEMPTS
                </Text>
              </View>
              <View collapsable={false}>
                <Text style={[styles.attemptsValue, { color: '#2055A9' }]}>
                  {levelData.platinum.attempts} ATTEMPTS!
                </Text>
              </View>
            </View>

            {/* Difficulty Block */}
            <View collapsable={false} style={[styles.dataBlock, { backgroundColor: '#D4E1F7' }]}>
              <View collapsable={false}>
                <Text style={[styles.dataLabel, { color: '#101E41' }]}>
                  DIFFICULTY
                </Text>
              </View>
              {renderDifficulty(levelData.platinum.difficulty, platinumCompleted)}
            </View>

            {/* Time Block */}
            <View collapsable={false} style={[styles.dataBlock, { backgroundColor: '#D4E1F7' }]}>
              <View collapsable={false}>
                <Text style={[styles.dataLabel, { color: '#101E41' }]}>
                  BEST TIME
                </Text>
              </View>
              <View collapsable={false}>
                <Text style={[styles.dataValue, { color: '#2055A9' }]}>
                  {levelData.platinum.time || 'N/A'}
                </Text>
              </View>
            </View>

            {/* Date Block */}
            <View collapsable={false} style={[styles.dataBlock, { backgroundColor: '#D4E1F7' }]}>
              <View collapsable={false}>
                <Text style={[styles.dataLabel, { color: '#101E41' }]}>
                  COMPLETED
                </Text>
              </View>
              <View collapsable={false}>
                <Text style={[styles.dataValue, { color: '#2055A9' }]}>
                  {levelData.platinum.completionDate ? formatDate(levelData.platinum.completionDate) : 'Not yet!'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* N.Sanely Perfect Relic Section */}
        <View collapsable={false} style={[styles.mainBlock, { backgroundColor: '#A12300' }]}>
          {/* Title */}
          <View style={styles.blockHeader} collapsable={false}>
            <Icon name="diamond-stone" size={44} color="#FFD700" />
            <View collapsable={false}>
              <Text style={[styles.blockTitle, { color: '#FFD6FF' }]}>
                N.SANELY PERFECT RELIC!
              </Text>
            </View>
          </View>

          {/* Data Blocks */}
          <View style={styles.dataBlocksContainer} collapsable={false}>
            {/* Attempts Block */}
            <View collapsable={false} style={[styles.dataBlock, { backgroundColor: '#FFD7CC' }]}>
              <View collapsable={false}>
                <Text style={[styles.dataLabel, { color: '#330033' }]}>
                  ATTEMPTS
                </Text>
              </View>
              <View collapsable={false}>
                <Text style={[styles.attemptsValue, { color: '#A12300' }]}>
                  {levelData.nsanely.attempts} ATTEMPTS!
                </Text>
              </View>
            </View>

            {/* Difficulty Block */}
            <View collapsable={false} style={[styles.dataBlock, { backgroundColor: '#FFD7CC' }]}>
              <View collapsable={false}>
                <Text style={[styles.dataLabel, { color: '#330033' }]}>
                  DIFFICULTY
                </Text>
              </View>
              {renderDifficulty(levelData.nsanely.difficulty, nsanelyCompleted)}
            </View>

            {/* Date Block */}
            <View collapsable={false} style={[styles.dataBlock, { backgroundColor: '#FFD7CC' }]}>
              <View collapsable={false}>
                <Text style={[styles.dataLabel, { color: '#330033' }]}>
                  COMPLETED
                </Text>
              </View>
              <View collapsable={false}>
                <Text style={[styles.dataValue, { color: '#A12300' }]}>
                  {levelData.nsanely.completionDate ? formatDate(levelData.nsanely.completionDate) : 'Not yet!'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} collapsable={false}>
          <View collapsable={false}>
            <Text style={[styles.footerDate, { color: '#E6FFFF' }]}>
              {getLatestDate()}
            </Text>
          </View>
        </View>
      </View>
    );
  }
);

ShareLevelImage.displayName = 'ShareLevelImage';

const styles = StyleSheet.create({
  container: {
    width: 1080,
    height: 1080,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Bangers-Regular',
    fontSize: 72,
    letterSpacing: 3,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    marginTop: 6,
    opacity: 0.8,
    textAlign: 'center',
    fontWeight: '600',
  },
  mainBlock: {
    borderRadius: 28,
    padding: 20,
    marginVertical: 12,
  },
  blockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  blockTitle: {
    fontSize: 36,
    letterSpacing: 1,
    fontWeight: '900',
  },
  dataBlocksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  dataBlock: {
    borderRadius: 16,
    padding: 14,
    minWidth: 310,
    flex: 1,
  },
  dataLabel: {
    fontSize: 16,
    fontWeight: '700',
    opacity: 0.8,
    marginBottom: 8,
  },
  dataValue: {
    fontSize: 36,
    fontWeight: '900',
  },
  attemptsValue: {
    fontFamily: 'Bangers-Regular',
    fontSize: 32,
    letterSpacing: 1,
  },
  value: {
    fontSize: 32,
    fontWeight: '900',
  },
  wumpaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 130,
  },
  difficultyText: {
    fontSize: 24,
    marginTop: 4,
    fontWeight: '900',
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 16,
  },
  footerDate: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
