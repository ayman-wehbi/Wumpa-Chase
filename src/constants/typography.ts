import { StyleSheet, TextStyle } from 'react-native';

/**
 * Crash Bandicoot Typography System
 * Material You + Playful Theming
 *
 * Foundation: Material Design 3 text variants
 * Enhancement: Bangers font for display/headline styles, Roboto for body text
 *
 * Text Hierarchy:
 * - Display (displayLarge, displayMedium, displaySmall): Bangers font for big impact
 * - Headline (headlineLarge, headlineMedium, headlineSmall): Bangers font for section headers
 * - Title (titleLarge, titleMedium, titleSmall): Bangers font for subsections
 * - Body (bodyLarge, bodyMedium, bodySmall): Roboto (default) for readability
 * - Label (labelLarge, labelMedium, labelSmall): Roboto (default) for UI labels
 */

/**
 * Material You Text Variants with Crash Bandicoot Theming
 *
 * These align with Material Design 3's type scale and can be used
 * with react-native-paper's Text component via the variant prop.
 *
 * Usage:
 * ```tsx
 * <Text variant="displayLarge" style={MD3_TEXT_VARIANTS.displayLarge}>
 *   Crash Bandicoot
 * </Text>
 * ```
 */
export const MD3_TEXT_VARIANTS = StyleSheet.create({
  // Display - Largest text, Bangers font for maximum impact
  displayLarge: {
    fontFamily: 'Bangers-Regular',
    fontSize: 57,
    lineHeight: 64,
    letterSpacing: 0,
  } as TextStyle,

  displayMedium: {
    fontFamily: 'Bangers-Regular',
    fontSize: 45,
    lineHeight: 52,
    letterSpacing: 0,
  } as TextStyle,

  displaySmall: {
    fontFamily: 'Bangers-Regular',
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: 0,
  } as TextStyle,

  // Headline - Section headers, Bangers font for playful sections
  headlineLarge: {
    fontFamily: 'Bangers-Regular',
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: 0,
  } as TextStyle,

  headlineMedium: {
    fontFamily: 'Bangers-Regular',
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 0,
  } as TextStyle,

  headlineSmall: {
    fontFamily: 'Bangers-Regular',
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0,
  } as TextStyle,

  // Title - Subsection headers, smaller Bangers for hierarchy
  titleLarge: {
    fontFamily: 'Bangers-Regular',
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0,
  } as TextStyle,

  titleMedium: {
    fontFamily: 'Bangers-Regular',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  } as TextStyle,

  titleSmall: {
    fontFamily: 'Bangers-Regular',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  } as TextStyle,

  // Body - Default Roboto for readability (Material Design standard)
  bodyLarge: {
    fontFamily: 'Roboto',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
  } as TextStyle,

  bodyMedium: {
    fontFamily: 'Roboto',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
  } as TextStyle,

  bodySmall: {
    fontFamily: 'Roboto',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
  } as TextStyle,

  // Label - UI elements, default Roboto
  labelLarge: {
    fontFamily: 'Roboto',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
    fontWeight: '500',
  } as TextStyle,

  labelMedium: {
    fontFamily: 'Roboto',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
    fontWeight: '500',
  } as TextStyle,

  labelSmall: {
    fontFamily: 'Roboto',
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.5,
    fontWeight: '500',
  } as TextStyle,
});

/**
 * Base Bangers font configurations (legacy support)
 * @deprecated Use MD3_TEXT_VARIANTS instead for Material You alignment
 */
export const CRASH_FONTS = {
  header: {
    fontFamily: 'Bangers-Regular',
    letterSpacing: 1.5,
  },
  title: {
    fontFamily: 'Bangers-Regular',
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: 'Bangers-Regular',
    letterSpacing: 0.5,
  },
};

/**
 * Pre-configured text styles for common use cases
 */
export const CRASH_TEXT_STYLES = StyleSheet.create({
  /**
   * App header (top bar)
   * Usage: Screen titles in Appbar
   */
  appHeader: {
    ...CRASH_FONTS.header,
    fontSize: 26,
  } as TextStyle,

  /**
   * Dimension header (section headers for dimensions)
   * Usage: N. Sanity Island, The Hazardous Wastes, etc.
   */
  dimensionHeader: {
    ...CRASH_FONTS.header,
    fontSize: 24,
  } as TextStyle,

  /**
   * Level name (individual level titles)
   * Usage: "Rude Awakening", "Hit the Road", etc.
   */
  levelName: {
    ...CRASH_FONTS.title,
    fontSize: 20,
  } as TextStyle,

  /**
   * Section title (subsections within cards)
   * Usage: "Platinum Time Trial", "N.Sanely Perfect Relic"
   */
  sectionTitle: {
    ...CRASH_FONTS.subtitle,
    fontSize: 18,
  } as TextStyle,

  /**
   * Stats title (statistics screen headers)
   * Usage: "Overall Completion", "Gem Collection", etc.
   */
  statTitle: {
    ...CRASH_FONTS.title,
    fontSize: 22,
  } as TextStyle,

  /**
   * Stats subtitle (secondary stats headers)
   * Usage: Subsection titles in stats screen
   */
  statSubtitle: {
    ...CRASH_FONTS.subtitle,
    fontSize: 18,
  } as TextStyle,

  /**
   * Tab label (navigation tab labels)
   * Usage: "Levels", "Stats", "Settings"
   */
  tabLabel: {
    ...CRASH_FONTS.subtitle,
    fontSize: 14,
  } as TextStyle,

  /**
   * Button text (primary action buttons)
   * Usage: Large buttons with Bangers font
   */
  buttonText: {
    ...CRASH_FONTS.subtitle,
    fontSize: 16,
  } as TextStyle,

  /**
   * Modal title (dialog/modal headers)
   * Usage: Difficulty modal, note modal, etc.
   */
  modalTitle: {
    ...CRASH_FONTS.title,
    fontSize: 20,
  } as TextStyle,
});

/**
 * Helper function to create custom Bangers text style
 * @param fontSize - Font size in pixels
 * @param letterSpacing - Letter spacing (default: 1)
 * @returns TextStyle object with Bangers font
 */
export const createBangersStyle = (
  fontSize: number,
  letterSpacing: number = 1,
): TextStyle => ({
  fontFamily: 'Bangers-Regular',
  fontSize,
  letterSpacing,
});
