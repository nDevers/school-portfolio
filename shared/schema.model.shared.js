// Define a function to return the schema definition for required string fields
/**
 * Function that generates a configuration object for a required string field.
 *
 * @function requiredString
 * @param {string} fieldName - The name of the field to be included in the error message.
 * @returns {Object} The configuration object for a required string field, which includes:
 * - type: Specifies the field type as String.
 * - required: An array where the first element indicates the field is required,
 *   and the second element is a custom error message.
 * - trim: Removes whitespace from both ends of the string when true.
 */
const requiredString = (fieldName) => ({
    type: String,
    required: [true, `${fieldName} is required`],
    trim: true,
});

/**
 * Represents a shared schema model.
 *
 * @typedef {Object} schemaModelShared
 * @property {string} requiredString - A required string property.
 */
const schemaModelShared = {
    requiredString,
};

export default schemaModelShared;
