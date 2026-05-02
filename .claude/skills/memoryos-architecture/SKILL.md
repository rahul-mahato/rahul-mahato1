---
name: memoryos-architecture
description: Use when the agent needs to orient on MemoryOS — request flow, module boundaries, where features live, what's allowed where. Invoke at session start for non-trivial work, or whenever a task spans more than one of {db, vector, ai, crypto, audit}.
---

# MemoryOS Architecture Tour

You're working in a local-first, privacy-bounded app. Most bugs come from people
treating it like a normal cloud-backed RN app. It isn't.

## The one diagram you need

```
 ┌──────────┐    plaintext    ┌──────────────┐   ciphertext   ┌──────────────┐
 │  UI/App  │ ───────────────▶│  Memory svc  │ ──────────────▶│ WatermelonDB │
 └──────────┘                 └──────────────┘                └──────────────┘
       │                            │                                │
       │ user query                 │ derive embedding                │
       ▼                            ▼                                ▼
 ┌──────────┐    text+ctx     ┌──────────────┐  upsert(384-d) ┌──────────────┐
 │  RAG svc │◀────────────────│  Embedder    │───────────────▶│   LanceDB    │
 └──────────┘                 └──────────────┘                └──────────────┘
       │                                                              ▲
       │ top-k context  ◀─────────────── vector.search(query) ────────┘
       ▼
 ┌──────────┐
 │ Local LLM│ ─▶ rendered to UI
 └──────────┘
```

## Module responsibilities

| Module          | Owns                                  | Must NOT                              |
|-----------------|---------------------------------------|---------------------------------------|
| `src/app/`      | Routes, screen-level state            | Talk to LanceDB, do crypto            |
| `src/components`| Pure presentational + hooks           | Do I/O, hold app state                |
| `src/db/`       | SQL schema, models, migrations        | Touch network, hold plaintext at rest |
| `src/vector/`   | Embedding + LanceDB upsert/search     | Persist plaintext                     |
| `src/ai/`       | Inference (embed, LLM, ASR), RAG glue | Make network calls                    |
| `src/crypto/`   | AES-GCM encrypt/decrypt, key mgmt     | Be bypassed by anyone else            |
| `src/audit/`    | Privacy audit log                     | Quote payloads — only describe shape  |

## Request flows you'll see in PRs

**Ingest:** `ChatInput` → `memory.create({text})` → encrypt → WatermelonDB row →
emit `memory.created` → background worker embeds → LanceDB upsert.

**Query:** `useQuery(q)` → `embedder.embed(q)` → `lancedb.search(vec, k=12)` →
`memory.hydrate(ids)` → decrypt → `rag.synthesize(q, contexts)` → LLM stream → UI.

**Sync (Phase 3):** local CRDT op → encrypt → relay → other device decrypts → apply.

## Where to put a new thing

- New screen → `src/app/<route>.tsx`
- New visual component → `src/components/`
- New AI capability → `src/ai/<capability>.ts` with a pure function
- New persisted entity → migration in `src/db/migrations/` + model in `src/db/models/`
- New cross-cutting concern → propose in PR, don't sneak it into `utils/`

## When in doubt

Search `CLAUDE.md` §4 (invariants) before changing anything in `db/`, `crypto/`, or
`sync/`. If you're about to add a network call anywhere, log it via
`src/audit/privacyLog.ts` or your PR will fail privacy review. Note: the
app is single-device by design — `fetch` calls are a red flag, not a
default.
