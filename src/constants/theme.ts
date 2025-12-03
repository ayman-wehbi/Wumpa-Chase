import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

/**
 * Material Design 3 Light Theme
 * Crash Bandicoot playful theme with Material You foundation
 *
 * Color Palette:
 * - Primary: Medium Blue (#2055A9)
 * - Secondary: Crash Orange/Red (#A12300)
 * - Tertiary: Dark Teal (#003333)
 * - Background: Light Cyan (#E6FFFF)
 */
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Primary - Medium Blue (main brand color)
    primary: '#2055A9',
    onPrimary: '#FFFFFF',
    primaryContainer: '#D4E1F7',  // Very light blue container
    onPrimaryContainer: '#101E41',  // Dark navy text

    // Secondary - Crash Orange/Red (accent actions)
    secondary: '#A12300',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#FFD7CC',  // Peachy light orange
    onSecondaryContainer: '#330033',  // Dark purple text

    // Tertiary - Dark Teal (success/complete states)
    tertiary: '#003333',
    onTertiary: '#E6FFFF',
    tertiaryContainer: '#D6DFF5',  // Light periwinkle
    onTertiaryContainer: '#101E41',

    // Error (keep Material default)
    error: 'rgb(186, 26, 26)',
    onError: 'rgb(255, 255, 255)',
    errorContainer: 'rgb(255, 218, 214)',
    onErrorContainer: 'rgb(65, 0, 2)',

    // Backgrounds - Very light cyan
    background: '#E6FFFF',
    onBackground: '#101E41',

    // Surface - Pure white
    surface: '#FFFFFF',
    onSurface: '#101E41',
    surfaceVariant: '#D6DFF5',  // Light periwinkle variant
    onSurfaceVariant: '#101E41',

    // Outline
    outline: '#2055A9',  // Use primary for outlines
    outlineVariant: '#D4E1F7',

    // Shadow & Scrim
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',

    // Inverse
    inverseSurface: '#101E41',
    inverseOnSurface: '#E6FFFF',
    inversePrimary: '#D4E1F7',

    // Elevation levels - tinted with primary
    elevation: {
      level0: 'transparent',
      level1: '#FAFCFE',  // Very subtle blue tint
      level2: '#F5F8FC',
      level3: '#F0F5FA',
      level4: '#EDF3F9',
      level5: '#E8F1F8',
    },

    // State layers
    surfaceDisabled: 'rgba(16, 30, 65, 0.12)',
    onSurfaceDisabled: 'rgba(16, 30, 65, 0.38)',
    backdrop: 'rgba(16, 30, 65, 0.4)',

    // Custom Crash Bandicoot colors
    wumpaOrange: '#FFD7CC',
    crashRed: '#A12300',
    akuAkuPurple: '#330033',
    completeTeal: '#003333',
  } as any,
};

/**
 * Material Design 3 Dark Theme
 * Crash Bandicoot playful theme with Material You foundation
 *
 * Color Palette (Inverted):
 * - Primary: Light Blue (#D4E1F7)
 * - Secondary: Peachy Orange (#FFD7CC)
 * - Tertiary: Light Periwinkle (#D6DFF5)
 * - Background: Dark Navy (#101E41)
 */
export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    // Primary - Light Blue (inverted for dark mode)
    primary: '#D4E1F7',
    onPrimary: '#101E41',
    primaryContainer: '#2055A9',  // Medium blue container
    onPrimaryContainer: '#E6FFFF',  // Cyan text

    // Secondary - Peachy Orange (inverted)
    secondary: '#FFD7CC',
    onSecondary: '#330033',  // Dark purple
    secondaryContainer: '#A12300',  // Crash red container
    onSecondaryContainer: '#FFD6FF',  // Light pink text

    // Tertiary - Light Periwinkle
    tertiary: '#D6DFF5',
    onTertiary: '#003333',  // Dark teal
    tertiaryContainer: '#003333',  // Dark teal container
    onTertiaryContainer: '#E6FFFF',  // Cyan text

    // Error (Material default dark)
    error: 'rgb(255, 180, 171)',
    onError: 'rgb(105, 0, 5)',
    errorContainer: 'rgb(147, 0, 10)',
    onErrorContainer: 'rgb(255, 180, 171)',

    // Backgrounds - Dark navy
    background: '#101E41',
    onBackground: '#D6DFF5',  // Light blue text

    // Surface - Slightly lighter navy
    surface: '#1A2B52',
    onSurface: '#E6FFFF',  // Cyan text
    surfaceVariant: '#2C3E5F',  // Medium navy variant
    onSurfaceVariant: '#D6DFF5',

    // Outline
    outline: '#D4E1F7',  // Light blue for dark mode
    outlineVariant: '#2055A9',

    // Shadow & Scrim
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',

    // Inverse
    inverseSurface: '#E6FFFF',
    inverseOnSurface: '#101E41',
    inversePrimary: '#2055A9',

    // Elevation levels - tinted with primary (lighter blues)
    elevation: {
      level0: 'transparent',
      level1: '#1E2F55',  // Subtle lighter navy
      level2: '#223458',
      level3: '#26395C',
      level4: '#283C5F',
      level5: '#2C4163',
    },

    // State layers
    surfaceDisabled: 'rgba(214, 223, 245, 0.12)',
    onSurfaceDisabled: 'rgba(214, 223, 245, 0.38)',
    backdrop: 'rgba(16, 30, 65, 0.6)',

    // Custom Crash Bandicoot colors (adjusted for dark mode)
    wumpaOrange: '#FFD7CC',
    crashRed: '#FF6347',  // Brighter for visibility
    akuAkuPurple: '#9370DB',  // Lighter purple for dark mode
    completeTeal: '#20B2AA',  // Lighter teal for dark mode
  } as any,
};
