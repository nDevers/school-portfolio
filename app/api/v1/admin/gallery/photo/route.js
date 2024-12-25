import { PrismaClient } from '@prisma/client';

import galleryPhotoSchema from "@/app/api/v1/gallery/photo/gallery.photo.schema";
import galleryPhotoConstants from "@/app/api/v1/gallery/photo/gallery.photo.constants";
import sharedResponseTypes from "@/shared/shared.response.types";
import localFileOperations from "@/util/localFileOperations";

import asyncHandler from "@/util/asyncHandler";
import validateUnsupportedContent from "@/util/validateUnsupportedContent";
import parseAndValidateFormData from "@/util/parseAndValidateFormData";
import validateToken from "@/util/validateToken";
import galleryPhotoSelectionCriteria from "@/app/api/v1/gallery/photo/gallery.photo.selection.criteria";

/**
 * An instance of the PrismaClient used for database interactions.
 *
 * The PrismaClient is the primary interface for querying and mutating data
 * in the connected database. It provides methods for performing Create,
 * Read, Update, and Delete (CRUD) operations on the defined models.
 *
 * Prisma automatically generates this client based on the schema definition,
 * allowing you to work with your database seamlessly using an API tailored
 * to the models in your application.
 *
 * Ensure to properly manage the lifecycle of the prisma instance. In most
 * cases, avoid creating multiple instances during runtime, especially in
 * server environments, as it can lead to connection pool exhaustion or
 * performance degradation.
 *
 * It is important to call `prisma.$disconnect()` when the application
 * shuts down in order to close database connections cleanly.
 */
const prisma = new PrismaClient();

const { INTERNAL_SERVER_ERROR, CONFLICT, CREATED, NOT_FOUND } = sharedResponseTypes;

/**
 * Represents the `GalleryPhoto` model from Prisma schema.
 * This model is used to handle photo data associated with a gallery in the application.
 *
 * The `GalleryPhoto` model contains information about an individual photo,
 * including its related metadata and the gallery it belongs to.
 */
const model = prisma.GalleryPhoto;

/**
 * Asynchronously creates a new gallery photo entry in the database and retrieves the created document.
 *
 * This function uses the provided user input to create a new entry in the database, then fetches
 * the created document based on its ID using specific selection criteria. If the creation or
 * retrieval process fails, an error response is returned. Otherwise, a success response
 * containing the created document is provided.
 *
 * @param {Object} userInput - The input object containing data to create the gallery photo entry.
 * @param {Object} request - An object representing the incoming HTTP request.
 * @returns {Promise<Object>} - A promise that resolves to a success or failure response object
 * containing the result of the operation.
 */
const createGalleryPhotoEntry = async (userInput, request) => {
    const newDocument = await model.create({
        data: userInput,
        select: {
            id: true, // Only return the ID of the updated document
        },
    });

    const selectionCriteria = galleryPhotoSelectionCriteria();

    const createdDocument = await model.findUnique({
        where: {
            id: newDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!createdDocument?.id) {
        return INTERNAL_SERVER_ERROR(`Failed to create gallery photo entry with title "${userInput?.title}".`, request);
    }

    // No need for an aggregation pipeline; Prisma returns the created document
    return CREATED(`Gallery photo entry with title "${userInput?.title}" created successfully.`, createdDocument, request);
};

/**
 * Asynchronous handler for creating a gallery photo entry.
 *
 * This function performs a series of validation checks and processing steps:
 * - Validates the content type of the request against the allowed content types.
 * - Authenticates the user to ensure they have admin-level authorization.
 * - Parses and validates the incoming form data based on a predefined schema.
 * - Checks for the existence of a gallery photo entry with the same title to prevent duplication.
 * - Uploads image files and prepares metadata for storage.
 * - Creates a new gallery photo entry in the system and returns the appropriate response.
 *
 * @param {Object} request - The HTTP request object containing headers, body, and other data.
 * @param {Object} context - Additional context for the operation, provided by the execution framework.
 * @returns {Promise<Object>} A promise that resolves to an HTTP response object indicating the operation's outcome.
 */
const handleCreateGalleryPhoto = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(request, galleryPhotoConstants.allowedContentTypes);
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Validate if the user is authorized (admin)
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, context, 'create', galleryPhotoSchema.createSchema);

    // Check if FAQ entry with the same title already exists
    const existingQuestion = await model.findUnique({
        where: {
            title: userInput?.title,
        },
        select: {
            id: true,
        }
    });
    if (existingQuestion) {
        return CONFLICT(`Gallery photo entry with title "${userInput?.title}" already exists.`, request);
    }

    // Upload files and construct the `files` array for documents
    const images = await Promise.all(
        (userInput[galleryPhotoConstants.imagesFieldName]).map(async (fileEntry) => {
            // Call your file upload operation
            const { fileId, fileLink } = await localFileOperations.uploadFile(request, fileEntry);
            return {
                imageId: fileId,
                image: fileLink
            };
        })
    );

    userInput.images = images;

    // Create the FAQ entry and send the response
    return createGalleryPhotoEntry(userInput, request);
};

/**
 * POST is an asynchronous handler function used to create a gallery photo.
 * It is wrapped with an async handler to manage possible errors during asynchronous operations.
 *
 * The function internally processes a request to handle the creation of a gallery photo
 * and sends the appropriate response.
 *
 * @type {function}
 */
export const POST = asyncHandler(handleCreateGalleryPhoto);
