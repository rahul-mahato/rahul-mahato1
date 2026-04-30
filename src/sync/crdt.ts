/**
 * E2EE CRDT sync (Phase 3 — not yet active).
 *
 * Design constraints:
 *   - Operations are encrypted with the user's DEK *before* leaving the device.
 *   - The relay sees only ciphertext + opaque routing IDs.
 *   - Conflict resolution is local; the relay is an untrusted message bus.
 *
 * STUB: implementation lands with the multi-device sync PR. Until then this
 * module exposes types so other code can be authored against the contract.
 */

export interface SyncOp {
  id: string;
  ts: number;
  ciphertext: string;
  iv: string;
}

export async function pushOp(_op: SyncOp): Promise<void> {
  throw new Error('CRDT sync not yet enabled — see roadmap Phase 3');
}

export async function* pullOps(): AsyncGenerator<SyncOp> {
  // STUB
}
