import * as Crypto from 'expo-crypto';
import { getDek } from './keystore';

/**
 * AES-256-GCM envelope for memory text.
 *
 * Format on disk (Base64):
 *   ciphertext: base64( ciphertext_bytes )
 *   iv:         base64( 12 random bytes per encrypt )
 *
 * NEVER reuse an IV with the same key. Always generate a fresh 12-byte IV.
 *
 * NOTE: expo-crypto exposes hashing + RNG; symmetric AES-GCM in RN typically
 * comes from a native module (e.g., `react-native-quick-crypto` or a custom
 * JSI binding). The functions below are the *contract*; the native binding
 * is wired in `crypto/native.ts` (added in the AES-GCM PR).
 */

export interface Sealed {
  ciphertext: string;
  iv: string;
}

export async function seal(plaintext: string): Promise<Sealed> {
  const dek = await getDek();
  const iv = await Crypto.getRandomBytesAsync(12);
  const ct = await aesGcmEncrypt(dek, iv, new TextEncoder().encode(plaintext));
  return {
    ciphertext: bytesToBase64(ct),
    iv: bytesToBase64(iv),
  };
}

export async function open(sealed: Sealed): Promise<string> {
  const dek = await getDek();
  const iv = base64ToBytes(sealed.iv);
  const ct = base64ToBytes(sealed.ciphertext);
  const pt = await aesGcmDecrypt(dek, iv, ct);
  return new TextDecoder().decode(pt);
}

// STUB: native AES-GCM binding lands with the AES-GCM PR. Until then, throw
// loudly so nothing accidentally persists plaintext.
async function aesGcmEncrypt(_key: Uint8Array, _iv: Uint8Array, _pt: Uint8Array): Promise<Uint8Array> {
  throw new Error('aesGcmEncrypt: native AES-GCM binding not yet wired');
}

async function aesGcmDecrypt(_key: Uint8Array, _iv: Uint8Array, _ct: Uint8Array): Promise<Uint8Array> {
  throw new Error('aesGcmDecrypt: native AES-GCM binding not yet wired');
}

function bytesToBase64(b: Uint8Array): string {
  let s = '';
  for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]!);
  return globalThis.btoa(s);
}

function base64ToBytes(s: string): Uint8Array {
  const bin = globalThis.atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
