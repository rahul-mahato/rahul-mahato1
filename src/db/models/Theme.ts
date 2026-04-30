import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

/**
 * A recurring concept surfaced by the synthesis engine. Themes are derived
 * — they are rebuilt from memories during weekly synthesis runs.
 */
export class Theme extends Model {
  static table = 'themes';

  @field('label') label!: string;
  @field('first_seen_at') firstSeenAt!: number;
  @field('last_seen_at') lastSeenAt!: number;
  @field('occurrence_count') occurrenceCount!: number;
}
