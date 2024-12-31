'use strict';

import { FaqModel } from '@/shared/prisma.model.shared';
import faqSchema from '@/app/api/v1/faq/faq.schema';
import faqConstants from '@/app/api/v1/faq/faq.constants';
import sharedResponseTypes from '@/shared/shared.response.types';

import asyncHandler from '@/util/asyncHandler';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import validateToken from '@/util/validateToken';
import faqSelectionCriteria from '@/app/api/v1/faq/faq.selection.criteria';

const { INTERNAL_SERVER_ERROR, CONFLICT, CREATED } = sharedResponseTypes;

/**
 * Asynchronously creates a new FAQ entry in the database based on the provided user input.
 *
 * The function handles the creation of a new document in the database, retrieves
 * the newly created document using specified selection criteria, and validates
 * the success of the creation process. If the creation is successful, it returns
 * the created document along with a success status. If it fails, an error
 * response is returned.
 *
 * @param {Object} userInput - The input data provided by the user for creating the FAQ entry.
 * @param {Object} request - The request object containing details about the current request.
 * @returns {Promise<Object>} A promise that resolves to a response object indicating the result of the operation.
 *
 * - On success:
 *   - A success message is returned with the newly created FAQ document.
 * - On failure:
 *   - An error message is returned indicating the failure to create the FAQ entry.
 *
 * The function makes use of a database model to handle CRUD operations, including:
 * - `create` to insert the new FAQ data into the database.
 * - `findUnique` to retrieve the document based on its unique identifier.
 */
const createFaqEntry = async (userInput, request) => {
    const newDocument = await FaqModel.create({
        data: userInput,
        select: {
            id: true, // Only return the ID of the updated document
        },
    });

    const selectionCriteria = faqSelectionCriteria();

    const createdDocument = await FaqModel.findUnique({
        where: {
            id: newDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!createdDocument?.id) {
        return INTERNAL_SERVER_ERROR(
            `Failed to create FAQ entry with question "${userInput?.question}".`,
            request
        );
    }

    // No need for an aggregation pipeline; Prisma returns the created document
    return CREATED(
        `FAQ entry with question "${userInput?.question}" created successfully.`,
        createdDocument,
        request
    );
};

/**
 * Handles the creation of a new FAQ entry by validating the request, verifying user authorization, and ensuring the submitted data adheres to requirements.
 *
 * This asynchronous function performs multiple steps to process the creation request:
 * 1. Validates the content type of the request against supported content types.
 * 2. Ensures the user is authorized to perform the operation by validating their authentication token.
 * 3. Parses and validates the submitted form data using a predefined schema.
 * 4. Checks if an FAQ entry with the same question already exists in the system to avoid duplicates.
 * 5. If all validation steps pass, it creates the new FAQ entry and returns the appropriate response.
 *
 * @param {Object} request - The incoming HTTP request that includes the data and metadata required to process the FAQ creation.
 * @param {Object} context - Additional context or information needed for handling the request, such as environment details.
 *
 * @returns {Object} Returns a response object that represents the result of the operation. The response can indicate success (new FAQ entry created) or an error (e.g., validation failure, authorization denial, or conflict with an existing entry).
 */
const handleCreateFaq = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(
        request,
        faqConstants.allowedContentTypes
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
        faqSchema.createSchema
    );

    // Check if FAQ entry with the same question already exists
    const existingQuestion = await FaqModel.findUnique({
        where: {
            question: userInput?.question,
        },
        select: {
            id: true,
        },
    });
    if (existingQuestion) {
        return CONFLICT(
            `FAQ entry with question "${userInput?.question}" already exists.`,
            request
        );
    }

    // Create the FAQ entry and send the response
    return createFaqEntry(userInput, request);
};

/**
 * POST is an asynchronous variable that handles the creation of FAQ entries.
 * It is wrapped with an asyncHandler to manage errors efficiently during the operation.
 * The purpose of this variable is to process and respond to HTTP POST requests intended for creating FAQs.
 *
 * Dependencies:
 * - asyncHandler: A function used to handle asynchronous operations and catch errors automatically.
 * - handleCreateFaq: A function responsible for the logic of creating and storing FAQ data.
 */
export const POST = asyncHandler(handleCreateFaq);
