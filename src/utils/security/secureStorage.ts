
/**
 * Secure Storage
 * 
 * Encrypted storage utilities for sensitive data
 * Following CodeFarm Development Methodology:
 * - Security-First Approach: Encryption for sensitive data
 * - User-Centric Design: Transparent security layer
 */

import { StorageEncryptionConfig, SecurityLevel } from './types';

// Default encryption configuration
const defaultEncryptionConfig: StorageEncryptionConfig = {
  algorithm: 'AES-GCM',
  secretKey: 'default-secret-key-change-in-production',
  ivLength: 12
};

// Current configuration
let encryptionConfig: StorageEncryptionConfig = { ...defaultEncryptionConfig };

/**
 * Configure secure storage
 * @param config Encryption configuration
 */
export function configureSecureStorage(config: Partial<StorageEncryptionConfig>): void {
  encryptionConfig = { ...defaultEncryptionConfig, ...config };
}

/**
 * Generate a random initialization vector (IV)
 * @returns Uint8Array containing the IV
 */
function generateIV(): Uint8Array {
  return window.crypto.getRandomValues(new Uint8Array(encryptionConfig.ivLength));
}

/**
 * Convert a string to an ArrayBuffer
 * @param str String to convert
 * @returns ArrayBuffer representation
 */
function str2ab(str: string): ArrayBuffer {
  const encoder = new TextEncoder();
  return encoder.encode(str).buffer;
}

/**
 * Convert an ArrayBuffer to a string
 * @param buffer ArrayBuffer to convert
 * @returns String representation
 */
function ab2str(buffer: ArrayBuffer): string {
  const decoder = new TextDecoder();
  return decoder.decode(new Uint8Array(buffer));
}

/**
 * Convert an ArrayBuffer to a Base64 string
 * @param buffer ArrayBuffer to convert
 * @returns Base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Convert a Base64 string to an ArrayBuffer
 * @param base64 Base64 string to convert
 * @returns ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Generate a cryptographic key from the secret
 * @returns Promise resolving to CryptoKey
 */
async function generateKey(): Promise<CryptoKey> {
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    str2ab(encryptionConfig.secretKey),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: str2ab('secure-storage-salt'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: encryptionConfig.algorithm, length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt data before storing
 * @param data Data to encrypt
 * @returns Promise resolving to encrypted string
 */
async function encrypt(data: string): Promise<string> {
  try {
    const key = await generateKey();
    const iv = generateIV();
    
    // Encrypt the data
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: encryptionConfig.algorithm,
        iv
      },
      key,
      str2ab(data)
    );
    
    // Combine IV and encrypted data
    const ivAndData = new Uint8Array(iv.byteLength + encryptedData.byteLength);
    ivAndData.set(iv, 0);
    ivAndData.set(new Uint8Array(encryptedData), iv.byteLength);
    
    // Convert to Base64 for storage
    return arrayBufferToBase64(ivAndData.buffer);
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt stored data
 * @param encryptedData Encrypted data string
 * @returns Promise resolving to decrypted string
 */
async function decrypt(encryptedData: string): Promise<string> {
  try {
    const key = await generateKey();
    
    // Convert from Base64
    const encryptedBuffer = base64ToArrayBuffer(encryptedData);
    
    // Extract IV and encrypted data
    const iv = new Uint8Array(encryptedBuffer, 0, encryptionConfig.ivLength);
    const data = new Uint8Array(
      encryptedBuffer, 
      encryptionConfig.ivLength, 
      encryptedBuffer.byteLength - encryptionConfig.ivLength
    );
    
    // Decrypt the data
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: encryptionConfig.algorithm,
        iv
      },
      key,
      data
    );
    
    return ab2str(decryptedBuffer);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Store data securely in localStorage
 * @param key Storage key
 * @param value Value to store
 * @param level Security level
 * @returns Promise resolving when data is stored
 */
export async function secureLocalStorage(
  key: string, 
  value: string,
  level: SecurityLevel = SecurityLevel.MEDIUM
): Promise<void> {
  if (!key || value === undefined) {
    throw new Error('Key and value are required');
  }
  
  try {
    // Apply different security levels
    if (level === SecurityLevel.LOW) {
      // Basic storage without encryption
      localStorage.setItem(key, value);
      return;
    }
    
    // Encrypt the data for higher security levels
    const encryptedData = await encrypt(value);
    localStorage.setItem(key, encryptedData);
  } catch (error) {
    console.error('Secure storage failed:', error);
    throw new Error('Failed to store data securely');
  }
}

/**
 * Retrieve securely stored data from localStorage
 * @param key Storage key
 * @param level Security level
 * @returns Promise resolving to retrieved data
 */
export async function getFromSecureLocalStorage(
  key: string,
  level: SecurityLevel = SecurityLevel.MEDIUM
): Promise<string | null> {
  if (!key) {
    throw new Error('Key is required');
  }
  
  try {
    const data = localStorage.getItem(key);
    
    if (!data) {
      return null;
    }
    
    // Return directly for low security level
    if (level === SecurityLevel.LOW) {
      return data;
    }
    
    // Decrypt data for higher security levels
    return await decrypt(data);
  } catch (error) {
    console.error('Secure retrieval failed:', error);
    throw new Error('Failed to retrieve data securely');
  }
}

/**
 * Remove securely stored data from localStorage
 * @param key Storage key
 */
export function removeFromSecureLocalStorage(key: string): void {
  if (!key) {
    throw new Error('Key is required');
  }
  
  localStorage.removeItem(key);
}

/**
 * Store data securely in sessionStorage
 * @param key Storage key
 * @param value Value to store
 * @param level Security level
 * @returns Promise resolving when data is stored
 */
export async function secureSessionStorage(
  key: string, 
  value: string,
  level: SecurityLevel = SecurityLevel.MEDIUM
): Promise<void> {
  if (!key || value === undefined) {
    throw new Error('Key and value are required');
  }
  
  try {
    // Apply different security levels
    if (level === SecurityLevel.LOW) {
      // Basic storage without encryption
      sessionStorage.setItem(key, value);
      return;
    }
    
    // Encrypt the data for higher security levels
    const encryptedData = await encrypt(value);
    sessionStorage.setItem(key, encryptedData);
  } catch (error) {
    console.error('Secure session storage failed:', error);
    throw new Error('Failed to store data securely in session');
  }
}

/**
 * Retrieve securely stored data from sessionStorage
 * @param key Storage key
 * @param level Security level
 * @returns Promise resolving to retrieved data
 */
export async function getFromSecureSessionStorage(
  key: string,
  level: SecurityLevel = SecurityLevel.MEDIUM
): Promise<string | null> {
  if (!key) {
    throw new Error('Key is required');
  }
  
  try {
    const data = sessionStorage.getItem(key);
    
    if (!data) {
      return null;
    }
    
    // Return directly for low security level
    if (level === SecurityLevel.LOW) {
      return data;
    }
    
    // Decrypt data for higher security levels
    return await decrypt(data);
  } catch (error) {
    console.error('Secure session retrieval failed:', error);
    throw new Error('Failed to retrieve data securely from session');
  }
}

/**
 * Remove securely stored data from sessionStorage
 * @param key Storage key
 */
export function removeFromSecureSessionStorage(key: string): void {
  if (!key) {
    throw new Error('Key is required');
  }
  
  sessionStorage.removeItem(key);
}
