import { PrismaClient } from '@prisma/client';
import moment from "moment";

import academicSchema from "@/app/api/v1/academic/academic.schema";
import academicConstants from "@/app/api/v1/academic/academic.constants";
import sharedResponseTypes from "@/shared/shared.response.types";
import localFileOperations from "@/util/localFileOperations";

import asyncHandler from "@/util/asyncHandler";
import validateUnsupportedContent from "@/util/validateUnsupportedContent";
import parseAndValidateFormData from "@/util/parseAndValidateFormData";
import validateToken from "@/util/validateToken";
import academicSelectionCriteria from "@/app/api/v1/academic/academic.selection.criteria";

/**
 * An instance of PrismaClient, which serves as an entry point to interact with the database
 * using the Prisma ORM (Object-Relational Mapping). This client enables operations such as
 * querying, creating, updating, and deleting records in the database.
 *
 * PrismaClient manages the database connection and provides methods corresponding to
 * the defined Prisma schema, offering a strongly-typed API for seamless database interactions.
 *
 * Note: Ensure proper management of the client instance, such as opening and closing database
 * connections when necessary, to avoid resource leaks.
 *
 * Typical usage includes:
 *  - Accessing model-specific methods to work with database tables/entities.
 *  - Executing raw SQL queries if needed.
 *  - Performing complex database operations in an organized and efficient manner.
 */
const prisma = new PrismaClient();

const { INTERNAL_SERVER_ERROR, CONFLICT, OK, NOT_FOUND } = sharedResponseTypes;

/**
 * Represents the Academic model in the Prisma schema.
 * This model is used to interact with the 'Academic' entity in the database.
 * Includes all the fields and relationships defined in the Prisma schema for the Academic model.
 *
 * This model supports operations such as create, read, update, and delete (CRUD).
 * Utilize this model for managing and querying data related to academics.
 */
const model = prisma.Academic;

/**
 * Updates an academic entry in the database based on provided input values.
 * This function filters out null or undefined fields from the user input,
 * constructs an update payload, and updates the academic entry in the database.
 * It also retrieves the updated entry using specific selection criteria for precise information.
 *
 * @param {Object} userInput - The input object containing fields to update in the academic entry.
 * @param {string} userInput.id - The unique identifier of the academic entry to update.
 * @param {string} userInput.categoryParams - The category parameter associated with the entry.
 * @param {Object} request - The HTTP request object for context in error handling or success messages.
 * @returns {Promise<Object>} A response object indicating success or failure of the update operation,
 * including the updated entry details if successful.
 * @throws {Error} Throws an error if the update or retrieval fails, returning an INTERNAL_SERVER_ERROR response.
 */
const updateAcademicEntry = async (userInput, request) => {
    // Filter `userInput` to only include fields with non-null values
    const fieldsToUpdate = Object.keys(userInput).reduce((acc, key) => {
        if (userInput[key] !== undefined && userInput[key] !== null && key !== 'id') {
            acc[key] = userInput[key];
        }
        return acc;
    }, {});

    const updateDocument = await model.update({
        where: { id: userInput?.id, category: userInput?.categoryParams },
        data: fieldsToUpdate,
        select: {
            id: true, // Only return the ID of the updated document
        },
    });

    const selectionCriteria = academicSelectionCriteria();

    const updatedDocument = await model.findUnique({
        where: {
            id: updateDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!updatedDocument?.id) {
        return INTERNAL_SERVER_ERROR(`Failed to update academic entry with CATEGORY "${userInput?.categoryParams}" and ID "${userInput?.id}".`, request);
    }

    // No need for an aggregation pipeline; Prisma returns the created document
    return OK(`Academic entry with CATEGORY "${userInput?.categoryParams}" and ID "${userInput?.id}" updated successfully.`, updatedDocument, request);
};

/**
 * Asynchronously handles the update of an academic entry by category and ID.
 *
 * This function processes an update request for an academic entry, including form data validation,
 * user authentication, content type validation, and optional file uploads. It ensures that the
 * category and ID combination corresponds to an existing entry and validates the absence of
 * duplicate titles within the specified category before performing the update.
 *
 * @param {Object} request - The HTTP request object containing the data to process for the update.
 * @param {Object} context - The context of the function call, which may contain additional metadata or resources.
 * @returns {Promise<Object>} - A promise resolving to the HTTP response object based on the operation result.
 *
 * Steps performed by this function:
 * - Validates the content type of the request to ensure compliance with supported types.
 * - Validates user authorization by checking their token.
 * - Parses and validates the provided form data against the predefined schema.
 * - Confirms the existence of an academic entry matching the provided category and ID combination.
 * - Ensures no duplicate entries exist with the same title within the specified category.
 * - Handles file upload operations and updates the entry if new files are provided.
 * - Validates and formats the `publishDate` field if present.
 * - Executes the update and returns the corresponding result.
 */
const handleUpdateAcademicByCategoryAndId = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(request, academicConstants.allowedContentTypes);
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Validate if the user is authorized (admin)
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, context, 'update', () => academicSchema.updateSchema());

    // Check if academic entry with the same title already exists
    const existingQuestion = await model.findUnique({
        where: {
            id: userInput?.id,
            category: userInput?.categoryParams,
        },
        select: {
            id: true,
            fileId: true,
        }
    });
    if (!existingQuestion) {
        return NOT_FOUND(`Academic entry with ID "${userInput?.id}" and CATEGORY ${userInput?.categoryParams} not found.`, request);
    }

    if (userInput?.title) {
        // Check if FAQ entry with the same title already exists
        const existingTitle = await model.findUnique({
            where: {
                title: userInput?.title,
                category: userInput?.categoryParams,
            },
            select: {
                id: true,
            }
        });
        if (existingTitle) {
            return CONFLICT(`Academic entry with ID "${userInput?.id}" and CATEGORY ${userInput?.categoryParams} already exists.`, request);
        }
    }

    if (userInput[academicConstants.fileFieldName]) {
        await localFileOperations.deleteFile(existingQuestion.fileId)

        // Upload file and generate link
        const newFile = userInput[academicConstants.fileFieldName][0];
        const { fileId, fileLink } = await localFileOperations.uploadFile(request, newFile);

        userInput.fileId = fileId;
        userInput.file = fileLink;
    }

    if (userInput?.publishDate) {
        userInput.publishDate = moment(userInput.publishDate, ['DD/MM/YYYY', moment.ISO_8601], true).toDate();
    }

    delete userInput.categoryParams;

    // Create the academic entry and send the response
    return updateAcademicEntry(userInput, request);
};

/**
 * Deletes an academic entry identified by a specific category and ID.
 *
 * This function validates the request to ensure the user is authorized
 * and has the necessary permissions before proceeding to delete the requested
 * academic entry. It also verifies the existence of the entry, processes
 * any associated files, and performs cleanup for consistency.
 * Provides error handling and sends appropriate responses during failures or successes.
 *
 * Key operations performed:
 * - Validates the authorization token to ensure the user has admin rights.
 * - Parses and validates form data against a defined schema for delete operations.
 * - Confirms the academic entry exists by searching with the given ID and category.
 * - Deletes any associated files such as banners, if applicable.
 * - Deletes the academic entry from the database using its ID and category.
 * - Checks post-deletion to ensure the record is removed from the database.
 * - Sends HTTP responses indicating success, not found errors, or other relevant errors.
 *
 * @param {Object} request - The incoming request, typically containing headers, body, and other parameters.
 * @param {Object} context - The execution context, containing environment configurations or utility functions.
 * @returns {Promise<Object>} A promise that resolves to an HTTP response object. The response contains a
 *                            success message or an appropriate error message if the deletion fails or
 *                            the resource is not found.
 */
const deleteAcademicByCategoryAndId = async (request, context) => {
    // Validate admin
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response; // Return early with the authorization failure response
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, context, 'delete', () => academicSchema.categoryAndIdSchema());

    // Check if data exists
    const data = await model.findUnique({
        where: {
            id: userInput?.id,
            category: userInput?.categoryParams,
        },
        select: {
            id: true, // Only return the ID of the deleted document
            fileId: true,
        },
    });
    if (!data) {
        return NOT_FOUND(`Academic entry with ID "${userInput?.id}" and CATEGORY "${userInput?.categoryParams}" not found.`, request);
    }

    if (data?.bannerId) {
        await localFileOperations.deleteFile(data?.bannerId); // Delete the file physically
    }

    // Perform the deletion with the specified projection field for optional file handling
    await model.delete({
        where: {
            id: userInput?.id,
            category: userInput?.categoryParams
        },
    });

    // If no document is found, send a 404 response
    const deletedData = await model.findUnique({
        where: {
            id: userInput?.id,
            category: userInput?.categoryParams
        },
        select: {
            id: true // Only return the ID of the deleted document
        },
    });
    if (deletedData) {
        return NOT_FOUND(`Failed to delete academic entry with ID "${userInput?.id}" and CATEGORY "${userInput?.categoryParams}".`, request);
    }

    // Send a success response
    return OK(`Academic entry with ID "${userInput?.id}" and CATEGORY "${userInput?.categoryParams}" deleted successfully.`, {}, request);
};

/**
 * PATCH is an asynchronous function that updates academic records by category and ID.
 * It leverages the `asyncHandler` utility to handle asynchronous operations and potential errors.
 * The core functionality is provided by the `handleUpdateAcademicByCategoryAndId` function,
 * which performs the update logic based on the provided parameters.
 *
 * This constant serves as a route handler for HTTP PATCH requests, ensuring that the specified
 * category and ID are used to locate and update the corresponding academic records.
 */
export const PATCH = asyncHandler(handleUpdateAcademicByCategoryAndId);

/**
 * Represents an asynchronous handler for deleting an academic resource
 * based on a specified category and identifier.
 *
 * The `DELETE` variable is used to handle HTTP DELETE requests by invoking
 * the `deleteAcademicByCategoryAndId` function, wrapped with `asyncHandler`
 * to manage asynchronous operations and handle potential errors effectively.
 *
 * The `deleteAcademicByCategoryAndId` function is expected to delete a
 * resource by matching it against the provided category and ID.
 */
export const DELETE = asyncHandler(deleteAcademicByCategoryAndId);

