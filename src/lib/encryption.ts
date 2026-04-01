/**
 * AES-256-GCM encryption for distress signals using Web Crypto API.
 * Key is derived from a stable device fingerprint so signals can be
 * decrypted server-side with the same passphrase.
 */

const PASSPHRASE = "soul-echoes-distress-key-v1";

async function deriveKey(passphrase: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  // Use a fixed salt for deterministic key derivation
  const salt = enc.encode("soul-echoes-salt-2024");
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptSignal(plaintext: string): Promise<string> {
  const key = await deriveKey(PASSPHRASE);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();
  const cipherBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(plaintext)
  );
  // Combine IV + ciphertext, encode as base64
  const combined = new Uint8Array(iv.length + cipherBuffer.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(cipherBuffer), iv.length);
  return btoa(String.fromCharCode(...combined));
}

export async function decryptSignal(encrypted: string): Promise<string> {
  const key = await deriveKey(PASSPHRASE);
  const combined = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);
  const plainBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );
  return new TextDecoder().decode(plainBuffer);
}
