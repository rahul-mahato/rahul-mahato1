import { MODELS } from './models';

/**
 * Local LLM inference (Phi-3.5-mini / Gemma-2B via ONNX).
 *
 * STUB: real implementation lazy-loads through onnxruntime-web. The contract
 * here is what callers (rag.ts, synthesis.ts) depend on; do not break it.
 */

export interface GenerateOptions {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  stop?: string[];
}

export interface GenerateChunk {
  delta: string;
  done: boolean;
}

let model: { stream: (o: GenerateOptions) => AsyncGenerator<GenerateChunk> } | null = null;

async function load() {
  if (model) return model;
  // STUB: replace with onnxruntime-web pipeline using MODELS['phi-3.5-mini'].
  model = {
    stream: async function* (o: GenerateOptions): AsyncGenerator<GenerateChunk> {
      const text = `[stub-llm] received ${o.prompt.length} chars of prompt`;
      yield { delta: text, done: false };
      yield { delta: '', done: true };
    },
  };
  return model;
}

export async function generate(options: GenerateOptions): Promise<string> {
  const out: string[] = [];
  for await (const chunk of streamGenerate(options)) {
    if (chunk.delta) out.push(chunk.delta);
  }
  return out.join('');
}

export async function* streamGenerate(options: GenerateOptions): AsyncGenerator<GenerateChunk> {
  const m = await load();
  yield* m.stream(options);
}
