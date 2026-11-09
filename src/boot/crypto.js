import CryptoJS from 'crypto-js'

const SECRET_KEY = import.meta.env.VITE_PAYLOAD_SECRET_KEY || 'SINTASI_PAYLOAD_SECRET_KEY_32B!'

/**
 * Enkripsi teks menggunakan AES-256-CBC dengan format "iv_base64:ciphertext_base64"
 * sesuai kontrak DecryptPayloadMiddleware di backend
 */
export function encryptPayload(plainText) {
  if (!plainText) return ''

  // Key 32 byte diturunkan melalui SHA-256 dan IV acak 16 byte dibuat setiap enkripsi
  const key = CryptoJS.SHA256(SECRET_KEY)
  const iv = CryptoJS.lib.WordArray.random(16)

  const encrypted = CryptoJS.AES.encrypt(plainText, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })

  const ivBase64 = CryptoJS.enc.Base64.stringify(iv)
  const cipherBase64 = encrypted.toString()

  return `${ivBase64}:${cipherBase64}`
}
