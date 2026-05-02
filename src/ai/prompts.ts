/**
 * Typed prompt templates. Strings are *generated* by these functions —
 * never built ad hoc at the call site.
 *
 * If you change a template, bump PROMPT_VERSION in `models.ts` so any cached
 * outputs invalidate.
 */

export interface RagContext {
  id: string;
  text: string;
  createdAt: Date;
}

export function synthesisPrompt(input: { query: string; contexts: RagContext[] }): string {
  const ctxBlock = input.contexts
    .map(
      (c, i) =>
        `[${i + 1}] (${c.createdAt.toISOString().slice(0, 10)}) ${c.text}`,
    )
    .join('\n');

  return [
    'You are MemoryOS, a private memory assistant. You only know what the user has',
    'previously written. If the answer is not in the entries below, say so plainly.',
    '',
    'User entries:',
    ctxBlock || '(none)',
    '',
    `Question: ${input.query}`,
    '',
    'Answer:',
  ].join('\n');
}

export function weeklySynthesisPrompt(input: { entries: RagContext[] }): string {
  return [
    'Summarize this week of the user\'s memories. Surface 3-5 recurring themes,',
    'mood shifts, and any open loops. Use neutral, observational language.',
    '',
    'Entries:',
    input.entries.map((e, i) => `[${i + 1}] ${e.text}`).join('\n'),
    '',
    'Summary:',
  ].join('\n');
}
