import SHA256 from 'crypto-js/sha256';

/**
 * Asynchronously generates a hashed token using the SHA-256 algorithm.
 *
 * This function takes a token as input, applies the SHA-256 hashing
 * algorithm to it, and returns the resulting hash in hexadecimal format.
 * It relies on the 'crypto' module for hash generation.
 *
 * @param {string} token - The input token to be hashed.
 * @returns {Promise<string>} A promise that resolves to the hashed token in hexadecimal format.
 */
const generateHashedToken = async (token) => {
    return SHA256(token).toString();
};

export default generateHashedToken;
