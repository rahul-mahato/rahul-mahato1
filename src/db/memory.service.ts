import { database, Memory } from './index';
import { logger } from '@/utils/logger';
import type { MemoryKind } from './models/Memory';
import { scheduleEmbed } from '@vector/embedQueue';

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
    logger.event('memory.deleted', { id });
  },
};
