import React, { useEffect } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useTheme, MD3Theme } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  interpolateColor,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// M3 Expressive navigation bar specifications
const ICON_SIZE = 26;
const ITEM_HEIGHT = 44;
const ITEM_BORDER_RADIUS = 22; // Full stadium shape (height / 2)
const CONTAINER_BORDER_RADIUS = 30;

// Pre-defined widths for each tab state
const TAB_WIDTHS = {
  inactive: 56, // Icon-only width
  active: {
    Levels: 105,
    Stats: 115, // "Statistics" is longer
    Settings: 110,
  } as Record<string, number>,
};

// Timing configuration for subtle, fast animations (no bounce)
const TIMING_CONFIG = {
  duration: 200,
  easing: Easing.out(Easing.cubic),
};

// Individual tab item component with animations
const TabItem: React.FC<{
  route: { key: string; name: string };
  isFocused: boolean;
  options: any;
  onPress: () => void;
  onLongPress: () => void;
  theme: MD3Theme;
}> = ({ route, isFocused, options, onPress, onLongPress, theme }) => {
  const iconName = getIconName(route.name);

  // Get label text
  const label =
    options.tabBarLabel !== undefined
      ? typeof options.tabBarLabel === 'string'
        ? options.tabBarLabel
        : options.title || route.name
      : options.title !== undefined
      ? options.title
      : route.name;

  // Shared values for animations
  const widthValue = useSharedValue(
    isFocused ? TAB_WIDTHS.active[route.name] || 100 : TAB_WIDTHS.inactive
  );
  const focusValue = useSharedValue(isFocused ? 1 : 0);

  // Update animations when focus changes
  useEffect(() => {
    widthValue.value = withTiming(
      isFocused ? TAB_WIDTHS.active[route.name] || 100 : TAB_WIDTHS.inactive,
      TIMING_CONFIG
    );
    focusValue.value = withTiming(isFocused ? 1 : 0, TIMING_CONFIG);
  }, [isFocused, route.name, widthValue, focusValue]);

  // Animated styles using shared values (not JS values)
  const itemAnimatedStyle = useAnimatedStyle(() => ({
    width: widthValue.value,
    backgroundColor: interpolateColor(
      focusValue.value,
      [0, 1],
      ['transparent', theme.colors.secondaryContainer]
    ),
  }));

  // Icon color based on focus state
  const iconColor = isFocused
    ? theme.colors.onSecondaryContainer
    : theme.colors.onSurfaceVariant;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel || label}
      testID={options.tabBarButtonTestID}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Animated.View style={[styles.itemContainer, itemAnimatedStyle]}>
        <Icon name={iconName} size={ICON_SIZE} color={iconColor} />
        {isFocused && (
          <Animated.Text
            entering={FadeIn.duration(150)}
            exiting={FadeOut.duration(100)}
            style={[styles.label, { color: theme.colors.onSecondaryContainer }]}
            numberOfLines={1}
          >
            {label}
          </Animated.Text>
        )}
      </Animated.View>
    </Pressable>
  );
};

export const MaterialYouTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.tabBarWrapper,
        { paddingBottom: insets.bottom + 16 },
      ]}
    >
      <View
        style={[
          styles.floatingContainer,
          {
            backgroundColor: theme.colors.surfaceVariant,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TabItem
              key={route.key}
              route={route}
              isFocused={isFocused}
              options={options}
              onPress={onPress}
              onLongPress={onLongPress}
              theme={theme}
            />
          );
        })}
      </View>
    </View>
  );
};

// Helper function to get icon name from route
function getIconName(routeName: string): string {
  switch (routeName) {
    case 'Levels':
      return 'format-list-checks';
    case 'Stats':
      return 'chart-box';
    case 'Settings':
      return 'cog';
    default:
      return 'circle';
  }
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center', // Center the floating pill
  },
  floatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: CONTAINER_BORDER_RADIUS,
    paddingHorizontal: 8,
    paddingVertical: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    gap: 4,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: ITEM_HEIGHT,
    borderRadius: ITEM_BORDER_RADIUS,
    paddingHorizontal: 16,
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});
