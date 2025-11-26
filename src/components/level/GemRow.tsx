import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { GemCheckboxes } from '../../types';
import { GemIcon } from '../common/GemIcon';
import Animated, { FadeIn } from 'react-native-reanimated';

interface GemRowProps {
  mode: 'Normal Mode' | 'N.Verted Mode';
  gems: GemCheckboxes;
  onGemPress: (gemType: keyof GemCheckboxes) => void;
}

/**
 * Displays a row of 6 gems for a specific mode (Normal or N.Verted)
 * Each gem is individually tappable to toggle its state
 */
export const GemRow: React.FC<GemRowProps> = ({ mode, gems, onGemPress }) => {
  const theme = useTheme();

  // Define gem data with values, labels, overlay text, and keys
  const gemData: Array<{
    key: keyof GemCheckboxes;
    collected: boolean;
    label: string;
    overlayText?: string;
  }> = [
    { key: 'wumpa40', collected: gems.wumpa40, overlayText: '40%', label: '🥭' },
    { key: 'wumpa60', collected: gems.wumpa60, overlayText: '60%', label: '🥭' },
    { key: 'wumpa80', collected: gems.wumpa80, overlayText: '80%', label: '🥭' },
    { key: 'allCrates', collected: gems.allCrates, label: '📦' },
    { key: 'deaths3OrLess', collected: gems.deaths3OrLess, label: '💀' },
    { key: 'hiddenGem', collected: gems.hiddenGem, label: '💎' },
  ];

  // Stagger appearance: Normal Mode appears first, N.Verted Mode appears second
  const delay = mode === 'Normal Mode' ? 100 : 200;

  return (
    <Animated.View
      style={styles.container}
      entering={FadeIn.delay(delay).duration(300)}
    >
      <Text
        variant="titleSmall"
        style={[styles.modeLabel, { color: theme.colors.onSurface }]}
      >
        {mode}
      </Text>
      <View
        style={[
          styles.gemRowContainer,
          { backgroundColor: theme.colors.elevation.level1 },
        ]}
      >
        {gemData.map((gem) => (
          <GemIcon
            key={gem.key}
            collected={gem.collected}
            label={gem.label}
            overlayText={gem.overlayText}
            size={36}
            onPress={() => onGemPress(gem.key)}
          />
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  modeLabel: {
    marginBottom: 8,
    fontWeight: '600',
  },
  gemRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
});
