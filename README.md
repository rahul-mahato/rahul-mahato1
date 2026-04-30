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
  app/         expo-router routes (chat, ask, timeline, insights, settings)
  components/  presentational React Native components
  db/          WatermelonDB schema, models, service layer
  vector/      LanceDB adapter + embedding queue
  ai/          embedder, inference, whisper, RAG, prompts
  crypto/      AES-GCM envelope + Keychain/Keystore DEK
  sync/        privacy audit log, CRDT (Phase 3)
  hooks/       useMemories, useAskPastSelf
docs/
  ARCHITECTURE.md   how it fits together
  PRIVACY.md        data model + promises (source of truth)
  ROADMAP.md        phases, acceptance criteria
  spec/             original product spec
.claude/
  skills/      MemoryOS-specific Claude skills (read CLAUDE.md first)
```

## Working with Claude

This repo is set up for AI-assisted development. Start every session by
reading `CLAUDE.md`. For common tasks, invoke the matching skill:

- `add-memory-feature` — user-facing memory CRUD/query work
- `update-schema` — DB schema changes (append-only!)
- `privacy-audit` — anything touching crypto, sync, or network
- `add-ai-pipeline` — new on-device models or RAG variants
- `memoryos-architecture` — orientation tour

## Status

**Phase 1 — Foundation.** See `docs/ROADMAP.md` for what's in scope.

## License

See `LICENSE`.
