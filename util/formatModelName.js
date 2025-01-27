'use strict';

import logger from '@/lib/logger';

/**
 * Formats a given model name by capitalizing the first letter and validating its content.
 *
 * This function ensures that the first letter of the provided name is capitalized and
 * checks if the formatted name contains only alphabetic characters. If the name includes
 * non-alphabetic characters, it logs a debug message and returns `false`.
 *
 * @param {string} name - The raw name of the model to be formatted and validated.
 * @returns {string|boolean} The formatted model name if valid, otherwise `false`.
 */
const formatModelName = (name) => {
    const modelName = name.charAt(0).toUpperCase() + name.slice(1);

    if (!modelName.match(/^[A-Za-z]+$/)) {
        logger.debug(
            `Invalid model name provided: ${modelName}. Only alphabetic characters without spaces or special characters are allowed.`
        );
        return false;
    }

    return modelName;
};

export default formatModelName;
