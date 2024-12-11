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

const { INTERNAL_SERVER_ERROR, CONFLICT, OK, NOT_FOUND } = sharedResponseTypes;

const model = prisma.Academic;

// Helper function to create and respond with the academic
const updateAcademicEntry = async (userInput, request) => {
    // Filter `userInput` to only include fields with non-null values
    const fieldsToUpdate = Object.keys(userInput).reduce((acc, key) => {
        if (userInput[key] !== undefined && userInput[key] !== null && key !== 'id') {
            acc[key] = userInput[key];
        }
        return acc;
    }, {});

    const updateDocument = await model.update({
        where: { id: userInput?.id, category: userInput?.categoryParams },
        data: fieldsToUpdate,
        select: {
            id: true, // Only return the ID of the updated document
        },
    });

    const selectionCriteria = academicSelectionCriteria();

    const updatedDocument = await model.findUnique({
        where: {
            id: updateDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!updatedDocument?.id) {
        return INTERNAL_SERVER_ERROR(`Failed to update academic entry with CATEGORY "${userInput?.categoryParams}" and ID "${userInput?.id}".`, request);
    }

    // No need for an aggregation pipeline; Prisma returns the created document
    return OK(`Academic entry with CATEGORY "${userInput?.categoryParams}" and ID "${userInput?.id}" updated successfully.`, updatedDocument, request);
};

// Named export for the POST request handler (Create academic)
const handleUpdateAcademicByCategoryAndId = async (request, context) => {
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
    const userInput = await parseAndValidateFormData(request, context, 'update', () => academicSchema.updateSchema());

    // Check if academic entry with the same title already exists
    const existingQuestion = await model.findUnique({
        where: {
            id: userInput?.id,
            category: userInput?.categoryParams,
        },
        select: {
            id: true,
            fileId: true,
        }
    });
    if (!existingQuestion) {
        return NOT_FOUND(`Academic entry with ID "${userInput?.id}" and CATEGORY ${userInput?.categoryParams} not found.`, request);
    }

    if (userInput?.title) {
        // Check if FAQ entry with the same title already exists
        const existingTitle = await model.findUnique({
            where: {
                title: userInput?.title,
                category: userInput?.categoryParams,
            },
            select: {
                id: true,
            }
        });
        if (existingTitle) {
            return CONFLICT(`Academic entry with ID "${userInput?.id}" and CATEGORY ${userInput?.categoryParams} already exists.`, request);
        }
    }

    if (userInput[academicConstants.fileFieldName]) {
        await localFileOperations.deleteFile(existingQuestion.fileId)

        // Upload file and generate link
        const newFile = userInput[academicConstants.fileFieldName][0];
        const { fileId, fileLink } = await localFileOperations.uploadFile(request, newFile);

        userInput.fileId = fileId;
        userInput.file = fileLink;
    }

    if (userInput?.publishDate) {
        userInput.publishDate = moment(userInput.publishDate, ['DD/MM/YYYY', moment.ISO_8601], true).toDate();
    }

    delete userInput.categoryParams;

    // Create the academic entry and send the response
    return updateAcademicEntry(userInput, request);
};

const deleteAcademicByCategoryAndId = async (request, context) => {
    // Validate admin
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response; // Return early with the authorization failure response
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, context, 'delete', () => academicSchema.categoryAndIdSchema());

    // Check if data exists
    const data = await model.findUnique({
        where: {
            id: userInput?.id,
            category: userInput?.categoryParams,
        },
        select: {
            id: true, // Only return the ID of the deleted document
            fileId: true,
        },
    });
    if (!data) {
        return NOT_FOUND(`Academic entry with ID "${userInput?.id}" and CATEGORY "${userInput?.categoryParams}" not found.`, request);
    }

    if (data?.bannerId) {
        await localFileOperations.deleteFile(data?.bannerId); // Delete the file physically
    }

    // Perform the deletion with the specified projection field for optional file handling
    await model.delete({
        where: {
            id: userInput?.id,
            category: userInput?.categoryParams
        },
    });

    // If no document is found, send a 404 response
    const deletedData = await model.findUnique({
        where: {
            id: userInput?.id,
            category: userInput?.categoryParams
        },
        select: {
            id: true // Only return the ID of the deleted document
        },
    });
    if (deletedData) {
        return NOT_FOUND(`Failed to delete academic entry with ID "${userInput?.id}" and CATEGORY "${userInput?.categoryParams}".`, request);
    }

    // Send a success response
    return OK(`Academic entry with ID "${userInput?.id}" and CATEGORY "${userInput?.categoryParams}" deleted successfully.`, {}, request);
};

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateAcademicByCategoryAndId);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(deleteAcademicByCategoryAndId);

