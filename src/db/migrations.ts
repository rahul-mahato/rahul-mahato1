import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';

/**
 * Append-only. Never edit a past migration; add a new one. See
 * `.claude/skills/update-schema/SKILL.md`.
 */
export const migrations = schemaMigrations({
  migrations: [
    // Future: { toVersion: 2, steps: [ addColumns(...) ] }
  ],
});
