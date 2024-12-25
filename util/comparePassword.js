import bcrypt from 'bcrypt';

/**
 * Asynchronously compares a plaintext password with a hashed password to determine if they match.
 *
 * @param {string} password - The plaintext password to be compared.
 * @param {string} hash - The hashed password to compare against.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the password matches the hash.
 */
const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

export default comparePassword;
