/**
 * LanceDB adapter — embedded, on-disk vector store with HNSW indexing.
 *
 * Tables:
 *   memories_v1: id (string, pk) | vector (float32[384]) | created_at (i64)
 *
 * The vector index is *derived state*. A wipe-and-rebuild from the SQL store
 * must always be safe.
 *
 * STUB: real implementation uses `@lancedb/lancedb` mobile build via JSI.
 * The contract here is what `rag.ts` and `embedQueue.ts` depend on — keep it.
 */

import { logger } from '@/utils/logger';

export interface VectorHit {
  id: string;
  score: number; // cosine similarity in [-1, 1]
}

const memTable = new Map<string, number[]>();

export async function upsert(id: string, vector: number[]): Promise<void> {
  if (vector.length !== 384) {
    throw new Error(`vector.upsert: expected dim 384, got ${vector.length}`);
  }
  memTable.set(id, vector);
  logger.debug('vector.upsert', { id, dim: vector.length });
}

export async function vectorSearch(query: number[], k: number): Promise<VectorHit[]> {
  const hits: VectorHit[] = [];
  for (const [id, v] of memTable) {
    hits.push({ id, score: cosine(query, v) });
  }
  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, k);
}

export async function deleteVector(id: string): Promise<void> {
  memTable.delete(id);
}

export async function rebuildAll(items: Array<{ id: string; vector: number[] }>): Promise<void> {
  memTable.clear();
  for (const it of items) await upsert(it.id, it.vector);
  logger.event('vector.rebuilt', { count: items.length });
}

function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    const ai = a[i] ?? 0;
    const bi = b[i] ?? 0;
    dot += ai * bi;
    na += ai * ai;
    nb += bi * bi;
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}
