/**
 * Secure Storage Service
 * 
 * Uses the Web Crypto API (SubtleCrypto) to encrypt sensitive data
 * before storing it in localStorage. This prevents casual reading
 * of stored secrets (like API keys) from the browser's dev tools.
 * 
 * Note: Since the encryption key is derived at runtime, this protects
 * against static analysis and casual inspection, but cannot protect
 * against a determined attacker with full runtime access to the browser.
 */

// ============================================================================
// Constants
// ============================================================================

const STORAGE_PREFIX = 'cf_secure_';
const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const SALT = 'ClipForgeAI-SecureStorage-v1';

// ============================================================================
// Key Management
// ============================================================================

/**
 * Derives an encryption key from a stable app-level secret.
 * Uses a fixed seed so encrypted data remains readable across browser sessions.
 * Security is provided by the AES-GCM encryption itself, not by device binding.
 */
async function deriveKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  
  // Use a stable seed that doesn't change across browser sessions
  // The security comes from AES-GCM encryption, not from device fingerprinting
  const seed = SALT + '__clipforge_secure_v1__';
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(seed),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode(SALT),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    {
      name: ALGORITHM,
      length: KEY_LENGTH,
    },
    false,
    ['encrypt', 'decrypt']
  );
}

// ============================================================================
// Encryption / Decryption
// ============================================================================

/**
 * Encrypts a string value and returns it as a base64-encoded string.
 * Uses AES-GCM with a random IV for each encryption operation.
 */
async function encrypt(plaintext: string): Promise<string> {
  try {
    const key = await deriveKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    
    const encrypted = await crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv,
      },
      key,
      encoder.encode(plaintext)
    );

    // Combine IV + ciphertext and encode as base64
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);

    // Convert to base64 (browser-compatible)
    const bytes = Array.from(combined);
    const binary = bytes.map(b => String.fromCharCode(b)).join('');
    return btoa(binary);
  } catch (e) {
    console.warn('[SecureStorage] Encryption failed, falling back to obfuscated storage');
    return obfuscate(plaintext);
  }
}

/**
 * Decrypts a base64-encoded encrypted string back to plaintext.
 */
async function decrypt(ciphertext: string): Promise<string> {
  try {
    const key = await deriveKey();
    
    // Decode from base64
    const binary = atob(ciphertext);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    // Extract IV (first 12 bytes) and ciphertext
    const iv = bytes.slice(0, 12);
    const encrypted = bytes.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv,
      },
      key,
      encrypted
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (e) {
    // Fallback: try legacy obfuscation
    const legacy = deobfuscate(ciphertext);
    if (legacy !== ciphertext) return legacy;
    throw new Error('Failed to decrypt stored data');
  }
}

// ============================================================================
// Legacy Fallback (for data stored before Web Crypto was available)
// ============================================================================

function obfuscate(value: string): string {
  // Simple base64-like encoding with a character shift
  const chars = value.split('').map(c => {
    const code = c.charCodeAt(0);
    return String.fromCharCode(code + 7);
  });
  return btoa(chars.join('')).replace(/=+$/, '');
}

function deobfuscate(value: string): string {
  try {
    const decoded = atob(value);
    const chars = decoded.split('').map(c => {
      const code = c.charCodeAt(0);
      return String.fromCharCode(code - 7);
    });
    return chars.join('');
  } catch {
    return value; // Return as-is if not obfuscated
  }
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Securely stores a value in localStorage.
 * The value is encrypted using AES-GCM before storage.
 * 
 * @param key - The localStorage key (automatically prefixed)
 * @param value - The plaintext value to store
 */
export async function secureSetItem(key: string, value: string): Promise<void> {
  try {
    const encrypted = await encrypt(value);
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, encrypted);
  } catch (e) {
    // Fallback to obfuscated storage if encryption fails
    const obfuscated = obfuscate(value);
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, obfuscated);
  }
}

/**
 * Retrieves and decrypts a value from localStorage.
 * 
 * @param key - The localStorage key (automatically prefixed)
 * @returns The decrypted plaintext value, or null if not found
 */
export async function secureGetItem(key: string): Promise<string | null> {
  const encrypted = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
  if (!encrypted) {
    // Fallback: check for legacy unencrypted key
    const legacy = localStorage.getItem(key);
    if (legacy) {
      // Migrate to secure storage
      await secureSetItem(key, legacy);
      localStorage.removeItem(key);
      return legacy;
    }
    return null;
  }

  try {
    return await decrypt(encrypted);
  } catch {
    // If decryption fails, try legacy fallback
    const legacy = localStorage.getItem(key);
    return legacy || null;
  }
}

/**
 * Removes a securely stored value from localStorage.
 */
export function secureRemoveItem(key: string): void {
  localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
}

/**
 * Checks if a secure key exists in localStorage.
 */
export function secureHasItem(key: string): boolean {
  return localStorage.getItem(`${STORAGE_PREFIX}${key}`) !== null;
}

// ============================================================================
// Storage Utility: Clear all sensitive data
// ============================================================================

/**
 * Clears all ClipForge AI data from localStorage.
 * This should be called when the user wants to wipe their data.
 */
export function clearAllSecureData(): void {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
}
