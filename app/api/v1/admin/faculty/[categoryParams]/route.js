import { PrismaClient } from '@prisma/client';

import facultySchema from "@/app/api/v1/faculty/faculty.schema";
import facultyConstants from "@/app/api/v1/faculty/faculty.constants";
import sharedResponseTypes from "@/shared/shared.response.types";
import localFileOperations from "@/util/localFileOperations";

import asyncHandler from "@/util/asyncHandler";
import validateUnsupportedContent from "@/util/validateUnsupportedContent";
import parseAndValidateFormData from "@/util/parseAndValidateFormData";
import validateToken from "@/util/validateToken";
import facultySelectionCriteria from "@/app/api/v1/faculty/faculty.selection.criteria";

const prisma = new PrismaClient();

const { INTERNAL_SERVER_ERROR, CONFLICT, CREATED } = sharedResponseTypes;

const model = prisma.Faculty;

// Helper function to create and respond with the faculty
const createFacultyEntry = async (userInput, request) => {
    const newDocument = await model.create({
        data: userInput,
        select: {
            id: true, // Only return the ID of the updated document
        },
    });

    const selectionCriteria = facultySelectionCriteria();

    const createdDocument = await model.findUnique({
        where: {
            id: newDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!createdDocument?.id) {
        return INTERNAL_SERVER_ERROR(`Failed to create faculty entry with title "${userInput?.title}".`, request);
    }

    // No need for an aggregation pipeline; Prisma returns the created document
    return CREATED(`Faculty entry with title "${userInput?.title}" created successfully.`, createdDocument, request);
};

// Named export for the POST request handler (Create faculty)
const handleCreateFacultyByCategory = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(request, facultyConstants.allowedContentTypes);
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Validate if the user is authorized (admin)
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, context, 'create', () => facultySchema.createSchema());

    // Check if faculty entry with the same email, mobile, or portfolio already exists
    const existingEntry = await model.findFirst({
        where: {
            OR: [
                { email: userInput?.email },
                { mobile: userInput?.mobile },
                { portfolio: userInput?.portfolio }
            ]
        },
        select: {
            id: true,
        }
    });
    if (existingEntry) {
        return CONFLICT(`Faculty entry with email: "${userInput?.email}", mobile: ${userInput?.mobile} and portfolio "${userInput?.portfolio}" already exists.`, request);
    }

    // Upload file and generate link
    const newImage = userInput[facultyConstants.imageFieldName][0];
    const { fileId, fileLink } = await localFileOperations.uploadFile(request, newImage);

    userInput.imageId = fileId;
    userInput.image = fileLink;
    userInput.category = userInput.categoryParams;

    delete userInput.categoryParams;

    // Create the faculty entry and send the response
    return createFacultyEntry(userInput, request);
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleCreateFacultyByCategory);
