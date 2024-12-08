import { PrismaClient } from '@prisma/client';

import serviceShared from "@/shared/service.shared";
import schoolAchievementSchema from "@/app/api/v1/school-achievement/school.achievement.schema";
import schoolAchievementConstants from "@/app/api/v1/school-achievement/school.achievement.constants";
import sharedResponseTypes from "@/shared/shared.response.types";
import localFileOperations from "@/util/localFileOperations";

import asyncHandler from "@/util/asyncHandler";
import parseAndValidateFormData from "@/util/parseAndValidateFormData";
import validateToken from "@/util/validateToken";
import validateUnsupportedContent from "@/util/validateUnsupportedContent";
import schoolAchievementSelectionCriteria from "@/app/api/v1/school-achievement/school.achievement.selection.criteria";

const prisma = new PrismaClient();

const { INTERNAL_SERVER_ERROR, NOT_FOUND, CONFLICT, OK } = sharedResponseTypes;

const model = prisma.SchoolAchievement;

// Helper function to update and respond with the school achievement
const updateSchoolAchievementEntry = async (userInput, request) => {
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

    const selectionCriteria = schoolAchievementSelectionCriteria();

    const updatedDocument = await model.findUnique({
        where: {
            id: updateDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!updatedDocument?.id) {
        return INTERNAL_SERVER_ERROR(`Failed to update school achievement entry with the ID "${userInput?.id}".`, request);
    }

    return OK(`School achievement entry with the ID "${userInput?.id}" updated successfully.`, updatedDocument, request);
};

// Named export for the GET request handler
const handleUpdateSchoolAchievementById = async (request, context) => {
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
    const userInput = await parseAndValidateFormData(request, context, 'update', schoolAchievementSchema.updateSchema);

    // Check if school achievement entry with the same title already exists
    const existingSchoolAchievement = await model.findUnique({
        where: {
            id: userInput?.id,
        },
        select: {
            id: true,
            iconId: true
        }
    });
    if (!existingSchoolAchievement) {
        return NOT_FOUND(`School achievement entry with ID "${userInput?.id}" not found.`, request);
    }

    if (userInput?.title) {
        // Check if school achievement entry with the same title already exists
        const existingQuestion = await model.findUnique({
            where: {
                title: userInput?.title,
            },
            select: {
                id: true,
            }
        });
        if (existingQuestion) {
            return CONFLICT(`School achievement entry with title "${userInput?.title}" already exists.`, request);
        }
    }

    // Handle file replacement if a new file is provided
    if (userInput[schoolAchievementConstants.fileFieldName] && userInput[schoolAchievementConstants.fileFieldName][0]) {
        await localFileOperations.deleteFile(existingSchoolAchievement?.iconId); // Delete old file

        const newFile = userInput[schoolAchievementConstants.fileFieldName][0];
        const { fileId, fileLink } = await localFileOperations.uploadFile(request, newFile);

        userInput.iconId = fileId;
        userInput.icon = fileLink;
    }

    // Create the school achievement entry and send the response
    return updateSchoolAchievementEntry(userInput, request);
};

const deleteSchoolAchievementById = async (request, context) => {
    return serviceShared.deleteEntryById(request, context, model, 'iconId', 'school achievement');
};

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateSchoolAchievementById);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(deleteSchoolAchievementById);
