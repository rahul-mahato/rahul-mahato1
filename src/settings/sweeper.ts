import { memoryService } from '@db/memory.service';
import { getTtl, ttlToCutoffMs } from './ttl';
import { logger } from '@/utils/logger';

/**
 * Runs the TTL sweep. Safe to call from app start; cheap when TTL is
 * `forever` (no-op). Triggered also when the user changes the TTL setting.
 */
export async function runTtlSweep(now = Date.now()): Promise<number> {
  try {
    const ttl = await getTtl();
    const cutoff = ttlToCutoffMs(ttl, now);
    if (cutoff === null) return 0;
    const deleted = await memoryService.deleteOlderThan(cutoff);
    return deleted;
  } catch (err) {
    logger.error('ttl.sweep.failed', { message: (err as Error).message });
    return 0;
  }
}
