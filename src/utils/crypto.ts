/**
 * Client-side encryption for API keys using Web Crypto API.
 *
 * - AES-GCM encryption with a non-extractable key stored in IndexedDB
 * - Keys persisted through bridge-backed app storage are ciphertext, not plaintext
 * - Protects against physical device access / app-storage inspection
 * - Does NOT protect against same-origin JS (but we have no third-party scripts)
 */

const DB_NAME = 'even-kitchen-crypto'
const STORE_NAME = 'keys'
const CRYPTO_KEY_ID = 'master'

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function getOrCreateMasterKey(): Promise<CryptoKey> {
  const db = await openDB()

  // Try to load existing key
  const existing = await new Promise<CryptoKey | undefined>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const req = tx.objectStore(STORE_NAME).get(CRYPTO_KEY_ID)
    req.onsuccess = () => resolve(req.result as CryptoKey | undefined)
    req.onerror = () => reject(req.error)
  })

  if (existing) {
    db.close()
    return existing
  }

  // Generate new non-extractable AES-GCM key
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    false, // non-extractable — can't be exported from IndexedDB
    ['encrypt', 'decrypt'],
  )

  // Store in IndexedDB
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const req = tx.objectStore(STORE_NAME).put(key, CRYPTO_KEY_ID)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })

  db.close()
  return key
}

/**
 * Encrypt a plaintext string. Returns a base64 string (iv + ciphertext).
 */
export async function encryptValue(plaintext: string): Promise<string> {
  if (!plaintext) return ''
  try {
    const key = await getOrCreateMasterKey()
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const encoded = new TextEncoder().encode(plaintext)
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded,
    )
    // Combine iv + ciphertext into a single array, then base64
    const combined = new Uint8Array(iv.length + ciphertext.byteLength)
    combined.set(iv, 0)
    combined.set(new Uint8Array(ciphertext), iv.length)
    return btoa(String.fromCharCode(...combined))
  } catch {
    // Fallback: return plaintext if crypto unavailable (e.g. HTTP, not HTTPS)
    return plaintext
  }
}

/**
 * Decrypt a base64 string (iv + ciphertext) back to plaintext.
 */
export async function decryptValue(encrypted: string): Promise<string> {
  if (!encrypted) return ''
  try {
    const key = await getOrCreateMasterKey()
    const combined = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0))
    const iv = combined.slice(0, 12)
    const ciphertext = combined.slice(12)
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext,
    )
    return new TextDecoder().decode(decrypted)
  } catch {
    // If decryption fails, the value might be plaintext (migration from old format)
    return encrypted
  }
}

/**
 * Check if a string looks like it's encrypted (base64 with sufficient length for iv+ciphertext).
 */
export function isEncrypted(value: string): boolean {
  if (!value || value.length < 20) return false
  try {
    atob(value)
    return true
  } catch {
    return false
  }
}
