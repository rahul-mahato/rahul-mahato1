import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
  cancelAnimation,
} from 'react-native-reanimated';
import { colors, motion } from '@/theme/tokens';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export type OrbState = 'idle' | 'listening' | 'thinking' | 'answered';

interface Props {
  state: OrbState;
  onPress: () => void;
  size?: number;
}

/**
 * Amber orb with breathing halo + listening waveform overlay.
 * Mirrors the prototype in `docs/design/orb-prototype.html`.
 *
 * Respects `prefers-reduced-motion` per `docs/design/UX_RATIONALE.md` §6.4 —
 * the breathing halo, waveform, and spinner all collapse to static states
 * when the OS asks for reduced motion. The interface still works perfectly.
 */
export function Orb({ state, onPress, size = 170 }: Props) {
  const reduced = useReducedMotion();
  const haloScale = useSharedValue(0.94);
  const haloOpacity = useSharedValue(0.55);
  const press = useSharedValue(1);
  const ring = useSharedValue(0);

  useEffect(() => {
    if (reduced) {
      haloScale.value = 1;
      haloOpacity.value = 0.7;
      return;
    }
    haloScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: motion.durations.breathe / 2, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.94, { duration: motion.durations.breathe / 2, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
    haloOpacity.value = withRepeat(
      withSequence(
        withTiming(0.95, { duration: motion.durations.breathe / 2 }),
        withTiming(0.55, { duration: motion.durations.breathe / 2 }),
      ),
      -1,
      false,
    );
    return () => {
      cancelAnimation(haloScale);
      cancelAnimation(haloOpacity);
    };
  }, [haloOpacity, haloScale, reduced]);

  useEffect(() => {
    ring.value = withTiming(state === 'listening' ? 1 : 0, { duration: reduced ? 0 : 220 });
  }, [reduced, ring, state]);

  const haloStyle = useAnimatedStyle(() => ({
    transform: [{ scale: haloScale.value }],
    opacity: haloOpacity.value,
  }));

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: press.value }],
    shadowOpacity: interpolate(ring.value, [0, 1], [0.5, 0.85]),
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: ring.value,
    transform: [{ scale: interpolate(ring.value, [0, 1], [0.95, 1.06]) }],
  }));

  return (
    <View
      style={[styles.wrap, { width: size + 70, height: size + 70 }]}
      accessibilityElementsHidden={false}
    >
      <Animated.View
        style={[styles.halo, haloStyle, { width: size + 70, height: size + 70 }]}
        importantForAccessibility="no"
      />
      <Animated.View
        style={[
          styles.ring,
          ringStyle,
          { width: size + 26, height: size + 26, borderRadius: (size + 26) / 2 },
        ]}
        importantForAccessibility="no"
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Hold to speak. Tap to start or stop listening."
        accessibilityState={{ selected: state === 'listening' }}
        onPress={onPress}
        onPressIn={() => {
          press.value = withTiming(0.97, { duration: reduced ? 0 : 120 });
        }}
        onPressOut={() => {
          press.value = withTiming(1, { duration: reduced ? 0 : 200 });
        }}
        style={[styles.pressable, { width: size, height: size, borderRadius: size / 2 }]}
      >
        <Animated.View style={[styles.orb, orbStyle, { width: size, height: size, borderRadius: size / 2 }]}>
          <View
            style={[styles.gradientCore, { width: size * 0.7, height: size * 0.7, borderRadius: size }]}
            importantForAccessibility="no"
          />
          {state === 'listening' && <Waves reduced={reduced} />}
          {state === 'thinking' && <Spinner reduced={reduced} />}
        </Animated.View>
      </Pressable>
    </View>
  );
}

function Waves({ reduced }: { reduced: boolean }) {
  return (
    <View style={styles.waves} importantForAccessibility="no">
      {[0, 0.12, 0.24, 0.36, 0.18].map((delay, i) => (
        <Bar key={i} delay={delay * 1000} reduced={reduced} />
      ))}
    </View>
  );
}

function Bar({ delay, reduced }: { delay: number; reduced: boolean }) {
  const h = useSharedValue(reduced ? 30 : 14);
  useEffect(() => {
    if (reduced) {
      h.value = 30;
      return;
    }
    h.value = withRepeat(
      withSequence(
        withTiming(48, { duration: 550, easing: Easing.inOut(Easing.quad) }),
        withTiming(14, { duration: 550, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
    return () => cancelAnimation(h);
  }, [h, reduced]);
  const style = useAnimatedStyle(() => ({ height: h.value }));
  return <Animated.View style={[styles.bar, style, { marginLeft: delay > 0 ? 5 : 0 }]} />;
}

function Spinner({ reduced }: { reduced: boolean }) {
  const r = useSharedValue(0);
  useEffect(() => {
    if (reduced) return;
    r.value = withRepeat(withTiming(1, { duration: 1400, easing: Easing.linear }), -1);
    return () => cancelAnimation(r);
  }, [r, reduced]);
  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: reduced ? '0deg' : `${r.value * 360}deg` }],
  }));
  return <Animated.View style={[styles.spinner, style]} importantForAccessibility="no" />;
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  halo: {
    position: 'absolute',
    borderRadius: 9999,
    backgroundColor: colors.glowSoft,
  },
  ring: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: colors.glow,
  },
  pressable: { alignItems: 'center', justifyContent: 'center' },
  orb: {
    backgroundColor: '#f5b656',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.glow,
    shadowRadius: 60,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
  },
  gradientCore: {
    position: 'absolute',
    top: '8%',
    left: '12%',
    backgroundColor: '#ffd89b',
    opacity: 0.55,
  },
  waves: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
  },
  bar: {
    width: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(20,15,8,0.7)',
  },
  spinner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: 'rgba(20,15,8,0.25)',
    borderTopColor: 'rgba(20,15,8,0.85)',
  },
});
