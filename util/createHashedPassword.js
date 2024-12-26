'use strict';

import bcrypt from 'bcrypt';

/**
 * Generates a hashed password using the bcrypt hashing algorithm.
 *
 * @async
 * @function createHashedPassword
 * @param {string} password - The plain text password to be hashed.
 * @returns {Promise<string>} A promise that resolves to the hashed password.
 */
const createHashedPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

export default createHashedPassword;
