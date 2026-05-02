import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Mirrors `prefers-reduced-motion: reduce`. Components that animate should
 * read this and skip looping/large transforms when it returns true. See
 * `docs/design/UX_RATIONALE.md` §6.4.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (active) setReduced(v);
    });
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (v) => {
      if (active) setReduced(v);
    });
    return () => {
      active = false;
      sub.remove();
    };
  }, []);

  return reduced;
}
