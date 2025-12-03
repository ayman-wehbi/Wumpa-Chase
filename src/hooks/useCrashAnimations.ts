import { useSharedValue, withSpring, withTiming, withSequence, withRepeat, Easing } from 'react-native-reanimated';

/**
 * Crash Bandicoot Animation Hooks
 * Reusable animation patterns for consistent, playful interactions
 *
 * Android-optimized:
 * - Uses Reanimated worklets (runs on UI thread)
 * - 60fps targeting
 * - Efficient spring physics
 */

/**
 * Bounce Animation Hook
 * Creates a spring-based bounce effect for card expand/collapse or interactive elements
 *
 * Usage:
 * ```tsx
 * const { value, trigger } = useBounceAnimation();
 *
 * // Trigger bounce
 * trigger(expanded);
 *
 * // Apply to style
 * const animatedStyle = useAnimatedStyle(() => ({
 *   transform: [{ scale: value.value }],
 * }));
 * ```
 *
 * @param initialValue - Starting value (default: 1)
 * @param targetValue - Target value when triggered (default: 1.05)
 */
export const useBounceAnimation = (initialValue = 1, targetValue = 1.05) => {
  const value = useSharedValue(initialValue);

  const trigger = (shouldBounce: boolean) => {
    value.value = withSpring(
      shouldBounce ? targetValue : initialValue,
      {
        damping: 12,
        stiffness: 100,
        mass: 0.8,
      },
    );
  };

  return { value, trigger };
};

/**
 * Wobble Animation Hook
 * Creates a celebration wobble effect (left-right shake)
 *
 * Usage:
 * ```tsx
 * const { value, trigger } = useWobbleAnimation();
 *
 * // Trigger wobble
 * trigger();
 *
 * // Apply to style
 * const animatedStyle = useAnimatedStyle(() => ({
 *   transform: [{ rotate: `${value.value}deg` }],
 * }));
 * ```
 */
export const useWobbleAnimation = () => {
  const value = useSharedValue(0);

  const trigger = () => {
    value.value = withSequence(
      withTiming(-8, { duration: 50 }),
      withTiming(8, { duration: 100 }),
      withTiming(-6, { duration: 100 }),
      withTiming(6, { duration: 100 }),
      withTiming(0, { duration: 50 }),
    );
  };

  return { value, trigger };
};

/**
 * Spin Animation Hook
 * Creates a continuous spinning animation (for loading states, Wumpa fruits, etc.)
 *
 * Usage:
 * ```tsx
 * const { value, start, stop } = useSpinAnimation();
 *
 * useEffect(() => {
 *   start();
 *   return () => stop();
 * }, []);
 *
 * // Apply to style
 * const animatedStyle = useAnimatedStyle(() => ({
 *   transform: [{ rotateZ: `${value.value}deg` }],
 * }));
 * ```
 *
 * @param duration - Duration of one full rotation in ms (default: 2000)
 */
export const useSpinAnimation = (duration = 2000) => {
  const value = useSharedValue(0);
  const isAnimating = useSharedValue(false);

  const start = () => {
    if (!isAnimating.value) {
      isAnimating.value = true;
      value.value = withRepeat(
        withTiming(360, {
          duration,
          easing: Easing.linear,
        }),
        -1, // Infinite
        false, // Don't reverse
      );
    }
  };

  const stop = () => {
    isAnimating.value = false;
    value.value = withTiming(0, { duration: 300 });
  };

  return { value, start, stop };
};

/**
 * Scale Animation Hook
 * Creates a scale-based pop effect (grows and shrinks back)
 *
 * Usage:
 * ```tsx
 * const { value, trigger } = useScaleAnimation();
 *
 * // Trigger scale pop
 * trigger();
 *
 * // Apply to style
 * const animatedStyle = useAnimatedStyle(() => ({
 *   transform: [{ scale: value.value }],
 * }));
 * ```
 *
 * @param peakScale - Maximum scale value (default: 1.2)
 */
export const useScaleAnimation = (peakScale = 1.2) => {
  const value = useSharedValue(1);

  const trigger = () => {
    value.value = withSequence(
      withSpring(peakScale, {
        damping: 50,
        stiffness: 1000,
      }),
      withSpring(1, {
        damping: 50,
        stiffness: 3000,
      }),
    );
  };

  return { value, trigger };
};

/**
 * Pulse Animation Hook
 * Creates a continuous pulsing effect (breathing animation)
 *
 * Usage:
 * ```tsx
 * const { value, start, stop } = usePulseAnimation();
 *
 * useEffect(() => {
 *   start();
 *   return () => stop();
 * }, []);
 *
 * // Apply to style
 * const animatedStyle = useAnimatedStyle(() => ({
 *   opacity: value.value,
 * }));
 * ```
 *
 * @param minValue - Minimum opacity (default: 0.5)
 * @param maxValue - Maximum opacity (default: 1)
 * @param duration - Duration of one pulse in ms (default: 1000)
 */
export const usePulseAnimation = (
  minValue = 0.5,
  maxValue = 1,
  duration = 1000,
) => {
  const value = useSharedValue(maxValue);
  const isAnimating = useSharedValue(false);

  const start = () => {
    if (!isAnimating.value) {
      isAnimating.value = true;
      value.value = withRepeat(
        withSequence(
          withTiming(minValue, {
            duration: duration / 2,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(maxValue, {
            duration: duration / 2,
            easing: Easing.inOut(Easing.ease),
          }),
        ),
        -1, // Infinite
        false, // Don't reverse
      );
    }
  };

  const stop = () => {
    isAnimating.value = false;
    value.value = withTiming(maxValue, { duration: 300 });
  };

  return { value, start, stop };
};
