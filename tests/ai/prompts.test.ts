import { synthesisPrompt } from '@ai/prompts';

describe('synthesisPrompt', () => {
  it('renders zero-context query cleanly', () => {
    const p = synthesisPrompt({ query: 'what did I think about Paris?', contexts: [] });
    expect(p).toContain('what did I think about Paris?');
    expect(p).toContain('(none)');
  });

  it('numbers contexts and includes ISO dates', () => {
    const p = synthesisPrompt({
      query: 'q',
      contexts: [
        { id: 'a', text: 'A', createdAt: new Date('2026-01-15T10:00:00Z') },
        { id: 'b', text: 'B', createdAt: new Date('2026-02-20T10:00:00Z') },
      ],
    });
    expect(p).toContain('[1] (2026-01-15) A');
    expect(p).toContain('[2] (2026-02-20) B');
  });
});
