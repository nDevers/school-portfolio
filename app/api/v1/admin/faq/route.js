import { PrismaClient } from '@prisma/client';

import faqSchema from "@/app/api/v1/faq/faq.schema";
import faqConstants from "@/app/api/v1/faq/faq.constants";
import sharedResponseTypes from "@/shared/shared.response.types";

import asyncHandler from "@/util/asyncHandler";
import validateUnsupportedContent from "@/util/validateUnsupportedContent";
import parseAndValidateFormData from "@/util/parseAndValidateFormData";
import validateToken from "@/util/validateToken";
import faqSelectionCriteria from "@/app/api/v1/faq/faq.selection.criteria";

const prisma = new PrismaClient();

const { INTERNAL_SERVER_ERROR, CONFLICT, CREATED, NOT_FOUND } = sharedResponseTypes;

const model = prisma.faq;

// Helper function to create and respond with the FAQ
const createFaqEntry = async (userInput, request) => {
    const newDocument = await model.create({
        data: userInput,
        select: {
            id: true, // Only return the ID of the updated document
        },
    });

    const selectionCriteria = faqSelectionCriteria();

    const createdDocument = await model.findUnique({
        where: {
            id: newDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!createdDocument?.id) {
        return INTERNAL_SERVER_ERROR(`Failed to create FAQ entry with question "${userInput?.question}".`, request);
    }

    // No need for an aggregation pipeline; Prisma returns the created document
    return CREATED(`FAQ entry with question "${userInput?.question}" created successfully.`, createdDocument, request);
};

// Named export for the POST request handler (Create FAQ)
const handleCreateFaq = async (request, context) => {
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
    const userInput = await parseAndValidateFormData(request, context, 'create', faqSchema.createSchema);

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

    // Create the FAQ entry and send the response
    return createFaqEntry(userInput, request);
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleCreateFaq);
