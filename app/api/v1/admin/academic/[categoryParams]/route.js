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

const prisma = new PrismaClient();

const { INTERNAL_SERVER_ERROR, CONFLICT, CREATED } = sharedResponseTypes;

const model = prisma.Academic;

// Helper function to create and respond with the academic
const createAcademicEntry = async (userInput, request) => {
    const newDocument = await model.create({
        data: userInput,
        select: {
            id: true, // Only return the ID of the updated document
        },
    });

    const selectionCriteria = academicSelectionCriteria();

    const createdDocument = await model.findUnique({
        where: {
            id: newDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!createdDocument?.id) {
        return INTERNAL_SERVER_ERROR(`Failed to create academic entry with title "${userInput?.title}".`, request);
    }

    // No need for an aggregation pipeline; Prisma returns the created document
    return CREATED(`Academic entry with title "${userInput?.title}" created successfully.`, createdDocument, request);
};

// Named export for the POST request handler (Create academic)
const handleCreateAcademicByCategory = async (request, context) => {
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
    const userInput = await parseAndValidateFormData(request, context, 'create', () => academicSchema.createSchema());

    // Check if academic entry with the same title already exists
    const existingQuestion = await model.findUnique({
        where: {
            title: userInput?.title,
            category: userInput?.categoryParams,
        },
        select: {
            id: true,
        }
    });
    if (existingQuestion) {
        return CONFLICT(`Academic entry with title "${userInput?.title}" and CATEGORY "${userInput?.categoryParams}" already exists.`, request);
    }

    // Upload file and generate link
    const newFile = userInput[academicConstants.fileFieldName][0];
    const { fileId, fileLink } = await localFileOperations.uploadFile(request, newFile);

    userInput.fileId = fileId;
    userInput.file = fileLink;
    userInput.category = userInput.categoryParams;
    userInput.publishDate = moment(userInput.publishDate, ['DD/MM/YYYY', moment.ISO_8601], true).toDate();

    delete userInput.categoryParams;

    // Create the academic entry and send the response
    return createAcademicEntry(userInput, request);
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleCreateAcademicByCategory);
