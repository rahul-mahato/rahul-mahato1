import { embed } from './embedder';
import { generate } from './inference';
import { synthesisPrompt, type RagContext } from './prompts';
import { vectorSearch } from '@vector/lancedb';
import { database, Memory } from '@db/index';

/**
 * "Ask your past self." Pure orchestration: query → vector search → hydrate
 * memories → prompt → local LLM → response. No side effects beyond reads.
 *
 * Latency budget: <3s end-to-end on a mid-tier device. If you add work here,
 * benchmark or move it to a worker.
 */
export async function askPastSelf(query: string, k = 12): Promise<{ answer: string; contexts: RagContext[] }> {
  const queryVec = await embed(query);
  const hits = await vectorSearch(queryVec, k);

  const memories = await Promise.all(
    hits.map((h) => database.get<Memory>('memories').find(h.id)),
  );

  const contexts: RagContext[] = await Promise.all(
    memories.map(async (m) => ({
      id: m.id,
      text: await m.readText(),
      createdAt: m.createdAt,
    })),
  );

  const prompt = synthesisPrompt({ query, contexts });
  const answer = await generate({ prompt, maxTokens: 512, temperature: 0.3 });

  return { answer, contexts };
}
