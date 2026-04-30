---
name: add-ai-pipeline
description: Use when adding or modifying an on-device AI capability — a new model, a new RAG variant, a new ASR/OCR pipeline, or changing prompt structure. Don't use for plain text features (use add-memory-feature) or for cloud APIs (we don't have any).
---

# Adding an on-device AI pipeline

All AI here runs on the device. There is no fallback to a hosted API. If the
device can't run it, the feature degrades — it doesn't phone home.

## Pick the right primitive

| Capability        | Module                  | Notes                                  |
|-------------------|-------------------------|----------------------------------------|
| Embeddings        | `src/ai/embedder.ts`    | 384-d, MiniLM-L6-v2 by default         |
| Generative LLM    | `src/ai/inference.ts`   | Phi-3.5-mini / Gemma-2B via ONNX       |
| Speech → text     | `src/ai/whisper.ts`     | Whisper-tiny on-device                 |
| OCR               | `src/ai/ocr.ts` (TBD)   | Vision model TBD; treat as Phase 2     |
| RAG orchestration | `src/ai/rag.ts`         | Pure: query → contexts → prompt → text |

## Pipeline contract

A pipeline is a **pure function** plus a **lazy model loader**:

```ts
// src/ai/<thing>.ts
let model: Model | null = null;

async function load(): Promise<Model> {
  if (!model) model = await loadModel(MODEL_ID);
  return model;
}

export async function run(input: Input): Promise<Output> {
  const m = await load();
  return m.infer(input);
}
```

Rules:
- **No I/O outside the loader.** No filesystem or network from `run()`.
- **Models are cached forever** for the process lifetime. Don't reload.
- **First-call latency is acceptable**, subsequent must be <p95 budget.

## Performance budgets

| Pipeline         | p50    | p95   | First-load |
|------------------|--------|-------|------------|
| Embed (1 doc)    | 30ms   | 80ms  | <2s        |
| LLM (256 tokens) | 1.5s   | 2.5s  | <8s        |
| Whisper (10s)    | 1.5s   | 3.0s  | <5s        |
| RAG end-to-end   | —      | <3s   | —          |

If your change moves a number outside the budget, file an issue or revert.

## Prompts

Prompts live in `src/ai/prompts.ts`. They're typed templates, not magic strings:

```ts
export const synthesisPrompt = template(({ query, contexts }) => `
You are a memory assistant. Use the user's past entries to answer.
Past entries:
${contexts.map((c, i) => `[${i + 1}] ${c.text}`).join('\n')}

Question: ${query}
`);
```

When you change a prompt:
- [ ] Bump `PROMPT_VERSION` for that pipeline (cache busting).
- [ ] Update the snapshot tests in `tests/ai/prompts.test.ts`.

## Adding a new model

1. Add the model id under `EXPO_PUBLIC_*_MODEL` in `.env.example`.
2. Add an entry in `src/ai/models.ts` with size, dim, and license.
3. Add a smoke test that runs the model on a fixed input on CI (mocked weights ok).
4. **Never commit weights** (`.onnx`, `.bin`) — they're gitignored.

## Anti-patterns

- ❌ Calling out to OpenAI/Anthropic/anything cloud.
- ❌ Reloading a model per call.
- ❌ Concatenating user text into prompts without a `template()`.
- ❌ Logging prompt+response (it contains user content).
