import { z } from 'zod';

import schemaShared from "@/shared/schema.shared";
import schoolInfoConstants from "@/app/api/v1/school/info/school.info.constants";

// Define reusable schema parts
const { nonEmptyString, validMongooseId, validDate, filesValidator } = schemaShared;
const { titleMaxCharacter, allowedMimeTypes, allowedBannerFileSize } = schoolInfoConstants;

const title = nonEmptyString('School info title', titleMaxCharacter);
const description = nonEmptyString('School info description');
const id = validMongooseId('School info ID');
const icon = filesValidator('School info icon', allowedMimeTypes, allowedBannerFileSize, 1, 1);

// Define the Zod validation schema
const createSchema = z.object({
    title,
    description,
    icon,
}).strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const getDataByQuery = z.object({
    id: id.optional(),
    title: title.optional(),
    description: description.optional(),
    createdAt: validDate('School info creation time').optional(),
    updatedAt: validDate('School info last update time').optional(),
}).strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const updateSchema = z.object({
    id,
    title: title.optional(),
    description: description.optional(),
    icon: icon.optional(),
})
    .strict() // Enforce strict mode to disallow extra fields
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message: 'At least one of "title" or "description" is required along with "id".',
        }
    );

const schoolInfoSchema = {
    createSchema,
    getDataByQuery,
    updateSchema,
};

export default schoolInfoSchema;
