import { z } from 'zod';

import schemaShared from "@/shared/schema.shared";
import facultyConstants from "@/app/api/v1/faculty/faculty.constants";

// Define reusable schema parts
const { nonEmptyString, enumValidation, validMongooseId, validDate, filesValidator, validEmail, validMobileNumber, validUrl } = schemaShared;
const { nameMaxCharacter, designationMaxCharacter, allowedCategories, allowedMimeTypes, allowedFileSize } = facultyConstants;

const name = (fieldName) => nonEmptyString(`${fieldName} name`, nameMaxCharacter);
const designation = (fieldName) => nonEmptyString(`${fieldName} designation`, designationMaxCharacter);
const id = (fieldName) => validMongooseId(`${fieldName} ID`);
const categoryParams = (fieldName) => enumValidation(`${fieldName} category parameter`, allowedCategories);
const image = (fieldName) => filesValidator(`${fieldName} image`, allowedMimeTypes, allowedFileSize, 1, 1);
const email = (fieldName) => validEmail(`${fieldName} email`).optional();
const mobile = (fieldName) => validMobileNumber(`${fieldName} mobile`);
const portfolio = (fieldName) => validUrl(`${fieldName} portfolio`).optional();

// Define the Zod validation schema
const createSchema = (fieldName) => z.object({
    categoryParams: categoryParams(fieldName),
    name: name(fieldName),
    designation: designation(fieldName),
    image: image(fieldName),
    email: email(fieldName),
    mobile: mobile(fieldName),
    portfolio: portfolio(fieldName)
}).strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const getDataByQuery = (fieldName) => z.object({
    id: id(fieldName).optional(),
    categoryParams: categoryParams(fieldName).optional(),
    name: name(fieldName).optional(),
    designation: designation(fieldName).optional(),
    createdAt: validDate(`${fieldName} creation time`).optional(),
    updatedAt: validDate(`${fieldName} last update time`).optional(),
    email: email(fieldName),
    mobile: mobile(fieldName).optional(),
    portfolio: portfolio(fieldName)
}).strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const updateSchema = (fieldName) => z.object({
    id: id(fieldName),
    categoryParams: categoryParams(fieldName),
    category: categoryParams(fieldName).optional(),
    name: name(fieldName).optional(),
    designation: designation(fieldName).optional(),
    image: image(fieldName).optional(),
    email: email(fieldName),
    mobile: mobile(fieldName).optional(),
    portfolio: portfolio(fieldName)
})
    .strict() // Enforce strict mode to disallow extra fields
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message: 'At least one of "category", "name", "designation", "image", "email" or "mobile" is required along with "id" and "categoryParams".',
        }
    );

const categorySchema = (fieldName) => z.object({
    categoryParams: categoryParams(fieldName),
}).strict();

const categoryAndIdSchema = (fieldName) => z.object({
    categoryParams: categoryParams(fieldName),
    id: id(fieldName),
}).strict();

const facultySchema = {
    createSchema,
    getDataByQuery,
    updateSchema,

    categorySchema,
    categoryAndIdSchema,
};

export default facultySchema;
