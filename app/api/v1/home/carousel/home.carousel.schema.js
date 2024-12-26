'use strict';

import { z } from 'zod';

import schemaShared from '@/shared/schema.shared';
import homeCarouselConstants from '@/app/api/v1/home/carousel/home.carousel.constants';

const { nonEmptyStringArray, filesValidator } = schemaShared;
const { allowedMimeTypes, allowedImageFileSize, maxImage } =
    homeCarouselConstants;

/**
 * Validates and manages the uploaded files for the "Home carousel images" feature.
 *
 * This variable uses a file validator function to ensure the uploaded images meet the required specifications.
 * It ensures the uploaded files are of correct MIME types, within the allowed file size, and limits the
 * number of images that can be uploaded.
 *
 * Rules and Parameters:
 * - Name: Home carousel images
 * - Allowed MIME types: Defined by `allowedMimeTypes`
 * - Maximum file size: Defined by `allowedImageFileSize`
 * - Minimum number of images: 1
 * - Maximum number of images: Defined by `maxImage`
 *
 * Used to manage and verify the home page carousel image uploads.
 */
const images = filesValidator(
    'Home carousel images',
    allowedMimeTypes,
    allowedImageFileSize,
    1,
    maxImage
);

/**
 * `createSchema` is a schema definition created using the `zod` library.
 * It ensures strict validation of an object containing specific properties.
 *
 * The schema:
 * - Validates that the object includes an `images` property.
 * - Enforces strict mode to disallow additional unexpected properties.
 */
const createSchema = z
    .object({
        images,
    })
    .strict(); // Enforce strict mode to disallow extra fields

/**
 * Update schema definition that validates the structure of an update request.
 *
 * This schema ensures that the provided object adheres to specific validation rules:
 * - Enforces strict mode to disallow extra fields that are not defined in the schema.
 * - Allows optional `images` and `deleteImages` fields.
 * - Validates that at least one of "images" or "deleteImages" is present in the object.
 *
 * Validation Rules:
 * - The `images` field is optional.
 * - The `deleteImages` field is an optional non-empty array of strings, each representing the ID of an image to delete.
 * - The object must contain at least one property in addition to `id` for it to be valid.
 *
 * Error Behavior:
 * - If neither `images` nor `deleteImages` is provided, an error message will indicate that at least one is required.
 */
const updateSchema = z
    .object({
        images: images.optional(),
        deleteImages: nonEmptyStringArray(
            'ID of the image that will be deleted'
        ).optional(),
    })
    .strict() // Enforce strict mode to disallow extra fields
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message: 'At least one of "images" or "deleteImages" is required.',
        }
    );

/**
 * Represents the schema for the home carousel component.
 * This object includes functionalities for schema creation and updating.
 *
 * @property {Function} createSchema - A method or utility responsible for creating the schema for the home carousel.
 * @property {Function} updateSchema - A method or utility responsible for updating the schema for the home carousel.
 */
const homeCarouselSchema = {
    createSchema,
    updateSchema,
};

export default homeCarouselSchema;
