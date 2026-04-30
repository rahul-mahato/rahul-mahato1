---
name: privacy-audit
description: Use whenever a change touches src/crypto/, src/sync/, adds a network call, adds telemetry/analytics, or imports a third-party SDK. The default in this codebase is "no data leaves the device" — every exception needs justification, audit-logging, and user-visible disclosure.
---

# Privacy audit checklist

Privacy is the product. If you cut a corner here, you've broken the product.

## Hard rules (P0 if violated)

1. **Plaintext never crosses a process or device boundary.** This includes:
   - Network requests
   - Logs (any level)
   - Crash reports / error monitors
   - Clipboard exports
   - Sync payloads (CRDT ops are encrypted before they hit the relay)

2. **Keys live in hardware-backed storage only.** Use `expo-secure-store`
   (iOS Keychain / Android Keystore). Never read the DEK into a plain JS
   variable for longer than needed; never persist it outside SecureStore.

3. **Every outbound network call is logged in the audit log.** That means
   *every* `fetch`, websocket, or third-party SDK that hits the network. Use
   `privacyLog.record({ url, reason, payloadShape })`. Payloads are described
   structurally, never quoted.

4. **No third-party analytics by default.** Telemetry is opt-in, anonymized,
   and event-shaped (`memory.created`, never `{ text }`).

## Review steps for a privacy-touching PR

1. Grep the diff:
   ```
   git diff main... | grep -E '(fetch|XMLHttpRequest|WebSocket|axios|console\.log|Sentry|Amplitude|posthog)'
   ```
   Every hit must be justified.

2. For each new network call:
   - [ ] Documented in `docs/PRIVACY.md` under "Outbound calls"
   - [ ] Logged via `privacyLog.record()`
   - [ ] Surfaced in the in-app Privacy panel (`src/app/settings.tsx`)
   - [ ] Payload contains no user content (CRDT ops must be ciphertext)

3. For each new persisted field:
   - [ ] Encrypted at rest if it could contain user content
   - [ ] Shape documented in `docs/PRIVACY.md` under "Data at rest"

4. For each new permission (mic, camera, contacts):
   - [ ] Justified in `app.json` `infoPlist` / `permissions`
   - [ ] User-facing copy explains what stays on-device

## Things that look fine but aren't

- "I'll just send the embedding, not the text." Embeddings are reversible enough
  to leak content. Don't.
- "It's only when the user opts in." Still must be E2EE.
- "Sentry filters PII." Not in this codebase.
- "Hashed user ID." Still a stable identifier; treat as PII.

## When you're not sure

Don't ship it. Comment in the PR with the question and tag for review.
