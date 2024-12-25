import { SchoolInfoModel } from "@/shared/prisma.model.shared";
import serviceShared from "@/shared/service.shared";
import schoolInfoSchema from "@/app/api/v1/school/info/school.info.schema";
import schoolInfoConstants from "@/app/api/v1/school/info/school.info.constants";
import sharedResponseTypes from "@/shared/shared.response.types";
import localFileOperations from "@/util/localFileOperations";

import asyncHandler from "@/util/asyncHandler";
import parseAndValidateFormData from "@/util/parseAndValidateFormData";
import validateToken from "@/util/validateToken";
import validateUnsupportedContent from "@/util/validateUnsupportedContent";
import schoolInfoSelectionCriteria from "@/app/api/v1/school/info/school.info.selection.criteria";


const { INTERNAL_SERVER_ERROR, NOT_FOUND, CONFLICT, OK } = sharedResponseTypes;

/**
 * Asynchronously updates a school information entry based on the provided user input.
 *
 * This function filters the user input to exclude null or undefined fields, and then updates
 * the corresponding database entry identified by the `id` field in the user input. After the
 * update, it retrieves the updated document based on defined selection criteria.
 *
 * In case the update operation fails or the updated document cannot be retrieved, an internal
 * server error response is returned. Otherwise, it returns a success response containing the
 * updated document data.
 *
 * @param {Object} userInput - The input data for updating the school information entry. Must include an `id` field to identify the entry to update.
 * @param {Object} request - The request object, used for error handling and constructing responses.
 * @returns {Promise<Object>} A response object indicating the success or failure of the update operation, including the updated document data on success.
 */
const updateSchoolInfoEntry = async (userInput, request) => {
    // Filter `userInput` to only include fields with non-null values
    const fieldsToUpdate = Object.keys(userInput).reduce((acc, key) => {
        if (userInput[key] !== undefined && userInput[key] !== null && key !== 'id') {
            acc[key] = userInput[key];
        }
        return acc;
    }, {});

    // Update the document with the filtered data
    const updateDocument = await SchoolInfoModel.update({
        where: { id: userInput?.id },
        data: fieldsToUpdate,
        select: {
            id: true, // Only return the ID of the updated document
        },
    });

    const selectionCriteria = schoolInfoSelectionCriteria();

    const updatedDocument = await SchoolInfoModel.findUnique({
        where: {
            id: updateDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!updatedDocument?.id) {
        return INTERNAL_SERVER_ERROR(`Failed to update school info entry with the ID "${userInput?.id}".`, request);
    }

    return OK(`School info entry with the ID "${userInput?.id}" updated successfully.`, updatedDocument, request);
};

/**
 * Handles updating school information by the provided school ID.
 *
 * This function performs the following operations:
 * - Validates the content type of the incoming request to ensure it matches the allowed content types.
 * - Validates the user's authorization, ensuring the requester has appropriate admin permissions.
 * - Parses and validates the request's form data based on defined schemas for updating school information.
 * - Verifies if the school info entry with the given ID exists. If not, a "Not Found" response is returned.
 * - Checks for conflicts by ensuring no existing school info entry has the same title as the new input (if a title is provided).
 * - Handles file replacements by deleting the old file (if applicable) and uploading the new file.
 * - Updates the given school information entry in the database and returns the appropriate response.
 *
 * @async
 * @param {Object} request - The request object containing the details of the operation to be performed.
 * @param {Object} context - The context object containing additional metadata or operational details.
 * @returns {Object} The response object detailing the outcome of the operation, including error or success messages.
 */
const handleUpdateSchoolInfoById = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(request, schoolInfoConstants.allowedContentTypes);
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Validate if the user is authorized (admin)
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, context, 'update', schoolInfoSchema.updateSchema);

    // Check if school info entry with the same title already exists
    const existingSchoolInfo = await SchoolInfoModel.findUnique({
        where: {
            id: userInput?.id,
        },
        select: {
            id: true,
            iconId: true
        }
    });
    if (!existingSchoolInfo) {
        return NOT_FOUND(`School info entry with ID "${userInput?.id}" not found.`, request);
    }

    if (userInput?.title) {
        // Check if school info entry with the same title already exists
        const existingQuestion = await SchoolInfoModel.findUnique({
            where: {
                title: userInput?.title,
            },
            select: {
                id: true,
            }
        });
        if (existingQuestion) {
            return CONFLICT(`School info entry with title "${userInput?.title}" already exists.`, request);
        }
    }

    // Handle file replacement if a new file is provided
    if (userInput[schoolInfoConstants.fileFieldName] && userInput[schoolInfoConstants.fileFieldName][0]) {
        await localFileOperations.deleteFile(existingSchoolInfo?.iconId); // Delete old file

        const newFile = userInput[schoolInfoConstants.fileFieldName][0];
        const { fileId, fileLink } = await localFileOperations.uploadFile(request, newFile);

        userInput.iconId = fileId;
        userInput.icon = fileLink;
    }

    // Create the school info entry and send the response
    return updateSchoolInfoEntry(userInput, request);
};

/**
 * Asynchronously deletes school information by its identifier.
 *
 * @function deleteSchoolInfoById
 * @async
 * @param {Object} request - The request object containing the necessary parameters to perform the deletion.
 * @param {Object} context - The context object providing environmental or user-related information.
 * @returns {Promise<any>} A promise that resolves to the result of the deletion operation.
 */
const deleteSchoolInfoById = async (request, context) => {
    return serviceShared.deleteEntryById(request, context, SchoolInfoModel, 'iconId', 'school info');
};

/**
 * PATCH is a function wrapped with an asynchronous handler to manage the process
 * of updating school information by its ID. It utilizes the `handleUpdateSchoolInfoById`
 * function to execute the logic for the update operation.
 *
 * The purpose of this function is to ensure that the school information is updated
 * securely and efficiently, handling any potential asynchronous errors effectively.
 *
 * Note: This function is expected to be used as part of a routing or middleware system.
 *
 * @type {Function}
 */
export const PATCH = asyncHandler(handleUpdateSchoolInfoById);

/**
 * DELETE is an asynchronous handler function for deleting school information by its unique identifier.
 * It utilizes the deleteSchoolInfoById function to perform the deletion operation.
 *
 * This variable is intended to streamline the process of handling deletion requests
 * by encapsulating the asynchronous logic within an error-handling middleware.
 *
 * The deleteSchoolInfoById function should be defined elsewhere in the application
 * and is expected to handle the specifics of locating and deleting the school information from the appropriate data source.
 */
export const DELETE = asyncHandler(deleteSchoolInfoById);
