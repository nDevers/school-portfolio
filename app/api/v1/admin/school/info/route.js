'use strict';

import { SchoolInfoModel } from '@/shared/prisma.model.shared';
import schoolInfoSchema from '@/app/api/v1/school/info/school.info.schema';
import schoolInfoConstants from '@/app/api/v1/school/info/school.info.constants';
import sharedResponseTypes from '@/shared/shared.response.types';
import localFileOperations from '@/util/localFileOperations';

import asyncHandler from '@/util/asyncHandler';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import validateToken from '@/util/validateToken';
import schoolInfoSelectionCriteria from '@/app/api/v1/school/info/school.info.selection.criteria';

const { INTERNAL_SERVER_ERROR, CONFLICT, CREATED, NOT_FOUND } =
    sharedResponseTypes;

/**
 * Creates a new school information entry in the database and retrieves the created document with specified selection criteria.
 *
 * The function first creates a new document in the database using the provided user input, returning only the newly created document's ID.
 * It then retrieves the full details of the created document based on defined selection criteria.
 * If the document cannot be created or retrieved, an error response is returned.
 *
 * @async
 * @function createSchoolInfoEntry
 * @param {Object} userInput - The input data for creating a new school info entry.
 * @param {Object} request - The HTTP request object, generally used for providing contextual request information in error or success responses.
 * @returns {Object} - A response indicating the success or failure of the create operation. Returns HTTP "CREATED" status on success or "INTERNAL_SERVER_ERROR" on failure.
 */
const createSchoolInfoEntry = async (userInput, request) => {
    const newDocument = await SchoolInfoModel.create({
        data: userInput,
        select: {
            id: true, // Only return the ID of the updated document
        },
    });

    const selectionCriteria = schoolInfoSelectionCriteria();

    const createdDocument = await SchoolInfoModel.findUnique({
        where: {
            id: newDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!createdDocument?.id) {
        return INTERNAL_SERVER_ERROR(
            `Failed to create school info entry with title "${userInput?.title}".`,
            request
        );
    }

    // No need for an aggregation pipeline; Prisma returns the created document
    return CREATED(
        `School info entry with title "${userInput?.title}" created successfully.`,
        createdDocument,
        request
    );
};

/**
 * Handles the creation of school information data by validating the request,
 * processing the input, verifying authorization, and storing the information.
 *
 * This function performs the following actions:
 * - Validates the content type of the request.
 * - Checks the user's authorization (admin privileges).
 * - Parses and validates form data against the specified schema.
 * - Ensures no duplicate school information entry exists with the same title.
 * - Uploads any associated files and generates a file link.
 * - Calls a service to create the school info entry and returns the response.
 *
 * @async
 * @function
 * @param {Object} request - The HTTP request object containing necessary data for processing.
 * @param {Object} context - The execution context containing environment and configuration details.
 * @returns {Promise<Object>} The HTTP response object with the result of the operation.
 */
const handleCreateSchoolInfo = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(
        request,
        schoolInfoConstants.allowedContentTypes
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
        schoolInfoSchema.createSchema
    );

    // Check if FAQ entry with the same title already exists
    const existingtitle = await SchoolInfoModel.findUnique({
        where: {
            title: userInput?.title,
        },
        select: {
            id: true,
        },
    });
    if (existingtitle) {
        return CONFLICT(
            `School info entry with title "${userInput?.title}" already exists.`,
            request
        );
    }

    // Upload file and generate link
    const newFile = userInput[schoolInfoConstants.fileFieldName][0];
    const { fileId, fileLink } = await localFileOperations.uploadFile(
        request,
        newFile
    );

    userInput.iconId = fileId;
    userInput.icon = fileLink;

    // Create the FAQ entry and send the response
    return createSchoolInfoEntry(userInput, request);
};

/**
 * POST is an asynchronous middleware function used to create school information.
 * It leverages the asyncHandler utility to handle any possible errors during the execution of the handleCreateSchoolInfo function.
 *
 * The primary purpose of POST is to facilitate the creation of school-related data
 * in a way that ensures error handling is managed cleanly and efficiently.
 *
 * @type {Function}
 */
export const POST = asyncHandler(handleCreateSchoolInfo);
