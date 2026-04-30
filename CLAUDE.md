# CLAUDE.md — MemoryOS Agent Brief

> Read this first. This file is the contract between you (an AI agent) and this codebase.
> Skim §1–§3 every session. Re-read §4 (invariants) before touching schema, crypto, or sync.

## 1. What this project is

**MemoryOS** is a Private Personal Memory Operating System. It is **not** a note-taking app —
it's a *living synthesis engine* that turns stream-of-consciousness chat input into a
searchable, relational, proactive second brain. See `docs/ARCHITECTURE.md` and the source
spec in `docs/spec/`.

Core promise to the user: **Zero-Knowledge, High-Context Memory.**
Everything semantic happens on-device. The server (if any) only ever sees ciphertext.

## 2. Stack at a glance

| Layer            | Tech                                          | Where                |
|------------------|-----------------------------------------------|----------------------|
| App framework    | Expo (React Native) + expo-router             | `src/app/`           |
| Local SQL        | WatermelonDB (over expo-sqlite)               | `src/db/`            |
| Vector store     | LanceDB embedded (HNSW, on-disk)              | `src/vector/`        |
| Embeddings       | Transformers.js — `all-MiniLM-L6-v2` (384-d)  | `src/ai/embedder.ts` |
| LLM              | ONNX — Phi-3.5-mini / Gemma-2B (local)        | `src/ai/inference.ts`|
| Voice            | Whisper-tiny (on-device)                      | `src/ai/whisper.ts`  |
| Crypto           | AES-256-GCM via Keychain/Keystore             | `src/crypto/`        |
| Sync             | E2EE CRDT (optional, opt-in)                  | `src/sync/`          |

## 3. Repository map

```
src/
  app/              # expo-router routes (chat, timeline, insights, settings)
  components/       # presentational React Native components
  db/               # WatermelonDB schema + models (Memory, Embedding, Theme)
  vector/           # LanceDB adapter + embedder pipeline
  ai/               # Inference, RAG, synthesis, whisper
  crypto/           # AES-GCM + hardware key management
  sync/             # CRDT + privacy audit log
  hooks/            # React hooks (useMemories, useQuery, useSynthesis)
  utils/            # logger, time, ids
docs/               # ARCHITECTURE, PRIVACY, ROADMAP, spec/
tests/              # jest tests, mirrors src/
.claude/skills/     # MemoryOS-specific Claude skills (read these!)
```

## 4. Non-negotiable invariants

These are the rails. Breaking any of them is a P0 bug.

1. **No raw user content leaves the device.** Not in logs, not in telemetry, not in
   error reports, not in sync payloads. Sync is E2EE-only — encryption happens *before*
   it crosses the JS↔native bridge boundary.
2. **All persisted memory rows are encrypted at rest.** Plaintext exists only in
   memory while a Memory model is hydrated. See `src/crypto/encryption.ts`.
3. **The vector index is derived state.** Memories are the source of truth. A wipe-and-
   rebuild of LanceDB must always be safe.
4. **Embedding dim is 384.** If you change the embedding model, write a migration that
   re-embeds all rows in a background worker before flipping the active model.
5. **Latency budget: <3s end-to-end** for vector search + LLM response on a mid-tier
   device. Anything that breaks this needs a `// PERF:` note and a follow-up issue.
6. **Schema migrations are append-only.** Never edit a past migration; add a new one.
   See `src/db/schema.ts`.
7. **The privacy audit log records every outbound network request.** If you add a
   `fetch` or websocket, you must log it via `src/sync/privacyLog.ts`.

## 5. Workflows — pick the right skill

For common tasks, invoke the matching skill in `.claude/skills/`:

- **Adding a new memory feature** → `.claude/skills/add-memory-feature/SKILL.md`
- **Changing the DB schema** → `.claude/skills/update-schema/SKILL.md`
- **Touching crypto or sync** → `.claude/skills/privacy-audit/SKILL.md`
- **Adding an AI model or pipeline** → `.claude/skills/add-ai-pipeline/SKILL.md`
- **Architecture orientation** → `.claude/skills/memoryos-architecture/SKILL.md`

If your task doesn't fit a skill, follow §6.

## 6. House rules for code

- **TypeScript strict.** `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` are
  on. No `any` without a `// TODO:` and an issue link.
- **Prefer pure functions** in `src/ai/`, `src/vector/`, `src/crypto/`. Side effects live
  in adapters (`*.adapter.ts`) and hooks.
- **Errors at boundaries only.** Internal modules trust their inputs. Validate at
  ingress (UI, sync, file import).
- **Logs never include user content.** Use `logger.event('memory.created', { id })`,
  not `logger.info(memory.text)`.
- **Tests live next to features** in `tests/` mirroring `src/`. Run `npm test`.
- **No comments that restate code.** Only document non-obvious *why*.

## 7. How to run

```bash
npm install
npm start            # Expo dev server
npm run ios          # iOS simulator
npm run android      # Android emulator
npm run typecheck
npm test
```

The first launch downloads models into `models/` (gitignored). Until that wires up, the
AI modules have stubbed implementations marked `// STUB:`.

## 8. Roadmap pointer

We are in **Phase 1 — Foundation** (Weeks 1–4). See `docs/ROADMAP.md` for what's in vs.
out of scope right now. Don't build Phase 3 features (proactive synthesis, multi-device
sync) until Phase 1 acceptance criteria are met.

## 9. When you're stuck

- Spec questions → `docs/spec/spec.md`
- Architecture questions → `docs/ARCHITECTURE.md`
- Privacy questions → `docs/PRIVACY.md` (this is the source of truth, not your
  intuition)
- If a skill exists for the task, use it. If not, propose one in your PR.
