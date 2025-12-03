import { StyleSheet, ViewStyle } from 'react-native';

/**
 * Wooden Crate Styling Constants
 * Reusable styling for Crash Bandicoot wooden crate aesthetic
 *
 * Android-optimized:
 * - Uses `elevation` for depth (not iOS shadow properties)
 * - Efficient border rendering
 * - Hardware-accelerated when possible
 */

/**
 * Base wooden crate style (light mode optimized)
 * Use with theme.colors.crateWood for dynamic theming
 */
export const baseCrateStyle: ViewStyle = {
  borderWidth: 3,
  borderRadius: 8,
  elevation: 5, // Android elevation for depth
};

/**
 * Metal corner bracket size
 * Small decorative elements positioned at card corners
 */
export const CORNER_SIZE = 8;

/**
 * Crate style variants
 */
export const CRATE_VARIANTS = StyleSheet.create({
  /**
   * Standard wooden crate (most common)
   * Usage: Level cards, regular content
   */
  wooden: {
    ...baseCrateStyle,
    // backgroundColor and borderColor set dynamically via theme
  } as ViewStyle,

  /**
   * Metal/steel crate (more industrial)
   * Usage: Stats cards, special achievements
   */
  metal: {
    ...baseCrateStyle,
    elevation: 6,
    borderWidth: 2,
    // backgroundColor: metallic gray from theme
  } as ViewStyle,

  /**
   * TNT crate (explosive, high-energy)
   * Usage: Warnings, important actions, dangerous stats
   */
  tnt: {
    ...baseCrateStyle,
    borderWidth: 4,
    elevation: 7,
    // backgroundColor: red/orange tint
    // borderColor: black with dashed pattern (simulated)
  } as ViewStyle,

  /**
   * Lightweight crate (subtle)
   * Usage: Small cards, secondary content
   */
  light: {
    borderWidth: 2,
    borderRadius: 6,
    elevation: 3,
  } as ViewStyle,
});

/**
 * Metal corner bracket style
 * Absolutely positioned small squares at card corners
 */
export const metalCornerStyle: ViewStyle = {
  position: 'absolute',
  width: CORNER_SIZE,
  height: CORNER_SIZE,
  borderWidth: 1,
  borderRadius: 1,
  // backgroundColor and borderColor set via theme.colors.crateCorner
};

/**
 * Corner positions (use with metalCornerStyle)
 */
export const CORNER_POSITIONS = {
  topLeft: { top: -1, left: -1 },
  topRight: { top: -1, right: -1 },
  bottomLeft: { bottom: -1, left: -1 },
  bottomRight: { bottom: -1, right: -1 },
};

/**
 * Helper function to create corner bracket components
 * Returns an array of 4 corner styles (top-left, top-right, bottom-left, bottom-right)
 */
export const createCornerBrackets = (cornerColor: string) => [
  { ...metalCornerStyle, ...CORNER_POSITIONS.topLeft, backgroundColor: cornerColor, borderColor: cornerColor },
  { ...metalCornerStyle, ...CORNER_POSITIONS.topRight, backgroundColor: cornerColor, borderColor: cornerColor },
  { ...metalCornerStyle, ...CORNER_POSITIONS.bottomLeft, backgroundColor: cornerColor, borderColor: cornerColor },
  { ...metalCornerStyle, ...CORNER_POSITIONS.bottomRight, backgroundColor: cornerColor, borderColor: cornerColor },
];

/**
 * Wooden plank texture simulation (optional)
 * Subtle horizontal lines to simulate wood grain
 */
export const woodGrainOverlay: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  opacity: 0.1,
  borderRadius: 8,
  // Add thin horizontal lines via border or multiple views
};

/**
 * Crate content padding
 * Standard padding for content inside crate cards
 */
export const CRATE_PADDING = {
  small: 8,
  medium: 12,
  large: 16,
};

/**
 * Crate margin spacing
 * Standard margins for crate cards
 */
export const CRATE_MARGIN = {
  vertical: 8,
  horizontal: 16,
};
