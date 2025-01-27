'use strict';

import CryptoJS from 'crypto-js';

import { CryptoError } from '@/lib/customError';

/**
 * A constant variable that holds the secret key used for cryptographic operations.
 * The value is retrieved from the environment variable `NEXT_PUBLIC_CRYPTO_SECRET_KEY`.
 * This variable is critical for secure operations and should be kept confidential.
 * Ensure the environment variable is properly set in the deployment environment.
 */
const SECRET_KEY = process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY;

/**
 * Encrypts the provided data using AES encryption.
 *
 * @param {string} data - The data to be encrypted.
 * @return {string} The encrypted data as a string.
 * @throws {Error} If the encryption secret key is missing.
 */
export function encryptData(data) {
    if (!SECRET_KEY) {
        throw new Error('Encryption secret key is missing.');
    }
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
}

/**
 * Decrypts the given encrypted data using AES encryption.
 *
 * @param {string} data - The encrypted data string that needs to be decrypted.
 * @return {string} The decrypted data in plain text format.
 * @throws {Error} If the decryption secret key is missing.
 * @throws {CryptoError} If the encrypted data is invalid or decryption fails.
 */
export function decryptData(data) {
    if (!SECRET_KEY) {
        throw new Error('Decryption secret key is missing.');
    }

    try {
        const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedData) {
            throw new CryptoError('Bad encrypted data.');
        }

        return decryptedData;
    } catch (error) {
        console.error(error);

        throw new CryptoError('Bad encrypted data.');
    }
}
