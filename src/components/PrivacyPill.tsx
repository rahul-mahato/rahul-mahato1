import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, cancelAnimation } from 'react-native-reanimated';
import { router } from 'expo-router';
import { Text } from '@/theme/text';
import { colors, radius, spacing } from '@/theme/tokens';

interface Props {
  outboundCount?: number;
}

export function PrivacyPill({ outboundCount = 0 }: Props) {
  const o = useSharedValue(0.6);
  useEffect(() => {
    o.value = withRepeat(withTiming(1, { duration: 1200 }), -1, true);
    return () => cancelAnimation(o);
  }, [o]);
  const dotStyle = useAnimatedStyle(() => ({ opacity: o.value }));

  const label = outboundCount === 0 ? 'On‑device · 0 sync' : `On‑device · ${outboundCount} sync`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}. Tap for privacy details.`}
      onPress={() => router.push('/(drawer)/settings')}
      style={styles.pill}
    >
      <Animated.View style={[styles.dot, dotStyle]} />
      <Text variant="meta" style={styles.label}>{label}</Text>
      <View style={{ width: spacing.xs }} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: colors.bg2,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.pill,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.safe,
    shadowColor: colors.safe,
    shadowOpacity: 1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  label: { color: colors.inkDim, fontSize: 13 },
});
