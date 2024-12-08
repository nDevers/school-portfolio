import { z } from 'zod';

import schemaShared from "@/shared/schema.shared";
import careerConstants from "@/app/api/v1/career/career.constants";

// Define reusable schema parts
const { nonEmptyString, nonEmptyStringArray, validMongooseId, validDate, filesValidator } = schemaShared;
const { titleMaxCharacter, allowedMimeTypes, allowedBannerFileSize } = careerConstants;

const title = nonEmptyString('School career title', titleMaxCharacter);
const subTitle = nonEmptyString('School career sub title', titleMaxCharacter);
const description = nonEmptyString('School career description');
const id = validMongooseId('School career ID');
const files = filesValidator('School career files', allowedMimeTypes, allowedBannerFileSize, 1, 10);
const date = validDate('School career date');

// Define the Zod validation schema
const createSchema = z.object({
    title,
    subTitle,
    description,
    date,
    files,
}).strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const getDataByQuery = z.object({
    id: id.optional(),
    title: title.optional(),
    subTitle: subTitle.optional(),
    description: description.optional(),
    date: date.optional(),
    createdAt: validDate('School career creation time').optional(),
    updatedAt: validDate('School career last update time').optional(),
}).strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const updateSchema = z.object({
    id,
    title: title.optional(),
    subTitle: subTitle.optional(),
    description: description.optional(),
    date: date.optional(),
    files: files.optional(),
    deleteFiles: nonEmptyStringArray('ID of the file that will be deleted').optional(),
})
    .strict() // Enforce strict mode to disallow extra fields
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message: 'At least one of "title" or "description" is required along with "id".',
        }
    );

const careerSchema = {
    createSchema,
    getDataByQuery,
    updateSchema,
};

export default careerSchema;
