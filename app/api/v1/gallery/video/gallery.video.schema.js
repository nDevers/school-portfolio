import { z } from 'zod';

import schemaShared from "@/shared/schema.shared";
import careerConstants from "@/app/api/v1/career/career.constants";

const { nonEmptyString, nonEmptyStringArray, validMongooseId, validDate } = schemaShared;
const { titleMaxCharacter} = careerConstants;

/**
 * Represents the title of a gallery video.
 * The title is initialized with a non-empty string and has a character limit defined by `titleMaxCharacter`.
 *
 * @param {string} value - A string representing the gallery video title. It must be non-empty.
 * @param {number} titleMaxCharacter - The maximum number of characters allowed for the title.
 * @throws {Error} If the input string is empty or exceeds the maximum character limit.
 */
const title = nonEmptyString('Gallery video title', titleMaxCharacter);

/**
 * Represents a non-empty string used as a description for a gallery video.
 * This variable contains a string value that is guaranteed to be non-empty.
 */
const description = nonEmptyString('Gallery video description');

/**
 * A variable holding a valid Mongoose ID for a gallery video.
 * This ID is used to uniquely identify a specific video within a
 * gallery in a MongoDB database. The ID should be in the format
 * recognized by Mongoose as a valid ObjectId.
 */
const id = validMongooseId('Gallery video ID');

/**
 * A variable that holds an array of non-empty strings.
 * Each string in the array represents a YouTube video link associated with the gallery.
 *
 * This is expected to only contain valid non-empty YouTube video URLs.
 */
const youtubeLinks = nonEmptyStringArray('Gallery video youtube links');

/**
 * A variable representing a schema created using the `zod` library.
 *
 * The `createSchema` variable defines a strict object schema with the following properties:
 * - `title`: Represents the title of the object.
 * - `description`: Represents the description of the object.
 * - `youtubeLinks`: Represents the YouTube links associated with the object.
 *
 * The `.strict()` method ensures that only the defined properties are allowed in the schema.
 */
const createSchema = z.object({
    title,
    description,
    youtubeLinks,
}).strict(); // Enforce strict mode to disallow extra fields

/**
 * Data structure definition for the `getDataByQuery` variable.
 *
 * This object schema is used for querying data with specific optional parameters.
 * It strictly enforces the shape and validation of the expected data.
 *
 * Properties:
 * - `id` (optional): Represents the ID of the queried entity.
 * - `title` (optional): Represents the title of the queried entity.
 * - `description` (optional): Represents the description of the queried entity.
 * - `createdAt` (optional): Represents the creation time of the gallery video.
 * - `updatedAt` (optional): Represents the last update time of the gallery video.
 *
 * Notes:
 * - All properties in the schema are optional.
 * - Uses custom validators such as `validDate` for date attributes.
 * - Enforcing strict validation ensures no additional properties are allowed.
 */
const getDataByQuery = z.object({
    id: id.optional(),
    title: title.optional(),
    description: description.optional(),
    createdAt: validDate('Gallery video creation time').optional(),
    updatedAt: validDate('Gallery video last update time').optional(),
}).strict(); // Enforce strict mode to disallow extra fields

/**
 * Schema to validate and enforce the structure for updating an entity.
 *
 * The `updateSchema` ensures:
 * - A strict object definition where no extra fields are permitted.
 * - Presence of an 'id' to identify the entity being updated.
 * - At least one other optional field in addition to 'id' is required.
 * - Validations for optional fields such as `title`, `description`, `youtubeLinks`, and `deleteYoutubeLinks`.
 *
 * Properties:
 * - id: Represents the unique identifier of the entity to update. This field is required.
 * - title: Represents the title of the entity. This field is optional.
 * - description: Represents the description of the entity. This field is optional.
 * - youtubeLinks: An optional array of YouTube video links associated with the entity.
 * - deleteYoutubeLinks: An optional array of identifiers for YouTube links that will be deleted.
 *
 * The schema applies:
 * - Strict mode to disallow extra fields not explicitly defined in the schema.
 * - A refinement to ensure that at least one field, in addition to `id`, is included during the update.
 */
const updateSchema = z.object({
    id,
    title: title.optional(),
    description: description.optional(),
    youtubeLinks: youtubeLinks.optional(),
    deleteYoutubeLinks: nonEmptyStringArray('IDs of the youtube link that will be deleted').optional(),
})
    .strict() // Enforce strict mode to disallow extra fields
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message: 'At least one of "title", "description", "youtubeLinks" or "deleteYoutubeLinks" is required along with "id".',
        }
    );

/**
 * Object representing the schema for managing gallery videos.
 *
 * This schema provides methods to create a video schema, perform queries,
 * and update existing video schemas in the gallery system. It is intended
 * to manage gallery video data consistently and effectively.
 *
 * Properties:
 * - `createSchema`: A method to create a new gallery video schema.
 * - `getDataByQuery`: A method to fetch gallery video data based on specific queries.
 * - `updateSchema`: A method to update existing gallery video schemas.
 */
const galleryVideoSchema = {
    createSchema,
    getDataByQuery,
    updateSchema,
};

export default galleryVideoSchema;
