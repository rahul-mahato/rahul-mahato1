import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/theme/text';
import { colors, spacing } from '@/theme/tokens';
import { InsightCard } from './InsightCard';
import { INSIGHTS } from '@/data/insightsFixture';

/**
 * Three-card synthesis surface for the home screen. Per UX_RATIONALE §9,
 * three is a deliberate ceiling — more becomes anxiety. The full archive
 * lives behind the Insights drawer screen.
 *
 * Phase 3 will replace `INSIGHTS` (a static fixture) with output from
 * `src/ai/synthesis.ts`. Keep the shape stable.
 */
export function SynthesisPreview() {
  const top = INSIGHTS.slice(0, 3);
  return (
    <View style={styles.wrap}>
      <View style={styles.label}>
        <Text variant="title" accessibilityRole="header">This week’s synthesis</Text>
        <Pressable
          accessibilityRole="link"
          onPress={() => router.push('/(drawer)/insights')}
          style={styles.allBtn}
        >
          <Text variant="mono">{top.length} PATTERNS NOTICED</Text>
        </Pressable>
      </View>

      <View style={styles.cards}>
        {top.map((p, i) => (
          <InsightCard
            key={i}
            kind={p.kind}
            body={p.body}
            emphasis={p.emphasis}
            meta={p.meta}
            onPress={() => router.push('/(drawer)/insights')}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: spacing['2xl'] },
  label: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  allBtn: { minHeight: 44, justifyContent: 'center' },
  cards: { gap: 12 },
});
