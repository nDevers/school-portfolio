import { PrismaClient } from '@prisma/client';

import serviceShared from "@/shared/service.shared";
import schoolInfoSchema from "@/app/api/v1/school/info/school.info.schema";
import schoolInfoConstants from "@/app/api/v1/school/info/school.info.constants";
import sharedResponseTypes from "@/shared/shared.response.types";
import localFileOperations from "@/util/localFileOperations";

import asyncHandler from "@/util/asyncHandler";
import parseAndValidateFormData from "@/util/parseAndValidateFormData";
import validateToken from "@/util/validateToken";
import validateUnsupportedContent from "@/util/validateUnsupportedContent";
import schoolInfoSelectionCriteria from "@/app/api/v1/school/info/school.info.selection.criteria";

const prisma = new PrismaClient();

const { INTERNAL_SERVER_ERROR, NOT_FOUND, CONFLICT, OK } = sharedResponseTypes;

const model = prisma.SchoolInfo;

// Helper function to update and respond with the school info
const updateSchoolInfoEntry = async (userInput, request) => {
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

    const selectionCriteria = schoolInfoSelectionCriteria();

    const updatedDocument = await model.findUnique({
        where: {
            id: updateDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!updatedDocument?.id) {
        return INTERNAL_SERVER_ERROR(`Failed to update school info entry with the ID "${userInput?.id}".`, request);
    }

    return OK(`School info entry with the ID "${userInput?.id}" updated successfully.`, updatedDocument, request);
};

// Named export for the GET request handler
const handleUpdateSchoolInfoById = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(request, schoolInfoConstants.allowedContentTypes);
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Validate if the user is authorized (admin)
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, context, 'update', schoolInfoSchema.updateSchema);

    // Check if school info entry with the same title already exists
    const existingSchoolInfo = await model.findUnique({
        where: {
            id: userInput?.id,
        },
        select: {
            id: true,
            iconId: true
        }
    });
    if (!existingSchoolInfo) {
        return NOT_FOUND(`School info entry with ID "${userInput?.id}" not found.`, request);
    }

    if (userInput?.title) {
        // Check if school info entry with the same title already exists
        const existingQuestion = await model.findUnique({
            where: {
                title: userInput?.title,
            },
            select: {
                id: true,
            }
        });
        if (existingQuestion) {
            return CONFLICT(`School info entry with title "${userInput?.title}" already exists.`, request);
        }
    }

    // Handle file replacement if a new file is provided
    if (userInput[schoolInfoConstants.fileFieldName] && userInput[schoolInfoConstants.fileFieldName][0]) {
        await localFileOperations.deleteFile(existingSchoolInfo?.iconId); // Delete old file

        const newFile = userInput[schoolInfoConstants.fileFieldName][0];
        const { fileId, fileLink } = await localFileOperations.uploadFile(request, newFile);

        userInput.iconId = fileId;
        userInput.icon = fileLink;
    }

    // Create the school info entry and send the response
    return updateSchoolInfoEntry(userInput, request);
};

const deleteSchoolInfoById = async (request, context) => {
    return serviceShared.deleteEntryById(request, context, model, 'iconId', 'school info');
};

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateSchoolInfoById);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(deleteSchoolInfoById);
