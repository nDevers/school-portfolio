import { z } from 'zod';

import schemaShared from "@/shared/schema.shared";
import aboutConstants from "@/app/api/v1/about-us/about.us.constants";

// Define reusable schema parts
const { nonEmptyString, nonEmptyStringArray, validMongooseId, validDate, filesValidator } = schemaShared;
const { titleMaxCharacter, allowedFilesMimeTypes, allowedImagesMimeTypes, allowedFileSize } = aboutConstants;

const title = nonEmptyString('More about us title', titleMaxCharacter);
const description = nonEmptyString('More about us description');
const id = validMongooseId('More about us ID');
const files = filesValidator('More about us files', allowedFilesMimeTypes, allowedFileSize, 1, 10);
const images = filesValidator('More about us images', allowedImagesMimeTypes, allowedFileSize, 1, 10);

// Define the Zod validation schema
const createSchema = z.object({
    title,
    description,
    files,
    images,
}).strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const getDataByQuery = z.object({
    id: id.optional(),
    title: title.optional(),
    description: description.optional(),
    createdAt: validDate('More about us creation time').optional(),
    updatedAt: validDate('More about us last update time').optional(),
}).strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const updateSchema = z.object({
    id,
    title: title.optional(),
    description: description.optional(),
    files: files.optional(),
    images: files.optional(),
    deleteFiles: nonEmptyStringArray('ID of the file that will be deleted').optional(),
    deleteImages: nonEmptyStringArray('ID of the image that will be deleted').optional(),
})
    .strict() // Enforce strict mode to disallow extra fields
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message: 'At least one of "title" or "description" is required along with "id".',
        }
    );

const aboutUsSchema = {
    createSchema,
    getDataByQuery,
    updateSchema,
};

export default aboutUsSchema;
