# MemoryOS Roadmap

Tracks the spec's three phases. Don't start a phase until the previous phase's
acceptance criteria are met.

## Phase 1 — Foundation (Weeks 1–4) · *current*

**Goal:** A user can type a memory, see it persisted encrypted, and read it
back. No AI yet beyond stub embeddings.

- [x] Project scaffold (Expo, TS strict, expo-router)
- [x] WatermelonDB schema + Memory model + service layer
- [x] LanceDB adapter contract (in-memory stub)
- [x] AES-GCM envelope contract (native binding pending)
- [x] Chat input → encrypted persistence path
- [x] Privacy audit log table + UI surface
- [x] 4-screen drawer (Ask / Memories / Insights / Settings) + theme system
- [x] Orb component (breathing halo, listening waves, thinking spinner)
- [x] Tap-to-edit memory editor (`memory/[id].tsx`)
- [x] Memory TTL setting + sweeper wired to app start
- [ ] Native AES-GCM binding (replaces stub in `crypto/encryption.ts`)
- [ ] Real LanceDB binding (replaces in-memory map in `vector/lancedb.ts`)
- [ ] First-launch model download + manifest verification

**Acceptance:**
- Cold-start under 1.5s on a mid-tier device.
- 1k memories ingest under 30s end-to-end.
- DB on disk reveals no plaintext to a hex dump.

## Phase 2 — Intelligence (Weeks 5–8)

**Goal:** Real local LLM + ASR. "Ask your past self" works.

- [ ] Wire Phi-3.5-mini / Gemma-2B via onnxruntime-web
- [ ] Wire `all-MiniLM-L6-v2` for real embeddings (replace deterministic stub)
- [ ] Whisper-tiny ASR pipeline + voice ingestion screen
- [ ] RAG end-to-end <3s p95 on mid-tier device
- [ ] Prompt snapshot tests + `PROMPT_VERSION` discipline
- [ ] Image OCR pipeline (TBD model)

**Acceptance:**
- 90%+ "Ask" queries return at least one relevant source from a 200-memory
  corpus (qualitative test set).
- Voice → memory round-trip <5s for a 10s clip.

## Phase 3 — Proactivity (Weeks 9–12)

**Goal:** Synthesis surfaces patterns. The Insights screen earns its name.

- [ ] Weekly synthesis worker → `themes` + `memory_themes`
- [ ] Insights screen pulls from synthesis output (replace fixture)
- [ ] Theme-label encryption once stable theme IDs land
- [ ] Public beta launch

**Acceptance:**
- Synthesis identifies a planted recurring theme across a 30-day fixture.
- Insights screen reflects last Sunday's run, not stale data.

## Out of scope

- **Multi-device sync.** Removed from scope deliberately. The app is
  single-device. No CRDT, no relay, no cloud account. Memories live on
  one phone; if they need to move, that's a manual export/import
  question for a much later phase.
- Cloud LLM fallback.
- Server-side search.
- Third-party analytics.
- Web/desktop builds before mobile parity.
