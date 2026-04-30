import * as Crypto from 'expo-crypto';

/**
 * Memory IDs are URL-safe random 128-bit values. Stable, opaque, not based on
 * content (so identical entries don't collide).
 */
export function newId(): string {
  return Crypto.randomUUID();
}
