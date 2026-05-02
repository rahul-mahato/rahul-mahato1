import { useEffect, useState } from 'react';
import { database, Memory } from '@db/index';

interface MemoryView {
  id: string;
  text: string;
  kind: Memory['kind'];
  createdAt: Date;
}

/**
 * Subscribes to the timeline of memories. Decrypts on hydrate; keep the
 * window small (limit) — we don't want N decrypts on every render.
 */
export function useMemories(limit = 50): MemoryView[] {
  const [items, setItems] = useState<MemoryView[]>([]);

  useEffect(() => {
    let active = true;
    const sub = database
      .get<Memory>('memories')
      .query()
      .observeWithColumns(['updated_at'])
      .subscribe(async (rows) => {
        const slice = rows
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(0, limit);

        const hydrated = await Promise.all(
          slice.map(async (m) => ({
            id: m.id,
            text: await m.readText(),
            kind: m.kind,
            createdAt: m.createdAt,
          })),
        );

        if (active) setItems(hydrated);
      });

    return () => {
      active = false;
      sub.unsubscribe();
    };
  }, [limit]);

  return items;
}
