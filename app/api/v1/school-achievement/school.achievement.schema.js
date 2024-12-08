import { z } from 'zod';

import schemaShared from "@/shared/schema.shared";
import schoolAchievementConstants from "@/app/api/v1/school-achievement/school.achievement.constants";

// Define reusable schema parts
const { nonEmptyString, validMongooseId, validDate, filesValidator } = schemaShared;
const { titleMaxCharacter, allowedMimeTypes, allowedBannerFileSize } = schoolAchievementConstants;

const title = nonEmptyString('School achievement title', titleMaxCharacter);
const description = nonEmptyString('School achievement description');
const id = validMongooseId('School achievement ID');
const icon = filesValidator('School achievement icon', allowedMimeTypes, allowedBannerFileSize, 1, 1);

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
    createdAt: validDate('School achievement creation time').optional(),
    updatedAt: validDate('School achievement last update time').optional(),
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

const schoolAchievementSchema = {
    createSchema,
    getDataByQuery,
    updateSchema,
};

export default schoolAchievementSchema;
