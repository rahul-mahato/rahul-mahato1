import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Memory TTL preference.
 *
 * - `forever` keeps everything (default).
 * - All other values are durations after which a memory is auto-deleted on
 *   the next app launch (or on demand).
 *
 * The TTL preference is NOT user content; it lives in AsyncStorage rather
 * than the encrypted DB. The deletes it drives are real (markAsDeleted +
 * vector index removal), not soft.
 */

export const TTL_OPTIONS = [
  { id: 'forever', label: 'Forever', days: null },
  { id: '7d', label: '7 days', days: 7 },
  { id: '30d', label: '30 days', days: 30 },
  { id: '90d', label: '90 days', days: 90 },
  { id: '365d', label: '1 year', days: 365 },
] as const;

export type TtlId = (typeof TTL_OPTIONS)[number]['id'];

const KEY = 'memoryos.settings.ttl';
const DEFAULT: TtlId = 'forever';

export async function getTtl(): Promise<TtlId> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return DEFAULT;
  const valid = TTL_OPTIONS.some((o) => o.id === raw);
  return valid ? (raw as TtlId) : DEFAULT;
}

export async function setTtl(id: TtlId): Promise<void> {
  await AsyncStorage.setItem(KEY, id);
}

export function ttlToCutoffMs(id: TtlId, now = Date.now()): number | null {
  const opt = TTL_OPTIONS.find((o) => o.id === id);
  if (!opt || opt.days === null) return null;
  return now - opt.days * 24 * 60 * 60 * 1000;
}
