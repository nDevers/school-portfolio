import moment from 'moment';

import { AcademicModel } from '@/shared/prisma.model.shared';
import academicSchema from '@/app/api/v1/academic/academic.schema';
import academicConstants from '@/app/api/v1/academic/academic.constants';
import sharedResponseTypes from '@/shared/shared.response.types';
import localFileOperations from '@/util/localFileOperations';

import asyncHandler from '@/util/asyncHandler';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import validateToken from '@/util/validateToken';
import academicSelectionCriteria from '@/app/api/v1/academic/academic.selection.criteria';

const { INTERNAL_SERVER_ERROR, CONFLICT, CREATED } = sharedResponseTypes;

/**
 * Asynchronously creates a new academic entry in the database and retrieves the created entry with a specific set of fields.
 *
 * This function first creates a new document in the database using the provided user input
 * and retrieves the ID of the newly created entry. It then fetches the complete entry data
 * based on predefined selection criteria. If the creation or retrieval process fails,
 * an error response is returned. Otherwise, the created entry details are returned with a
 * success response.
 *
 * @async
 * @function createAcademicEntry
 * @param {Object} userInput - The data provided by the user to create the academic entry.
 * @param {Object} request - The request object associated with the current operation, used for logging or contextual purposes.
 * @returns {Promise<Object>} - Returns a response object indicating the result of the operation. The response
 * contains either the data of the created academic entry or an error message.
 */
const createAcademicEntry = async (userInput, request) => {
    const newDocument = await AcademicModel.create({
        data: userInput,
        select: {
            id: true, // Only return the ID of the updated document
        },
    });

    const selectionCriteria = academicSelectionCriteria();

    const createdDocument = await AcademicModel.findUnique({
        where: {
            id: newDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!createdDocument?.id) {
        return INTERNAL_SERVER_ERROR(
            `Failed to create academic entry with title "${userInput?.title}".`,
            request
        );
    }

    // No need for an aggregation pipeline; Prisma returns the created document
    return CREATED(
        `Academic entry with title "${userInput?.title}" created successfully.`,
        createdDocument,
        request
    );
};

/**
 * Asynchronous function for handling the creation of an academic entry by category.
 *
 * This function performs the following actions:
 * - Validates unsupported content types in the request.
 * - Verifies if the user is authorized to perform the operation (admin access).
 * - Parses and validates the input form data using a predefined schema.
 * - Checks for the existence of an academic entry with the same title and category to prevent duplicates.
 * - Handles file uploads and generates a link for the uploaded file.
 * - Formats, transforms, and cleans the user input data to be stored in the database.
 * - Creates a new academic entry and returns the appropriate response.
 *
 * @async
 * @param {Object} request - The incoming HTTP request containing user-submitted data.
 * @param {Object} context - Context object providing additional operational information.
 * @returns {Object} The HTTP response, including success or error messages based on the operation outcome.
 */
const handleCreateAcademicByCategory = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(
        request,
        academicConstants.allowedContentTypes
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
        () => academicSchema.createSchema()
    );

    // Check if academic entry with the same title already exists
    const existingQuestion = await AcademicModel.findUnique({
        where: {
            title: userInput?.title,
            category: userInput?.categoryParams,
        },
        select: {
            id: true,
        },
    });
    if (existingQuestion) {
        return CONFLICT(
            `Academic entry with title "${userInput?.title}" and CATEGORY "${userInput?.categoryParams}" already exists.`,
            request
        );
    }

    // Upload file and generate link
    const newFile = userInput[academicConstants.fileFieldName][0];
    const { fileId, fileLink } = await localFileOperations.uploadFile(
        request,
        newFile
    );

    userInput.fileId = fileId;
    userInput.file = fileLink;
    userInput.category = userInput.categoryParams;
    userInput.publishDate = moment(
        userInput.publishDate,
        ['DD/MM/YYYY', moment.ISO_8601],
        true
    ).toDate();

    delete userInput.categoryParams;

    // Create the academic entry and send the response
    return createAcademicEntry(userInput, request);
};

/**
 * POST variable utilizing an asynchronous handler to manage the creation
 * of academic entries by category. This variable wraps the `handleCreateAcademicByCategory`
 * function, which is used for handling HTTP POST requests related to this functionality.
 *
 * @constant
 * @type {Function}
 * @function
 * @description Handles the HTTP POST request and delegates the creation of
 *              academic entries to the `handleCreateAcademicByCategory` function
 *              while ensuring proper error handling through the `asyncHandler`.
 */
export const POST = asyncHandler(handleCreateAcademicByCategory);
