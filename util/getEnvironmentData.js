'use strict';

/**
 * Retrieves the value of an environment variable.
 *
 * This function accesses the `process.env` object to fetch the value
 * of the specified environment variable. If the variable is not found,
 * it returns `null`.
 *
 * @param {string} variable - The name of the environment variable to retrieve.
 * @returns {string | null} The value of the environment variable, or `null` if it does not exist.
 */
const getEnvironmentData = (variable) => process.env[variable] || null;

export default getEnvironmentData;
