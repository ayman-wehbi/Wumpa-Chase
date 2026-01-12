import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton, useTheme, Divider, Card, Menu, Snackbar } from 'react-native-paper';
import Animated, { FadeInDown, LinearTransition, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import HapticFeedback from 'react-native-haptic-feedback';
import { LevelData, GemCheckboxes } from '../../types';
import { useProgress } from '../../context/ProgressContext';
import { LevelProgress } from './LevelProgress';
import { GemRow } from './GemRow';
import { PlatinumSection } from './PlatinumSection';
import { NSanelySection } from './NSanelySection';
import { MD3_TEXT_VARIANTS } from '../../constants/typography';
import { useBounceAnimation } from '../../hooks/useCrashAnimations';
import ShareService from '../../services/ShareService';
import { ShareLevelImage } from '../share/ShareLevelImage';

interface LevelCardProps {
  level: LevelData;
}

export const LevelCard: React.FC<LevelCardProps> = ({ level }) => {
  const [expanded, setExpanded] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareMenuVisible, setShareMenuVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [shareImageReady, setShareImageReady] = useState(false);
  const theme = useTheme();
  const { value: bounceValue, trigger: triggerBounce } = useBounceAnimation();
  const animatedMargin = useSharedValue(8);
  const shareViewRef = useRef<View>(null);

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
    animatedMargin.value = withTiming(expanded ? 20 : 8, { duration: 200 });
  }, [expanded]);

  // Check if level has any completion data for share button
  const hasAnyCompletion = useMemo(() => {
    return (
      level.progress.platinumTimeTrial.attempts > 0 ||
      level.progress.nsanelyPerfectRelic.attempts > 0
    );
  }, [level.progress]);

  const handleToggle = () => setExpanded(!expanded);

  // Open share menu
  const openShareMenu = () => {
    if (!hasAnyCompletion || isSharing) return;
    HapticFeedback.trigger('impactLight');
    setShareMenuVisible(true);
  };

  const closeShareMenu = () => setShareMenuVisible(false);

  // Handle share via share sheet
  const handleShare = async () => {
    closeShareMenu();
    if (!hasAnyCompletion || isSharing) return;

    setIsSharing(true);
    setShareImageReady(false);

    try {
      // Wait for ShareLevelImage to render and layout
      console.log('Waiting for layout before share...');
      await new Promise<void>(resolve => setTimeout(() => resolve(), 1500));

      const result = await ShareService.shareLevel(shareViewRef, level.name);

      if (result.success && !result.cancelled) {
        setSnackbarMessage('Shared successfully!');
        setSnackbarVisible(true);
      } else if (result.error) {
        setSnackbarMessage(`Share failed: ${result.error}`);
        setSnackbarVisible(true);
      }
    } catch (error) {
      console.error('Share failed:', error);
      setSnackbarMessage('Share failed');
      setSnackbarVisible(true);
    } finally {
      setIsSharing(false);
    }
  };

  // Handle save to gallery
  const handleSaveToGallery = async () => {
    closeShareMenu();
    if (!hasAnyCompletion || isSharing) return;

    setIsSharing(true);
    setShareImageReady(false);

    try {
      // Wait for ShareLevelImage to render and layout
      console.log('Waiting for layout...');
      await new Promise<void>(resolve => setTimeout(() => resolve(), 1500));

      console.log('Checking ref...', shareViewRef.current ? 'Ready' : 'Not ready');

      const result = await ShareService.saveToGallery(shareViewRef, level.name);

      if (result.success) {
        setSnackbarMessage('Saved to gallery!');
        setSnackbarVisible(true);
      } else {
        setSnackbarMessage(`Save failed: ${result.error || 'Unknown error'}`);
        setSnackbarVisible(true);
      }
    } catch (error) {
      console.error('Save to gallery failed:', error);
      setSnackbarMessage('Save failed');
      setSnackbarVisible(true);
    } finally {
      setIsSharing(false);
    }
  };

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
            <View style={{ flexDirection: 'row' }}>
              <Menu
                visible={shareMenuVisible}
                onDismiss={closeShareMenu}
                anchor={
                  <IconButton
                    icon="share-variant"
                    size={20}
                    onPress={openShareMenu}
                    iconColor={theme.colors.primary}
                    disabled={!hasAnyCompletion || isSharing}
                    style={{ opacity: hasAnyCompletion ? 1 : 0.5 }}
                  />
                }
              >
                <Menu.Item
                  onPress={handleShare}
                  title="Share"
                  leadingIcon="share-variant"
                />
                <Menu.Item
                  onPress={handleSaveToGallery}
                  title="Save to Gallery"
                  leadingIcon="download"
                />
              </Menu>
              <IconButton
                icon={expanded ? 'chevron-up' : 'chevron-down'}
                size={24}
                onPress={handleToggle}
                iconColor={theme.colors.primary}
              />
            </View>
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

      {/* Hidden component for share image generation - visible during capture */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          opacity: isSharing ? 1 : 0,
          zIndex: isSharing ? 9999 : -1,
        }}
        pointerEvents="none"
      >
        <ShareLevelImage
          ref={shareViewRef}
          levelData={{
            name: level.name,
            dimension: level.dimension,
            platinum: level.progress.platinumTimeTrial,
            nsanely: level.progress.nsanelyPerfectRelic,
          }}
          onLayout={() => {
            console.log('ShareLevelImage layout complete', {
              levelName: level.name,
              platinum: level.progress.platinumTimeTrial,
              nsanely: level.progress.nsanelyPerfectRelic,
            });
            setShareImageReady(true);
          }}
        />
      </View>

      {/* Snackbar for feedback */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
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