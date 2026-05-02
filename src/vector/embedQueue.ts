import { database, Memory } from '@db/index';
import { embed } from '@ai/embedder';
import { upsert } from './lancedb';
import { EMBEDDING_VERSION } from '@ai/models';
import { logger } from '@/utils/logger';

/**
 * Background embedding queue. Schedule when a memory changes; the queue
 * dequeues off the UI thread and writes to LanceDB.
 *
 * The vector index is derived state — failures here are recoverable by
 * re-running the queue.
 */

const queue: string[] = [];
let running = false;

export function scheduleEmbed(memoryId: string): void {
  queue.push(memoryId);
  if (!running) void run();
}

async function run(): Promise<void> {
  running = true;
  try {
    while (queue.length > 0) {
      const id = queue.shift();
      if (!id) continue;
      try {
        const memory = await database.get<Memory>('memories').find(id);
        const text = await memory.readText();
        const vec = await embed(text);
        await upsert(id, vec);
        await database.write(async () => {
          await memory.update((m) => {
            m.embeddingVersion = EMBEDDING_VERSION;
            m.embeddedAt = Date.now();
          });
        });
        logger.event('vector.embedded', { id });
      } catch (err) {
        logger.error('vector.embed.failed', { id, message: (err as Error).message });
      }
    }
  } finally {
    running = false;
  }
}
