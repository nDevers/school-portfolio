import { SchoolSpeechModel } from '@/shared/prisma.model.shared';
import schoolSpeechSchema from '@/app/api/v1/school/speech/school.speech.schema';
import schoolSpeechConstants from '@/app/api/v1/school/speech/school.speech.constants';
import sharedResponseTypes from '@/shared/shared.response.types';
import localFileOperations from '@/util/localFileOperations';

import asyncHandler from '@/util/asyncHandler';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import validateToken from '@/util/validateToken';
import schoolSpeechSelectionCriteria from '@/app/api/v1/school/speech/school.speech.selection.criteria';

const { INTERNAL_SERVER_ERROR, CONFLICT, CREATED } = sharedResponseTypes;

/**
 * Asynchronously creates a new school speech entry in the database and returns the created document.
 *
 * @param {Object} userInput - The data to create the school speech entry with.
 * Contains all attributes required to construct the new speech entry.
 * @param {Object} request - The HTTP request object associated with the operation.
 *
 * @returns {Promise<Object>} A promise resolving to the newly created school speech entry
 * if successful. On success, the returned object will contain the created speech entry data
 * as selected by the `schoolSpeechSelectionCriteria` logic.
 *
 * If the entry creation fails, this method returns an internal server error response.
 *
 * This method uses the following main operations:
 * 1. Creates a new speech entry in the database with the user-provided input.
 * 2. Retrieves the created entry and only the fields selected by
 * `schoolSpeechSelectionCriteria()` logic.
 *
 * @throws {Error} Throws an internal server error if the database operations or validation fail.
 *
 * Note: Relies on Prisma for database interaction and assumes the presence of
 * `model.create`, `model.findUnique`, and `schoolSpeechSelectionCriteria` in the surrounding context.
 * Also assumes helpers like `INTERNAL_SERVER_ERROR` and `CREATED` are defined for error handling
 * and response generation.
 */
const createSchoolSpeechEntry = async (userInput, request) => {
    const newDocument = await SchoolSpeechModel.create({
        data: userInput,
        select: {
            id: true, // Only return the ID of the updated document
        },
    });

    const selectionCriteria = schoolSpeechSelectionCriteria();

    const createdDocument = await SchoolSpeechModel.findUnique({
        where: {
            id: newDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!createdDocument?.id) {
        return INTERNAL_SERVER_ERROR(
            `Failed to create school speech entry with title "${userInput?.title}".`,
            request
        );
    }

    // No need for an aggregation pipeline; Prisma returns the created document
    return CREATED(
        `School speech entry with title "${userInput?.title}" created successfully.`,
        createdDocument,
        request
    );
};

/**
 * Handles the creation of a new school speech entry. This function performs several steps:
 * - Validates the content type of the incoming request against allowed content types.
 * - Verifies if the user is authorized to perform the action.
 * - Parses and validates the form data using a predefined schema.
 * - Checks if a school speech entry with the same title already exists in the database.
 * - Uploads an associated file and generates the corresponding file link.
 * - Creates a new school speech entry in the database and generates an appropriate response.
 *
 * @param {Object} request - The incoming HTTP request object containing the necessary data for the school speech entry.
 * @param {Object} context - The context object containing environment-specific information or dependencies.
 * @returns {Object} The HTTP response object derived from the outcome of the operation. This includes error responses for invalid input, unauthorized access, or conflicting titles, and success response for successful creation.
 * @async
 */
const handleCreateSchoolSpeech = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(
        request,
        schoolSpeechConstants.allowedContentTypes
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
        schoolSpeechSchema.createSchema
    );

    // Check if FAQ entry with the same title already exists
    const existingTitle = await SchoolSpeechModel.findUnique({
        where: {
            title: userInput?.title,
        },
        select: {
            id: true,
        },
    });
    if (existingTitle) {
        return CONFLICT(
            `School speech entry with title "${userInput?.title}" already exists.`,
            request
        );
    }

    // Upload file and generate link
    const newFile = userInput[schoolSpeechConstants.imageFieldName][0];
    const { fileId, fileLink } = await localFileOperations.uploadFile(
        request,
        newFile
    );

    userInput.imageId = fileId;
    userInput.image = fileLink;

    // Create the FAQ entry and send the response
    return createSchoolSpeechEntry(userInput, request);
};

/**
 * POST is an asynchronous function wrapped with the `asyncHandler` to handle HTTP POST requests
 * for creating a school speech resource. Allows for streamlined error handling during the request lifecycle.
 *
 * This function delegates the logic to the `handleCreateSchoolSpeech` function,
 * which contains the implementation for creating a new school speech resource.
 *
 * The `asyncHandler` ensures that any errors occurring in `handleCreateSchoolSpeech` are caught and passed
 * to the global error handler without the need for explicit try-catch blocks.
 */
export const POST = asyncHandler(handleCreateSchoolSpeech);
