import { PrismaClient } from '@prisma/client';

import schoolAchievementSchema from "@/app/api/v1/school/achievement/school.achievement.schema";
import schoolAchievementConstants from "@/app/api/v1/school/achievement/school.achievement.constants";
import sharedResponseTypes from "@/shared/shared.response.types";
import localFileOperations from "@/util/localFileOperations";

import asyncHandler from "@/util/asyncHandler";
import validateUnsupportedContent from "@/util/validateUnsupportedContent";
import parseAndValidateFormData from "@/util/parseAndValidateFormData";
import validateToken from "@/util/validateToken";
import schoolAchievementSelectionCriteria from "@/app/api/v1/school/achievement/school.achievement.selection.criteria";

const prisma = new PrismaClient();

const { INTERNAL_SERVER_ERROR, CONFLICT, CREATED, NOT_FOUND } = sharedResponseTypes;

const model = prisma.SchoolAchievement;

// Helper function to create and respond with the FAQ
const createSchoolAchievementEntry = async (userInput, request) => {
    const newDocument = await model.create({
        data: userInput,
        select: {
            id: true, // Only return the ID of the updated document
        },
    });

    const selectionCriteria = schoolAchievementSelectionCriteria();

    const createdDocument = await model.findUnique({
        where: {
            id: newDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!createdDocument?.id) {
        return INTERNAL_SERVER_ERROR(`Failed to create school achievement entry with title "${userInput?.title}".`, request);
    }

    // No need for an aggregation pipeline; Prisma returns the created document
    return CREATED(`School achievement entry with title "${userInput?.title}" created successfully.`, createdDocument, request);
};

// Named export for the POST request handler (Create FAQ)
const handleCreateSchoolAchievement = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(request, schoolAchievementConstants.allowedContentTypes);
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Validate if the user is authorized (admin)
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, context, 'create', schoolAchievementSchema.createSchema);

    // Check if FAQ entry with the same title already exists
    const existingtitle = await model.findUnique({
        where: {
            title: userInput?.title,
        },
        select: {
            id: true,
        }
    });
    if (existingtitle) {
        return CONFLICT(`School achievement entry with title "${userInput?.title}" already exists.`, request);
    }

    // Upload file and generate link
    const newFile = userInput[schoolAchievementConstants.fileFieldName][0];
    const { fileId, fileLink } = await localFileOperations.uploadFile(request, newFile);

    userInput.iconId = fileId;
    userInput.icon = fileLink;

    // Create the FAQ entry and send the response
    return createSchoolAchievementEntry(userInput, request);
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleCreateSchoolAchievement);
