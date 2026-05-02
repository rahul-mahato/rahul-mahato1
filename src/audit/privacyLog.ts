import { database, PrivacyLogEntry } from '@db/index';
import { logger } from '@/utils/logger';

/**
 * The privacy audit log. Every outbound network request from this app must
 * be recorded here. The settings UI surfaces it verbatim to the user.
 *
 * Payloads are SHAPES (e.g. "ciphertext+iv"), not contents.
 */

export interface PrivacyEvent {
  kind: 'fetch' | 'sync' | 'permission';
  url: string;
  reason: string;
  payloadShape: string;
}

export const privacyLog = {
  async record(ev: PrivacyEvent): Promise<void> {
    await database.write(async () => {
      await database.get<PrivacyLogEntry>('privacy_log').create((e) => {
        e.occurredAt = Date.now();
        e.kind = ev.kind;
        e.url = ev.url;
        e.reason = ev.reason;
        e.payloadShape = ev.payloadShape;
      });
    });
    logger.event('privacy.outbound', { kind: ev.kind, url: ev.url });
  },

  async list(limit = 100): Promise<PrivacyLogEntry[]> {
    const entries = await database
      .get<PrivacyLogEntry>('privacy_log')
      .query()
      .fetch();
    return entries
      .sort((a, b) => b.occurredAt - a.occurredAt)
      .slice(0, limit);
  },
};
