import { useEffect, useRef } from 'react';
import { AccessibilityInfo, findNodeHandle, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import { Text } from '@/theme/text';
import { colors, radius, spacing } from '@/theme/tokens';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { RagContext } from '@ai/prompts';

interface Props {
  question: string;
  answer: string;
  contexts: RagContext[];
}

/**
 * The Siri-style answer panel. Three-part legibility per UX_RATIONALE §8:
 *   1. Echoed question (italic — confirms the system heard you).
 *   2. Synthesis (serif italic — reads as your own voice).
 *   3. Cited sources (mono date + italic memory text — RAG made transparent).
 *
 * Receives programmatic accessibility focus when it appears so screen-reader
 * users land on the answer without having to tab through the whole tree.
 */
export function AnswerSurface({ question, answer, contexts }: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<View>(null);

  useEffect(() => {
    const node = ref.current && findNodeHandle(ref.current);
    if (node != null) AccessibilityInfo.setAccessibilityFocus(node);
  }, [question]);

  const Wrapper = reduced ? View : Animated.View;
  const wrapperProps = reduced ? {} : { entering: FadeInDown.duration(400) };

  return (
    <Wrapper ref={ref as never} accessible accessibilityViewIsModal={false} style={styles.wrap} {...wrapperProps}>
      <Text variant="mono" accessibilityRole="header" style={styles.label}>YOU ASKED</Text>
      <Text variant="serifQuote" style={styles.question}>“{question}”</Text>

      <Text variant="serifItalic" style={styles.answer}>{answer}</Text>

      {contexts.length > 0 && (
        <>
          <Text variant="meta" accessibilityRole="header" style={styles.sourcesLabel}>
            MEMORIES USED TO ANSWER
          </Text>
          <View style={styles.sources}>
            {contexts.map((c, i) => (
              <Pressable
                key={c.id}
                accessibilityRole="button"
                accessibilityLabel={`Source ${i + 1} from ${c.createdAt.toLocaleDateString()}. Tap to open the memory.`}
                onPress={() => router.push({ pathname: '/memory/[id]', params: { id: c.id } })}
                style={({ pressed }) => [styles.source, pressed && styles.sourcePressed]}
              >
                <Text variant="mono" style={styles.date}>
                  {c.createdAt
                    .toLocaleDateString(undefined, { month: 'short', day: '2-digit' })
                    .toUpperCase()}
                </Text>
                <Text variant="serifQuote" style={styles.sourceText}>“{c.text}”</Text>
                <Text variant="meta" style={styles.idx}>[{i + 1}]</Text>
              </Pressable>
            ))}
          </View>
        </>
      )}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.xl,
    paddingTop: spacing.xl,
    borderTopWidth: 1,
    borderColor: colors.line,
  },
  label: { fontSize: 11, marginBottom: spacing.sm, color: colors.inkFaint, letterSpacing: 1.6 },
  question: { marginBottom: spacing.md, color: colors.inkFaint },
  answer: {
    marginBottom: spacing.lg,
  },
  sourcesLabel: {
    color: colors.inkFaint,
    letterSpacing: 1.4,
    marginBottom: spacing.sm,
  },
  sources: { gap: 10 },
  source: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
    minHeight: 48,
    padding: 14,
    backgroundColor: colors.bg2,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.md,
  },
  sourcePressed: { borderColor: colors.accent },
  date: { minWidth: 50, color: colors.inkFaint, letterSpacing: 1 },
  sourceText: { flex: 1 },
  idx: { color: colors.inkFaint },
});
