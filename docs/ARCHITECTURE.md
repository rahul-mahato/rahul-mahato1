# MemoryOS Architecture

> Companion to `CLAUDE.md`. This is the human-readable, longer-form version.

## Goals

- **Local-first.** All semantic processing on-device.
- **Zero-knowledge.** Server (when present) only sees ciphertext.
- **Low-friction ingest.** Chat-native, voice-native, image-native.
- **Proactive recall.** Synthesis surfaces themes; not a passive archive.

## Components

### App layer (`src/app/`)
expo-router routes. The root stack mounts a 4-screen drawer
(`(drawer)/index.tsx` Ask, `memories.tsx`, `insights.tsx`, `settings.tsx`)
plus a modal editor route at `memory/[id].tsx`. Screens are thin — they
compose components and hooks. Screens never reach into the DB or vector
store directly.

The Ask screen is the focal point: an animated amber Orb (see
`src/components/Orb.tsx`, mirrored in `docs/design/orb-prototype.html`)
with a typed prompt fallback. There is **no search bar** — retrieval is
ask-only by design.

### Theme (`src/theme/`)
- `tokens.ts` — colors, spacing, fonts, motion durations.
- `fonts.ts` — `useAppFonts()` (Fraunces + Geist + Geist Mono via
  `@expo-google-fonts/*`).
- `text.tsx` — typed `<Text variant>` so designers and code agree on
  what `display`, `title`, `serifBody`, `mono` mean.

### Settings (`src/settings/`)
- `ttl.ts` — TTL preference (AsyncStorage). Plain helpers; not user content.
- `sweeper.ts` — `runTtlSweep()` deletes memories older than the cutoff,
  wired into root layout post-fonts and on TTL change in Settings.

### Components (`src/components/`)
Presentational + light state. They consume hooks. No I/O, no encryption.

### DB (`src/db/`)
WatermelonDB on top of expo-sqlite. Schema is **append-only** with
versioned migrations.

Tables:
- `memories` — text ciphertext, IV, kind, timestamps, embedding metadata.
- `themes` — recurring concepts (derived).
- `memory_themes` — many-to-many with confidence score.
- `privacy_log` — every outbound network call.

The `memoryService` is the only correct write path. It encrypts before
persistence and queues an embedding job.

### Vector (`src/vector/`)
LanceDB embedded build, accessed via JSI. `embedQueue` runs off-thread,
embeds via `embedder.ts`, and upserts. The vector index is **derived state**;
it can be rebuilt from `memories` at any time.

### AI (`src/ai/`)
Pure functions over lazily-loaded models:
- `embedder.ts` — 384-d MiniLM-L6-v2.
- `inference.ts` — Phi-3.5-mini / Gemma-2B via ONNX.
- `whisper.ts` — speech → text.
- `rag.ts` — orchestrates query → search → synthesize.
- `prompts.ts` — typed templates, `PROMPT_VERSION`-tagged.

Models are downloaded into `models/` on first launch (gitignored).

### Crypto (`src/crypto/`)
- `keystore.ts` — DEK in iOS Keychain / Android Keystore.
- `encryption.ts` — AES-256-GCM seal/open envelope.
The native AES-GCM binding is wired in `crypto/native.ts` (added with the
encryption PR). Until then the stub throws to fail loud.

### Sync (`src/sync/`)
- `privacyLog.ts` — every outbound call is recorded here.
- `crdt.ts` — E2EE CRDT sync (Phase 3, stubbed).

## Critical flows

### Ingest
```
ChatInput
  → memoryService.create({ text, kind })
    → seal(text) via DEK
    → DB write { text_ct, text_iv }
    → scheduleEmbed(id)
  → embedQueue
    → embed(text) → 384-d vector
    → lancedb.upsert(id, vec)
    → mark memory.embedded_at = now
```

### Query (Ask your past self)
```
useAskPastSelf.ask(q)
  → embed(q) → query vector
  → lancedb.vectorSearch(vec, k=12) → hits
  → DB.find(id) for each hit → memory rows
  → memory.readText() → plaintext (in-memory only)
  → synthesisPrompt(q, contexts)
  → inference.generate(prompt) → answer
  → returned to UI with sources
```

### Sync (Phase 3)
```
local op
  → encrypt(op, DEK) → SyncOp { ciphertext, iv }
  → relay (untrusted, sees only ciphertext)
  → other device pulls → decrypt → CRDT apply
```

## Performance budgets

Total wall-clock for a query (embed + search + synthesize) must stay <3s on a
mid-tier device. Per-pipeline budgets in
`.claude/skills/add-ai-pipeline/SKILL.md`.

## What's NOT here yet

- Native AES-GCM binding (stub throws)
- ONNX-based real LLM (stub returns canned text)
- LanceDB native build (in-memory map for now)
- CRDT sync engine (stub throws)
- OCR for image ingestion

These are tracked in `docs/ROADMAP.md`.
