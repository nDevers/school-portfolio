import { z } from 'zod';

import schemaShared from "@/shared/schema.shared";
import galleryPhotoConstants from "@/app/api/v1/gallery/photo/gallery.photo.constants";

// Define reusable schema parts
const { nonEmptyString, nonEmptyStringArray, validMongooseId, validDate, filesValidator } = schemaShared;
const { titleMaxCharacter, allowedMimeTypes, allowedBannerFileSize } = galleryPhotoConstants;

const title = nonEmptyString('Gallery photo title', titleMaxCharacter);
const description = nonEmptyString('Gallery photo description');
const id = validMongooseId('Gallery photo ID');
const images = filesValidator('Gallery photo images', allowedMimeTypes, allowedBannerFileSize, 1, 10);

// Define the Zod validation schema
const createSchema = z.object({
    title,
    description,
    images,
}).strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const getDataByQuery = z.object({
    id: id.optional(),
    title: title.optional(),
    description: description.optional(),
    createdAt: validDate('Gallery photo creation time').optional(),
    updatedAt: validDate('Gallery photo last update time').optional(),
}).strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const updateSchema = z.object({
    id,
    title: title.optional(),
    description: description.optional(),
    images: images.optional(),
    deleteImages: nonEmptyStringArray('ID of the image that will be deleted').optional(),
})
    .strict() // Enforce strict mode to disallow extra fields
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message: 'At least one of "title" or "description" is required along with "id".',
        }
    );

const configurationSchema = {
    createSchema,
    getDataByQuery,
    updateSchema,
};

export default configurationSchema;
