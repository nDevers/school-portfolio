import { z } from 'zod';

import schemaShared from "@/shared/schema.shared";
import schoolSpeechConstants from "@/app/api/v1/school/speech/school.speech.constants";

// Define reusable schema parts
const { nonEmptyString, validMongooseId, validDate, filesValidator } = schemaShared;
const { titleMaxCharacter, allowedMimeTypes, allowedBannerFileSize } = schoolSpeechConstants;

const title = nonEmptyString('School speech title', titleMaxCharacter);
const description = nonEmptyString('School speech description');
const id = validMongooseId('School speech ID');
const image = filesValidator('School speech image', allowedMimeTypes, allowedBannerFileSize, 1, 1);

// Define the Zod validation schema
const createSchema = z.object({
    title,
    description,
    image,
}).strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const getDataByQuery = z.object({
    id: id.optional(),
    title: title.optional(),
    description: description.optional(),
    createdAt: validDate('School speech creation time').optional(),
    updatedAt: validDate('School speech last update time').optional(),
}).strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const updateSchema = z.object({
    id,
    title: title.optional(),
    description: description.optional(),
    image: image.optional(),
})
    .strict() // Enforce strict mode to disallow extra fields
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message: 'At least one of "title" or "description" is required along with "id".',
        }
    );

const schoolSpeechSchema = {
    createSchema,
    getDataByQuery,
    updateSchema,
};

export default schoolSpeechSchema;
