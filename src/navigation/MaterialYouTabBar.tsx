import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Material You specifications for navigation bar pill
const PILL_WIDTH = 64;
const PILL_HEIGHT = 32;
const PILL_BORDER_RADIUS = 16;
const ICON_SIZE = 24;

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
        styles.tabBar,
        {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outlineVariant,
          paddingBottom: insets.bottom,
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

        // Get icon name from route
        const iconName = getIconName(route.name);

        // Animated pill style
        const animatedPillStyle = useAnimatedStyle(() => ({
          opacity: withSpring(isFocused ? 1 : 0, {
            damping: 15,
            stiffness: 150,
          }),
          transform: [
            {
              scale: withSpring(isFocused ? 1 : 0.8, {
                damping: 15,
                stiffness: 150,
              }),
            },
          ],
        }));

        // Icon color (active or inactive)
        const iconColor = isFocused
          ? theme.colors.primary
          : theme.colors.onSurfaceVariant;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tab}
          >
            <View style={styles.tabContent}>
              {/* Animated pill background */}
              <Animated.View
                style={[
                  styles.iconPill,
                  {
                    backgroundColor: theme.colors.primaryContainer,
                  },
                  animatedPillStyle,
                ]}
              />

              {/* Icon (positioned on top of pill) */}
              <View style={styles.iconContainer}>
                <Icon name={iconName} size={ICON_SIZE} color={iconColor} />
              </View>

              {/* Label (below icon, always subtle) */}
              <Text
                style={[
                  styles.label,
                  {
                    color: theme.colors.onSurfaceVariant,
                  },
                ]}
                numberOfLines={1}
              >
                {options.tabBarLabel !== undefined
                  ? typeof options.tabBarLabel === 'function'
                    ? options.tabBarLabel({
                        focused: isFocused,
                        color: theme.colors.onSurfaceVariant,
                        position: options.tabBarLabelPosition || 'below-icon',
                        children: options.title || route.name,
                      })
                    : options.tabBarLabel
                  : options.title !== undefined
                  ? options.title
                  : route.name}
              </Text>
            </View>
          </Pressable>
        );
      })}
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
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    elevation: 8,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPill: {
    position: 'absolute',
    width: PILL_WIDTH,
    height: PILL_HEIGHT,
    borderRadius: PILL_BORDER_RADIUS,
    top: 0,
  },
  iconContainer: {
    width: PILL_WIDTH,
    height: PILL_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});
