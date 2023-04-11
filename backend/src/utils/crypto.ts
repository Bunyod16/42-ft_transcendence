import { AES, enc } from 'crypto-js';

export function encryptTOTP(rawPassword: string, secretKey: string) {
  return AES.encrypt(rawPassword, secretKey).toString();
}

export function decryptTOTP(rawPassword: string, secretKey: string) {
  return AES.decrypt(rawPassword, secretKey).toString(enc.Utf8);
}
