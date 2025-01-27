'use strict';

import { GalleryPhotoModel } from '@/shared/prisma.model.shared';
import galleryPhotoSchema from '@/app/api/v1/gallery/photo/gallery.photo.schema';
import galleryPhotoConstants from '@/app/api/v1/gallery/photo/gallery.photo.constants';
import sharedResponseTypes from '@/shared/shared.response.types';
import localFileOperations from '@/util/localFileOperations';
import schemaShared from '@/shared/schema.shared';

import asyncHandler from '@/util/asyncHandler';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import galleryPhotoSelectionCriteria from '@/app/api/v1/gallery/photo/gallery.photo.selection.criteria';

const { INTERNAL_SERVER_ERROR, NOT_FOUND, CONFLICT, OK } = sharedResponseTypes;
const { idValidationSchema } = schemaShared;

/**
 * Asynchronously updates a gallery photo entry with the specified user input.
 *
 * This function filters the provided `userInput` to include only fields with non-null values,
 * excluding the `id` field. The filtered fields are then used to update the specified gallery
 * photo entry in the database. After updating, the function retrieves the updated document
 * with a defined selection criteria and returns it. If no document is found or the update fails,
 * an error response is returned.
 *
 * @param {Object} userInput - An object containing the fields to update and the ID of the entry to be updated.
 *                             Only non-null values in this object are considered for the update.
 *                             The `id` property specifies the entry to be updated.
 * @param {Object} request - The client request object, used for creating response data.
 *
 * @returns {Promise<Object>} - A promise that resolves with the updated gallery photo entry
 *                               and a success message if the update is successful.
 *                               Returns an error response if the update fails or the entry is not found.
 */
const updateGalleryPhotoEntry = async (userInput, request) => {
    // Filter `userInput` to only include fields with non-null values
    const fieldsToUpdate = Object.keys(userInput).reduce((acc, key) => {
        if (
            userInput[key] !== undefined &&
            userInput[key] !== null &&
            key !== 'id'
        ) {
            acc[key] = userInput[key];
        }
        return acc;
    }, {});

    // Update the document with the filtered data
    const updateDocument = await GalleryPhotoModel.update({
        where: { id: userInput?.id },
        data: fieldsToUpdate,
        select: {
            id: true, // Only return the ID of the updated document
        },
    });

    const selectionCriteria = galleryPhotoSelectionCriteria();

    const updatedDocument = await GalleryPhotoModel.findUnique({
        where: {
            id: updateDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!updatedDocument?.id) {
        return INTERNAL_SERVER_ERROR(
            `Failed to update gallery photo entry with the ID "${userInput?.id}".`,
            request
        );
    }

    return OK(
        `Gallery photo entry with the ID "${userInput?.id}" updated successfully.`,
        updatedDocument,
        request
    );
};

/**
 * Handles the update of a gallery photo entry by its ID.
 *
 * This function performs a series of operations to validate the update request,
 * process the provided data, handle image uploads and deletions, and update
 * the gallery photo entry in the database.
 *
 * Process Overview:
 * 1. Validates the request's content type against allowed content types.
 * 2. Verifies user authorization to ensure the request comes from an authorized user.
 * 3. Parses and validates the form data based on the update schema.
 * 4. Ensures the gallery photo entry with the specified ID exists in the database.
 * 5. Validates that there is no duplicate entry with the same title, if a new title is provided.
 * 6. Manages image uploads and constructs a proper list of images for the entry.
 * 7. Handles deletion of specified images:
 *    - Checks that all specified images for deletion exist in the current gallery photo entry.
 *    - Physically deletes the images and updates the images list in the database.
 * 8. Updates the gallery photo entry with the modified data.
 *
 * @param {Object} request - The incoming request object containing necessary data for the update operation.
 * @param {Object} context - The context object providing metadata or additional configuration for the request handling.
 * @returns {Object} The result of the update operation, including success or error details.
 */
const handleUpdateGalleryPhotoById = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(
        request,
        galleryPhotoConstants.allowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Validate if the user is authorized (admin)
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'update',
        galleryPhotoSchema.updateSchema
    );

    // Check if FAQ entry with the same title already exists
    const existingGalleryPhoto = await GalleryPhotoModel.findUnique({
        where: {
            id: userInput?.id,
        },
        select: {
            id: true,
            images: true,
        },
    });
    if (!existingGalleryPhoto) {
        return NOT_FOUND(
            `Gallery photo entry with ID "${userInput?.id}" not found.`,
            request
        );
    }

    if (userInput?.title) {
        // Check if FAQ entry with the same title already exists
        const existingQuestion = await GalleryPhotoModel.findUnique({
            where: {
                title: userInput?.title,
            },
            select: {
                id: true,
            },
        });
        if (existingQuestion) {
            return CONFLICT(
                `Gallery photo entry with title "${userInput?.title}" already exists.`,
                request
            );
        }
    }

    if (userInput?.images?.length > 0) {
        // Upload images and construct the `images` array for documents
        const images = await Promise.all(
            (userInput[galleryPhotoConstants.imagesFieldName] || []).map(
                async (imageEntry) => {
                    // Call your image upload operation
                    const { fileId, fileLink } =
                        await localFileOperations.uploadFile(
                            request,
                            imageEntry
                        );
                    return {
                        imageId: fileId,
                        image: fileLink,
                    };
                }
            )
        );

        userInput.images = images;
    }

    let images = {};

    if (userInput?.deleteImages && Array.isArray(userInput.deleteImages)) {
        // Check if all images in deleteImages actually exist in the current images array
        const nonExistingFiles = userInput.deleteImages.filter(
            (imageId) =>
                !existingGalleryPhoto?.images?.some(
                    (image) => image.imageId === imageId
                )
        );

        if (nonExistingFiles.length > 0) {
            // If any image to be deleted is not found in the database, return 404 with the missing image IDs
            return NOT_FOUND(
                `File(s) with IDs [${nonExistingFiles.join(', ')}] not found in the database.`,
                request
            );
        }

        // Create an array of promises for each image deletion
        const deletePromises = userInput.deleteImages.map((imageId) => {
            return localFileOperations.deleteFile(imageId); // Delete the image physically
        });

        // Filter out images that are being deleted (those in deleteImages)
        images = existingGalleryPhoto?.images?.filter(
            (image) => !userInput.deleteImages.includes(image?.imageId)
        );

        // Delete the images physically using Promise.all
        await Promise.all(deletePromises);

        // After deletion, update the database to remove the deleted image objects
        await GalleryPhotoModel.update({
            where: { id: existingGalleryPhoto.id }, // Assuming the record is identified by id
            data: {
                images, // Update the images field in the database, only keeping non-deleted images
            },
        });

        delete userInput.deleteImages; // Remove deleteImages field from userInput
    }

    // Create the FAQ entry and send the response
    return updateGalleryPhotoEntry(userInput, request);
};

/**
 * Asynchronous function to delete a gallery photo by its unique ID.
 * This function validates the authorization token, parses and validates input data,
 * checks the existence of the gallery photo, deletes associated images physically,
 * and removes the database entry corresponding to the given ID.
 *
 * @param {Object} request - The incoming request object containing required details for processing the deletion.
 * @param {Object} context - Additional contextual information to access helper functions and utilities.

 * @returns {Object} - Returns a response object indicating success or failure, including appropriate status codes and messages.
 *
 * Function Workflow:
 * 1. Validates the incoming authorization token to ensure administrative access.
 * 2. Parses and validates the form data from the request using a pre-defined schema (`idValidationSchema`).
 * 3. Confirms whether a gallery photo entry exists in the database for the given ID.
 * 4. Deletes associated images physically using file operations, if any images are linked to the entry.
 * 5. Deletes the gallery photo entry in the database.
 **/
const deleteGalleryPhotoById = async (request, context) => {
    // Validate admin
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response; // Return early with the authorization failure response
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'delete',
        idValidationSchema
    );

    // Check if data exists
    const data = await GalleryPhotoModel.findUnique({
        where: {
            id: userInput?.id,
        },
        select: {
            id: true, // Only return the ID of the deleted document
            images: true,
        },
    });
    if (!data) {
        return NOT_FOUND(
            `Gallery photo entry with ID "${userInput?.id}" not found.`,
            request
        );
    }

    if (data?.images?.length) {
        // Create an array of promises for each image deletion
        const deleteImagesPromises = data.images.map((image) => {
            return localFileOperations.deleteFile(image?.imageId); // Delete the image physically
        });

        // Delete the images physically using Promise.all
        await Promise.all(deleteImagesPromises);
    }

    // Perform the deletion with the specified projection field for optional image handling
    await GalleryPhotoModel.delete({
        where: {
            id: userInput?.id,
        },
    });

    // If no document is found, send a 404 response
    const deletedData = await GalleryPhotoModel.findUnique({
        where: {
            id: userInput?.id,
        },
        select: {
            id: true, // Only return the ID of the deleted document
        },
    });
    if (deletedData) {
        return NOT_FOUND(
            `Failed to delete gallery photo entry with ID "${userInput?.id}".`,
            request
        );
    }

    // Send a success response
    return OK(
        `Gallery photo entry with ID "${userInput?.id}" deleted successfully.`,
        {},
        request
    );
};

/**
 * PATCH is an asynchronous function assigned to handle the process of updating a gallery photo by its unique identifier.
 * It is wrapped with `asyncHandler` to handle any asynchronous errors that may occur during execution.
 * The underlying logic for this function resides in `handleUpdateGalleryPhotoById`.
 */
export const PATCH = asyncHandler(handleUpdateGalleryPhotoById);

/**
 * DELETE is an asynchronous handler function that removes a gallery photo by its identifier.
 * It utilizes the `deleteGalleryPhotoById` function to perform the deletion operation.
 *
 * The handler ensures asynchronous errors are properly managed and passed to the error-handling middleware.
 */
export const DELETE = asyncHandler(deleteGalleryPhotoById);
