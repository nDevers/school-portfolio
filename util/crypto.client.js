import CryptoJS from 'crypto-js';

/**
 * SECRET_KEY is a constant that stores the cryptographic secret key
 * used for secure operations. It retrieves its value from the
 * environment variable `NEXT_PUBLIC_CRYPTO_SECRET_KEY`.
 *
 * This key is essential for encryption, decryption, or any process
 * requiring a consistent cryptographic secret. Ensure that the
 * environment variable is set and kept private to maintain security.
 *
 * @constant
 * @type {string}
 */
const SECRET_KEY = process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY;

/**
 * Encrypts the provided data using AES encryption with a predefined secret key.
 *
 * @param {string} data - The data to be encrypted.
 * @return {string} - The encrypted string.
 * @throws {Error} - Throws an error if the encryption secret key is missing.
 */
export function encryptData(data) {
    if (!SECRET_KEY) {
        throw new Error('Encryption secret key is missing.');
    }
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
}

/**
 * Decrypts the given encrypted data using a predefined secret key.
 *
 * @param {string} data - The encrypted data that needs to be decrypted.
 * @return {string} The decrypted string data. Throws an error if decryption fails or the secret key is missing.
 */
export function decryptData(data) {
    if (!SECRET_KEY) {
        throw new Error('Decryption secret key is missing.');
    }

    try {
        const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        throw new Error('Bad encrypted data.');
    }
}
