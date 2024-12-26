'use strict';

import { z } from 'zod';

import schemaShared from '@/shared/schema.shared';
import blogConstants from '@/app/api/v1/blog/blog.constants';

const {
    nonEmptyString,
    nonEmptyStringArray,
    validMongooseId,
    validDate,
    filesValidator,
} = schemaShared;
const {
    titleMaxCharacter,
    allowedBannerMimeTypes,
    allowedFilesMimeTypes,
    allowedImagesMimeTypes,
    allowedFileSize,
} = blogConstants;

/**
 * The title of the blog, expected to be a non-empty string.
 * This variable enforces a maximum character limit as defined by `titleMaxCharacter`.
 *
 * @type {string}
 * @param {string} 'Blog title' - A descriptor indicating the purpose or use of the string.
 * @param {number} titleMaxCharacter - The maximum number of characters allowed for the blog title.
 */
const title = nonEmptyString('Blog title', titleMaxCharacter);

/**
 * Represents the description of a blog.
 * The description must be a non-empty string.
 */
const description = nonEmptyString('Blog description');

/**
 * Represents a valid Mongoose ObjectId for a Blog.
 * Used to identify and validate the Blog's unique identifier.
 */
const id = validMongooseId('Blog ID');

/**
 * Represents the validation configuration for the "Blog banner" file input.
 *
 * This variable uses the `filesValidator` function to enforce file validation rules
 * for uploaded banners in a blog. The validation includes constraints on MIME types,
 * file size, and file quantity.
 *
 * @constant {Object} banner
 * @param {string} 'Blog banner' - A descriptive string for the file input field.
 * @param {Array<string>} allowedBannerMimeTypes - A predefined list of allowed MIME types for the banner.
 * @param {number} allowedFileSize - The maximum allowed file size (in bytes) for the banner.
 * @param {number} 1 - The minimum number of files that must be uploaded.
 * @param {number} 1 - The maximum number of files that can be uploaded.
 */
const banner = filesValidator(
    'Blog banner',
    allowedBannerMimeTypes,
    allowedFileSize,
    1,
    1
);

/**
 * Represents the configuration for file validation.
 *
 * @constant {Object} files
 * @description This variable holds the configuration for validating file uploads in the context of blog files.
 * It ensures the uploaded files adhere to the specified allowed MIME types, maximum file size,
 * and restricts the number of files that can be uploaded between a minimum and a maximum limit.
 *
 * @property {string} description - A descriptive name for the file validation context, set as 'Blog files'.
 * @property {Array<string>} allowedMimeTypes - A list of MIME types that are permitted for the file uploads.
 * @property {number} maxFileSize - The maximum allowed size for each file in bytes.
 * @property {number} minFiles - The minimum number of files that must be uploaded, set as 1.
 * @property {number} maxFiles - The maximum number of files that can be uploaded, set as 10.
 */
const files = filesValidator(
    'Blog files',
    allowedFilesMimeTypes,
    allowedFileSize,
    1,
    10
);

/**
 * A variable representing the validation rules for blog images.
 *
 * This variable is assigned the result of the `filesValidator` function, which validates image files.
 *
 * The validator enforces the following constraints:
 * - The images must conform to supported MIME types specified by `allowedImagesMimeTypes`.
 * - The size of each image must not exceed the limit specified by `allowedFileSize`.
 * - A minimum of 1 image and a maximum of 10 images are allowed.
 *
 * @type {Array|Object} - The validated image files or validation result.
 */
const images = filesValidator(
    'Blog images',
    allowedImagesMimeTypes,
    allowedFileSize,
    1,
    10
);

/**
 * The `date` variable stores the result of the `validDate` function, which is used to handle the date associated with a blog.
 *
 * The `validDate` function ensures that the value assigned to the `date` variable represents a valid and correctly formatted date.
 * This is particularly useful for purposes such as displaying, sorting, or validating blog-related date entries.
 *
 * @type {Date}
 */
const date = validDate('Blog date');

/**
 * `createSchema` is a Zod schema object used for defining the structure and validation of an input object.
 * It strictly enforces the shape of the input, disallowing additional properties beyond those defined.
 *
 * The schema includes the following properties:
 * - `title`: Represents the title field.
 * - `description`: Represents the description field.
 * - `banner`: Represents the banner field.
 * - `files`: Represents the files field.
 * - `images`: Represents the images field.
 * - `date`: Represents the date field.
 */
const createSchema = z
    .object({
        title,
        description,
        banner,
        files,
        images,
        date,
    })
    .strict(); // Enforce strict mode to disallow extra fields

/**
 * Represents a schema to validate the structure and optionality of data retrieved by a query.
 * This schema enforces strict checking to ensure no additional properties are allowed.
 *
 * Properties:
 * - id: An optional identifier for the object.
 * - title: An optional title for the object.
 * - description: An optional description for the object.
 * - createdAt: An optional valid date representing the creation time of a blog.
 * - updatedAt: An optional valid date representing the last update time of a blog.
 * - date: An optional date field.
 */
const getDataByQuery = z
    .object({
        id: id.optional(),
        title: title.optional(),
        description: description.optional(),
        createdAt: validDate('Blog creation time').optional(),
        updatedAt: validDate('Blog last update time').optional(),
        date: date.optional(),
    })
    .strict(); // Enforce strict mode to disallow extra fields

/**
 * A validation schema for updating an entity, ensuring required and optional fields follow specific rules.
 *
 * This schema validates that the provided object includes an `id` field alongside at least one other optional
 * field. It strictly enforces the shape of the object, disallowing any extra fields not explicitly defined.
 *
 * The schema includes the following properties:
 * - `id`: The identifier of the entity to update (required).
 * - `title`: The title of the entity (optional).
 * - `description`: The description of the entity (optional).
 * - `banner`: Information about the banner (optional).
 * - `files`: Uploaded files associated with the entity (optional).
 * - `images`: Images associated with the entity (optional).
 * - `deleteFiles`: An array of IDs for the files that will be deleted (optional).
 * - `deleteImages`: An array of IDs for the images that will be deleted (optional).
 * - `date`: The date associated with the update (optional).
 *
 * Validates that at least one of the optional fields is present along with the required `id`.
 * Disallows any properties not explicitly defined within the schema.
 *
 * Notes: The `deleteFiles` and `deleteImages` fields expect non-empty arrays of strings containing the IDs
 * to be deleted. Each optional property, if provided, must comply with its respective field validation rule.
 */
const updateSchema = z
    .object({
        id,
        title: title.optional(),
        description: description.optional(),
        banner: banner.optional(),
        files: files.optional(),
        images: images.optional(),
        deleteFiles: nonEmptyStringArray(
            'The IDs of the files that will be deleted'
        ).optional(),
        deleteImages: nonEmptyStringArray(
            'The IDs of the images that will be deleted'
        ).optional(),
        date: date.optional(),
    })
    .strict() // Enforce strict mode to disallow extra fields
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message:
                'At least one of "title", "description", "banner", "files", "images", "deleteFiles", "deleteImages" or "date" is required along with "id".',
        }
    );

/**
 * Represents the schema and methods to interact with a blog system.
 *
 * The `blogSchema` object provides methods to create, retrieve, and update blog data.
 *
 * Properties:
 * - `createSchema`: Method used for creating a new schema or structure for blog posts.
 * - `getDataByQuery`: Method used to retrieve data from the blog system based on specific queries or criteria.
 * - `updateSchema`: Method used to update an existing schema or blog data.
 */
const blogSchema = {
    createSchema,
    getDataByQuery,
    updateSchema,
};

export default blogSchema;
