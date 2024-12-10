import { z } from 'zod';

import schemaShared from "@/shared/schema.shared";
import careerConstants from "@/app/api/v1/career/career.constants";

// Define reusable schema parts
const { nonEmptyString, nonEmptyStringArray, validMongooseId, validDate } = schemaShared;
const { titleMaxCharacter} = careerConstants;

const title = nonEmptyString('Gallery video title', titleMaxCharacter);
const description = nonEmptyString('Gallery video description');
const id = validMongooseId('Gallery video ID');
const youtubeLinks = nonEmptyStringArray('Gallery video youtube links');

// Define the Zod validation schema
const createSchema = z.object({
    title,
    description,
    youtubeLinks,
}).strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const getDataByQuery = z.object({
    id: id.optional(),
    title: title.optional(),
    description: description.optional(),
    createdAt: validDate('Gallery video creation time').optional(),
    updatedAt: validDate('Gallery video last update time').optional(),
}).strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
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

const galleryVideoSchema = {
    createSchema,
    getDataByQuery,
    updateSchema,
};

export default galleryVideoSchema;
