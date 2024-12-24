/**
 * Asynchronously checks if an entry exists in a given model that matches the specified criteria.
 *
 * @param {Object} model - The database model to query against.
 * @param {Object} matcher - An object representing the query criteria used to find a matching entry.
 * @returns {Promise<boolean>} A promise that resolves to `true` if a matching entry exists, or `false` otherwise.
 */
const checkExistingEntry = async (model, matcher) => {
    return model.exists(matcher);
};

export default checkExistingEntry;
