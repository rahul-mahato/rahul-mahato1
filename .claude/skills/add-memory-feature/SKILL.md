---
name: add-memory-feature
description: Use when adding a user-facing feature that creates, reads, or transforms Memory entries — chat composer changes, new query modes, timeline interactions, insights cards. Don't use for schema changes (use update-schema) or pure crypto/sync changes (use privacy-audit).
---

# Adding a Memory feature

Follow this checklist *in order*. Each step has a hard gate.

## 1. Confirm scope

Before writing code, name the user-visible behavior in one sentence. If it touches
more than one of {ingest, retrieve, synthesize, display}, split the work.

## 2. Layer placement

| Concern                  | Goes in              |
|--------------------------|----------------------|
| Pure transform on text   | `src/ai/`            |
| New query/RAG variant    | `src/ai/rag.ts`      |
| Vector op (search/upsert)| `src/vector/`        |
| New screen / route       | `src/app/`           |
| Reusable visual          | `src/components/`    |
| Stateful binding         | `src/hooks/`         |

If you're unsure, re-read `.claude/skills/memoryos-architecture/SKILL.md` first.

## 3. Data path checklist

For any code that touches a Memory:
- [ ] Reads go through `memory.get*` / `useMemories()`, not raw DB queries.
- [ ] Writes go through `memory.create` / `memory.update`, which encrypt before
      persisting. Never write plaintext directly to the DB.
- [ ] If the feature changes how text is indexed, queue an embedding refresh (don't
      block the UI on it).

## 4. Performance gate

Total wall-clock for a query (embed + search + synthesize) must stay <3s on a
mid-tier device. If your feature can blow that budget, either:
- move work into a background worker, **or**
- gate it behind an explicit user action (button, not on-keystroke).

Add a `// PERF:` comment with your reasoning if it's close.

## 5. Privacy gate

- [ ] No `console.log(memory.text)` or any variant.
- [ ] No new outbound network call without a `privacyLog.record()`.
- [ ] No telemetry that includes memory content, even hashed.

## 6. Tests

Add at least one test under `tests/` mirroring the source path:
- A pure function in `src/ai/foo.ts` → `tests/ai/foo.test.ts`.
- A hook → render-test with `@testing-library/react-native`.

## 7. Update touch points

- If the feature is user-visible, update `docs/ROADMAP.md` (move from "in flight"
  to "shipped" on merge).
- If it changes a public type or interface, update `docs/ARCHITECTURE.md`.
