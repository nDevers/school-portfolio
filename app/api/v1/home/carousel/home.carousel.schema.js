import { z } from 'zod';

import schemaShared from "@/shared/schema.shared";
import homeCarouselConstants from "@/app/api/v1/home/carousel/home.carousel.constants";

// Define reusable schema parts
const { nonEmptyStringArray, filesValidator } = schemaShared;
const { allowedMimeTypes, allowedImageFileSize, maxImage } = homeCarouselConstants;

const images = filesValidator('Home carousel images', allowedMimeTypes, allowedImageFileSize, 1, maxImage);

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
