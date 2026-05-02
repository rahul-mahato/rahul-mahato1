import { useCallback, useState } from 'react';
import { askPastSelf } from '@ai/rag';
import type { RagContext } from '@ai/prompts';

interface AskResult {
  answer: string;
  contexts: RagContext[];
}

export function useAskPastSelf() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AskResult | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const ask = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const r = await askPastSelf(query);
      setResult(r);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { ask, loading, result, error };
}
