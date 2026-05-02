import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

/**
 * Every outbound network call is recorded here so the user can audit it from
 * the in-app Privacy panel. URLs are kept; payloads are described structurally
 * (`payload_shape`), never quoted.
 */
export class PrivacyLogEntry extends Model {
  static table = 'privacy_log';

  @field('occurred_at') occurredAt!: number;
  @field('kind') kind!: string;
  @field('url') url!: string;
  @field('reason') reason!: string;
  @field('payload_shape') payloadShape!: string;
}
