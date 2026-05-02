import { MODELS } from './models';

/**
 * Text → 384-dim embedding. Pure function over a lazily-loaded model.
 *
 * STUB: real implementation uses `@xenova/transformers` to run
 * `all-MiniLM-L6-v2` in WASM/onnxruntime-web. Wiring lives in the embedder PR.
 */

let model: { embed: (s: string) => Promise<number[]> } | null = null;

async function load() {
  if (model) return model;
  // STUB: replace with `pipeline('feature-extraction', MODELS['all-MiniLM-L6-v2'].id)`
  model = {
    embed: async (s: string) => {
      // Deterministic-but-fake embedding — keeps tests/types honest until
      // the real WASM pipeline is wired.
      const dim = MODELS['all-MiniLM-L6-v2']!.dim!;
      const out = new Array(dim).fill(0);
      for (let i = 0; i < s.length; i++) out[i % dim] += s.charCodeAt(i);
      const norm = Math.sqrt(out.reduce((a, b) => a + b * b, 0)) || 1;
      return out.map((v) => v / norm);
    },
  };
  return model;
}

export async function embed(text: string): Promise<number[]> {
  const m = await load();
  return m.embed(text);
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  const m = await load();
  return Promise.all(texts.map((t) => m.embed(t)));
}
