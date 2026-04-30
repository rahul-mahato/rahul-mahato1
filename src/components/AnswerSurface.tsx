import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Text } from '@/theme/text';
import { colors, radius, spacing } from '@/theme/tokens';
import type { RagContext } from '@ai/prompts';

interface Props {
  question: string;
  answer: string;
  contexts: RagContext[];
}

export function AnswerSurface({ question, answer, contexts }: Props) {
  return (
    <Animated.View entering={FadeInDown.duration(400)} style={styles.wrap}>
      <Text variant="mono" style={styles.label}>YOU ASKED</Text>
      <Text variant="bodyDim" style={styles.question}>“{question}”</Text>
      <Text variant="serifBody" style={styles.answer}>{answer}</Text>

      {contexts.length > 0 && (
        <View style={styles.sources}>
          {contexts.map((c, i) => (
            <View key={c.id} style={styles.source}>
              <Text variant="mono" style={styles.date}>
                {c.createdAt.toLocaleDateString(undefined, { month: 'short', day: '2-digit' })}
              </Text>
              <Text variant="bodyDim" style={styles.sourceText}>“{c.text}”</Text>
              <Text variant="meta" style={styles.idx}>[{i + 1}]</Text>
            </View>
          ))}
        </View>
      )}
    </Animated.View>
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
  question: { fontSize: 14, marginBottom: spacing.md, color: colors.inkFaint },
  answer: {
    fontSize: 22,
    lineHeight: 30,
    marginBottom: spacing.lg,
  },
  sources: { gap: 10 },
  source: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
    padding: 14,
    backgroundColor: colors.bg2,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.md,
  },
  date: { minWidth: 50, color: colors.inkFaint, letterSpacing: 1 },
  sourceText: { flex: 1, fontSize: 13, color: colors.inkDim },
  idx: { color: colors.inkFaint },
});
