import { describe, it, expect } from 'vitest'
import { encryptPayload } from '../src/boot/crypto'
import CryptoJS from 'crypto-js'

describe('Pengujian utilitas enkripsi payload login', () => {
  it('should encrypt plain text and produce formatted iv:ciphertext string', () => {
    const plain = 'admin@sintasi.com'
    const encrypted = encryptPayload(plain)

    expect(encrypted).toBeDefined()
    expect(encrypted).toContain(':')

    const [ivBase64, cipherBase64] = encrypted.split(':')
    expect(ivBase64.length).toBeGreaterThan(10)
    expect(cipherBase64.length).toBeGreaterThan(10)
  })

  it('should be decryptable with the shared secret key', () => {
    const plain = 'password123'
    const encrypted = encryptPayload(plain)

    const [ivBase64, cipherBase64] = encrypted.split(':')
    const secretKey = 'SINTASI_PAYLOAD_SECRET_KEY_32B!'
    const key = CryptoJS.SHA256(secretKey)
    const iv = CryptoJS.enc.Base64.parse(ivBase64)

    const decrypted = CryptoJS.AES.decrypt(cipherBase64, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8)

    expect(decrypted).toBe(plain)
  })
})
