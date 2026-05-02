import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

/**
 * Hardware-backed key storage. The Data Encryption Key (DEK) lives in the
 * iOS Keychain / Android Keystore. It NEVER touches AsyncStorage, the JS
 * bundle, or anything that can be backed up to a cloud provider.
 *
 * Lifecycle:
 *   - First launch: generate a 256-bit DEK, store under DEK_KEY.
 *   - Subsequent: read it once, hold in-memory for the process lifetime.
 *   - User wipe: delete the DEK; all ciphertext on disk becomes unreadable.
 */

const DEK_KEY = 'memoryos.dek.v1';

let cachedDek: Uint8Array | null = null;

export async function getDek(): Promise<Uint8Array> {
  if (cachedDek) return cachedDek;

  const existing = await SecureStore.getItemAsync(DEK_KEY);
  if (existing) {
    cachedDek = base64ToBytes(existing);
    return cachedDek;
  }

  const fresh = await Crypto.getRandomBytesAsync(32);
  await SecureStore.setItemAsync(DEK_KEY, bytesToBase64(fresh), {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
  cachedDek = fresh;
  return cachedDek;
}

export async function wipe(): Promise<void> {
  await SecureStore.deleteItemAsync(DEK_KEY);
  cachedDek = null;
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
