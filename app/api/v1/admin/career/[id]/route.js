import { PrismaClient } from '@prisma/client';
import moment from 'moment';

import careerSchema from "@/app/api/v1/career/career.schema";
import careerConstants from "@/app/api/v1/career/career.constants";
import sharedResponseTypes from "@/shared/shared.response.types";
import localFileOperations from "@/util/localFileOperations";
import schemaShared from "@/shared/schema.shared";

import asyncHandler from "@/util/asyncHandler";
import parseAndValidateFormData from "@/util/parseAndValidateFormData";
import validateToken from "@/util/validateToken";
import validateUnsupportedContent from "@/util/validateUnsupportedContent";
import careerSelectionCriteria from "@/app/api/v1/career/career.selection.criteria";

/**
 * An instance of PrismaClient, which is used to interact with a database through Prisma's query engine.
 *
 * PrismaClient provides methods for performing CRUD operations, executing raw SQL queries, and managing database connections.
 *
 * This instance is typically used as the main access point for querying and manipulating data in a Prisma-managed database.
 *
 * Ensure to call the appropriate lifecycle methods (e.g., `$connect`, `$disconnect`) to manage database connections effectively in your application.
 */
const prisma = new PrismaClient();

const { INTERNAL_SERVER_ERROR, NOT_FOUND, CONFLICT, OK } = sharedResponseTypes;
const { idValidationSchema } = schemaShared;

/**
 * Represents the Prisma model `Career`.
 * This model is typically used for interaction with the `Career` table in the database.
 * Provides mechanisms to query, create, update, and delete `Career` records.
 *
 * The structure and fields of this model are defined in the Prisma schema.
 * Use this model to perform database operations related to career data.
 */
const model = prisma.Career;

/**
 * Updates a career entry in the database based on the given user input.
 *
 * This function filters the provided user input to include only fields with non-null and non-undefined values,
 * excluding the `id` field. It updates the database with these filtered values and retrieves the updated document
 * using a pre-defined set of selection criteria. If the update or retrieval process fails, it returns an error response.
 * Upon success, it returns a success response with the updated document.
 *
 * @param {Object} userInput - The user's input containing fields to update and the `id` of the career entry.
 * @param {Object} request - The request object, typically representing the incoming request context.
 * @returns {Promise<Object>} - A promise resolving to a server response indicating success or failure,
 *                              including the updated document if successful.
 */
const updateCareerEntry = async (userInput, request) => {
    // Filter `userInput` to only include fields with non-null values
    const fieldsToUpdate = Object.keys(userInput).reduce((acc, key) => {
        if (userInput[key] !== undefined && userInput[key] !== null && key !== 'id') {
            acc[key] = userInput[key];
        }
        return acc;
    }, {});

    // Update the document with the filtered data
    const updateDocument = await model.update({
        where: { id: userInput?.id },
        data: fieldsToUpdate,
        select: {
            id: true, // Only return the ID of the updated document
        },
    });

    const selectionCriteria = careerSelectionCriteria();

    const updatedDocument = await model.findUnique({
        where: {
            id: updateDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!updatedDocument?.id) {
        return INTERNAL_SERVER_ERROR(`Failed to update career entry with the ID "${userInput?.id}".`, request);
    }

    return OK(`Career entry with the ID "${userInput?.id}" updated successfully.`, updatedDocument, request);
};

/**
 * Handles the update operation for a career entry by its unique ID.
 *
 * This function performs the following operations:
 * - Validates the content type of the request.
 * - Authorizes the user to ensure they have necessary permissions.
 * - Parses and validates the form data against a defined schema.
 * - Checks if a career entry with the provided ID exists in the database.
 * - Ensures that a career entry with the same title does not already exist.
 * - Handles file uploads, including adding new files and deleting specified files.
 * - Converts the provided date to a standard format using Moment.js.
 * - Updates the career entry in the database and returns the response.
 *
 * @async
 * @param {Object} request - The request object containing the data and metadata for the update operation.
 * @param {Object} context - The context object, typically containing information about the current execution environment.
 * @returns {Promise<Object>} A response object containing the status and any data or error messages related to the operation.
 */
const handleUpdateCareerById = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(request, careerConstants.allowedContentTypes);
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Validate if the user is authorized (admin)
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, context, 'update', careerSchema.updateSchema);

    // Check if FAQ entry with the same title already exists
    const existingCareer = await model.findUnique({
        where: {
            id: userInput?.id,
        },
        select: {
            id: true,
            files: true,
        }
    });
    if (!existingCareer) {
        return NOT_FOUND(`Career entry with ID "${userInput?.id}" not found.`, request);
    }

    if (userInput?.title) {
        // Check if FAQ entry with the same title already exists
        const existingQuestion = await model.findUnique({
            where: {
                title: userInput?.title,
            },
            select: {
                id: true,
            }
        });
        if (existingQuestion) {
            return CONFLICT(`Career entry with title "${userInput?.title}" already exists.`, request);
        }
    }

    if (userInput?.files?.length) {
        // Upload files and construct the `files` array for documents
        const files = await Promise.all(
            (userInput[careerConstants.fileFieldName] || []).map(async (fileEntry) => {
                // Call your file upload operation
                const { fileId, fileLink } = await localFileOperations.uploadFile(request, fileEntry);
                return {
                    fileId: fileId,
                    file: fileLink
                };
            })
        );

        userInput.files = files;
    }

    let files = {};

    if (userInput?.deleteFiles && Array.isArray(userInput.deleteFiles)) {
        // Check if all files in deleteFiles actually exist in the current files array
        const nonExistingFiles = userInput.deleteFiles.filter(fileId =>
            !existingCareer?.files?.some(file => file.fileId === fileId)
        );

        if (nonExistingFiles.length > 0) {
            // If any file to be deleted is not found in the database, return 404 with the missing file IDs
            return NOT_FOUND(`File(s) with IDs [${nonExistingFiles.join(', ')}] not found in the database.`, request);
        }

        // Create an array of promises for each file deletion
        const deletePromises = userInput.deleteFiles.map(fileId => {
            return localFileOperations.deleteFile(fileId); // Delete the file physically
        });

        // Filter out files that are being deleted (those in deleteFiles)
        files = existingCareer?.files?.filter(file => !userInput.deleteFiles.includes(file?.fileId));

        // Delete the files physically using Promise.all
        await Promise.all(deletePromises);

        // After deletion, update the database to remove the deleted file objects
        await model.update({
            where: { id: existingCareer.id }, // Assuming the record is identified by id
            data: {
                files: files // Update the files field in the database, only keeping non-deleted files
            }
        });
    }

    delete userInput.deleteFiles;  // Remove deleteFiles field from userInput

    userInput.files = files; // Assign the updated files list to userInput

    // Use Moment.js to convert the date
    if (userInput?.date) {
        // Convert the date using Moment.js
        userInput.date = moment(userInput.date, ['DD/MM/YYYY', moment.ISO_8601], true).toDate();
    }

    // Create the FAQ entry and send the response
    return updateCareerEntry(userInput, request);
};

/**
 * Asynchronously deletes a career entry by its unique identifier.
 *
 * Validates the provided request token to ensure the user has administrative access.
 * Parses and validates the request data to retrieve a valid career ID. If the career entry
 * corresponding to the provided ID does not exist, a "not found" response is returned.
 *
 * If the career entry associates any files, all associated files are deleted physically
 * before deleting the career entry record from the database. The deletion is performed
 * based on the specified career ID and ensures the record no longer exists in the database
 * after the operation completes.
 *
 * Returns an appropriate response depending on whether the deletion was successful,
 * failed, or if the resource was not found.
 *
 * @param {Object} request - The incoming HTTP request object containing authentication and data payload.
 * @param {Object} context - The execution context for handling auxiliary operations.
 * @returns {Object} A response object indicating the result of the deletion process (success or failure).
 */
const deleteCareerById = async (request, context) => {
    // Validate admin
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response; // Return early with the authorization failure response
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, context, 'delete', idValidationSchema);

    // Check if data exists
    const data = await model.findUnique({
        where: {
            id: userInput?.id,
        },
        select: {
            id: true, // Only return the ID of the deleted document
            files: true,
        },
    });
    if (!data) {
        return NOT_FOUND(`Career entry with ID "${userInput?.id}" not found.`, request);
    }

    if (data?.files?.length) {
        // Create an array of promises for each file deletion
        const deleteFilesPromises = data.files.map(file => {
            return localFileOperations.deleteFile(file?.fileId); // Delete the file physically
        });

        // Delete the files physically using Promise.all
        await Promise.all(deleteFilesPromises);
    }

    // Perform the deletion with the specified projection field for optional file handling
    await model.delete({
        where: {
            id: userInput?.id,
        },
    });

    // If no document is found, send a 404 response
    const deletedData = await model.findUnique({
        where: {
            id: userInput?.id,
        },
        select: {
            id: true // Only return the ID of the deleted document
        },
    });
    if (deletedData) {
        return NOT_FOUND(`Failed to delete career entry with ID "${userInput?.id}".`, request);
    }

    // Send a success response
    return OK(`Career entry with ID "${userInput?.id}" deleted successfully.`, {}, request);
};

/**
 * PATCH is an asynchronous handler function intended for managing updates to a specific career entry by its unique identifier.
 *
 * The function encapsulates the logic to process an update operation, ensuring any asynchronous errors are appropriately managed.
 * It is leveraged within a route to handle HTTP PATCH requests aimed at modifying career-related data.
 *
 * The handler connects with the underlying service or database logic to perform the update operation,
 * verifying and applying the necessary changes to the targeted resource by its ID.
 *
 * This function is designed to provide a robust and streamlined way to handle updates
 * while maintaining a clean separation of asynchronous error-handling responsibilities with the use of `asyncHandler`.
 *
 * Dependencies or related functions:
 * - `asyncHandler`: Utility to catch and process errors within asynchronous route handlers.
 * - `handleUpdateCareerById`: The core function that contains the business logic for updating a career entry by ID.
 */
export const PATCH = asyncHandler(handleUpdateCareerById);

/**
 * DELETE is an asynchronous function handler that invokes the `deleteCareerById` function.
 * It is typically used to handle requests for deleting a career record by its unique identifier.
 * The function leverages `asyncHandler` to manage asynchronous operations and error handling.
 *
 * @type {Function}
 */
export const DELETE = asyncHandler(deleteCareerById);
