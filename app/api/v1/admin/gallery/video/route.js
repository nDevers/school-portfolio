import { GalleryVideoModel } from '@/shared/prisma.model.shared';
import galleryVideoSchema from '@/app/api/v1/gallery/video/gallery.video.schema';
import galleryVideoConstants from '@/app/api/v1/gallery/video/gallery.video.constants';
import sharedResponseTypes from '@/shared/shared.response.types';

import asyncHandler from '@/util/asyncHandler';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import validateToken from '@/util/validateToken';
import galleryVideoSelectionCriteria from '@/app/api/v1/gallery/video/gallery.video.selection.criteria';

const { INTERNAL_SERVER_ERROR, CONFLICT, CREATED } = sharedResponseTypes;

/**
 * Represents the criteria used to select videos in a gallery. This variable
 * is typically assigned the result of invoking the `galleryVideoSelectionCriteria` function,
 * which determines how videos should be filtered or chosen.
 *
 * The selection criteria may include various parameters or configurations
 * to define how the gallery videos are selected.
 */
const selectionCriteria = galleryVideoSelectionCriteria();

/**
 * Creates a new gallery video entry in the database and retrieves the newly created entry.
 *
 * @async
 * @function createGalleryVideoEntry
 * @param {Object} userInput - The input data containing the details of the gallery video entry to be created.
 * @param {Object} request - The incoming request object providing context for the operation.
 * @returns {Promise<Object>} A response object indicating success or failure of the operation. On success, it includes the created gallery video entry details.
 * @throws {Error} If the creation process fails or the created document cannot be retrieved.
 */
const createGalleryVideoEntry = async (userInput, request) => {
    const newDocument = await GalleryVideoModel.create({
        data: userInput,
        select: {
            id: true, // Only return the ID of the updated document
        },
    });

    const createdDocument = await GalleryVideoModel.findUnique({
        where: {
            id: newDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!createdDocument?.id) {
        return INTERNAL_SERVER_ERROR(
            `Failed to create gallery video entry with title "${userInput?.title}".`,
            request
        );
    }

    // No need for an aggregation pipeline; Prisma returns the created document
    return CREATED(
        `Gallery video entry with title "${userInput?.title}" created successfully.`,
        createdDocument,
        request
    );
};

/**
 * Handles the creation of a new gallery video entry.
 *
 * This asynchronous function performs the following actions:
 * - Validates the content type of the request to ensure it matches the allowed content types.
 * - Validates the user's authorization to ensure they have the necessary admin privileges.
 * - Parses and validates the form data against the defined schema for creating a gallery video entry.
 * - Checks if a gallery video entry with the same title already exists in the database.
 * - If all validations pass, creates a new gallery video entry and returns the appropriate response.
 *
 * @param {Object} request - The inbound request object containing data for creating a gallery video.
 * @param {Object} context - The context object providing additional environment-specific information.
 * @returns {Object} Response object indicating success or failure of the operation.
 */
const handleCreateGalleryVideo = async (request, context) => {
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
        'create',
        galleryVideoSchema.createSchema
    );

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

    // Create the FAQ entry and send the response
    return createGalleryVideoEntry(userInput, request);
};

/**
 * POST is an asynchronous middleware function that handles HTTP POST requests.
 * It utilizes an async handler to manage errors during the process of creating a new gallery video.
 * This function expects necessary data to be provided in the request for creating the gallery video.
 *
 * The asyncHandler is a wrapper that simplifies error handling by passing any errors to the next middleware.
 * handleCreateGalleryVideo contains the main logic for creating a gallery video resource.
 *
 * Usage of POST facilitates the creation of new resources in a gallery video collection through HTTP requests.
 */
export const POST = asyncHandler(handleCreateGalleryVideo);
