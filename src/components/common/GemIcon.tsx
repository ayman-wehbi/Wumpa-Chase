import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, View } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSpring } from 'react-native-reanimated';

interface GemIconProps {
  collected: boolean;
  label?: string;
  overlayText?: string;
  size?: number;
  onPress?: () => void;
  style?: ViewStyle;
}

/**
 * Displays a single gem icon that can be in "dull" or "shiny" state
 * Dull = not collected (gray, low opacity)
 * Shiny = collected (colored, full opacity with glow effect)
 * Optional overlayText displayed INSIDE the gem
 * Optional label displayed below the gem
 */
// Create animated version of MaterialCommunityIcons
const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);

export const GemIcon: React.FC<GemIconProps> = ({
  collected,
  label,
  overlayText,
  size = 40,
  onPress,
  style,
}) => {
  const theme = useTheme();

  // Animated values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(collected ? 1 : 0.35);

  const gemColor = collected
    ? theme.colors.primary // Shiny: Crash orange
    : theme.colors.onSurfaceDisabled; // Dull: gray

  const overlayTextColor = collected
    ? theme.colors.onPrimary // White text on orange gem
    : theme.colors.onSurfaceVariant; // Gray text on dull gem

  // Animate when collected state changes
  useEffect(() => {
    opacity.value = withTiming(collected ? 1 : 0.35, { duration: 100 });
    scale.value = withSpring(collected ? 1.15 : 1, {
      damping: 50,
      stiffness: 1000,
    }, () => {
      // Bounce back to normal size
      scale.value = withSpring(1, { damping: 50, stiffness: 3000 });
    });
  }, [collected]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      style={[styles.container, style]}
      activeOpacity={0.7}
    >
      <View style={styles.gemContainer}>
        <Animated.View style={[styles.iconWrapper, animatedStyle]}>
          <AnimatedIcon
            name="diamond"
            size={size}
            color={gemColor}
            style={[
              styles.gemIcon,
              collected && styles.shinyGem,
            ]}
          />
          {overlayText && (
            <Text
              style={[
                styles.overlayText,
                {
                  color: overlayTextColor,
                  fontSize: size * 0.22, // Scale with gem size
                },
              ]}
            >
              {overlayText}
            </Text>
          )}
        </Animated.View>
        {label && (
          <Text
            variant="labelSmall"
            style={[styles.label, { color: theme.colors.onSurfaceVariant }]}
          >
            {label}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gemIcon: {
    // Base icon styling
  },
  shinyGem: {
    // Add subtle shadow/glow effect for collected gems
    textShadowColor: 'rgba(255, 111, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  overlayText: {
    position: 'absolute',
    fontWeight: '700',
    textAlign: 'center',
    top: '30%',
    left: '55%',
    transform: [{ translateX: -10 }, { translateY: -5 }],
  },
  label: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '600',
  },
});
