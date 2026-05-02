/**
 * Registry of on-device models. Sizes/dim must stay in sync with reality —
 * if a model swap changes embedding dim, see `.claude/skills/update-schema`.
 */

export interface ModelSpec {
  id: string;
  kind: 'embed' | 'llm' | 'asr';
  dim?: number;
  approxSizeMB: number;
  license: string;
}

export const MODELS: Record<string, ModelSpec> = {
  'all-MiniLM-L6-v2': {
    id: 'Xenova/all-MiniLM-L6-v2',
    kind: 'embed',
    dim: 384,
    approxSizeMB: 22,
    license: 'Apache-2.0',
  },
  'phi-3.5-mini': {
    id: 'Xenova/Phi-3.5-mini-instruct-onnx',
    kind: 'llm',
    approxSizeMB: 2200,
    license: 'MIT',
  },
  'gemma-2b': {
    id: 'Xenova/gemma-2b-it',
    kind: 'llm',
    approxSizeMB: 1800,
    license: 'Gemma Terms of Use',
  },
  'whisper-tiny': {
    id: 'Xenova/whisper-tiny',
    kind: 'asr',
    approxSizeMB: 75,
    license: 'MIT',
  },
};

export const EMBEDDING_VERSION = 1;
export const PROMPT_VERSION = 1;
