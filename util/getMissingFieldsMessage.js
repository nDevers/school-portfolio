import { z } from 'zod';

/**
 * Generates a message indicating missing optional fields required by the given schema.
 *
 * This function checks the provided data object against a given schema,
 * identifying optional fields as defined by Zod. It then detects which of
 * these optional fields are missing in the data object and returns a message
 * describing the missing fields.
 *
 * Note: The message also requires the "id" field to be present in addition
 * to at least one of the identified optional fields.
 *
 * @param {Object} data - The input data object to validate against the schema.
 * @param {Object} schema - The schema definition which includes a shape of fields.
 * @returns {string} A message specifying which optional fields are missing
 *                   and the requirement of the "id" field.
 */
const getMissingFieldsMessage = (data, schema) => {
    const optionalFields = Object.keys(schema.shape).filter((field) => {
        const fieldDef = schema.shape[field];
        return fieldDef instanceof z.ZodOptional;
    });

    const missingFields = optionalFields.filter((field) => !data[field]);
    return `At least one of "${missingFields.join('" or "')}" is required along with "id".`;
};

export default getMissingFieldsMessage;
