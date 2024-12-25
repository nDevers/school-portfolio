import { PrismaClient } from '@prisma/client';

import aboutUsSchema from "@/app/api/v1/about-us/about.us.schema";
import aboutUsConstants from "@/app/api/v1/about-us/about.us.constants";
import sharedResponseTypes from "@/shared/shared.response.types";
import localFileOperations from "@/util/localFileOperations";

import asyncHandler from "@/util/asyncHandler";
import validateUnsupportedContent from "@/util/validateUnsupportedContent";
import parseAndValidateFormData from "@/util/parseAndValidateFormData";
import validateToken from "@/util/validateToken";
import aboutUsSelectionCriteria from "@/app/api/v1/about-us/about.us.selection.criteria";

/**
 * Represents an instance of the Prisma Client.
 * Prisma Client is an auto-generated query builder that helps interact
 * with the database in a type-safe and efficient manner.
 *
 * This instance provides methods to perform CRUD operations on the database
 * as defined in the Prisma schema.
 *
 * When utilizing the Prisma Client, make sure to manage database connections properly.
 * It is recommended to only initialize this client once in the application's lifecycle
 * and close the connections when the application shuts down.
 *
 * Avoid creating multiple PrismaClient instances to prevent potential
 * issues with database connections, which may lead to performance bottlenecks.
 *
 * Requires the @prisma/client package to be installed and the Prisma schema to be
 * configured and generated.
 *
 * Variable:
 * - prisma: Initialized PrismaClient instance configured for the current project setup.
 */
const prisma = new PrismaClient();

const { INTERNAL_SERVER_ERROR, CONFLICT, CREATED, NOT_FOUND } = sharedResponseTypes;

/**
 * The `model` variable represents the `AboutUs` model in the Prisma schema.
 * This model is used to interact with the `AboutUs` table in the database,
 * facilitating CRUD operations and other queries related to the `AboutUs` entity.
 *
 * It is typically used to manage information related to the "About Us" section of an application,
 * such as descriptions, team details, company history, mission, and vision statements.
 *
 * Note: The exact fields and properties depend on the Prisma schema definition of the `AboutUs` model.
 */
const model = prisma.AboutUs;

/**
 * Asynchronously creates a new "About Us" entry in the database and retrieves the created document.
 *
 * This function takes user input and creates a new record in the database using the `model.create` method.
 * It retrieves a subset of the created document based on a predefined selection criteria.
 * If successful, it returns the newly created document alongside a success response.
 * If the creation fails or the document is not properly retrieved, it returns an internal server error response.
 *
 * @param {Object} userInput - The data provided by the user to create the "About Us" entry.
 * @param {Object} request - The HTTP request object representing the current request.
 * @returns {Promise<Object>} A promise that resolves to a response object indicating the result of the operation.
 *                            This includes information about the created entry or an error message if unsuccessful.
 */
const createAboutUsEntry = async (userInput, request) => {
    const newDocument = await model.create({
        data: userInput,
        select: {
            id: true, // Only return the ID of the updated document
        },
    });

    const selectionCriteria = aboutUsSelectionCriteria();

    const createdDocument = await model.findUnique({
        where: {
            id: newDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!createdDocument?.id) {
        return INTERNAL_SERVER_ERROR(`Failed to create about us entry with title "${userInput?.title}".`, request);
    }

    // No need for an aggregation pipeline; Prisma returns the created document
    return CREATED(`About us entry with title "${userInput?.title}" created successfully.`, createdDocument, request);
};

/**
 * Handles the creation of a new "About Us" entry.
 *
 * This asynchronous function validates the request and user authorization,
 * parses form data, checks for title uniqueness, uploads associated files
 * and images, and creates a new "About Us" entry in the database.
 *
 * Key operations performed:
 * - Validates the content type of the request.
 * - Confirms the requesting user is authorized (admin privileges required).
 * - Parses and validates the form data using predefined schemas.
 * - Verifies that no duplicate entry exists with the provided title.
 * - Handles file and image uploads for the entry.
 * - Creates the "About Us" entry with the provided and processed data.
 *
 * @param {object} request - The incoming HTTP request object.
 * @param {object} context - The context object containing request-specific data.
 * @returns {object} Response object indicating success or failure of the operation.
 */
const handleCreateAboutUs = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(request, aboutUsConstants.allowedContentTypes);
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Validate if the user is authorized (admin)
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, context, 'create', aboutUsSchema.createSchema);

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
        return CONFLICT(`About us entry with title "${userInput?.title}" already exists.`, request);
    }

    // Upload files and construct the `files` array for documents
    const files = await Promise.all(
        (userInput[aboutUsConstants.fileFieldName] || []).map(async (fileEntry) => {
            // Call your file upload operation
            const { fileId, fileLink } = await localFileOperations.uploadFile(request, fileEntry);
            return {
                fileId: fileId,
                file: fileLink
            };
        })
    );

    // Upload files and construct the `files` array for documents
    const images = await Promise.all(
        (userInput[aboutUsConstants.imageFieldName] || []).map(async (imageEntry) => {
            // Call your file upload operation
            const { fileId, fileLink } = await localFileOperations.uploadFile(request, imageEntry);
            return {
                imageId: fileId,
                image: fileLink
            };
        })
    );

    userInput.files = files;
    userInput.images = images;

    // Create the FAQ entry and send the response
    return createAboutUsEntry(userInput, request);
};

/**
 * POST is an asynchronous function that handles the creation of an "About Us" entity.
 * It utilizes an async handler middleware to manage errors or exceptions during execution.
 *
 * The function is primarily responsible for processing requests that create new "About Us" data.
 * It relies on the `handleCreateAboutUs` function as the core logic to handle the request
 * and appropriately manage the response structure.
 *
 * @constant {Function} POST - Async function wrapped in an error-handling middleware.
 */
export const POST = asyncHandler(handleCreateAboutUs);
