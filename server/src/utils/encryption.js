import crypto from 'crypto';
import dotenv from 'dotenv';

// Obtener configuración de variables de entorno
dotenv.config();
const encryptionKey = process.env.ENCRYPTION_KEY;
const encryptionIV = process.env.ENCRYPTION_IV;

if (!encryptionKey || encryptionKey.length !== 32) {
  throw new Error('ENCRYPTION_KEY debe tener 32 caracteres');
}

if (!encryptionIV || encryptionIV.length !== 16) {
  throw new Error('ENCRYPTION_IV debe tener 16 caracteres');
}

// Algoritmo y configuración
const algorithm = 'aes-256-cbc';
const key = Buffer.from(encryptionKey);
const iv = Buffer.from(encryptionIV);

/**
 * Encripta un texto con AES-256-CBC
 * @param {string} text - Texto a encriptar
 * @returns {string} - Texto encriptado en formato hexadecimal
 */
export const encrypt = (text) => {
  if (!text) return null;
  
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

/**
 * Desencripta un texto encriptado con AES-256-CBC
 * @param {string} encryptedText - Texto encriptado en formato hexadecimal
 * @returns {string} - Texto original desencriptado
 */
export const decrypt = (encryptedText) => {
  if (!encryptedText) return null;
  
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};