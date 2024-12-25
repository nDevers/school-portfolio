import { FacultyModel } from '@/shared/prisma.model.shared';
import facultySchema from '@/app/api/v1/faculty/faculty.schema';
import facultyConstants from '@/app/api/v1/faculty/faculty.constants';
import sharedResponseTypes from '@/shared/shared.response.types';
import localFileOperations from '@/util/localFileOperations';

import asyncHandler from '@/util/asyncHandler';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import validateToken from '@/util/validateToken';
import facultySelectionCriteria from '@/app/api/v1/faculty/faculty.selection.criteria';

const { INTERNAL_SERVER_ERROR, CONFLICT, OK, NOT_FOUND } = sharedResponseTypes;

/**
 * Updates an existing faculty entry in the database with the provided user input.
 * Filters the user input to exclude null, undefined, and specific fields, and updates only valid fields.
 *
 * @async
 * @param {Object} userInput - The data provided by the user to update the faculty entry.
 * @param {string} userInput.id - The unique identifier of the faculty entry to be updated.
 * @param {string} userInput.categoryParams - The category parameter related to the entry.
 * @param {Object} request - The incoming request object related to the update operation.
 * @returns {Promise<Object>} A response indicating the success or failure of the update operation,
 * containing the updated faculty entry or an error message.
 * @throws {Error} If the update operation fails or if the document cannot be located after the update.
 */
const updateFacultyEntry = async (userInput, request) => {
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

    const updateDocument = await FacultyModel.update({
        where: { id: userInput?.id, category: userInput?.categoryParams },
        data: fieldsToUpdate,
        select: {
            id: true, // Only return the ID of the updated document
        },
    });

    const selectionCriteria = facultySelectionCriteria();

    const updatedDocument = await FacultyModel.findUnique({
        where: {
            id: updateDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!updatedDocument?.id) {
        return INTERNAL_SERVER_ERROR(
            `Failed to update faculty entry with CATEGORY "${userInput?.categoryParams}" and ID "${userInput?.id}".`,
            request
        );
    }

    // No need for an aggregation pipeline; Prisma returns the created document
    return OK(
        `Faculty entry with CATEGORY "${userInput?.categoryParams}" and ID "${userInput?.id}" updated successfully.`,
        updatedDocument,
        request
    );
};

/**
 * Asynchronously handles the update of a faculty entry by category and ID.
 *
 * This function validates the incoming request and processes it to update a faculty record in the database.
 * It performs the following operations:
 * - Validates the content type of the request.
 * - Confirms if the user is authorized to perform the update.
 * - Parses and validates the incoming form data against a predefined schema.
 * - Checks if the specified faculty entry exists in the database based on the provided ID and category.
 * - Ensures no duplicate entry exists based on unique fields such as email, mobile, or portfolio.
 * - Handles the replacement of the faculty image if a new file is uploaded, including deleting the old image and uploading the new one.
 * - Updates the faculty entry and constructs the appropriate response.
 *
 * @async
 * @param {Object} request - The request object containing all the necessary data for the update operation.
 * @param {Object} context - The context object containing utility and runtime information for the function.
 * @returns {Object} - An appropriate response based on the operation's success or failure.
 */
const handleUpdateFacultyByCategoryAndId = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(
        request,
        facultyConstants.allowedContentTypes
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
        () => facultySchema.updateSchema()
    );

    // Check if faculty entry with the same title already exists
    const existingEntry = await FacultyModel.findUnique({
        where: {
            id: userInput?.id,
            category: userInput?.categoryParams,
        },
        select: {
            id: true,
            imageId: true,
        },
    });
    if (!existingEntry) {
        return NOT_FOUND(
            `Faculty entry with ID "${userInput?.id}" and CATEGORY ${userInput?.categoryParams} not found.`,
            request
        );
    }

    // Dynamically build the OR condition based on provided fields
    const conditions = [];
    if (userInput?.email) {
        conditions.push({ email: userInput.email });
    }
    if (userInput?.mobile) {
        conditions.push({ mobile: userInput.mobile });
    }
    if (userInput?.portfolio) {
        conditions.push({ portfolio: userInput.portfolio });
    }

    // Only perform the query if at least one condition is provided
    if (conditions.length > 0) {
        const existingEntry = await FacultyModel.findFirst({
            where: {
                OR: conditions,
            },
            select: {
                id: true,
                imageId: true,
            },
        });

        if (existingEntry) {
            return CONFLICT(
                `Faculty entry with email: "${userInput?.email}", mobile: ${userInput?.mobile} and portfolio "${userInput?.portfolio}" already exists.`,
                request
            );
        }
    }

    if (userInput[facultyConstants.imageFieldName]) {
        await localFileOperations.deleteFile(existingEntry.imageId);

        // Upload file and generate link
        const newFile = userInput[facultyConstants.imageFieldName][0];
        const { fileId, fileLink } = await localFileOperations.uploadFile(
            request,
            newFile
        );

        userInput.imageId = fileId;
        userInput.image = fileLink;
    }

    delete userInput.categoryParams;

    // Create the faculty entry and send the response
    return updateFacultyEntry(userInput, request);
};

/**
 * Function to delete a faculty entry by its category and ID.
 *
 * Validates the request token to ensure the user is authorized to
 * perform the deletion. Parses and validates the request body
 * against the expected schema to ensure input correctness.
 *
 * Checks whether a faculty entry matching the provided ID and
 * category exists. If the entry exists, it deletes any associated
 * physical files before removing the entry from the database.
 *
 * If the specified faculty entry does not exist, or if the
 * deletion fails unexpectedly, an appropriate error response
 * is returned. On successful deletion, a success response is
 * sent back to the requester.
 *
 * @param {Object} request - The incoming request containing the necessary data to delete a faculty entry.
 * @param {Object} context - The context object containing dependencies and configurations for processing the request.
 * @returns {Promise<Object>} A promise resolving to a response indicating the result of the deletion operation.
 */
const deleteFacultyByCategoryAndId = async (request, context) => {
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
        () => facultySchema.categoryAndIdSchema()
    );

    // Check if data exists
    const data = await FacultyModel.findUnique({
        where: {
            id: userInput?.id,
            category: userInput?.categoryParams,
        },
        select: {
            id: true, // Only return the ID of the deleted document
            imageId: true,
        },
    });
    if (!data) {
        return NOT_FOUND(
            `Faculty entry with ID "${userInput?.id}" and CATEGORY "${userInput?.categoryParams}" not found.`,
            request
        );
    }

    if (data?.imageId) {
        await localFileOperations.deleteFile(data?.imageId); // Delete the file physically
    }

    // Perform the deletion with the specified projection field for optional file handling
    await FacultyModel.delete({
        where: {
            id: userInput?.id,
            category: userInput?.categoryParams,
        },
    });

    // If no document is found, send a 404 response
    const deletedData = await FacultyModel.findUnique({
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
            `Failed to delete faculty entry with ID "${userInput?.id}" and CATEGORY "${userInput?.categoryParams}".`,
            request
        );
    }

    // Send a success response
    return OK(
        `Faculty entry with ID "${userInput?.id}" and CATEGORY "${userInput?.categoryParams}" deleted successfully.`,
        {},
        request
    );
};

/**
 * An asynchronous handler function assigned to the `PATCH` variable.
 * It is responsible for updating a faculty record based on its category and ID.
 * The function utilizes an asynchronous wrapper to handle errors and streamline the update process.
 *
 * @constant
 * @type {Function}
 * @async
 * @param {Function} asyncHandler - A middleware function used to catch and handle errors in asynchronous operations.
 * @param {Function} handleUpdateFacultyByCategoryAndId - A controller function that processes the update logic for updating a faculty member based on the specified category and identifier.
 */
export const PATCH = asyncHandler(handleUpdateFacultyByCategoryAndId);

/**
 * DELETE is a variable representing an asynchronous handler function.
 * It is used to delete a faculty member by their category and ID.
 * The function is wrapped using an asyncHandler utility to handle
 * potential errors during asynchronous operations.
 *
 * The deleteFacultyByCategoryAndId function is invoked with the required
 * parameters to perform the deletion operation.
 */
export const DELETE = asyncHandler(deleteFacultyByCategoryAndId);
