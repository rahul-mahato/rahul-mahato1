import { appSchema, tableSchema } from '@nozbe/watermelondb';

/**
 * MemoryOS local schema. Append-only — see `.claude/skills/update-schema`.
 *
 * Memory rows store CIPHERTEXT in `text_ct` + `text_iv`. The plain `text`
 * column is intentionally absent. Hydration happens in the model getter.
 */
export const SCHEMA_VERSION = 1;

export const schema = appSchema({
  version: SCHEMA_VERSION,
  tables: [
    tableSchema({
      name: 'memories',
      columns: [
        { name: 'text_ct', type: 'string' },
        { name: 'text_iv', type: 'string' },
        { name: 'kind', type: 'string', isIndexed: true }, // 'text' | 'voice' | 'image'
        { name: 'created_at', type: 'number', isIndexed: true },
        { name: 'updated_at', type: 'number' },
        { name: 'embedding_version', type: 'number' },
        { name: 'embedded_at', type: 'number', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'themes',
      columns: [
        { name: 'label', type: 'string' },
        { name: 'first_seen_at', type: 'number' },
        { name: 'last_seen_at', type: 'number' },
        { name: 'occurrence_count', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'memory_themes',
      columns: [
        { name: 'memory_id', type: 'string', isIndexed: true },
        { name: 'theme_id', type: 'string', isIndexed: true },
        { name: 'confidence', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'privacy_log',
      columns: [
        { name: 'occurred_at', type: 'number', isIndexed: true },
        { name: 'kind', type: 'string' }, // 'fetch' | 'sync' | 'permission'
        { name: 'url', type: 'string' },
        { name: 'reason', type: 'string' },
        { name: 'payload_shape', type: 'string' },
      ],
    }),
  ],
});
