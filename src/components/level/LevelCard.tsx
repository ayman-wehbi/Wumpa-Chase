import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton, useTheme, Divider, Card } from 'react-native-paper';
import Animated, { FadeInDown, LinearTransition, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { LevelData, GemCheckboxes } from '../../types';
import { useProgress } from '../../context/ProgressContext';
import { LevelProgress } from './LevelProgress';
import { GemRow } from './GemRow';
import { PlatinumSection } from './PlatinumSection';
import { NSanelySection } from './NSanelySection';
import { MD3_TEXT_VARIANTS } from '../../constants/typography';
import { useBounceAnimation } from '../../hooks/useCrashAnimations';

interface LevelCardProps {
  level: LevelData;
}

export const LevelCard: React.FC<LevelCardProps> = ({ level }) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const { value: bounceValue, trigger: triggerBounce } = useBounceAnimation();
  const animatedMargin = useSharedValue(8);

  const {
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
  } = useProgress();

  // Trigger bounce animation and adjust margin when expanded state changes
  useEffect(() => {
    triggerBounce(expanded);
    animatedMargin.value = withTiming(expanded ? 16 : 8, { duration: 200 });
  }, [expanded]);

  const handleToggle = () => setExpanded(!expanded);

  const handleGemToggle = (mode: 'normalMode' | 'nVertedMode') => (gemType: keyof GemCheckboxes) => {
    const currentValue = level.progress[mode][gemType];
    updateGemCheckbox(level.id, mode, gemType, !currentValue);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bounceValue.value }],
  }));

  const animatedContainerStyle = useAnimatedStyle(() => ({
    marginVertical: animatedMargin.value,
  }));

  return (
    <Animated.View style={[styles.cardContainer, animatedStyle, animatedContainerStyle]}>
      <Card
        mode="elevated"
        elevation={expanded ? 2 : 1}
        style={[styles.card, { backgroundColor: theme.colors.surface }]}
      >
        <Card.Content style={styles.cardContent}>
          {/* Level title with Bangers font */}
          <View style={styles.header}>
            <Text
              variant="titleLarge"
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[
                MD3_TEXT_VARIANTS.titleLarge,
                {
                  color: theme.colors.primary,
                  flex: 1,
                  flexShrink: 1
                }
              ]}
            >
              {level.name}
            </Text>
            <IconButton
              icon={expanded ? 'chevron-up' : 'chevron-down'}
              size={24}
              onPress={handleToggle}
              iconColor={theme.colors.primary}
            />
          </View>

          {/* Progress indicator */}
          <LevelProgress progress={level.progress} />

          {/* Expanded content */}
          {expanded && (
            <Animated.View
              entering={FadeInDown.duration(300)}
              layout={LinearTransition.duration(200)}
              style={styles.expandedContent}
            >
              <GemRow
                mode="Normal Mode"
                gems={level.progress.normalMode}
                onGemPress={handleGemToggle('normalMode')}
              />

              <Divider style={styles.divider} />

              <GemRow
                mode="N.Verted Mode"
                gems={level.progress.nVertedMode}
                onGemPress={handleGemToggle('nVertedMode')}
              />

              <Divider style={styles.divider} />

              <PlatinumSection
                platinum={level.progress.platinumTimeTrial}
                levelId={level.id}
                onCompletionChange={updatePlatinumCompletion}
                onTimeChange={updatePlatinumTime}
                onAttemptsChange={updatePlatinumAttempts}
                onDifficultyChange={updatePlatinumDifficulty}
                onDateChange={updatePlatinumDate}
                onNoteChange={updatePlatinumNote}
                onNoteDelete={deletePlatinumNote}
                onReset={resetPlatinum}
              />

              <NSanelySection
                nsanely={level.progress.nsanelyPerfectRelic}
                levelId={level.id}
                onCompletionChange={updateNSanelyCompletion}
                onAttemptsChange={updateNSanelyAttempts}
                onDifficultyChange={updateNSanelyDifficulty}
                onDateChange={updateNSanelyDate}
                onNoteChange={updateNSanelyNote}
                onNoteDelete={deleteNSanelyNote}
                onReset={resetNSanely}
              />
            </Animated.View>
          )}
        </Card.Content>
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    // marginVertical is animated, see animatedContainerStyle
  },
  card: {
    borderRadius: 12,
  },
  cardContent: {
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  expandedContent: {
    paddingTop: 8,
  },
  divider: {
    marginVertical: 12,
  },
});