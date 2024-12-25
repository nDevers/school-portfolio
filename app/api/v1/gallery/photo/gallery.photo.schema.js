import { z } from 'zod';

import schemaShared from '@/shared/schema.shared';
import galleryPhotoConstants from '@/app/api/v1/gallery/photo/gallery.photo.constants';

const {
    nonEmptyString,
    nonEmptyStringArray,
    validMongooseId,
    validDate,
    filesValidator,
} = schemaShared;
const { titleMaxCharacter, allowedMimeTypes, allowedBannerFileSize } =
    galleryPhotoConstants;

/**
 * The nonEmptyString function applied to create a validated string value
 * representing the title of a gallery photo.
 *
 * @param {string} value - The string description for the field indicating
 *                         its purpose and validation needs.
 * @param {number} maxCharacters - The maximum allowable character limit
 *                                  for the title.
 * @returns {string} A string containing the validated gallery photo title.
 *                   It cannot be empty and must not exceed the maximum
 *                   character limit defined.
 */
const title = nonEmptyString('Gallery photo title', titleMaxCharacter);

/**
 * A non-empty string representing the description of a gallery photo.
 * This variable ensures the gallery photo has a meaningful description
 * that cannot be left blank.
 */
const description = nonEmptyString('Gallery photo description');

/**
 * A function to validate a Mongoose ObjectId.
 *
 * @param {string} id - The string identifier to be validated.
 * @returns {boolean} Returns true if the provided id is a valid Mongoose ObjectId, otherwise false.
 *
 * @throws {TypeError} Throws an error if the input is not a string.
 */
const id = validMongooseId('Gallery photo ID');

/**
 * Validates and processes gallery photo images.
 *
 * The `images` variable is initialized using the `filesValidator` function
 * to enforce constraints on uploaded photo files for a gallery. It ensures
 * that only files with specific MIME types and sizes can be uploaded, while
 * also limiting the number of permissible files.
 *
 * Constraints:
 * - Acceptable MIME types are defined by the `allowedMimeTypes` parameter.
 * - Maximum allowed file size is defined by the `allowedBannerFileSize` parameter.
 * - A minimum of 1 file and a maximum of 10 files can be uploaded.
 *
 * The `filesValidator` function referenced here is assumed to implement the logic
 * for verifying these constraints.
 */
const images = filesValidator(
    'Gallery photo images',
    allowedMimeTypes,
    allowedBannerFileSize,
    1,
    10
);

/**
 * Represents the schema definition for creating an object with specific properties.
 *
 * The `createSchema` variable is a strict schema created using `z.object` to ensure validation
 * of the given object. The schema validates that the object includes the following required fields:
 * - `title`: A required property.
 * - `description`: A required property.
 * - `images`: A required property.
 *
 * This schema does not permit any extra or unspecified fields outside the defined properties.
 */
const createSchema = z
    .object({
        title,
        description,
        images,
    })
    .strict(); // Enforce strict mode to disallow extra fields

/**
 * `getDataByQuery` is a schema object that defines the structure and validation
 * for querying data. It restricts the expected fields and ensures compliance
 * with the specified types and optionality. The schema strictly enforces the
 * validation rules to avoid additional undefined properties.
 *
 * Fields:
 * - id: An optional identifier, validated by the custom `id` schema.
 * - title: An optional title, validated by the custom `title` schema.
 * - description: An optional description, validated by the custom `description` schema.
 * - createdAt: An optional valid date representing the creation time of the gallery photo.
 * - updatedAt: An optional valid date representing the last update time of the gallery photo.
 */
const getDataByQuery = z
    .object({
        id: id.optional(),
        title: title.optional(),
        description: description.optional(),
        createdAt: validDate('Gallery photo creation time').optional(),
        updatedAt: validDate('Gallery photo last update time').optional(),
    })
    .strict(); // Enforce strict mode to disallow extra fields

/**
 * Schema validation for updating an entity, ensuring specific fields are present,
 * enforcing strict mode, and requiring at least one additional field besides the `id`.
 *
 * The schema validates the following:
 * - `id`: Identifier for the entity being updated. Required field.
 * - `title`: Optional field for the title of the entity.
 * - `description`: Optional field for the description of the entity.
 * - `images`: Optional field for an array of images associated with the entity.
 * - `deleteImages`: Optional field to specify an array of IDs of images to be deleted.
 *
 * Validation rules:
 * - Extra fields outside of the defined schema are disallowed.
 * - The data must contain `id` and at least one of `title`, `description`, `images`, or `deleteImages`.
 * - Throws an error if no fields other than `id` are provided.
 */
const updateSchema = z
    .object({
        id,
        title: title.optional(),
        description: description.optional(),
        images: images.optional(),
        deleteImages: nonEmptyStringArray(
            'ID of the image that will be deleted'
        ).optional(),
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
 * @constant {Object} galleryPhotoSchema
 * @description Represents a schema object for gallery photos, providing methods to manage and interact with the schema.
 *
 * @property {Function} createSchema - Method for creating a new gallery photo schema.
 * @property {Function} getDataByQuery - Method to fetch data from the gallery photo schema based on a provided query.
 * @property {Function} updateSchema - Method to update an existing gallery photo schema.
 */
const galleryPhotoSchema = {
    createSchema,
    getDataByQuery,
    updateSchema,
};

export default galleryPhotoSchema;
