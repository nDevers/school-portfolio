'use strict';

import moment from 'moment/moment';

import { AnnouncementModel } from '@/shared/prisma.model.shared';
import announcementSchema from '@/app/api/v1/announcement/announcement.schema';
import announcementConstants from '@/app/api/v1/announcement/announcement.constants';
import sharedResponseTypes from '@/shared/shared.response.types';
import localFileOperations from '@/util/localFileOperations';
import careerConstants from '@/app/api/v1/career/career.constants';

import asyncHandler from '@/util/asyncHandler';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import validateToken from '@/util/validateToken';
import announcementSelectionCriteria from '@/app/api/v1/announcement/announcement.selection.criteria';

const { INTERNAL_SERVER_ERROR, OK, NOT_FOUND } = sharedResponseTypes;

/**
 * Updates an announcement entry in the database based on the provided user input.
 *
 * This function filters the provided `userInput` object to extract only the fields with non-null
 * and non-undefined values, excluding the `id` field. It then updates the specific
 * announcement entry in the database with the filtered data.
 *
 * After the update operation, it retrieves the updated entry using its ID and additional
 * selection criteria. If the update fails or the entry cannot be retrieved, an error
 * response is returned. Otherwise, a success response containing the updated data is returned.
 *
 * @async
 * @param {Object} userInput - An object containing the fields to update and the identification
 *                             information of the announcement entry (e.g., `id`, `categoryParams`).
 *                             Fields with `undefined` or `null` values are ignored.
 * @param {Object} request - The current request object for context and response construction.
 * @returns {Object} - A response object indicating the success or failure of the update operation,
 *                     along with the updated document if successful.
 * @throws {Error} - Throws an error if the update fails or the announcement entry cannot be retrieved.
 */
const updateAnnouncementEntry = async (userInput, request) => {
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

    const updateDocument = await AnnouncementModel.update({
        where: { id: userInput?.id, category: userInput?.categoryParams },
        data: fieldsToUpdate,
        select: {
            id: true, // Only return the ID of the updated document
        },
    });

    const selectionCriteria = announcementSelectionCriteria();

    const updatedDocument = await AnnouncementModel.findUnique({
        where: {
            id: updateDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!updatedDocument?.id) {
        return INTERNAL_SERVER_ERROR(
            `Failed to update announcement entry with CATEGORY "${userInput?.categoryParams}" and ID "${userInput?.id}".`,
            request
        );
    }

    // No need for an aggregation pipeline; Prisma returns the created document
    return OK(
        `Announcement entry with CATEGORY "${userInput?.categoryParams}" and ID "${userInput?.id}" updated successfully.`,
        updatedDocument,
        request
    );
};

/**
 * Handles the process of updating an announcement by its category and ID.
 * This function includes several validations such as content type, user
 * authorization, and presence of the announcement entry. It also processes
 * file uploads, deletions, and updates corresponding database records.
 *
 * @async
 * @param {Object} request - The request object containing payload data, headers, and other request-specific details.
 * @param {Object} context - Context information that might be needed for specific operations, such as schema validations.
 * @returns {Object} - The response result of the update operation, which includes success or failure output with appropriate status and messages.
 *
 * @throws {Error} - Throws an error if there are issues during the validation, file operations, or database interactions.
 */
const handleUpdateAnnouncementByCategoryAndId = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(
        request,
        announcementConstants.allowedContentTypes
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
        () => announcementSchema.updateSchema()
    );

    // Check if announcement entry with the same title already exists
    const existingEntry = await AnnouncementModel.findUnique({
        where: {
            id: userInput?.id,
            category: userInput?.categoryParams,
        },
        select: {
            id: true,
            files: true,
        },
    });
    if (!existingEntry) {
        return NOT_FOUND(
            `Announcement entry with ID "${userInput?.id}" and CATEGORY ${userInput?.categoryParams} not found.`,
            request
        );
    }

    // Check if announcement entry with the same title already exists
    const existingTitle = await AnnouncementModel.findUnique({
        where: {
            category: userInput?.categoryParams,
            title: userInput?.title,
        },
        select: {
            id: true,
        },
    });
    if (!existingTitle) {
        return NOT_FOUND(
            `Announcement entry with ID "${userInput?.id}" and CATEGORY ${userInput?.categoryParams} not found.`,
            request
        );
    }

    if (userInput?.files?.length) {
        // Upload files and construct the `files` array for documents
        const files = await Promise.all(
            (userInput[careerConstants.fileFieldName] || []).map(
                async (fileEntry) => {
                    // Call your file upload operation
                    const { fileId, fileLink } =
                        await localFileOperations.uploadFile(
                            request,
                            fileEntry
                        );
                    return {
                        fileId: fileId,
                        file: fileLink,
                    };
                }
            )
        );

        userInput.files = files;
    }

    let files = {};

    if (userInput?.deleteFiles && Array.isArray(userInput.deleteFiles)) {
        // Check if all files in deleteFiles actually exist in the current files array
        const nonExistingFiles = userInput.deleteFiles.filter(
            (fileId) =>
                !existingEntry?.files?.some((file) => file.fileId === fileId)
        );

        if (nonExistingFiles.length > 0) {
            // If any file to be deleted is not found in the database, return 404 with the missing file IDs
            return NOT_FOUND(
                `File(s) with IDs [${nonExistingFiles.join(', ')}] not found in the database.`,
                request
            );
        }

        // Create an array of promises for each file deletion
        const deletePromises = userInput.deleteFiles.map((fileId) => {
            return localFileOperations.deleteFile(fileId); // Delete the file physically
        });

        // Filter out files that are being deleted (those in deleteFiles)
        files = existingEntry?.files?.filter(
            (file) => !userInput.deleteFiles.includes(file?.fileId)
        );

        // Delete the files physically using Promise.all
        await Promise.all(deletePromises);

        // After deletion, update the database to remove the deleted file objects
        await AnnouncementModel.update({
            where: { id: existingEntry.id }, // Assuming the record is identified by id
            data: {
                files: files, // Update the files field in the database, only keeping non-deleted files
            },
        });
    }

    userInput.files = files; // Assign the updated files list to userInput

    if (userInput?.date) {
        // Convert the date using Moment.js
        userInput.date = moment(
            userInput.date,
            ['DD/MM/YYYY', moment.ISO_8601],
            true
        ).toDate();
    }

    if (userInput?.advertiseMailTime) {
        // Convert the date using Moment.js
        userInput.advertiseMailTime = moment(
            userInput.advertiseMailTime,
            ['DD/MM/YYYY', moment.ISO_8601],
            true
        ).toDate();
    }

    if (userInput?.isHeadline) {
        userInput.isHeadline = userInput.isHeadline === true;
    }

    if (userInput?.isAdvertise) {
        userInput.isAdvertise = userInput.isAdvertise === true;
    }

    delete userInput.deleteFiles; // Remove deleteFiles field from userInput
    delete userInput.categoryParams; // Remove categoryParams field from userInput

    // Create the announcement entry and send the response
    return updateAnnouncementEntry(userInput, request);
};

/**
 * Asynchronously deletes an announcement based on the provided category and ID.
 *
 * This function validates the user's authorization, parses and validates form data, checks for
 * the existence of the announcement, deletes associated files, and performs the deletion
 * of the announcement entry. Returns a success response if the deletion is successful,
 * or an appropriate error response in case of issues.
 *
 * @param {Object} request - The request object containing the necessary data for authorization and deletion.
 * @param {Object} context - The context object containing additional parameters or configurations.
 * @returns {Promise<Object>} A response object indicating the success or failure of the operation.
 */
const deleteAnnouncementByCategoryAndId = async (request, context) => {
    // Validate admin
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response; // Return early with the authorization failure response
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'delete',
        () => announcementSchema.categoryAndIdSchema()
    );

    // Check if data exists
    const data = await AnnouncementModel.findUnique({
        where: {
            id: userInput?.id,
            category: userInput?.categoryParams,
        },
        select: {
            id: true, // Only return the ID of the deleted document
            files: true,
        },
    });
    if (!data) {
        return NOT_FOUND(
            `Announcement entry with ID "${userInput?.id}" and CATEGORY "${userInput?.categoryParams}" not found.`,
            request
        );
    }

    if (data?.files?.length) {
        // Create an array of promises for each file deletion
        const deleteFilesPromises = data.files.map((file) => {
            return localFileOperations.deleteFile(file?.fileId); // Delete the file physically
        });

        // Delete the files physically using Promise.all
        await Promise.all(deleteFilesPromises);
    }

    // Perform the deletion with the specified projection field for optional file handling
    await AnnouncementModel.delete({
        where: {
            id: userInput?.id,
            category: userInput?.categoryParams,
        },
    });

    // If no document is found, send a 404 response
    const deletedData = await AnnouncementModel.findUnique({
        where: {
            id: userInput?.id,
            category: userInput?.categoryParams,
        },
        select: {
            id: true, // Only return the ID of the deleted document
        },
    });
    if (deletedData) {
        return NOT_FOUND(
            `Failed to delete announcement entry with ID "${userInput?.id}" and CATEGORY "${userInput?.categoryParams}".`,
            request
        );
    }

    // Send a success response
    return OK(
        `Announcement entry with ID "${userInput?.id}" and CATEGORY "${userInput?.categoryParams}" deleted successfully.`,
        {},
        request
    );
};

/**
 * PATCH is an asynchronous middleware function that handles HTTP PATCH requests
 * to update an announcement identified by its category and ID.
 * It utilizes an `asyncHandler` to manage asynchronous operations,
 * ensuring proper error handling and response management during the update process.
 *
 * Dependencies:
 * - `asyncHandler`: A wrapper to handle asynchronous route functions and errors.
 * - `handleUpdateAnnouncementByCategoryAndId`: The specific handler logic that processes
 *   the update operation based on the announcement's category and ID parameters.
 *
 * Usage:
 * Assigns the provided `asyncHandler` and `handleUpdateAnnouncementByCategoryAndId` function
 * to handle the PATCH route for announcements, allowing updates to specific entries.
 */
export const PATCH = asyncHandler(handleUpdateAnnouncementByCategoryAndId);

/**
 * DELETE is an asynchronous function wrapped with asyncHandler to handle exceptions.
 *
 * It is responsible for deleting an announcement by its category and ID.
 * The functionality is executed by the deleteAnnouncementByCategoryAndId function
 * that it encapsulates.
 *
 * Usage of this variable typically involves API request handling for deletion
 * of a specific resource in the application.
 */
export const DELETE = asyncHandler(deleteAnnouncementByCategoryAndId);
