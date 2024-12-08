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

const prisma = new PrismaClient();

const { INTERNAL_SERVER_ERROR, NOT_FOUND, CONFLICT, OK } = sharedResponseTypes;

const model = prisma.faq;

// Helper function to update and respond with the FAQ
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

// Named export for the GET request handler
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

const deleteFaqById = async (request, context) => {
    return serviceShared.deleteEntryById(request, context, model, '', 'FAQ');
};

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateFaqById);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(deleteFaqById);
