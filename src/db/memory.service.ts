import { Q } from '@nozbe/watermelondb';
import { database, Memory } from './index';
import { logger } from '@/utils/logger';
import type { MemoryKind } from './models/Memory';
import { scheduleEmbed } from '@vector/embedQueue';
import { deleteVector } from '@vector/lancedb';

/**
 * The only correct way to write a Memory.
 *
 * Plaintext lives at the boundary; the moment it crosses into persistence,
 * it's encrypted. Callers in UI/hooks should use this service, not the DB
 * collection directly.
 */
export const memoryService = {
  async create({ text, kind }: { text: string; kind: MemoryKind }): Promise<Memory> {
    const sealed = await Memory.sealText(text);
    const created = await database.write(async () => {
      return database.get<Memory>('memories').create((m) => {
        m.textCiphertext = sealed.ciphertext;
        m.textIv = sealed.iv;
        m.kind = kind;
        m.embeddingVersion = 0;
        m.embeddedAt = null;
      });
    });

    logger.event('memory.created', { id: created.id, kind });
    scheduleEmbed(created.id);
    return created;
  },

  async update({ id, text }: { id: string; text: string }): Promise<void> {
    const sealed = await Memory.sealText(text);
    await database.write(async () => {
      const m = await database.get<Memory>('memories').find(id);
      await m.update((row) => {
        row.textCiphertext = sealed.ciphertext;
        row.textIv = sealed.iv;
        row.embeddedAt = null; // mark stale; embed worker will pick it up
      });
    });
    logger.event('memory.updated', { id });
    scheduleEmbed(id);
  },

  async delete(id: string): Promise<void> {
    await database.write(async () => {
      const m = await database.get<Memory>('memories').find(id);
      await m.markAsDeleted();
    });
    await deleteVector(id);
    logger.event('memory.deleted', { id });
  },

  /**
   * Drives the TTL sweeper. Deletes every memory whose `created_at` is
   * older than `cutoffMs` and removes its vector entry. Returns the count
   * deleted so the caller can surface it in the UI / logs.
   */
  async deleteOlderThan(cutoffMs: number): Promise<number> {
    const stale = await database
      .get<Memory>('memories')
      .query(Q.where('created_at', Q.lt(cutoffMs)))
      .fetch();
    if (stale.length === 0) return 0;

    await database.write(async () => {
      for (const m of stale) await m.markAsDeleted();
    });
    for (const m of stale) await deleteVector(m.id);

    logger.event('memory.ttl_swept', { count: stale.length, cutoff: cutoffMs });
    return stale.length;
  },
};
