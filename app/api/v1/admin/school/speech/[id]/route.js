'use strict';

import { SchoolSpeechModel } from '@/shared/prisma.model.shared';
import serviceShared from '@/shared/service.shared';
import schoolSpeechSchema from '@/app/api/v1/school/speech/school.speech.schema';
import schoolSpeechConstants from '@/app/api/v1/school/speech/school.speech.constants';
import sharedResponseTypes from '@/shared/shared.response.types';
import localFileOperations from '@/util/localFileOperations';

import asyncHandler from '@/util/asyncHandler';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import schoolSpeechSelectionCriteria from '@/app/api/v1/school/speech/school.speech.selection.criteria';

const { INTERNAL_SERVER_ERROR, NOT_FOUND, CONFLICT, OK } = sharedResponseTypes;

/**
 * Updates an existing school speech entry based on the provided user input.
 *
 * This asynchronous function takes user input to update specific fields in the database and
 * filters out null or undefined values from the input object before performing the update.
 * It ensures that only valid, non-null fields are updated and excludes the `id` field from updates.
 * After the operation, it retrieves the updated document using a predefined selection criteria.
 *
 * @async
 * @function updateSchoolSpeechEntry
 * @param {Object} userInput - The user-provided data for updating the school speech entry.
 * @param {Object} request - The request object providing context for the operation.
 * @returns {Promise<Object>} Resolves with an object containing a success message and updated data.
 * Rejects with an error message if the update operation fails.
 */
const updateSchoolSpeechEntry = async (userInput, request) => {
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
    const updateDocument = await SchoolSpeechModel.update({
        where: { id: userInput?.id },
        data: fieldsToUpdate,
        select: {
            id: true, // Only return the ID of the updated document
        },
    });

    const selectionCriteria = schoolSpeechSelectionCriteria();

    const updatedDocument = await SchoolSpeechModel.findUnique({
        where: {
            id: updateDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!updatedDocument?.id) {
        return INTERNAL_SERVER_ERROR(
            `Failed to update school speech entry with the ID "${userInput?.id}".`,
            request
        );
    }

    return OK(
        `School speech entry with the ID "${userInput?.id}" updated successfully.`,
        updatedDocument,
        request
    );
};

/**
 * Asynchronously handles updating a school speech entry by its unique identifier.
 *
 * This function performs multiple operations such as validating the input request,
 * checking user authorization, ensuring the uniqueness of the speech title, managing file
 * replacements, and updating the speech entry in the database.
 *
 * Steps performed:
 * 1. Validates the request's content type against allowed content types.
 * 2. Validates the user's token to ensure administrative authorization.
 * 3. Parses and validates the form data using a predefined schema.
 * 4. Checks if a school speech entry exists with the given ID.
 * 5. Ensures that the speech title does not already exist if a new title is provided.
 * 6. Handles file operations, replacing the old file if a new file is provided.
 * 7. Updates the school speech entry in the database and returns the appropriate response.
 *
 * Returns appropriate HTTP responses in case of validation failure, unauthorized access,
 * conflict, or success.
 *
 * @param {Object} request - The HTTP request object containing data to update the school speech entry.
 * @param {Object} context - Additional context for validations and processing.
 * @returns {Object} The resulting response object indicating the update operation's outcome.
 */
const handleUpdateSchoolSpeechById = async (request, context) => {
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
        'update',
        schoolSpeechSchema.updateSchema
    );

    // Check if school speech entry with the same title already exists
    const existingSchoolSpeech = await SchoolSpeechModel.findUnique({
        where: {
            id: userInput?.id,
        },
        select: {
            id: true,
            imageId: true,
        },
    });
    if (!existingSchoolSpeech) {
        return NOT_FOUND(
            `School speech entry with ID "${userInput?.id}" not found.`,
            request
        );
    }

    if (userInput?.title) {
        // Check if school speech entry with the same title already exists
        const existingQuestion = await SchoolSpeechModel.findUnique({
            where: {
                title: userInput?.title,
            },
            select: {
                id: true,
            },
        });
        if (existingQuestion) {
            return CONFLICT(
                `School speech entry with title "${userInput?.title}" already exists.`,
                request
            );
        }
    }

    // Handle file replacement if a new file is provided
    const newImage = userInput[schoolSpeechConstants.imageFieldName];
    if (newImage && newImage[0]) {
        await localFileOperations.deleteFile(existingSchoolSpeech?.imageId); // Delete old file

        const newFile = newImage[0];
        const { fileId, fileLink } = await localFileOperations.uploadFile(
            request,
            newFile
        );

        userInput.imageId = fileId;
        userInput.image = fileLink;
    }

    // Create the school speech entry and send the response
    return updateSchoolSpeechEntry(userInput, request);
};

/**
 * Asynchronously deletes a school speech entry by its identifier.
 *
 * @function deleteSchoolSpeechById
 * @async
 * @param {Object} request - The request object containing details for deleting the school speech.
 * @param {Object} context - The context in which the deletion operation is executed.
 * @returns {Promise<*>} A promise resolving with the result of the deletion operation.
 */
const deleteSchoolSpeechById = async (request, context) => {
    return serviceShared.deleteEntryById(
        request,
        context,
        SchoolSpeechModel,
        'imageId',
        'school speech'
    );
};

/**
 * The PATCH variable is an asynchronous handler function designed to process
 * updates for a specific school speech identified by its ID. It leverages
 * an async operation for efficient handling of requests.
 *
 * This function is wrapped with an `asyncHandler` to handle any asynchronous
 * errors that might occur during the update operation. The actual logic of
 * updating the school speech is implemented in the `handleUpdateSchoolSpeechById` function,
 * which processes the necessary updates to the resource.
 *
 * Use this function within an Express route to handle HTTP PATCH requests for
 * modifying existing school speech data by its unique identifier.
 */
export const PATCH = asyncHandler(handleUpdateSchoolSpeechById);

/**
 * DELETE is an asynchronous handler function assigned to deleteSchoolSpeechById,
 * which processes the deletion of a school speech by its unique identifier.
 *
 * It utilizes the asyncHandler wrapper to handle any asynchronous
 * operations and streamline error management during the execution
 * of the deleteSchoolSpeechById function.
 *
 * Ensures proper deletion logic while maintaining robust error handling.
 */
export const DELETE = asyncHandler(deleteSchoolSpeechById);
