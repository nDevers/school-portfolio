'use strict';

import { v4 as uuidv4 } from 'uuid';
import SHA256 from 'crypto-js/sha256';

/**
 * Generates a 6-digit numeric string using a UUID.
 *
 * The function generates a new UUID, creates a SHA-256 hash from it, and extracts the first 6 hexadecimal characters.
 * These characters are then parsed into an integer, converted to a string, and formatted to ensure it is 6 digits long.
 *
 * @returns {string} A 6-digit numeric string derived from a UUID.
 */
const generate6DigitFromUUID = () => {
    const uuid = uuidv4();
    const hash = SHA256(uuid).toString();

    return parseInt(hash.slice(0, 6), 16)
        .toString()
        .padStart(6, '0')
        .slice(0, 6);
};

export default generate6DigitFromUUID;
