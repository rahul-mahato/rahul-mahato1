# MemoryOS Privacy Model

This is the source of truth for what the app does and doesn't do with your
data. Code that contradicts this document is wrong.

## Promises

1. **Your memories never leave this device unencrypted.**
2. **Encryption keys are stored in hardware-backed storage** (iOS Keychain /
   Android Keystore) and cannot be exported through the app.
3. **There is no analytics SDK by default.** Telemetry, if enabled, is
   opt-in and event-shaped (`memory.created`); it never includes content.
4. **Every outbound network request is recorded** in the in-app Privacy log.

## Data at rest

| Field                         | Encrypted | Notes                                 |
|-------------------------------|-----------|---------------------------------------|
| `memories.text_ct` / `text_iv`| ✅        | AES-256-GCM, fresh IV per write       |
| `memories.kind`               | ❌        | Enum, no user content                 |
| `memories.created_at`         | ❌        | Unix ms                               |
| `themes.label`                | ❌        | Derived label, may be sensitive (TBD) |
| `privacy_log.url`             | ❌        | The point is to be auditable          |

> **Open issue:** if a user types a sensitive theme into a memory and the
> synthesis engine extracts it as a label, the label sits unencrypted. We
> resolve this in Phase 3 by encrypting `themes.label` once we have stable
> theme IDs that don't depend on plaintext lookup.

## Data in transit

Phase 1: **none**. The app is offline by default.

Phase 3 (sync): every CRDT op is encrypted with the user's DEK before it
leaves the device. The relay sees:
- `id` (random)
- `ts` (timestamp)
- `ciphertext`
- `iv`

It does **not** see: text, embeddings, theme labels, kind, or any user-stable
identifier beyond what the user opts into.

## Outbound calls

The current build makes **no** outbound calls. When that changes, every call
must be:
1. Documented here.
2. Recorded via `privacyLog.record()`.
3. Surfaced in the in-app Privacy panel.

## Permissions

| Permission   | Why                                  | Where declared        |
|--------------|--------------------------------------|-----------------------|
| Microphone   | Voice notes via on-device Whisper    | `app.json` (iOS+And)  |
| Camera       | Image-to-text via on-device OCR      | `app.json` (iOS+And)  |

Both stay on-device. Audio buffers live only as long as transcription takes.

## What we'd love to do but won't

- Cloud LLM fallback for low-end devices. Tempting, breaks the model.
- Crash reporting via Sentry. We'd have to filter PII; we'd rather not collect.
- "Anonymous" usage analytics. There's no anonymous when the events
  reflect the user's writing cadence.

## Retention

Memory TTL is user-configurable in Settings. Options:

| TTL      | Behavior                                                    |
|----------|-------------------------------------------------------------|
| Forever  | Default. Nothing is auto-deleted.                           |
| 7 days   | Memories older than 7 days are deleted on next launch.      |
| 30 days  | …                                                           |
| 90 days  | …                                                           |
| 1 year   | …                                                           |

When the TTL changes, the sweeper runs immediately. Deletes are real:
the WatermelonDB row is destroyed and its vector is removed from LanceDB.
There is no "trash" bucket and no soft-delete. The user asked for
forgetting, so the app forgets.

The TTL preference itself is stored in AsyncStorage under
`memoryos.settings.ttl`. It is not user content; it does not require
encryption. The setting key never leaves the device.

## Wipe

`crypto/keystore.ts:wipe()` deletes the DEK. All on-disk ciphertext becomes
unreadable. That is the strongest delete the app can offer.
