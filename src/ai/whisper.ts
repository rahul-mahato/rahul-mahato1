import { MODELS } from './models';

/**
 * On-device speech → text. STUB: real impl wraps whisper.cpp via JSI or
 * `@xenova/transformers` ASR pipeline.
 *
 * Audio buffers must NEVER cross to the server. They live in memory just long
 * enough to transcribe, then are dropped. The transcript path goes through
 * `memoryService.create({ kind: 'voice' })` like any other entry.
 */
export interface TranscribeInput {
  audio: Float32Array; // 16kHz mono
  language?: string;
}

export async function transcribe(input: TranscribeInput): Promise<string> {
  void MODELS['whisper-tiny'];
  // STUB: wire whisper.cpp or transformers.js ASR pipeline here.
  if (input.audio.length === 0) return '';
  return '[stub-whisper] transcript';
}
