import { PrismaClient } from '@prisma/client';

import serviceShared from "@/shared/service.shared";
import faqSchema from "@/app/api/v1/faq/faq.schema";
import faqConstants from "@/app/api/v1/faq/faq.constants";
import sharedResponseTypes from "@/shared/shared.response.types";

import asyncHandler from "@/util/asyncHandler";
import parseAndValidateFormData from "@/util/parseAndValidateFormData";
import validateToken from "@/util/validateToken";
import validateUnsupportedContent from "@/util/validateUnsupportedContent";
import faqSelectionCriteria from "@/app/api/v1/faq/faq.selection.criteria";

/**
 * Instance of PrismaClient, the main entry point for interacting with the database using Prisma ORM.
 * Provides methods for accessing and manipulating database records based on defined schema models.
 *
 * Use this instance to perform database operations such as querying, creating, updating, and deleting records.
 * Ensures type safety and leverages Prisma's query engine for efficient and optimized database interactions.
 *
 * Note: Ensure that the PrismaClient instance is properly managed, especially in applications with long-living processes.
 * Avoid creating multiple instances unnecessarily to prevent exhaustion of database connections.
 */
const prisma = new PrismaClient();

const { INTERNAL_SERVER_ERROR, NOT_FOUND, CONFLICT, OK } = sharedResponseTypes;

/**
 * Represents the FAQ model in the Prisma schema.
 *
 * This model is used to interact with the FAQ table in the database.
 * It typically includes fields such as questions, answers, and any metadata
 * associated with frequently asked questions.
 *
 * Use this model to perform CRUD operations and queries related to FAQs.
 */
const model = prisma.faq;

/**
 * Asynchronously updates an FAQ entry in the database based on the provided user input.
 *
 * This function filters the `userInput` object to exclude null, undefined, or invalid fields
 * (such as `id`) and updates the corresponding database document. It retrieves and returns
 * the updated document with the specified selection criteria. If the update operation fails,
 * an error response is returned.
 *
 * @param {Object} userInput - The user-provided data containing fields to update and the ID of the entry.
 * @param {Object} request - The request object used for logging or response creation.
 * @returns {Promise<Object>} A promise resolving to the response indicating the result of the update operation. This includes the updated document if successful, or an error response if the operation fails.
 */
const updateFaqEntry = async (userInput, request) => {
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

    const selectionCriteria = faqSelectionCriteria();

    const updatedDocument = await model.findUnique({
        where: {
            id: updateDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!updatedDocument?.id) {
        return INTERNAL_SERVER_ERROR(`Failed to update FAQ entry with the ID "${userInput?.id}".`, request);
    }

    return OK(`FAQ entry with the ID "${userInput?.id}" updated successfully.`, updatedDocument, request);
};

/**
 * Asynchronously handles the update of an FAQ entry by its ID.
 *
 * This function performs several operations including validating the request's content type,
 * authorizing the user, parsing and validating the input data, checking for the existence
 * of the FAQ entry with the provided ID, validating the uniqueness of the updated question,
 * and finally updating the FAQ entry.
 *
 * @param {Object} request - The incoming request object containing data necessary for processing the update operation.
 * @param {Object} context - Additional context information related to the request and execution environment.
 * @returns {Object} Returns an HTTP response object indicating success or failure of the update operation.
 */
const handleUpdateFaqById = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(request, faqConstants.allowedContentTypes);
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Validate if the user is authorized (admin)
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, context, 'update', faqSchema.updateSchema);

    // Check if FAQ entry with the same question already exists
    const existingFaq = await model.findUnique({
        where: {
            id: userInput?.id,
        },
        select: {
            id: true,
        }
    });
    if (!existingFaq) {
        return NOT_FOUND(`FAQ entry with ID "${userInput?.id}" not found.`, request);
    }

    if (userInput?.question) {
        // Check if FAQ entry with the same question already exists
        const existingQuestion = await model.findUnique({
            where: {
                question: userInput?.question,
            },
            select: {
                id: true,
            }
        });
        if (existingQuestion) {
            return CONFLICT(`FAQ entry with question "${userInput?.question}" already exists.`, request);
        }
    }

    // Create the FAQ entry and send the response
    return updateFaqEntry(userInput, request);
};

/**
 * Asynchronously deletes a FAQ entry by its identifier.
 *
 * This function utilizes the shared service method `deleteEntryById`
 * to remove a specific FAQ entry from the database or data store.
 * It requires a valid request and context to identify and authorize
 * the deletion operation.
 *
 * @param {Object} request - The request object containing necessary information, such as the FAQ identifier to delete.
 * @param {Object} context - The context object providing authorization and runtime information for the operation.
 * @returns {Promise<any>} A promise that resolves when the FAQ entry has been successfully deleted.
 */
const deleteFaqById = async (request, context) => {
    return serviceShared.deleteEntryById(request, context, model, '', 'FAQ');
};

/**
 * PATCH is an asynchronous handler function used to manage HTTP PATCH requests.
 * It processes the update of a FAQ entry by its unique identifier.
 *
 * The function wraps the handleUpdateFaqById process inside an asynchronous error handler,
 * ensuring that any potential errors in the operation are managed effectively.
 *
 * This variable and its associated handler can be integrated into route definitions
 * to handle update operations in a structured and consistent manner.
 *
 * @constant {Function} PATCH - The asynchronous handler function to update a FAQ by ID.
 */
export const PATCH = asyncHandler(handleUpdateFaqById);

/**
 * DELETE is an asynchronous function wrapped with an error-handling utility, `asyncHandler`.
 * It is responsible for deleting a FAQ by its unique identifier.
 * This function ensures that any errors during the deletion process are properly managed.
 *
 * The underlying logic is implemented in the `deleteFaqById` function, which this handler invokes.
 * It is typically used in the context of an HTTP request to handle FAQ deletion actions.
 *
 * @constant {Function} DELETE
 */
export const DELETE = asyncHandler(deleteFaqById);
