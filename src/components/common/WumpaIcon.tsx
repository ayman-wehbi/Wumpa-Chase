import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface WumpaIconProps {
  animated?: boolean;
  size?: number;
  style?: any;
}

/**
 * WumpaIcon - Animated Wumpa fruit component
 *
 * Displays the iconic Crash Bandicoot Wumpa fruit (🥭 mango emoji)
 * with optional spinning animation.
 *
 * Features:
 * - Uses native emoji (universal Android support)
 * - Smooth 360° rotation animation
 * - Configurable size
 * - Performance-optimized with Reanimated
 *
 * Usage:
 * ```tsx
 * // Static Wumpa fruit
 * <WumpaIcon size={24} />
 *
 * // Animated spinning Wumpa
 * <WumpaIcon animated size={32} />
 * ```
 */
export const WumpaIcon: React.FC<WumpaIconProps> = ({
  animated = false,
  size = 24,
  style,
}) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      // Infinite spinning animation
      rotation.value = withRepeat(
        withTiming(360, {
          duration: 2000,
          easing: Easing.linear,
        }),
        -1, // Infinite repeat
        false, // Don't reverse
      );
    } else {
      // Reset rotation if animation is disabled
      rotation.value = 0;
    }
  }, [animated]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Text style={[styles.emoji, { fontSize: size }]}>🥭</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  emoji: {
    textAlign: 'center',
  },
});
