'use strict';

import crypto from 'crypto';

import createHashedPassword from '@/util/createHashedPassword';

/**
 * Asynchronously generates a verification token.
 *
 * This function creates a random 20-byte hexadecimal token and hashes it using
 * a secure password hashing function. It returns an object containing both the
 * hashed token (`verifyToken`) and the original token (`token`).
 *
 * @function
 * @async
 * @returns {Promise<{verifyToken: string, token: string}>}
 *   A promise that resolves to an object containing:
 *   - `verifyToken`: The securely hashed version of the token.
 *   - `token`: The original random token (in hexadecimal format).
 * @throws Will throw an error if the token hashing process fails.
 */
const generateVerificationToken = async () => {
    const token = crypto.randomBytes(20).toString('hex');
    const verifyToken = await createHashedPassword(token);

    return {
        verifyToken,
        token,
    };
};

export default generateVerificationToken;
