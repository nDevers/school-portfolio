'use strict';

import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a unique identifier by combining a specified prefix with a random suffix.
 *
 * The random suffix is obtained by extracting the first 6 characters
 * from a randomly generated UUID. If no prefix is provided, a default
 * value of "undefined" is used.
 *
 * @param {string} [prefix="undefined"] - The prefix to be prepended to the generated unique ID.
 * @returns {string} A unique identifier in the format of `prefix-randomSuffix`.
 */
const generateUniqueID = (prefix = 'undefined') => {
    // Extract the first 6 characters from the random UUID as the suffix
    const randomSuffix = uuidv4().substring(0, 6);

    // Combine the prefix and random suffix to create the unique ID
    return `${prefix}-${randomSuffix}`;
};

export default generateUniqueID;
