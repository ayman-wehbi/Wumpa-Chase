import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { CRATE_VARIANTS, createCornerBrackets, CRATE_PADDING } from '../../constants/crateStyles';

interface CrateCardProps {
  children: React.ReactNode;
  variant?: 'wooden' | 'metal' | 'tnt' | 'light';
  style?: ViewStyle;
  showCorners?: boolean;
  padding?: 'small' | 'medium' | 'large';
}

/**
 * CrateCard - Wooden crate-styled card component
 *
 * Provides the iconic Crash Bandicoot wooden crate aesthetic
 * with metal corner brackets and Android-optimized elevation.
 *
 * Features:
 * - Pure CSS styling (no images)
 * - Metal corner brackets (optional)
 * - Multiple variants (wooden, metal, TNT)
 * - Android elevation for depth
 * - Configurable padding
 *
 * Usage:
 * ```tsx
 * <CrateCard variant="wooden" showCorners>
 *   <Text>Content goes here</Text>
 * </CrateCard>
 * ```
 */
export const CrateCard: React.FC<CrateCardProps> = ({
  children,
  variant = 'wooden',
  style,
  showCorners = true,
  padding = 'medium',
}) => {
  const theme = useTheme();

  // Get background and border colors based on variant and theme
  const getColors = () => {
    switch (variant) {
      case 'wooden':
        return {
          backgroundColor: (theme.colors as any).crateWood,
          borderColor: (theme.colors as any).crateBorder,
        };
      case 'metal':
        return {
          backgroundColor: (theme.colors as any).crateCorner,
          borderColor: theme.colors.outline,
        };
      case 'tnt':
        return {
          backgroundColor: theme.colors.errorContainer,
          borderColor: theme.colors.error,
        };
      case 'light':
        return {
          backgroundColor: theme.colors.surfaceVariant,
          borderColor: theme.colors.outline,
        };
      default:
        return {
          backgroundColor: (theme.colors as any).crateWood,
          borderColor: (theme.colors as any).crateBorder,
        };
    }
  };

  const colors = getColors();
  const variantStyle = CRATE_VARIANTS[variant];
  const cornerColor = (theme.colors as any).crateCorner || '#B8B8B8';
  const cornerBrackets = createCornerBrackets(cornerColor);

  // Get padding value
  const getPadding = () => {
    switch (padding) {
      case 'small':
        return CRATE_PADDING.small;
      case 'medium':
        return CRATE_PADDING.medium;
      case 'large':
        return CRATE_PADDING.large;
      default:
        return CRATE_PADDING.medium;
    }
  };

  return (
    <View
      style={[
        styles.container,
        variantStyle,
        {
          backgroundColor: colors.backgroundColor,
          borderColor: colors.borderColor,
          padding: getPadding(),
        },
        style,
      ]}
    >
      {/* Metal corner brackets */}
      {showCorners && (
        <>
          <View style={cornerBrackets[0]} />
          <View style={cornerBrackets[1]} />
          <View style={cornerBrackets[2]} />
          <View style={cornerBrackets[3]} />
        </>
      )}

      {/* Card content */}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'visible', // Allow corners to render outside
  },
});
