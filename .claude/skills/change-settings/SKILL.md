---
name: change-settings
description: Use when adding or changing a user-facing preference (TTL, telemetry opt-in, theme, sync toggle). Settings are *not* user content — they live in AsyncStorage, but anything they drive (deletes, network calls, key rotation) must still respect the privacy and crypto rules. Don't use for schema changes (use update-schema).
---

# Adding or changing a setting

Settings are small, plain-text preferences that change app behavior. They are
not user content, so they don't need to live in the encrypted DB — but the
*effects* they drive almost always do. Treat the setting as cheap; treat what
it triggers with the usual care.

## Where things go

| Concern                          | Goes in                          |
|----------------------------------|----------------------------------|
| Persisted preference value       | `src/settings/<name>.ts`         |
| Side-effect runner (sweep, etc.) | `src/settings/<name>Runner.ts`   |
| UI                               | `src/app/(drawer)/settings.tsx`  |

## Steps

1. **Define the value type and storage.** Use AsyncStorage with a stable
   key like `memoryos.settings.<name>`. Provide:
   - a `default`,
   - a `getX()` that validates on read,
   - a `setX(value)` that writes,
   - any pure helpers (e.g. `toCutoffMs`).

2. **Drive the side effect from a single function** in
   `src/settings/<name>Runner.ts` (or extend `sweeper.ts`). Make it
   idempotent and cheap when the setting is the default.

3. **Hook it into app start** in `src/app/_layout.tsx`. Fire-and-forget
   after fonts load — never block first paint.

4. **Surface the control in Settings.** Use the existing radio-row pattern
   in `(drawer)/settings.tsx`. Confirm destructive choices via `Alert`.

5. **Document in `docs/PRIVACY.md`.** If the setting changes data retention
   or affects what the app does on the network, it belongs in the privacy
   doc, not just the UI.

## TTL — concrete example

- Storage: `src/settings/ttl.ts` (`getTtl`, `setTtl`, `ttlToCutoffMs`).
- Runner: `src/settings/sweeper.ts` calls `memoryService.deleteOlderThan(cutoff)`.
- Hook: `src/app/_layout.tsx` invokes `runTtlSweep()` after fonts load.
- UI: radio rows in `(drawer)/settings.tsx`, with destructive confirm.
- Doc: `docs/PRIVACY.md` "Retention" section.

## Anti-patterns

- ❌ Reading the setting in 12 places. Wrap reads in `getX()` and never
  inline the storage key elsewhere.
- ❌ Putting the sweeper logic in the UI. Keep it pure and headless.
- ❌ Soft-deletes for TTL. The user asked for forgetting — actually delete.
- ❌ Storing a sensitive value (e.g. a sync token) in AsyncStorage. That goes
  in `expo-secure-store`.
