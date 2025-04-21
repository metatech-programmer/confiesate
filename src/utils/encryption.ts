import crypto from 'crypto';
import dotenv from 'dotenv';

// Obtener configuración de variables de entorno
dotenv.config();

if (!process.env.ENCRYPTION_KEY || process.env.ENCRYPTION_KEY.length !== 32) {
  throw new Error('ENCRYPTION_KEY debe tener 32 caracteres');
}

if (!process.env.ENCRYPTION_IV || process.env.ENCRYPTION_IV.length !== 16) {
  throw new Error('ENCRYPTION_IV debe tener 16 caracteres');
}

// Algoritmo y configuración
const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPTION_KEY);
const iv = Buffer.from(process.env.ENCRYPTION_IV);

/**
 * Encripta un texto con AES-256-CBC
 * @param text - Texto a encriptar
 * @returns Texto encriptado en formato hexadecimal o null si el texto es vacío
 */
export const encrypt = (text: string): string | null => {
  if (!text) return null;
  
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

/**
 * Desencripta un texto encriptado con AES-256-CBC
 * @param encryptedText - Texto encriptado en formato hexadecimal
 * @returns Texto original desencriptado o null si el texto encriptado es vacío
 */
export const decrypt = (encryptedText: string): string | null => {
  if (!encryptedText) return null;
  
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};