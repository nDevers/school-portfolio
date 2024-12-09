import { z } from 'zod';

import schemaShared from "@/shared/schema.shared";
import academicConstants from "@/app/api/v1/academic/academic.constants";

// Define reusable schema parts
const { nonEmptyString, enumValidation, validMongooseId, validDate, filesValidator } = schemaShared;
const { titleMaxCharacter, allowedCategories, allowedFilesMimeTypes, allowedFileSize } = academicConstants;

const title = (fieldName) => nonEmptyString(`${fieldName} title`, titleMaxCharacter);
const description = (fieldName) => nonEmptyString(`${fieldName} description`);
const id = (fieldName) => validMongooseId(`${fieldName} ID`);
const categoryParams = (fieldName) => enumValidation(`${fieldName} parameter`, allowedCategories);
const file = (fieldName) => filesValidator(`${fieldName} file`, allowedFilesMimeTypes, allowedFileSize, 1, 1);
const publishDate = (fieldName) => validDate(`${fieldName} publish date`);
const badge = (fieldName) => nonEmptyString(`${fieldName} badge`);

// Define the Zod validation schema
const createSchema = (fieldName) => z.object({
    categoryParams: title(fieldName),
    title: title(fieldName),
    description: description(fieldName),
    file: file(fieldName),
    publishDate: publishDate(fieldName),
    badge: badge(fieldName)
}).strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const getDataByQuery = (fieldName) => z.object({
    id: id(fieldName).optional(),
    categoryParams: categoryParams(fieldName).optional(),
    title: title(fieldName).optional(),
    description: description(fieldName).optional(),
    createdAt: validDate(`${fieldName} creation time`).optional(),
    updatedAt: validDate(`${fieldName} last update time`).optional(),
    publishDate: publishDate(fieldName).optional(),
    badge: badge(fieldName).optional(),
}).strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const updateSchema = (fieldName) => z.object({
    id,
    categoryParams: categoryParams(fieldName),
    category: categoryParams(fieldName).optional(),
    title: title(fieldName).optional(),
    description: description(fieldName).optional(),
    file: file(fieldName).optional(),
    publishDate: publishDate(fieldName).optional(),
    badge: badge(fieldName).optional(),
})
    .strict() // Enforce strict mode to disallow extra fields
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message: 'At least one of "category", "title", "description", "file", "publishDate" or "badge" is required along with "id" and "categoryParams".',
        }
    );

const categorySchema = z.object({
    categoryParams: categoryParams('Category'),
}).strict();

const categoryAndIdSchema = z.object({
    categoryParams: categoryParams('Category'),
    id
}).strict();

const academicSchema = {
    createSchema,
    getDataByQuery,
    updateSchema,

    categorySchema,
    categoryAndIdSchema,
};

export default academicSchema;
