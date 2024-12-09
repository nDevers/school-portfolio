import { z } from 'zod';

import schemaShared from "@/shared/schema.shared";
import announcementConstants from "@/app/api/v1/announcement/announcement.constants";

// Define reusable schema parts
const { nonEmptyString, nonEmptyStringArray, enumValidation, validMongooseId, validDate, filesValidator, booleanString } = schemaShared;
const { titleMaxCharacter, descriptionMaxCharacter, allowedCategories, allowedMimeTypes, allowedFileSize } = announcementConstants;

const title = (fieldName) => nonEmptyString(`${fieldName} title`, titleMaxCharacter);
const description = (fieldName) => nonEmptyString(`${fieldName} description`, descriptionMaxCharacter);
const id = (fieldName) => validMongooseId(`${fieldName} ID`);
const categoryParams = (fieldName) => enumValidation(`${fieldName} category parameter`, allowedCategories);
const files = (fieldName) => filesValidator(`${fieldName} files`, allowedMimeTypes, allowedFileSize, 1, 10);
const deleteFiles = (fieldName) => nonEmptyStringArray(`${fieldName} IDs of the file that will be deleted`, titleMaxCharacter)
const date = (fieldName) => validDate(`${fieldName} date`);
const advertiseMailTime = (fieldName) => validDate(`${fieldName} date`);
const isHeadline = (fieldName) => booleanString(`${fieldName} is headline`);
const isAdvertise = (fieldName) => booleanString(`${fieldName} is advertise`);

// Define the Zod validation schema
const createSchema = (fieldName) => z.object({
    categoryParams: categoryParams(fieldName),
    title: title(fieldName),
    description: description(fieldName),
    files: files(fieldName),
    date: date(fieldName),
    isHeadline: isHeadline(fieldName),
    isAdvertise: isAdvertise(fieldName),
    advertiseMailTime: advertiseMailTime(fieldName),
}).strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const getDataByQuery = (fieldName) => z.object({
    id: id(fieldName).optional(),
    categoryParams: categoryParams(fieldName).optional(),
    title: title(fieldName).optional(),
    description: description(fieldName).optional(),
    createdAt: validDate(`${fieldName} creation time`).optional(),
    updatedAt: validDate(`${fieldName} last update time`).optional(),
    date: date(fieldName),
    isHeadline: isHeadline(fieldName).optional(),
    isAdvertise: isAdvertise(fieldName).optional(),
    advertiseMailTime: advertiseMailTime(fieldName).optional(),
}).strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const updateSchema = (fieldName) => z.object({
    id: id(fieldName),
    categoryParams: categoryParams(fieldName),
    category: categoryParams(fieldName).optional(),
    title: title(fieldName).optional(),
    description: description(fieldName).optional(),
    files: files(fieldName).optional(),
    deleteFiles: deleteFiles(fieldName).optional(),
    date: date(fieldName).optional(),
    isHeadline: isHeadline(fieldName).optional(),
    isAdvertise: isAdvertise(fieldName).optional(),
    advertiseMailTime: advertiseMailTime(fieldName).optional(),
})
    .strict() // Enforce strict mode to disallow extra fields
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message: 'At least one of "category", "title", "description", "files", "date" or "isHeadline" is required along with "id" and "categoryParams".',
        }
    );

const categorySchema = (fieldName) => z.object({
    categoryParams: categoryParams(fieldName),
}).strict();

const categoryAndIdSchema = (fieldName) => z.object({
    categoryParams: categoryParams(fieldName),
    id: id(fieldName),
}).strict();

const announcementSchema = {
    createSchema,
    getDataByQuery,
    updateSchema,

    categorySchema,
    categoryAndIdSchema,
};

export default announcementSchema;
