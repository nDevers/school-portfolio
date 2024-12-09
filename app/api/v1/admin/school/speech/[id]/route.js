import { PrismaClient } from '@prisma/client';

import serviceShared from "@/shared/service.shared";
import schoolSpeechSchema from "@/app/api/v1/school/speech/school.speech.schema";
import schoolSpeechConstants from "@/app/api/v1/school/speech/school.speech.constants";
import sharedResponseTypes from "@/shared/shared.response.types";
import localFileOperations from "@/util/localFileOperations";

import asyncHandler from "@/util/asyncHandler";
import parseAndValidateFormData from "@/util/parseAndValidateFormData";
import validateToken from "@/util/validateToken";
import validateUnsupportedContent from "@/util/validateUnsupportedContent";
import schoolSpeechSelectionCriteria from "@/app/api/v1/school/speech/school.speech.selection.criteria";

const prisma = new PrismaClient();

const { INTERNAL_SERVER_ERROR, NOT_FOUND, CONFLICT, OK } = sharedResponseTypes;

const model = prisma.SchoolSpeech;

// Helper function to update and respond with the school speech
const updateSchoolSpeechEntry = async (userInput, request) => {
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

    const selectionCriteria = schoolSpeechSelectionCriteria();

    const updatedDocument = await model.findUnique({
        where: {
            id: updateDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!updatedDocument?.id) {
        return INTERNAL_SERVER_ERROR(`Failed to update school speech entry with the ID "${userInput?.id}".`, request);
    }

    return OK(`School speech entry with the ID "${userInput?.id}" updated successfully.`, updatedDocument, request);
};

// Named export for the GET request handler
const handleUpdateSchoolSpeechById = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(request, schoolSpeechConstants.allowedContentTypes);
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Validate if the user is authorized (admin)
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, context, 'update', schoolSpeechSchema.updateSchema);

    // Check if school speech entry with the same title already exists
    const existingSchoolSpeech = await model.findUnique({
        where: {
            id: userInput?.id,
        },
        select: {
            id: true,
            imageId: true
        }
    });
    if (!existingSchoolSpeech) {
        return NOT_FOUND(`School speech entry with ID "${userInput?.id}" not found.`, request);
    }

    if (userInput?.title) {
        // Check if school speech entry with the same title already exists
        const existingQuestion = await model.findUnique({
            where: {
                title: userInput?.title,
            },
            select: {
                id: true,
            }
        });
        if (existingQuestion) {
            return CONFLICT(`School speech entry with title "${userInput?.title}" already exists.`, request);
        }
    }

    // Handle file replacement if a new file is provided
    const newImage = userInput[schoolSpeechConstants.imageFieldName];
    if (newImage && newImage[0]) {
        await localFileOperations.deleteFile(existingSchoolSpeech?.imageId); // Delete old file

        const newFile = newImage[0];
        const { fileId, fileLink } = await localFileOperations.uploadFile(request, newFile);

        userInput.imageId = fileId;
        userInput.image = fileLink;
    }

    // Create the school speech entry and send the response
    return updateSchoolSpeechEntry(userInput, request);
};

const deleteSchoolSpeechById = async (request, context) => {
    return serviceShared.deleteEntryById(request, context, model, 'imageId', 'school speech');
};

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateSchoolSpeechById);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(deleteSchoolSpeechById);
