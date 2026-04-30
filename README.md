# MemoryOS

> A Private Personal Memory Operating System.

MemoryOS turns stream-of-consciousness chat into a searchable, relational,
proactive second brain — entirely on-device. **Zero-knowledge, high-context
memory.**

- **Local-first:** all semantic processing happens on your device.
- **Encrypted at rest:** AES-256-GCM with keys in iOS Keychain / Android Keystore.
- **Vector-native:** 384-d embeddings via Transformers.js, LanceDB on disk.
- **Audit-transparent:** every outbound network call is logged for you to inspect.

## Quick start

```bash
npm install
npm start            # Expo dev server
npm run ios          # iOS simulator
npm run android      # Android emulator
npm run typecheck
npm test
```

First launch downloads on-device models into `models/` (gitignored).

## Repo layout

```
src/
  app/
    _layout.tsx       fonts + splash + TTL sweep + stack
    (drawer)/         4-screen drawer:
      index.tsx       · Ask  — orb-centric, no search box, ask-only
      memories.tsx    · Memories — chronological, tap to edit
      insights.tsx    · Insights — weekly synthesis
      settings.tsx    · Settings — Memory TTL + privacy audit log
    memory/[id].tsx   modal editor for update / delete
  components/         Orb, AnswerSurface, MemoryRow, InsightCard, …
  theme/              tokens, font loader, typed Text
  db/                 WatermelonDB schema + models + memory.service
  vector/             LanceDB adapter + embedding queue
  ai/                 embedder, inference, whisper, RAG, prompts
  crypto/             AES-256-GCM + Keychain/Keystore DEK
  sync/               privacy audit log, CRDT (Phase 3)
  settings/           TTL preference + sweeper
  hooks/              useMemories, useAskPastSelf, useUpdateMemory
docs/
  ARCHITECTURE.md     how it fits together
  PRIVACY.md          data model + promises (source of truth)
  ROADMAP.md          phases, acceptance criteria
  design/             visual prototype (HTML mirror of theme)
  spec/               original product spec
.claude/
  skills/             MemoryOS-specific Claude skills (read CLAUDE.md first)
```

## Working with Claude

This repo is set up for AI-assisted development. Start every session by
reading `CLAUDE.md`. For common tasks, invoke the matching skill:

- `add-memory-feature` — user-facing memory CRUD/query work
- `update-schema` — DB schema changes (append-only!)
- `privacy-audit` — anything touching crypto, sync, or network
- `add-ai-pipeline` — new on-device models or RAG variants
- `change-settings` — adding or modifying user preferences (TTL, etc.)
- `memoryos-architecture` — orientation tour

## Status

**Phase 1 — Foundation.** See `docs/ROADMAP.md` for what's in scope.

## License

See `LICENSE`.
