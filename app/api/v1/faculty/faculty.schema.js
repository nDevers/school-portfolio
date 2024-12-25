import { z } from 'zod';

import schemaShared from '@/shared/schema.shared';
import facultyConstants from '@/app/api/v1/faculty/faculty.constants';

const {
    nonEmptyString,
    enumValidation,
    validMongooseId,
    validDate,
    filesValidator,
    validEmail,
    validMobileNumber,
    validUrl,
} = schemaShared;
const {
    nameMaxCharacter,
    designationMaxCharacter,
    allowedCategories,
    allowedMimeTypes,
    allowedFileSize,
} = facultyConstants;

/**
 * A function that generates a non-empty string representation of a name for a given field.
 *
 * @param {string} fieldName - The name of the field associated with this name entry.
 * @returns {string} A non-empty string representation of the field name with a maximum character limit.
 */
const name = (fieldName) =>
    nonEmptyString(`${fieldName} name`, nameMaxCharacter);

/**
 * Generates a designation string based on the provided field name.
 * Ensures the designation is a non-empty string and validates against the maximum allowed character limit.
 *
 * @param {string} fieldName - The name of the field used to create a designation string.
 * @returns {string} A non-empty designation string created from the input field name.
 */
const designation = (fieldName) =>
    nonEmptyString(`${fieldName} designation`, designationMaxCharacter);

/**
 * Generates a Mongoose-valid ID for a specified field name.
 *
 * This function appends " ID" to the given field name and creates a
 * valid Mongoose ID format using the `validMongooseId` utility.
 *
 * @param {string} fieldName - The name of the field for which the ID
 *                              is being generated.
 * @returns {string} A string representing the valid Mongoose ID
 *                   for the specified field.
 */
const id = (fieldName) => validMongooseId(`${fieldName} ID`);

/**
 * Function parameter used for validating category-related fields.
 *
 * @param {string} fieldName - The name of the field to be validated as a category parameter.
 * @returns {Function} A configured validation function to validate the given fieldName with the allowed categories.
 */
const categoryParams = (fieldName) =>
    enumValidation(`${fieldName} category parameter`, allowedCategories);

/**
 * Defines a function that validates an image file based on allowed MIME types,
 * file size, and limits the number of files to exactly one.
 *
 * @param {string} fieldName - The name of the field being validated.
 * @returns {Function} A validation function specific to the provided field name.
 */
const image = (fieldName) =>
    filesValidator(
        `${fieldName} image`,
        allowedMimeTypes,
        allowedFileSize,
        1,
        1
    );

/**
 * A function that returns a validation rule for an email field.
 *
 * This function takes a field name as input, appends the string " email"
 * to it, and applies an email validation rule. The `.optional()` method
 * allows the email field to be optional for validation.
 *
 * @param {string} fieldName - The name of the field to be validated.
 * @returns {object} A validation rule for the email field.
 */
const email = (fieldName) => validEmail(`${fieldName} email`).optional();

/**
 * A function that validates if the input is a valid mobile number.
 *
 * This function takes a field name as a parameter, appends the word 'mobile'
 * to the field name, and checks if the resulting value is a valid mobile number.
 *
 * @param {string} fieldName - The name of the field to be validated as a mobile number.
 * @returns {boolean} Returns true if the composed string is a valid mobile number, otherwise false.
 */
const mobile = (fieldName) => validMobileNumber(`${fieldName} mobile`);

/**
 * A function to generate and validate an optional URL for a portfolio.
 *
 * @param {string} fieldName - The name of the field to be used in constructing the portfolio URL.
 * @returns {Function} - A function that validates if the constructed URL is valid and marks it as optional.
 */
const portfolio = (fieldName) => validUrl(`${fieldName} portfolio`).optional();

/**
 * A function that creates a strict schema object using `zod`.
 *
 * The schema validates an object with the following fields:
 * - `categoryParams`: Generated from the `categoryParams` function using the provided field name.
 * - `name`: Generated from the `name` function using the provided field name.
 * - `designation`: Generated from the `designation` function using the provided field name.
 * - `image`: Generated from the `image` function using the provided field name.
 * - `email`: Generated from the `email` function using the provided field name.
 * - `mobile`: Generated from the `mobile` function using the provided field name.
 * - `portfolio`: Generated from the `portfolio` function using the provided field name.
 *
 * @param {string} fieldName - The base field name used to generate the schema's sub-fields.
 * @returns {ZodObject} A Zod schema object that conforms to the defined structure.
 */
const createSchema = (fieldName) =>
    z
        .object({
            categoryParams: categoryParams(fieldName),
            name: name(fieldName),
            designation: designation(fieldName),
            image: image(fieldName),
            email: email(fieldName),
            mobile: mobile(fieldName),
            portfolio: portfolio(fieldName),
        })
        .strict(); // Enforce strict mode to disallow extra fields

/**
 * Constructs a strict schema for validating data using the provided field name.
 *
 * @param {string} fieldName - The name of the field to be used in the schema generation.
 * @returns {object} - A zod schema object with validation rules for the specified fields.
 *
 * The schema includes the following optional fields:
 * - id: A unique identifier for the entry.
 * - categoryParams: Category-specific parameters.
 * - name: The name associated with the entry.
 * - designation: The designation or title associated with the entry.
 * - createdAt: The creation timestamp for the entry.
 * - updatedAt: The last update timestamp for the entry.
 * - mobile: A mobile phone number.
 *
 * Additionally, it includes the following required fields:
 * - email: An email address.
 * - portfolio: A portfolio URL or related information.
 *
 * All fields are strictly validated.
 */
const getDataByQuery = (fieldName) =>
    z
        .object({
            id: id(fieldName).optional(),
            categoryParams: categoryParams(fieldName).optional(),
            name: name(fieldName).optional(),
            designation: designation(fieldName).optional(),
            createdAt: validDate(`${fieldName} creation time`).optional(),
            updatedAt: validDate(`${fieldName} last update time`).optional(),
            email: email(fieldName),
            mobile: mobile(fieldName).optional(),
            portfolio: portfolio(fieldName),
        })
        .strict(); // Enforce strict mode to disallow extra fields

/**
 * A schema generator function for validating data objects based on the provided `fieldName`.
 *
 * @param {string} fieldName - The identifier for the field used to dynamically construct the schema validations.
 * @returns {z.ZodType} A Zod schema object with the following structure:
 *
 * - `id`: Required field validated using the `id` function with the provided `fieldName`.
 * - `categoryParams`: Required field validated using the `categoryParams` function with the provided `fieldName`.
 * - `category`: Optional field validated using the `categoryParams` function with the provided `fieldName`.
 * - `name`: Optional field validated using the `name` function with the provided `fieldName`.
 * - `designation`: Optional field validated using the `designation` function with the provided `fieldName`.
 * - `image`: Optional field validated using the `image` function with the provided `fieldName`.
 * - `email`: Required field validated using the `email` function with the provided `fieldName`.
 * - `mobile`: Optional field validated using the `mobile` function with the provided `fieldName`.
 * - `portfolio`: Required field validated using the `portfolio` function with the provided `fieldName`.
 *
 * Enforces strict mode to disallow extra fields beyond those defined in the schema.
 *
 * Includes additional refinement to ensure the object contains at least the `id`, `categoryParams`,
 * and one additional optional field such as `category`, `name`, `designation`, `image`, `email`, or `mobile`.
 *
 * Refinement validation error message:
 * "At least one of 'category', 'name', 'designation', 'image', 'email' or 'mobile' is required along with 'id' and 'categoryParams'."
 */
const updateSchema = (fieldName) =>
    z
        .object({
            id: id(fieldName),
            categoryParams: categoryParams(fieldName),
            category: categoryParams(fieldName).optional(),
            name: name(fieldName).optional(),
            designation: designation(fieldName).optional(),
            image: image(fieldName).optional(),
            email: email(fieldName),
            mobile: mobile(fieldName).optional(),
            portfolio: portfolio(fieldName),
        })
        .strict() // Enforce strict mode to disallow extra fields
        .refine(
            (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
            {
                message:
                    'At least one of "category", "name", "designation", "image", "email" or "mobile" is required along with "id" and "categoryParams".',
            }
        );

/**
 * Defines a schema for a category object using Zod's validation library.
 *
 * @function
 * @param {string} fieldName - The name of the field associated with the category.
 * @returns {ZodObject} A strict Zod object schema for validating category-related data.
 *
 * The schema enforces a structure with the following:
 * - `categoryParams`: A nested schema generated by invoking `categoryParams` function with `fieldName` as its argument.
 */
const categorySchema = (fieldName) =>
    z
        .object({
            categoryParams: categoryParams(fieldName),
        })
        .strict();

/**
 * Function that defines a schema for validating objects with specific fields related to a category and its ID.
 *
 * @param {string} fieldName - The name of the field that is used as a base for validation in the schema.
 * @returns {object} - A Zod object schema that strictly validates an object containing
 *                     `categoryParams` and `id` fields.
 *
 * The `categoryParams` is validated using the `categoryParams` function which takes `fieldName` as a parameter.
 * The `id` is validated using the `id` function which also takes `fieldName` as a parameter.
 * The `.strict()` method enforces that no additional properties are allowed in the object.
 */
const categoryAndIdSchema = (fieldName) =>
    z
        .object({
            categoryParams: categoryParams(fieldName),
            id: id(fieldName),
        })
        .strict();

/**
 * facultySchema is an object representing various schema-related methods and definitions for managing faculty data.
 *
 * It provides the following properties:
 *
 * @property {Function} createSchema - Function to define or create a new schema related to faculty.
 * @property {Function} getDataByQuery - Function to retrieve faculty data based on specific query conditions.
 * @property {Function} updateSchema - Function to update the faculty schema or its related properties.
 * @property {Object} categorySchema - Object representing the structure or schema related to faculty categories.
 * @property {Object} categoryAndIdSchema - Object defining the schema structure involving both categories and their identifiers.
 */
const facultySchema = {
    createSchema,
    getDataByQuery,
    updateSchema,

    categorySchema,
    categoryAndIdSchema,
};

export default facultySchema;
