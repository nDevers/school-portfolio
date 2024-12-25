import { z } from 'zod';

import schemaShared from '@/shared/schema.shared';
import schoolAchievementConstants from '@/app/api/v1/school/achievement/school.achievement.constants';

const { nonEmptyString, validMongooseId, validDate, filesValidator } =
    schemaShared;
const { allowedMimeTypes, allowedBannerFileSize } = schoolAchievementConstants;

/**
 * Represents the title of a school achievement.
 * The value is expected to be a non-empty string providing
 * a concise and descriptive title for an achievement.
 */
const title = nonEmptyString('School achievement title');

/**
 * Represents a description of a school achievement.
 * This variable must contain a non-empty string.
 */
const description = nonEmptyString('School achievement description');

/**
 * Validates and represents a MongoDB ObjectID for a School Achievement.
 *
 * @param {string} id - The School achievement ID to be validated as a valid Mongoose ObjectID.
 * @returns {boolean} Returns true if the provided ID is a valid Mongoose ObjectID, otherwise false.
 */
const id = validMongooseId('School achievement ID');

/**
 * Represents an icon for validating school achievement-related files.
 *
 * This variable is initialized using the `filesValidator` function and is configured with
 * the parameters to validate specific files associated with school achievements.
 *
 * Configuration:
 * - Description: "School achievement icon"
 * - Allowed MIME Types: specified in `allowedMimeTypes`
 * - Maximum File Size: `allowedBannerFileSize`
 * - Minimum File Quantity: 1
 * - Maximum File Quantity: 1
 *
 * Used to ensure uploaded icons meet predetermined file type and size requirements
 * within the constraints of the allowed file limits.
 */
const icon = filesValidator(
    'School achievement icon',
    allowedMimeTypes,
    allowedBannerFileSize,
    1,
    1
);

// Define the Zod validation schema
/**
 * `createSchema` is a Zod schema that defines a strict object structure.
 * This schema validates objects to ensure they contain only the specified properties:
 * `title`, `description`, and `icon`.
 * Any additional properties outside of these will result in a validation error.
 */
const createSchema = z
    .object({
        title,
        description,
        icon,
    })
    .strict(); // Enforce strict mode to disallow extra fields

/**
 * An object schema for validating and structuring data used to query school achievements.
 *
 * The `getDataByQuery` object includes the following optional properties:
 * - `id`: An optional unique identifier for the school achievement.
 * - `title`: An optional title or name of the school achievement.
 * - `description`: An optional description or details about the school achievement.
 * - `createdAt`: An optional timestamp representing the creation time of the school achievement.
 * - `updatedAt`: An optional timestamp representing the last update time of the school achievement.
 *
 * The object is strictly validated to ensure only these defined properties are allowed.
 */
const getDataByQuery = z
    .object({
        id: id.optional(),
        title: title.optional(),
        description: description.optional(),
        createdAt: validDate('School achievement creation time').optional(),
        updatedAt: validDate('School achievement last update time').optional(),
    })
    .strict(); // Enforce strict mode to disallow extra fields

/**
 * Represents a schema validation for updating an object, ensuring specific rules and structure.
 *
 * The schema ensures the following:
 * - It requires an `id` field to be present.
 * - Fields `title`, `description`, and `icon` are optional.
 * - Enforces strict mode to disallow additional fields beyond what is defined.
 * - Validates that the object must contain the `id` field and at least one additional field (`title`, `description`, or `icon`).
 * - Provides an error message if the validation fails, requiring at least one of `title` or `description` to accompany `id`.
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
 * Represents a schema object for managing school achievements.
 * Provides methods to create, retrieve, and update schema-related data.
 *
 * @property {Function} createSchema - Method to create a new school achievement schema.
 * @property {Function} getDataByQuery - Method to retrieve data using specific query parameters.
 * @property {Function} updateSchema - Method to update an existing school achievement schema.
 */
const schoolAchievementSchema = {
    createSchema,
    getDataByQuery,
    updateSchema,
};

export default schoolAchievementSchema;
