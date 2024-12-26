'use strict';

import { SchoolAchievementModel } from '@/shared/prisma.model.shared';
import schoolAchievementSchema from '@/app/api/v1/school/achievement/school.achievement.schema';
import schoolAchievementConstants from '@/app/api/v1/school/achievement/school.achievement.constants';
import sharedResponseTypes from '@/shared/shared.response.types';
import localFileOperations from '@/util/localFileOperations';

import asyncHandler from '@/util/asyncHandler';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import validateToken from '@/util/validateToken';
import schoolAchievementSelectionCriteria from '@/app/api/v1/school/achievement/school.achievement.selection.criteria';

const { INTERNAL_SERVER_ERROR, CONFLICT, CREATED } = sharedResponseTypes;

/**
 * Asynchronously creates a new school achievement entry in the database.
 *
 * @async
 * @function createSchoolAchievementEntry
 * @param {Object} userInput - The input data for the school achievement entry.
 * @param {Object} request - The HTTP request object.
 * @returns {Promise<Object>} A response object indicating the success or failure of the operation, including the created entry's details.
 * @throws {Error} If the creation process fails or the created document cannot be retrieved.
 */
const createSchoolAchievementEntry = async (userInput, request) => {
    const newDocument = await SchoolAchievementModel.create({
        data: userInput,
        select: {
            id: true, // Only return the ID of the updated document
        },
    });

    const selectionCriteria = schoolAchievementSelectionCriteria();

    const createdDocument = await SchoolAchievementModel.findUnique({
        where: {
            id: newDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!createdDocument?.id) {
        return INTERNAL_SERVER_ERROR(
            `Failed to create school achievement entry with title "${userInput?.title}".`,
            request
        );
    }

    // No need for an aggregation pipeline; Prisma returns the created document
    return CREATED(
        `School achievement entry with title "${userInput?.title}" created successfully.`,
        createdDocument,
        request
    );
};

/**
 * Asynchronous function to handle the creation of a school achievement entry.
 *
 * This function performs several steps to ensure the creation process is executed securely and correctly:
 * 1. Validates the content type of the incoming request against allowed content types.
 * 2. Validates the user's authorization to ensure they have sufficient permissions (admin).
 * 3. Parses and validates the form data against the defined schema for creating school achievements.
 * 4. Checks for the existence of a school achievement entry with the same title to prevent duplicate entries.
 * 5. Handles file upload to associate an icon or file with the newly created school achievement entry.
 * 6. Creates the school achievement entry with the validated and processed data.
 *
 * @name handleCreateSchoolAchievement
 * @function
 * @async
 *
 * @param {Object} request - The HTTP request object containing headers, body, and other request-related data.
 * @param {Object} context - Contextual data that may include additional information for validation and processing.
 *
 * @returns {Promise<Object>} Returns a promise that resolves to an HTTP response object, either with the success of the operation or an error response in case of issues.
 */
const handleCreateSchoolAchievement = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(
        request,
        schoolAchievementConstants.allowedContentTypes
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
        schoolAchievementSchema.createSchema
    );

    // Check if FAQ entry with the same title already exists
    const existingtitle = await SchoolAchievementModel.findUnique({
        where: {
            title: userInput?.title,
        },
        select: {
            id: true,
        },
    });
    if (existingtitle) {
        return CONFLICT(
            `School achievement entry with title "${userInput?.title}" already exists.`,
            request
        );
    }

    // Upload file and generate link
    const newFile = userInput[schoolAchievementConstants.fileFieldName][0];
    const { fileId, fileLink } = await localFileOperations.uploadFile(
        request,
        newFile
    );

    userInput.iconId = fileId;
    userInput.icon = fileLink;

    // Create the FAQ entry and send the response
    return createSchoolAchievementEntry(userInput, request);
};

/**
 * The `POST` variable is an asynchronous handler function that processes HTTP POST requests.
 * It utilizes the `asyncHandler` higher-order function to automatically handle errors in the `handleCreateSchoolAchievement` function.
 * This enables efficient management of asynchronous operations and standardized error handling during the creation of school achievements.
 *
 * Usage:
 * Typically used as the controller function in a route handling framework like Express.js to manage POST requests.
 *
 * Dependencies:
 * - `asyncHandler`: A utility function for catching errors in asynchronous route handlers.
 * - `handleCreateSchoolAchievement`: The specific function that contains the logic for creating a school achievement.
 */
export const POST = asyncHandler(handleCreateSchoolAchievement);
