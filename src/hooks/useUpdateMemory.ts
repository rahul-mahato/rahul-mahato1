import { useCallback, useEffect, useState } from 'react';
import { database, Memory } from '@db/index';
import { memoryService } from '@db/memory.service';

interface MemoryView {
  id: string;
  text: string;
  createdAt: Date;
  kind: Memory['kind'];
}

/**
 * Loads a single memory by id, decrypts it, and exposes save/delete handlers
 * that go through the encrypting service layer.
 */
export function useMemory(id: string) {
  const [memory, setMemory] = useState<MemoryView | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const row = await database.get<Memory>('memories').find(id);
        const text = await row.readText();
        if (active) {
          setMemory({ id: row.id, text, createdAt: row.createdAt, kind: row.kind });
        }
      } catch (e) {
        if (active) setError(e as Error);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  const save = useCallback(
    async (text: string) => {
      await memoryService.update({ id, text });
      setMemory((m) => (m ? { ...m, text } : m));
    },
    [id],
  );

  const remove = useCallback(async () => {
    await memoryService.delete(id);
  }, [id]);

  return { memory, error, save, remove };
}
