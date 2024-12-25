import { GalleryVideoModel } from '@/shared/prisma.model.shared';
import galleryVideoSchema from '@/app/api/v1/gallery/video/gallery.video.schema';
import galleryVideoConstants from '@/app/api/v1/gallery/video/gallery.video.constants';
import sharedResponseTypes from '@/shared/shared.response.types';
import serviceShared from '@/shared/service.shared';

import asyncHandler from '@/util/asyncHandler';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import galleryVideoSelectionCriteria from '@/app/api/v1/gallery/video/gallery.video.selection.criteria';

const { INTERNAL_SERVER_ERROR, NOT_FOUND, CONFLICT, OK } = sharedResponseTypes;

/**
 * Represents the criteria used to select videos in a gallery.
 *
 * The `selectionCriteria` variable contains specific conditions or filters
 * that determine which videos should be included or displayed in a gallery.
 * It is initialized using the `galleryVideoSelectionCriteria()` function,
 * which sets up the rules or parameters for selecting the videos.
 *
 * This variable is typically used in functionalities where filtering, sorting,
 * or identifying specific videos based on defined criteria is required.
 */
const selectionCriteria = galleryVideoSelectionCriteria();

/**
 * Asynchronously updates a gallery video entry in the data store with specified fields.
 *
 * This function accepts user input, filters out any null or undefined fields (except the `id`),
 * and applies the updates to the corresponding entry identified by its `id`.
 * It returns the updated record upon successful execution or an error response
 * if the update operation fails.
 *
 * @param {Object} userInput - The input object containing fields to update along with the `id` of the entry.
 *                             Fields with `null` or `undefined` values are ignored.
 * @param {Object} request - The request context object used for logging or meta operations.
 * @returns {Promise<Object>} - A promise resolving to the response object with the status, message,
 *                              and the updated entry upon success. Returns an error response if the update fails.
 * @throws {Error} - Throws an error if the operation encounters an unexpected issue with the data update.
 */
const updateGalleryVideoEntry = async (userInput, request) => {
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
    const updateDocument = await GalleryVideoModel.update({
        where: { id: userInput?.id },
        data: fieldsToUpdate,
        select: {
            id: true, // Only return the ID of the updated document
        },
    });

    const updatedDocument = await GalleryVideoModel.findUnique({
        where: {
            id: updateDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!updatedDocument?.id) {
        return INTERNAL_SERVER_ERROR(
            `Failed to update gallery video entry with the ID "${userInput?.id}".`,
            request
        );
    }

    return OK(
        `Gallery video entry with the ID "${userInput?.id}" updated successfully.`,
        updatedDocument,
        request
    );
};

/**
 * Handles the update of a gallery video entry by its ID.
 *
 * This function performs the following operations:
 * 1. Validates the content type of the incoming request against allowed content types.
 * 2. Authenticates the user by validating the provided token, ensuring they have proper permissions.
 * 3. Parses and validates the form data based on a predefined schema.
 * 4. Checks whether a gallery video entry with the specified ID exists in the database.
 * 5. Verifies if the title already exists for another gallery video, preventing duplicate entries.
 * 6. Manages YouTube links:
 *    - Deletes specified YouTube links if they exist in the current entry.
 *    - Returns an error if any link specified for deletion is not found.
 *    - Adds new YouTube links and ensures there are no duplicate entries.
 *
 * If all validations and operations are successful, the gallery video entry is updated based on the provided input.
 *
 * @param {Object} request - The HTTP request object containing necessary data and parameters.
 * @param {Object} context - The context object containing execution-specific details.
 * @returns {Promise<Object>} A response object containing the outcome of the update operation.
 */
const handleUpdateGalleryVideoById = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(
        request,
        galleryVideoConstants.allowedContentTypes
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
        galleryVideoSchema.updateSchema
    );

    // Check if FAQ entry with the same title already exists
    const existingGalleryVideo = await GalleryVideoModel.findUnique({
        where: {
            id: userInput?.id,
        },
        select: {
            id: true,
            youtubeLinks: true,
        },
    });
    if (!existingGalleryVideo) {
        return NOT_FOUND(
            `Gallery video entry with ID "${userInput?.id}" not found.`,
            request
        );
    }

    if (userInput?.title) {
        // Check if FAQ entry with the same title already exists
        const existingQuestion = await GalleryVideoModel.findUnique({
            where: {
                title: userInput?.title,
            },
            select: {
                id: true,
            },
        });
        if (existingQuestion) {
            return CONFLICT(
                `Gallery video entry with title "${userInput?.title}" already exists.`,
                request
            );
        }
    }

    // Handle deletion of specific YouTube links
    let updatedYoutubeLinks = existingGalleryVideo.youtubeLinks || [];
    if (userInput?.deleteYoutubeLinks?.length > 0) {
        // Ensure only existing YouTube links are being deleted
        const nonExistingLinks = userInput.deleteYoutubeLinks.filter(
            (link) => !updatedYoutubeLinks.includes(link)
        );

        if (nonExistingLinks.length > 0) {
            return NOT_FOUND(
                `YouTube link(s) [${nonExistingLinks.join(', ')}] not found in the database.`,
                request
            );
        }

        // Remove specified links from the current list
        updatedYoutubeLinks = updatedYoutubeLinks.filter(
            (link) => !userInput.deleteYoutubeLinks.includes(link)
        );
    }

    // Add new YouTube links (if provided)
    if (userInput?.youtubeLinks?.length > 0) {
        updatedYoutubeLinks = [
            ...new Set([...updatedYoutubeLinks, ...userInput.youtubeLinks]),
        ]; // Ensure no duplicates
    }

    userInput.youtubeLinks = updatedYoutubeLinks;

    delete userInput.deleteYoutubeLinks;

    // Create the FAQ entry and send the response
    return updateGalleryVideoEntry(userInput, request);
};

/**
 * Asynchronous function to delete a gallery video entry by its unique identifier.
 *
 * This function interfaces with a shared service to remove a gallery video.
 * It utilizes the provided request and context to identify and authorize
 * the deletion operation. The model is specified implicitly within the service
 * call, and the operation targets entries classified as 'Gallery video'.
 *
 * @function deleteGalleryVideoById
 * @async
 * @param {Object} request - The request object containing identifiers and metadata needed for deletion.
 * @param {Object} context - The context object providing information about the caller or execution environment.
 * @returns {Promise<Object>} Resolves with a result object that confirms deletion or contains relevant data.
 */
const deleteGalleryVideoById = async (request, context) => {
    return serviceShared.deleteEntryById(
        request,
        context,
        GalleryVideoModel,
        '',
        'Gallery video'
    );
};

/**
 * PATCH is an asynchronous middleware function used to handle HTTP PATCH requests.
 * It utilizes the `asyncHandler` utility to wrap the `handleUpdateGalleryVideoById` function,
 * ensuring proper error handling for asynchronous operations.
 *
 * This handler is responsible for processing updates to a specific gallery video
 * resource by its identifier. It expects the necessary request data to be
 * included in the HTTP PATCH request body or parameters.
 *
 * @constant {Function} PATCH
 */
export const PATCH = asyncHandler(handleUpdateGalleryVideoById);

/**
 * Asynchronous function for handling the deletion of a gallery video by its ID.
 * This variable utilizes an async handler to manage the asynchronous execution
 * of the `deleteGalleryVideoById` function, providing error handling and ensuring
 * proper execution in a controlled environment.
 *
 * The function passed to this variable is intended to handle HTTP request and
 * response objects, specifically for deleting a video resource from a gallery.
 * Error handling is managed via the async handler.
 *
 * @constant {Function} DELETE
 */
export const DELETE = asyncHandler(deleteGalleryVideoById);
