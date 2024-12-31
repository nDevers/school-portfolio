'use strict';

import { z } from 'zod';

import schemaShared from '@/shared/schema.shared';
import faqConstants from '@/app/api/v1/faq/faq.constants';

const { nonEmptyString, validMongooseId, validDate } = schemaShared;
const { questionMaxCharacter } = faqConstants;

/**
 * Holds the FAQ question text with a maximum character limit.
 * The value must be a non-empty string and is validated against the specified maximum character limit.
 *
 * @type {string}
 * @param {string} label - The label or description for the input field.
 * @param {number} maxCharacter - The maximum allowed character length for the string.
 */
const question = nonEmptyString('Faq question', questionMaxCharacter);

/**
 * Represents the answer to a FAQ (Frequently Asked Question).
 *
 * This variable holds a non-empty string value of the FAQ answer.
 * The value must not be null, undefined, or an empty string.
 * It ensures that the answer content is always present and valid.
 */
const answer = nonEmptyString('Faq answer');

/**
 * Validates if the provided Status ID is a valid Mongoose ObjectId.
 * This function is used to ensure that IDs conform to the expected format
 * used by MongoDB and Mongoose for document identification.
 *
 * @param {string} id - The Status ID to validate.
 * @returns {boolean} - Returns true if the ID is a valid Mongoose ObjectId, otherwise false.
 */
const id = validMongooseId('Status ID');

/**
 * A schema definition for validating an object with strict mode applied.
 * The schema expects the object to have the following properties:
 * - `question`: Represents a specific required property that needs to be provided for validation.
 * - `answer`: Represents another required property for validation.
 *
 * Utilizes the `z.object` method from the `zod` library to define and enforce the structure of the object.
 * The `.strict()` modifier ensures that no extra or unspecified properties are allowed in the object during validation.
 */
const createSchema = z
    .object({
        question,
        answer,
    })
    .strict(); // Enforce strict mode to disallow extra fields

/**
 * getDataByQuery is a schema definition using Zod for validating query objects.
 * It ensures that the query object adheres to the specified structure and data types.
 *
 * Properties:
 * - id: An optional field representing the identifier.
 * - question: An optional field representing the question text.
 * - answer: An optional field representing the answer text.
 * - createdAt: An optional field representing the creation date. It validates the value as a valid date string with the label "Creation time".
 * - updatedAt: An optional field representing the last update date. It validates the value as a valid date string with the label "last update time".
 *
 * The schema is strict, disallowing additional fields not specified in the definition.
 */
const getDataByQuery = z
    .object({
        id: id.optional(),
        question: question.optional(),
        answer: answer.optional(),
        createdAt: validDate('Creation time').optional(),
        updatedAt: validDate('last update time').optional(),
    })
    .strict(); // Enforce strict mode to disallow extra fields

/**
 * A schema definition for validating and ensuring the integrity of an object used
 * to update a specific entity. The `updateSchema` schema enforces the following rules:
 *
 * - The object must contain an `id` field.
 * - The object can optionally include the `question` and/or `answer` fields.
 * - Any other fields outside the defined schema are disallowed due to strict mode.
 * - The object must include at least both the `id` field and one other field (`question` or `answer`).
 *
 * Validation Errors:
 * - If the object does not contain the required fields (`id` and at least one of `question` or `answer`),
 *   then it throws an error with the message:
 *   'At least one of "question" or "answer" is required along with "id".'
 */
const updateSchema = z
    .object({
        id,
        question: question.optional(),
        answer: answer.optional(),
    })
    .strict() // Enforce strict mode to disallow extra fields
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message:
                'At least one of "question" or "answer" is required along with "id".',
        }
    );

/**
 * faqSchema
 *
 * An object that encapsulates methods related to the FAQ schema operations.
 * This variable includes functionalities to create, retrieve, and update the schema.
 *
 * Properties:
 * - createSchema: A method to create a new FAQ schema.
 * - getDataByQuery: A method to retrieve FAQ data based on specific queries.
 * - updateSchema: A method to update an existing FAQ schema.
 */
const faqSchema = {
    createSchema,
    getDataByQuery,
    updateSchema,
};

export default faqSchema;
