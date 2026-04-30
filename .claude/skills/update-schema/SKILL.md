---
name: update-schema
description: Use when adding/changing a column, table, or index in WatermelonDB; renaming an entity; or changing the embedding dimension. Schema work is migration-only — never edit history.
---

# Updating the schema

WatermelonDB schemas are **append-only**. Never edit a past migration. Never lower
the schema version. If you do, existing user devices get corrupted DBs.

## Steps

1. **Bump version** in `src/db/schema.ts` (`version: N` → `N + 1`).
2. **Add a migration** in `src/db/migrations.ts` for `toVersion: N + 1`.
   Use `addColumns`, `createTable`, `addIndex`. WatermelonDB does not support
   destructive ops; if you need to drop, deprecate the column and stop writing it.
3. **Update the model** in `src/db/models/<Entity>.ts`:
   - Add `@field('column_name')` for new columns.
   - Add `@readonly @date('column_name')` for timestamps.
4. **Encryption check.** If the new column holds user content, store the
   ciphertext. Add a `*_iv` column alongside any encrypted column. The model
   should expose a typed getter that decrypts on read.
5. **Vector check.** If the column changes how a Memory is embedded, you must:
   - bump `EMBEDDING_VERSION` in `src/ai/embedder.ts`,
   - schedule a background re-embed of all rows on next launch.
6. **Test the migration.** Add `tests/db/migration-vN.test.ts`:
   - Build a v(N) DB,
   - Run the migration,
   - Assert shape + that existing rows survive.

## Embedding-dimension changes (rare, high-blast-radius)

If you change embedding model and the dimension changes from 384:
- Treat as a schema migration even though LanceDB isn't WatermelonDB.
- Write to a new LanceDB table, re-embed lazily, swap atomically.
- Keep old table until the swap is done — never leave the user with no index.

## Anti-patterns

- ❌ Editing migration N after it shipped.
- ❌ Renaming a column "in place" (do: add new column, backfill, deprecate old).
- ❌ Dropping the version bump because "it's just dev data."
- ❌ Storing plaintext "for now."
