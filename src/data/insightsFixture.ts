import type { InsightKind } from '@components/InsightCard';

/**
 * Static insights for the Phase 1 build. The synthesis worker (Phase 3)
 * will replace this with output from `src/ai/synthesis.ts`. Keep the
 * shape — both `SynthesisPreview` and the Insights drawer screen consume
 * it.
 */
export interface InsightFixture {
  kind: InsightKind;
  body: string;
  emphasis: string;
  meta: string;
}

export const INSIGHTS: InsightFixture[] = [
  {
    kind: 'theme',
    body: 'You\'ve mentioned sleep quality in 6 entries this week — usually after late gym sessions.',
    emphasis: 'sleep quality',
    meta: 'Tap to see all 6 →',
  },
  {
    kind: 'mood',
    body: 'Tone of your Tuesday entries is steadily more optimistic than three weeks ago.',
    emphasis: 'more optimistic',
    meta: 'Compare timelines →',
  },
  {
    kind: 'thread',
    body: 'A question you asked yourself on April 12 is still unresolved.',
    emphasis: 'unresolved',
    meta: 'Revisit →',
  },
];
