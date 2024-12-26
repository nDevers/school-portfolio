'use strict';

import { SchoolAchievementModel } from '@/shared/prisma.model.shared';
import serviceShared from '@/shared/service.shared';
import schoolAchievementSchema from '@/app/api/v1/school/achievement/school.achievement.schema';
import schoolAchievementConstants from '@/app/api/v1/school/achievement/school.achievement.constants';
import sharedResponseTypes from '@/shared/shared.response.types';
import localFileOperations from '@/util/localFileOperations';

import asyncHandler from '@/util/asyncHandler';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import schoolAchievementSelectionCriteria from '@/app/api/v1/school/achievement/school.achievement.selection.criteria';

const { INTERNAL_SERVER_ERROR, NOT_FOUND, CONFLICT, OK } = sharedResponseTypes;

/**
 * Updates a school achievement entry in the database based on user-provided input.
 *
 * Filters the `userInput` object to exclude null or undefined fields, as well as the "id" field,
 * before proceeding to update the database. Retrieves and returns the updated document,
 * or handles errors if the update fails.
 *
 * @async
 * @function updateSchoolAchievementEntry
 * @param {Object} userInput - An object containing the fields to update along with the corresponding values.
 *                             The object must include an `id` field representing the target entry's ID.
 * @param {Object} request - The request context for the operation, often used for generating server responses.
 * @returns {Promise<Object>} A promise that resolves to the updated document along with a success message,
 *                            or an error message if the update operation fails.
 */
const updateSchoolAchievementEntry = async (userInput, request) => {
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
    const updateDocument = await SchoolAchievementModel.update({
        where: { id: userInput?.id },
        data: fieldsToUpdate,
        select: {
            id: true, // Only return the ID of the updated document
        },
    });

    const selectionCriteria = schoolAchievementSelectionCriteria();

    const updatedDocument = await SchoolAchievementModel.findUnique({
        where: {
            id: updateDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!updatedDocument?.id) {
        return INTERNAL_SERVER_ERROR(
            `Failed to update school achievement entry with the ID "${userInput?.id}".`,
            request
        );
    }

    return OK(
        `School achievement entry with the ID "${userInput?.id}" updated successfully.`,
        updatedDocument,
        request
    );
};

/**
 * Handles the update of a school achievement entry by its ID.
 *
 * This function validates the request payload, checks user authorization, processes the input data,
 * and updates an existing achievement entry. It ensures that only authorized administrators can
 * modify achievements, validates input data against a schema, checks for duplicate titles, and
 * handles file replacement if a new file is provided.
 *
 * @param {Object} request - The HTTP request object containing user input and headers.
 * @param {Object} context - The context object containing metadata or additional request details.
 * @returns {Promise<Object>} - A response object containing the result of the update operation.
 *
 * @throws {ValidationError} If the input data fails validation.
 * @throws {AuthorizationError} If the user is not authorized to perform the operation.
 * @throws {ConflictError} If an achievement with the same title already exists.
 * @throws {NotFoundError} If the achievement entry with the provided ID does not exist.
 */
const handleUpdateSchoolAchievementById = async (request, context) => {
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
        'update',
        schoolAchievementSchema.updateSchema
    );

    // Check if school achievement entry with the same title already exists
    const existingSchoolAchievement = await SchoolAchievementModel.findUnique({
        where: {
            id: userInput?.id,
        },
        select: {
            id: true,
            iconId: true,
        },
    });
    if (!existingSchoolAchievement) {
        return NOT_FOUND(
            `School achievement entry with ID "${userInput?.id}" not found.`,
            request
        );
    }

    if (userInput?.title) {
        // Check if school achievement entry with the same title already exists
        const existingQuestion = await SchoolAchievementModel.findUnique({
            where: {
                title: userInput?.title,
            },
            select: {
                id: true,
            },
        });
        if (existingQuestion) {
            return CONFLICT(
                `School achievement entry with title "${userInput?.title}" already exists.`,
                request
            );
        }
    }

    // Handle file replacement if a new file is provided
    if (
        userInput[schoolAchievementConstants.fileFieldName] &&
        userInput[schoolAchievementConstants.fileFieldName][0]
    ) {
        await localFileOperations.deleteFile(existingSchoolAchievement?.iconId); // Delete old file

        const newFile = userInput[schoolAchievementConstants.fileFieldName][0];
        const { fileId, fileLink } = await localFileOperations.uploadFile(
            request,
            newFile
        );

        userInput.iconId = fileId;
        userInput.icon = fileLink;
    }

    // Create the school achievement entry and send the response
    return updateSchoolAchievementEntry(userInput, request);
};

/**
 * Asynchronously deletes a school achievement entry by its ID.
 *
 * This function interacts with the serviceShared module to remove a school
 * achievement record from the database or the relevant data store. It utilizes
 * the provided `request` and `context` parameters, which typically include
 * details of the operation and the execution environment. The `model` and
 * field name ('iconId') are used to identify and delete the specific school
 * achievement.
 *
 * @param {Object} request - The request object containing parameters required for deleting the school achievement entry.
 * @param {Object} context - The context of the execution, often containing additional metadata or execution-related information.
 * @returns {Promise<Object>} A promise that resolves to the result of the deletion operation, typically indicating success or failure.
 */
const deleteSchoolAchievementById = async (request, context) => {
    return serviceShared.deleteEntryById(
        request,
        context,
        SchoolAchievementModel,
        'iconId',
        'school achievement'
    );
};

/**
 * PATCH is an asynchronous function that handles the update of a school achievement
 * identified by its ID. It uses an asynchronous handler to process the update operation.
 *
 * The function encapsulates the logic for processing the request, updating the corresponding
 * school achievement data, and returning the appropriate response to the client.
 *
 * Typically utilized in routes where school achievement records need to be modified via a PATCH request.
 */
export const PATCH = asyncHandler(handleUpdateSchoolAchievementById);

/**
 * Asynchronous handler for deleting a school achievement by its ID.
 *
 * This variable uses an async handler to invoke the `deleteSchoolAchievementById` function,
 * which performs the deletion operation. The handler ensures proper error handling
 * and response management during the deletion process.
 *
 * @constant
 * @type {Function}
 */
export const DELETE = asyncHandler(deleteSchoolAchievementById);
