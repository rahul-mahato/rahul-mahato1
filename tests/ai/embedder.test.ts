import { embed } from '@ai/embedder';

describe('embedder', () => {
  it('returns a 384-dim unit-norm vector', async () => {
    const v = await embed('hello world');
    expect(v).toHaveLength(384);
    const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
    expect(norm).toBeCloseTo(1, 5);
  });

  it('is deterministic for identical input (under stub)', async () => {
    const a = await embed('same');
    const b = await embed('same');
    expect(a).toEqual(b);
  });
});
