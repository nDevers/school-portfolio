'use strict';

import { z } from 'zod';

import schemaShared from '@/shared/schema.shared';
import academicConstants from '@/app/api/v1/academic/academic.constants';

const {
    nonEmptyString,
    enumValidation,
    validMongooseId,
    validDate,
    filesValidator,
} = schemaShared;
const {
    titleMaxCharacter,
    badgeMaxCharacter,
    allowedCategories,
    allowedMimeTypes,
    allowedFileSize,
} = academicConstants;

/**
 * Generates a non-empty string representing the title for the given field name,
 * ensuring it adheres to the maximum character limit defined by `titleMaxCharacter`.
 *
 * @param {string} fieldName - The name of the field for which the title is being generated.
 * @returns {string} A validated non-empty string representing the title.
 */
const title = (fieldName) =>
    nonEmptyString(`${fieldName} title`, titleMaxCharacter);

/**
 * Generates a non-empty string description for a given field name.
 *
 * @param {string} fieldName - The name of the field for which the description is being generated.
 * @returns {string} A formatted, non-empty string containing the description of the specified field name.
 */
const description = (fieldName) => nonEmptyString(`${fieldName} description`);

/**
 * Generates a valid Mongoose ID for the specified field.
 *
 * @param {string} fieldName - The name of the field for which the ID is being generated.
 * @returns {string} A valid Mongoose ID in the format "{fieldName} ID".
 */
const id = (fieldName) => validMongooseId(`${fieldName} ID`);

/**
 * A function to validate a category parameter for a given field name.
 *
 * @param {string} fieldName - The name of the field for which the category parameter is being validated.
 * @returns {Function} - Returns a function that performs validation using the provided field name and allowed categories.
 */
const categoryParams = (fieldName) =>
    enumValidation(`${fieldName} category parameter`, allowedCategories);

/**
 * A function that creates a file validation rule for validating a single file field.
 *
 * @param {string} fieldName - The name of the field being validated.
 * @returns {function} A validation function that checks if the provided file meets the specified criteria.
 */
const file = (fieldName) =>
    filesValidator(
        `${fieldName} file`,
        allowedMimeTypes,
        allowedFileSize,
        1,
        1
    );

/**
 * A function that validates the publish date of a given field.
 *
 * @param {string} fieldName - The name of the field whose publish date needs to be validated.
 * @returns {string} A valid date representation of the field's publish date.
 */
const publishDate = (fieldName) => validDate(`${fieldName} publish date`);

/**
 * Generates a badge name as a non-empty string, incorporating the provided field name.
 *
 * This function ensures the resulting badge name is not empty and appends the string "badge"
 * to the specified field name while enforcing a maximum character limit.
 *
 * @param {string} fieldName - The name of the field to be used as the basis for the badge name.
 * @returns {string} The generated badge name as a non-empty string, subject to the maximum character restriction.
 */
const badge = (fieldName) =>
    nonEmptyString(`${fieldName} badge`, badgeMaxCharacter);

/**
 * Constructs and returns a strict schema object using the provided `fieldName`.
 *
 * The schema is defined with the following structure:
 * - `categoryParams`: Validates the category parameters using the supplied field name.
 * - `title`: Validates the title based on the supplied field name.
 * - `description`: Validates the description based on the supplied field name.
 * - `file`: Validates the file using the supplied field name.
 * - `publishDate`: Validates the publish date based on the supplied field name.
 * - `badge`: Validates the badge details using the supplied field name.
 *
 * @param {string} fieldName - The name of the field to be used for constructing the schema.
 * @returns {ZodObject} A strict Zod schema object with the defined structure and validation rules.
 */
const createSchema = (fieldName) =>
    z
        .object({
            categoryParams: categoryParams(fieldName),
            title: title(fieldName),
            description: description(fieldName),
            file: file(fieldName),
            publishDate: publishDate(fieldName),
            badge: badge(fieldName),
        })
        .strict(); // Enforce strict mode to disallow extra fields

/**
 * Constructs and validates a structured object schema based on a specified field name.
 *
 * @function getDataByQuery
 * @param {string} [fieldName='Category'] - The base name used to define and validate the schema fields.
 * @returns {object} - A strict schema object with optional fields:
 * - id: An optional identifier linked to the given field name.
 * - categoryParams: An optional object defining parameters related to the specified category.
 * - title: An optional title field, validated against the provided field name context.
 * - description: An optional description field, validated for the specified field name.
 * - createdAt: An optional, valid date indicating the creation time for the given field name.
 * - updatedAt: An optional, valid date indicating the last update time for the given field name.
 * - publishDate: An optional, validated publish date related to the specified field name.
 * - badge: An optional field representing additional badges, evaluated for the provided field name context.
 */
const getDataByQuery = (fieldName = 'Category') =>
    z
        .object({
            id: id(fieldName).optional(),
            categoryParams: categoryParams(fieldName).optional(),
            title: title(fieldName).optional(),
            description: description(fieldName).optional(),
            createdAt: validDate(`${fieldName} creation time`).optional(),
            updatedAt: validDate(`${fieldName} last update time`).optional(),
            publishDate: publishDate(fieldName).optional(),
            badge: badge(fieldName).optional(),
        })
        .strict(); // Enforce strict mode to disallow extra fields

/**
 * Constructs a schema for updating records.
 *
 * This schema defines the structure and validation rules for an update operation.
 * The main goal of the schema is to ensure the presence of an `id` field along with
 * at least one additional field; other fields are optional but must pass their
 * specific validation when provided.
 *
 * The schema strictly enforces the allowed fields, rejecting any extra fields to
 * maintain data integrity. Additionally, the schema leverages refinement to validate
 * that the object contains more than just the `id` field.
 *
 * @param {string} fieldName - The base name for individual field validation.
 * @returns {object} A zod schema used to validate the update payload.
 */
const updateSchema = (fieldName) =>
    z
        .object({
            id: id(fieldName),
            categoryParams: categoryParams(fieldName),
            category: categoryParams(fieldName).optional(),
            title: title(fieldName).optional(),
            description: description(fieldName).optional(),
            file: file(fieldName).optional(),
            publishDate: publishDate(fieldName).optional(),
            badge: badge(fieldName).optional(),
        })
        .strict() // Enforce strict mode to disallow extra fields
        .refine(
            (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
            {
                message:
                    'At least one of "category", "title", "description", "file", "publishDate" or "badge" is required along with "id" and "categoryParams".',
            }
        );

/**
 * A schema definition for a category object.
 *
 * This function generates a strict object schema using the input field name to
 * produce category parameters. It leverages the Zod library to define and
 * validate the structure of the category object.
 *
 * @param {string} fieldName - The name of the field for which the category
 *                             parameters will be generated.
 * @returns {object} A Zod schema object that enforces the validation of the
 *                   defined category structure.
 */
const categorySchema = (fieldName) =>
    z
        .object({
            categoryParams: categoryParams(fieldName),
        })
        .strict();

/**
 * Schema generator function for validating objects with category and ID properties.
 *
 * @param {string} fieldName - The base name of the field to customize error messages or validation rules.
 * @returns {ZodObject} A Zod schema object that strictly validates two specific properties: `categoryParams` and `id`.
 * The `categoryParams` property is validated using the `categoryParams` schema function, and the `id` property
 * is validated using the `id` schema function.
 */
const categoryAndIdSchema = (fieldName) =>
    z
        .object({
            categoryParams: categoryParams(fieldName),
            id: id(fieldName),
        })
        .strict();

/**
 * Represents a collection of functionalities and schemas related to academic data management.
 *
 * This object groups together methods and schemas for handling data operations
 * such as creating schemas, querying data, and updating schemas.
 *
 * Properties:
 * - `createSchema`: A method responsible for schema creation.
 * - `getDataByQuery`: A method for querying data based on specific criteria.
 * - `updateSchema`: A method used to update existing schemas or related data.
 * - `categorySchema`: A predefined schema for managing different categories.
 * - `categoryAndIdSchema`: A predefined schema combining category data with unique identifiers.
 */
const academicSchema = {
    createSchema,
    getDataByQuery,
    updateSchema,

    categorySchema,
    categoryAndIdSchema,
};

export default academicSchema;
