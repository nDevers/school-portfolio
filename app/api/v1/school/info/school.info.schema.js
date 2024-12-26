'use strict';

import { z } from 'zod';

import schemaShared from '@/shared/schema.shared';
import schoolInfoConstants from '@/app/api/v1/school/info/school.info.constants';

const { nonEmptyString, validMongooseId, validDate, filesValidator } =
    schemaShared;
const { titleMaxCharacter, allowedMimeTypes, allowedBannerFileSize } =
    schoolInfoConstants;

/**
 * Represents the title for the school information section.
 * This value must be a non-empty string and adhere to the maximum character limit defined by `titleMaxCharacter`.
 *
 * @param {string} description - A description to label the title variable, here set as 'School info title'.
 * @param {number} titleMaxCharacter - The defined maximum character limit for the title string.
 * @returns {string} A validated non-empty string that does not exceed the maximum character length.
 */
const title = nonEmptyString('School info title', titleMaxCharacter);

/**
 * Represents a non-empty string containing the description of school information.
 * The string must not be empty and is intended to provide details about school information purposes.
 */
const description = nonEmptyString('School info description');

/**
 * Represents a Mongoose identifier used to validate the ID of a school information record.
 * This variable holds a function intended to ensure the provided ID conforms to the
 * formatting requirements of a valid Mongoose ID.
 *
 * @type {Function}
 */
const id = validMongooseId('School info ID');

/**
 * Represents an icon generated by the `filesValidator` function with specific configurations.
 *
 * The icon is associated with "School info icon" as its description and
 * is validated against the provided criteria, such as allowed MIME types,
 * banner file size limits, and the minimum and maximum file count requirements.
 *
 * @type {Object}
 * @constant
 * @description The icon configuration for validating files related to "School info icon".
 */
const icon = filesValidator(
    'School info icon',
    allowedMimeTypes,
    allowedBannerFileSize,
    1,
    1
);

/**
 * Represents a schema definition created using the Zod library.
 * The `createSchema` variable defines a strict object schema with specific fields.
 *
 * Schema fields:
 * - `title`: Represents the title field in the schema. The field type and validation rules are defined elsewhere.
 * - `description`: Represents the description field in the schema. The field type and validation rules are defined elsewhere.
 * - `icon`: Represents the icon field in the schema. The field type and validation rules are defined elsewhere.
 *
 * The schema enforces strict object validation, meaning no additional properties beyond the defined fields are allowed.
 */
const createSchema = z
    .object({
        title,
        description,
        icon,
    })
    .strict(); // Enforce strict mode to disallow extra fields

/**
 * Represents a schema for validating and handling data queried for school information.
 *
 * The `getDataByQuery` variable uses the `z.object` schema to validate fields related to school details.
 * All the fields in this schema are optional and strictly validated as per the specified type requirements.
 *
 * Fields:
 * - `id` (optional): Identifies the school information using an ID. Must conform to the predefined `id` schema.
 * - `title` (optional): Represents the title or name of the school. Must conform to the predefined `title` schema.
 * - `description` (optional): Provides additional information or details about the school. Must conform to the predefined `description` schema.
 * - `createdAt` (optional): Indicates the creation time of the school information. Must be a valid date, labeled as "School info creation time".
 * - `updatedAt` (optional): Represents the last update time of the school information. Must be a valid date, labeled as "School info last update time".
 *
 * The schema is strict, meaning no additional properties outside of the defined fields are allowed.
 */
const getDataByQuery = z
    .object({
        id: id.optional(),
        title: title.optional(),
        description: description.optional(),
        createdAt: validDate('School info creation time').optional(),
        updatedAt: validDate('School info last update time').optional(),
    })
    .strict(); // Enforce strict mode to disallow extra fields

/**
 * Represents a schema validator for updating an object. The `updateSchema` ensures that the object adheres to specific structural requirements and enforces validation rules.
 *
 * Validation Details:
 * - The object must contain an `id` field.
 * - At least one of the optional fields (`title`, `description`, `icon`) must be present in addition to the `id`.
 * - Extra fields not defined in the schema are disallowed due to strict mode enforcement.
 *
 * Refinement:
 * - Validates that the object contains more than one key (`id` and at least one additional field).
 * - If the above refinement fails, an error message is provided: "At least one of 'title' or 'description' is required along with 'id'."
 */
const updateSchema = z
    .object({
        id,
        title: title.optional(),
        description: description.optional(),
        icon: icon.optional(),
    })
    .strict() // Enforce strict mode to disallow extra fields
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message:
                'At least one of "title" or "description" is required along with "id".',
        }
    );

/**
 * An object representing the schema and operations for managing school information.
 *
 * @property {Function} createSchema - A function to create the school information schema in the database.
 * @property {Function} getDataByQuery - A function to retrieve school information from the database based on specific queries.
 * @property {Function} updateSchema - A function to update the existing school information schema in the database.
 */
const schoolInfoSchema = {
    createSchema,
    getDataByQuery,
    updateSchema,
};

export default schoolInfoSchema;
