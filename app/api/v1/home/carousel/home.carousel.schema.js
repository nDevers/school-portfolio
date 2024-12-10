import { z } from 'zod';

import schemaShared from "@/shared/schema.shared";
import careerConstants from "@/app/api/v1/career/career.constants";

// Define reusable schema parts
const { nonEmptyStringArray, filesValidator } = schemaShared;
const { allowedMimeTypes, allowedImageFileSize } = careerConstants;

const images = filesValidator('Home carousel images', allowedMimeTypes, allowedImageFileSize, 1, 10);

// Define the Zod validation schema
const createSchema = z.object({
    images,
}).strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const updateSchema = z.object({
    images: images.optional(),
    deleteImages: nonEmptyStringArray('ID of the image that will be deleted').optional(),
})
    .strict() // Enforce strict mode to disallow extra fields
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message: 'At least one of "images" or "deleteImages" is required.',
        }
    );

const homeCarouselSchema = {
    createSchema,
    updateSchema,
};

export default homeCarouselSchema;
