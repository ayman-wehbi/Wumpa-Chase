import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

/**
 * Material Design 3 Light Theme
 * Crash Bandicoot inspired color scheme (orange/purple)
 */
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: 'rgb(255, 111, 0)', // Crash Bandicoot orange
    onPrimary: 'rgb(255, 255, 255)',
    primaryContainer: 'rgb(255, 219, 200)',
    onPrimaryContainer: 'rgb(51, 22, 0)',
    secondary: 'rgb(120, 69, 172)', // Purple for secondary actions
    onSecondary: 'rgb(255, 255, 255)',
    secondaryContainer: 'rgb(239, 221, 255)',
    onSecondaryContainer: 'rgb(44, 0, 81)',
    tertiary: 'rgb(0, 105, 92)',
    onTertiary: 'rgb(255, 255, 255)',
    tertiaryContainer: 'rgb(151, 248, 228)',
    onTertiaryContainer: 'rgb(0, 32, 27)',
    error: 'rgb(186, 26, 26)',
    onError: 'rgb(255, 255, 255)',
    errorContainer: 'rgb(255, 218, 214)',
    onErrorContainer: 'rgb(65, 0, 2)',
    background: 'rgb(255, 251, 255)',
    onBackground: 'rgb(29, 27, 30)',
    surface: 'rgb(255, 251, 255)',
    onSurface: 'rgb(29, 27, 30)',
    surfaceVariant: 'rgb(242, 221, 210)',
    onSurfaceVariant: 'rgb(82, 67, 60)',
    outline: 'rgb(132, 115, 107)',
    outlineVariant: 'rgb(213, 194, 182)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(51, 47, 50)',
    inverseOnSurface: 'rgb(246, 239, 242)',
    inversePrimary: 'rgb(255, 183, 134)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(250, 242, 247)',
      level2: 'rgb(247, 236, 242)',
      level3: 'rgb(244, 230, 237)',
      level4: 'rgb(243, 228, 235)',
      level5: 'rgb(240, 224, 231)',
    },
    surfaceDisabled: 'rgba(29, 27, 30, 0.12)',
    onSurfaceDisabled: 'rgba(29, 27, 30, 0.38)',
    backdrop: 'rgba(58, 45, 38, 0.4)',
  },
};

/**
 * Material Design 3 Dark Theme
 * Crash Bandicoot inspired color scheme (orange/purple)
 */
export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: 'rgb(255, 183, 134)',
    onPrimary: 'rgb(87, 37, 0)',
    primaryContainer: 'rgb(122, 54, 0)',
    onPrimaryContainer: 'rgb(255, 219, 200)',
    secondary: 'rgb(220, 184, 255)',
    onSecondary: 'rgb(71, 12, 122)',
    secondaryContainer: 'rgb(95, 43, 146)',
    onSecondaryContainer: 'rgb(239, 221, 255)',
    tertiary: 'rgb(121, 219, 200)',
    onTertiary: 'rgb(0, 54, 47)',
    tertiaryContainer: 'rgb(0, 79, 69)',
    onTertiaryContainer: 'rgb(151, 248, 228)',
    error: 'rgb(255, 180, 171)',
    onError: 'rgb(105, 0, 5)',
    errorContainer: 'rgb(147, 0, 10)',
    onErrorContainer: 'rgb(255, 180, 171)',
    background: 'rgb(29, 27, 30)',
    onBackground: 'rgb(231, 225, 228)',
    surface: 'rgb(29, 27, 30)',
    onSurface: 'rgb(231, 225, 228)',
    surfaceVariant: 'rgb(82, 67, 60)',
    onSurfaceVariant: 'rgb(213, 194, 182)',
    outline: 'rgb(158, 140, 132)',
    outlineVariant: 'rgb(82, 67, 60)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(231, 225, 228)',
    inverseOnSurface: 'rgb(51, 47, 50)',
    inversePrimary: 'rgb(157, 68, 0)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(39, 35, 41)',
      level2: 'rgb(45, 40, 48)',
      level3: 'rgb(51, 44, 54)',
      level4: 'rgb(53, 46, 56)',
      level5: 'rgb(57, 49, 61)',
    },
    surfaceDisabled: 'rgba(231, 225, 228, 0.12)',
    onSurfaceDisabled: 'rgba(231, 225, 228, 0.38)',
    backdrop: 'rgba(58, 45, 38, 0.4)',
  },
};
