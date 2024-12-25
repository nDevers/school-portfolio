import moment from 'moment';

import { CareerModel } from '@/shared/prisma.model.shared';
import careerSchema from '@/app/api/v1/career/career.schema';
import careerConstants from '@/app/api/v1/career/career.constants';
import sharedResponseTypes from '@/shared/shared.response.types';
import localFileOperations from '@/util/localFileOperations';

import asyncHandler from '@/util/asyncHandler';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import validateToken from '@/util/validateToken';
import careerSelectionCriteria from '@/app/api/v1/career/career.selection.criteria';

const { INTERNAL_SERVER_ERROR, CONFLICT, CREATED } = sharedResponseTypes;

/**
 * Asynchronous function to create a new career entry in the database.
 *
 * This function accepts user input, creates a new document in the database,
 * retrieves the newly created document using specified selection criteria,
 * and returns the created document along with a success message.
 *
 * If the creation or retrieval process fails, it returns an internal server
 * error response with a failure message.
 *
 * @param {Object} userInput - The data input provided by the user for the new career entry.
 * @param {Object} request - The incoming request object for context or additional data.
 * @returns {Object} A response object indicating success or failure, and the data of the created career entry.
 */
const createCareerEntry = async (userInput, request) => {
    const newDocument = await CareerModel.create({
        data: userInput,
        select: {
            id: true, // Only return the ID of the updated document
        },
    });

    const selectionCriteria = careerSelectionCriteria();

    const createdDocument = await CareerModel.findUnique({
        where: {
            id: newDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!createdDocument?.id) {
        return INTERNAL_SERVER_ERROR(
            `Failed to create career entry with title "${userInput?.title}".`,
            request
        );
    }

    // No need for an aggregation pipeline; Prisma returns the created document
    return CREATED(
        `Career entry with title "${userInput?.title}" created successfully.`,
        createdDocument,
        request
    );
};

/**
 * Handles the creation of a new career entry.
 *
 * This function performs the following steps:
 * 1. Validates the content type of the incoming request to ensure it matches allowed types.
 * 2. Verifies the user authorization status, ensuring the user has administrative access.
 * 3. Parses and validates the form data against a predefined schema for creating career entries.
 * 4. Checks for potential conflicts by confirming that no existing career entry with the same title exists.
 * 5. Processes file uploads associated with the career entry, stores the files, and populates the files array.
 * 6. Parses and normalizes the date field into a valid Date object.
 * 7. Creates a new career entry in the database and returns an appropriate response.
 *
 * @param {Object} request - The incoming HTTP request object containing career entry data and headers.
 * @param {Object} context - Additional context or dependencies that may be required for processing the request.
 * @returns {Object} - An HTTP response object indicating the success or failure of the operation.
 * @throws {Error} - Throws an error if an unexpected issue occurs during processing.
 */
const handleCreateCareer = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(
        request,
        careerConstants.allowedContentTypes
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
        careerSchema.createSchema
    );

    // Check if FAQ entry with the same title already exists
    const existingQuestion = await CareerModel.findUnique({
        where: {
            title: userInput?.title,
        },
        select: {
            id: true,
        },
    });
    if (existingQuestion) {
        return CONFLICT(
            `Career entry with title "${userInput?.title}" already exists.`,
            request
        );
    }

    // Upload files and construct the `files` array for documents
    const files = await Promise.all(
        (userInput[careerConstants.fileFieldName] || []).map(
            async (fileEntry) => {
                // Call your file upload operation
                const { fileId, fileLink } =
                    await localFileOperations.uploadFile(request, fileEntry);
                return {
                    fileId: fileId,
                    file: fileLink,
                };
            }
        )
    );

    userInput.files = files;
    userInput.date = moment(
        userInput.date,
        ['DD/MM/YYYY', moment.ISO_8601],
        true
    ).toDate();

    // Create the FAQ entry and send the response
    return createCareerEntry(userInput, request);
};

/**
 * POST is an asynchronous handler function used for processing HTTP POST requests.
 * It manages the creation of a career entity by invoking the handleCreateCareer function.
 * This function is designed to streamline asynchronous request handling, ensuring errors are properly caught and handled.
 *
 * The main responsibilities of POST include:
 * - Accepting and validating incoming POST requests
 * - Delegating the handling of career creation logic to the handleCreateCareer function
 * - Managing exceptions and providing error responses if necessary
 *
 * Utilizes an external asyncHandler wrapper for consistent error handling middleware.
 */
export const POST = asyncHandler(handleCreateCareer);
