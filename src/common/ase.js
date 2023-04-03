import CryptoJS from 'crypto-js'

// 密钥
const key = CryptoJS.enc.Utf8.parse('47FC4124CF94E090')
// 密钥偏移量
const iv = CryptoJS.enc.Utf8.parse('ovOh2xYoRdfATob9')

// 加密方法
export function AesEncode (word) {
    const srcs = CryptoJS.enc.Utf8.parse(word)
    const encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
    const encryptedBase64Data = CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
    return encodeURIComponent(encryptedBase64Data)
}

// 解密方法
export function AesDecode (word) {
    const nextWord = decodeURIComponent(word)
    const encryptedHexStr = CryptoJS.enc.Base64.parse(nextWord)
    const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
    const decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
    const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
    return decryptedStr.toString()
}
