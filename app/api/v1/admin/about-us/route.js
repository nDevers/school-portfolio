'use strict';

import { AboutUsModel } from '@/shared/prisma.model.shared';
import aboutUsSchema from '@/app/api/v1/about-us/about.us.schema';
import aboutUsConstants from '@/app/api/v1/about-us/about.us.constants';
import sharedResponseTypes from '@/shared/shared.response.types';
import localFileOperations from '@/util/localFileOperations';

import asyncHandler from '@/util/asyncHandler';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import validateToken from '@/util/validateToken';
import aboutUsSelectionCriteria from '@/app/api/v1/about-us/about.us.selection.criteria';

const { INTERNAL_SERVER_ERROR, CONFLICT, CREATED } = sharedResponseTypes;

/**
 * Asynchronously creates a new "About Us" entry in the database and retrieves the newly created entry.
 *
 * The function begins by creating a new document in the database using the provided user input. Afterward,
 * it fetches the created document using its unique ID and applies pre-defined selection criteria. If the
 * creation or retrieval fails, an appropriate error response is returned. Otherwise, the successful creation
 * response is returned along with the newly created document.
 *
 * @param {Object} userInput - The user-provided data used to create the "About Us" entry.
 * @param {Object} request - The request object containing metadata or associated details for logging or error handling purposes.
 * @returns {Promise<Object>} A promise resolving to the created document and accompanying metadata response, or an error response if creation fails.
 * @throws {Error} Throws an error if there is an issue during the creation or retrieval of the document.
 */
const createAboutUsEntry = async (userInput, request) => {
    const newDocument = await AboutUsModel.create({
        data: userInput,
        select: {
            id: true, // Only return the ID of the updated document
        },
    });

    const selectionCriteria = aboutUsSelectionCriteria();

    const createdDocument = await AboutUsModel.findUnique({
        where: {
            id: newDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!createdDocument?.id) {
        return INTERNAL_SERVER_ERROR(
            `Failed to create about us entry with title "${userInput?.title}".`,
            request
        );
    }

    // No need for an aggregation pipeline; Prisma returns the created document
    return CREATED(
        `About us entry with title "${userInput?.title}" created successfully.`,
        createdDocument,
        request
    );
};

/**
 * Handles the creation of an "About Us" entry by performing the necessary validation,
 * file uploads, and database operations.
 *
 * @param {Object} request - The incoming HTTP request object.
 * @param {Object} context - Additional context for processing the request, such as request metadata.
 *
 * @returns {Promise<Object>} - A response object indicating success or the relevant error.
 *
 * Functionality:
 * - Validates the content type of the request using pre-defined allowed content types.
 * - Checks the user's authorization status to ensure administrative privileges.
 * - Parses and validates the form data schema for creating an "About Us" entry.
 * - Checks for duplication by verifying if an entry with the same title already exists in the database.
 * - Handles file uploads for documents and images by calling the appropriate file upload operations.
 * - Constructs and attaches the `files` and `images` arrays to the user input.
 * - Creates a new database entry for "About Us" and returns the operation's result.
 *
 * Validation and Database Usage:
 * - Utilizes `aboutUsConstants.allowedContentTypes` for content validation.
 * - Validates token credentials using `validateToken(request)`.
 * - Uses `aboutUsSchema.createSchema` for form data validation.
 * - Checks the database for duplicate titles via `model.findUnique`.
 *
 * File Operations:
 * - Uploads document files and images using `localFileOperations.uploadFile`.
 * - Constructs `files` and `images` arrays containing file IDs and file links.
 *
 * Response Handling:
 * - Returns conflict error responses for duplicate titles.
 * - Returns appropriate responses for validation or authorization failures.
 * - Returns success response upon successful creation of the "About Us" entry.
 */
const handleCreateAboutUs = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(
        request,
        aboutUsConstants.allowedContentTypes
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
        aboutUsSchema.createSchema
    );

    // Check if FAQ entry with the same title already exists
    const existingQuestion = await AboutUsModel.findUnique({
        where: {
            title: userInput?.title,
        },
        select: {
            id: true,
        },
    });
    if (existingQuestion) {
        return CONFLICT(
            `About us entry with title "${userInput?.title}" already exists.`,
            request
        );
    }

    // Upload files and construct the `files` array for documents
    const files = await Promise.all(
        (userInput[aboutUsConstants.fileFieldName] || []).map(
            async (fileEntry) => {
                // Call your file upload operation
                const { fileId, fileLink } =
                    await localFileOperations.uploadFile(request, fileEntry);
                return {
                    fileId,
                    file: fileLink,
                };
            }
        )
    );

    // Upload files and construct the `files` array for documents
    const images = await Promise.all(
        (userInput[aboutUsConstants.imageFieldName] || []).map(
            async (imageEntry) => {
                // Call your file upload operation
                const { fileId, fileLink } =
                    await localFileOperations.uploadFile(request, imageEntry);
                return {
                    imageId: fileId,
                    image: fileLink,
                };
            }
        )
    );

    userInput.files = files;
    userInput.images = images;

    // Create the FAQ entry and send the response
    return createAboutUsEntry(userInput, request);
};

/**
 * @swagger
 * components:
 *   schemas:
 *     AboutUs:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the "About Us" entry.
 *         content:
 *           type: string
 *           description: Content of the "About Us" entry.
 *         files:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               fileId:
 *                 type: string
 *                 description: Unique ID of the uploaded file.
 *               file:
 *                 type: string
 *                 description: URL of the uploaded file.
 *         images:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               imageId:
 *                 type: string
 *                 description: Unique ID of the uploaded image.
 *               image:
 *                 type: string
 *                 description: URL of the uploaded image.
 *
 * tags:
 *   - name: AboutUs
 *     description: Operations to manage "About Us" entries.
 *
 * /api/v1/about-us:
 *   post:
 *     summary: Create a new "About Us" entry
 *     tags: [AboutUs]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/AboutUs'
 *     responses:
 *       201:
 *         description: Successfully created a new "About Us" entry.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AboutUs'
 *       400:
 *         description: Bad Request - Invalid input.
 *       409:
 *         description: Conflict - Entry with the same title already exists.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * POST is a variable that holds an asynchronous function wrapped with the `asyncHandler` utility function.
 * The wrapped function, `handleCreateAboutUs`, manages the creation of an "About Us" resource.
 *
 * Intended to be used as a POST request handler in an application.
 *
 * asyncHandler is used to handle asynchronous errors in the wrapped function
 * and pass them to the next middleware in the application's request-response cycle.
 *
 * `handleCreateAboutUs` should contain the specific logic for creating or updating
 * the "About Us" resource, such as interacting with a database or performing validation.
 *
 * This variable is a part of the application's route/controller definitions.
 */
export const POST = asyncHandler(handleCreateAboutUs);
