import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, useSharedValue, withTiming, useAnimatedStyle, runOnJS } from 'react-native-reanimated';
import { Text } from '@/theme/text';
import { colors, radius, spacing } from '@/theme/tokens';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface Props {
  visible: boolean;
  onHidden: () => void;
}

/**
 * Tiny calm confirmation that appears after a capture, then fades.
 * Per UX_RATIONALE §12 next-iteration: capture needs its own micro-flow with
 * a clear "this stayed on your device" affirmation. Three seconds, no
 * action required.
 */
export function CaptureToast({ visible, onHidden }: Props) {
  const reduced = useReducedMotion();
  const o = useSharedValue(0);

  useEffect(() => {
    if (!visible) return;
    o.value = withTiming(1, { duration: reduced ? 0 : 200 });
    const t = setTimeout(() => {
      o.value = withTiming(0, { duration: reduced ? 0 : 250 }, () => {
        runOnJS(onHidden)();
      });
    }, 2400);
    return () => clearTimeout(t);
  }, [o, onHidden, reduced, visible]);

  const style = useAnimatedStyle(() => ({ opacity: o.value }));

  if (!visible) return null;

  const Wrapper = reduced ? View : Animated.View;
  const wrapperProps = reduced ? {} : { entering: FadeIn, exiting: FadeOut };

  return (
    <Wrapper
      accessibilityLiveRegion="polite"
      accessibilityRole="text"
      style={[styles.wrap, style]}
      {...wrapperProps}
    >
      <View style={styles.dot} importantForAccessibility="no" />
      <Text variant="bodyDim" style={styles.text}>
        Saved. <Text variant="bodyDim" style={styles.emph}>This stayed on your device.</Text>
      </Text>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'center',
    marginTop: spacing.md,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.line,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.safe,
  },
  text: { fontSize: 13 },
  emph: { color: colors.ink },
});
