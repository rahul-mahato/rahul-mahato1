import { upsert, vectorSearch, rebuildAll } from '@vector/lancedb';

function vec(seed: number): number[] {
  const out = new Array(384).fill(0).map((_, i) => Math.sin(seed + i));
  const norm = Math.sqrt(out.reduce((s, x) => s + x * x, 0)) || 1;
  return out.map((x) => x / norm);
}

describe('lancedb adapter', () => {
  beforeEach(async () => {
    await rebuildAll([]);
  });

  it('upserts and returns the inserted vector as the top hit', async () => {
    await upsert('m1', vec(1));
    await upsert('m2', vec(2));
    const hits = await vectorSearch(vec(1), 5);
    expect(hits[0]?.id).toBe('m1');
  });

  it('rejects vectors of the wrong dimension', async () => {
    await expect(upsert('bad', [1, 2, 3])).rejects.toThrow(/dim 384/);
  });
});
