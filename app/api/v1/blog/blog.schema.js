import { z } from 'zod';

import schemaShared from "@/shared/schema.shared";
import blogConstants from "@/app/api/v1/blog/blog.constants";

// Define reusable schema parts
const { nonEmptyString, nonEmptyStringArray, validMongooseId, validDate, filesValidator } = schemaShared;
const { titleMaxCharacter, allowedBannerMimeTypes, allowedFilesMimeTypes, allowedImagesMimeTypes, allowedFileSize } = blogConstants;

const title = nonEmptyString('Blog title', titleMaxCharacter);
const description = nonEmptyString('Blog description');
const id = validMongooseId('Blog ID');
const banner = filesValidator('Blog banner', allowedBannerMimeTypes, allowedFileSize, 1, 1);
const files = filesValidator('Blog files', allowedFilesMimeTypes, allowedFileSize, 1, 10);
const images = filesValidator('Blog images', allowedImagesMimeTypes, allowedFileSize, 1, 10);
const date = validDate('Blog date');

// Define the Zod validation schema
const createSchema = z.object({
    title,
    description,
    banner,
    files,
    images,
    date,
}).strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const getDataByQuery = z.object({
    id: id.optional(),
    title: title.optional(),
    description: description.optional(),
    createdAt: validDate('Blog creation time').optional(),
    updatedAt: validDate('Blog last update time').optional(),
    date: date.optional(),
}).strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const updateSchema = z.object({
    id,
    title: title.optional(),
    description: description.optional(),
    banner: banner.optional(),
    files: files.optional(),
    images: images.optional(),
    deleteFiles: nonEmptyStringArray('The IDs of the files that will be deleted').optional(),
    deleteImages: nonEmptyStringArray('The IDs of the images that will be deleted').optional(),
    date: date.optional(),
})
    .strict() // Enforce strict mode to disallow extra fields
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message: 'At least one of "title", "description", "banner", "files", "images", "deleteFiles", "deleteImages" or "date" is required along with "id".',
        }
    );

const blogSchema = {
    createSchema,
    getDataByQuery,
    updateSchema,
};

export default blogSchema;
