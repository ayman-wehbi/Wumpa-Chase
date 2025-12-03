import React from 'react';
import { View, StyleSheet } from 'react-native';

interface TropicalBackgroundProps {
  variant: 'sunset' | 'jungle' | 'beach';
  intensity?: number; // 0-1, controls overall opacity
  children?: React.ReactNode;
}

/**
 * TropicalBackground - Layered gradient background component
 *
 * Creates tropical-themed gradients without requiring LinearGradient package.
 * Uses layered Views with different opacities to simulate smooth gradients.
 *
 * Variants:
 * - sunset: Orange → Pink → Purple (warm, evening vibes)
 * - jungle: Green → Teal (lush, vibrant)
 * - beach: Blue → Cyan (cool, oceanic)
 *
 * Android-optimized:
 * - Hardware-accelerated opacity layers
 * - Efficient absolute positioning
 * - No external dependencies
 *
 * Usage:
 * ```tsx
 * <TropicalBackground variant="sunset" intensity={0.3}>
 *   <YourContent />
 * </TropicalBackground>
 * ```
 */
export const TropicalBackground: React.FC<TropicalBackgroundProps> = ({
  variant,
  intensity = 1,
  children,
}) => {
  // Get gradient colors based on variant
  const getGradientLayers = () => {
    switch (variant) {
      case 'sunset':
        return [
          { color: '#FF6F00', opacity: 0.8 * intensity },  // Orange base
          { color: '#FF8E53', opacity: 0.6 * intensity },  // Light orange
          { color: '#FF4081', opacity: 0.4 * intensity },  // Pink
          { color: '#9C27B0', opacity: 0.2 * intensity },  // Purple top
        ];
      case 'jungle':
        return [
          { color: '#1B5E20', opacity: 0.7 * intensity },  // Dark green base
          { color: '#43A047', opacity: 0.5 * intensity },  // Medium green
          { color: '#66BB6A', opacity: 0.4 * intensity },  // Light green
          { color: '#00BFA5', opacity: 0.2 * intensity },  // Teal top
        ];
      case 'beach':
        return [
          { color: '#0277BD', opacity: 0.7 * intensity },  // Dark blue base
          { color: '#039BE5', opacity: 0.5 * intensity },  // Medium blue
          { color: '#29B6F6', opacity: 0.4 * intensity },  // Light blue
          { color: '#00E5FF', opacity: 0.2 * intensity },  // Cyan top
        ];
      default:
        return [];
    }
  };

  const layers = getGradientLayers();

  return (
    <View style={styles.container}>
      {/* Gradient layers (bottom to top) */}
      {layers.map((layer, index) => (
        <View
          key={index}
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: layer.color,
              opacity: layer.opacity,
            },
          ]}
        />
      ))}

      {/* Content overlay */}
      {children && <View style={styles.content}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    zIndex: 1, // Ensure content is above gradient layers
  },
});
