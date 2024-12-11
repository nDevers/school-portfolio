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

const { INTERNAL_SERVER_ERROR, CONFLICT, OK, NOT_FOUND } = sharedResponseTypes;

const model = prisma.Faculty;

// Helper function to create and respond with the faculty
const updateFacultyEntry = async (userInput, request) => {
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

    const selectionCriteria = facultySelectionCriteria();

    const updatedDocument = await model.findUnique({
        where: {
            id: updateDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!updatedDocument?.id) {
        return INTERNAL_SERVER_ERROR(`Failed to update faculty entry with CATEGORY "${userInput?.categoryParams}" and ID "${userInput?.id}".`, request);
    }

    // No need for an aggregation pipeline; Prisma returns the created document
    return OK(`Faculty entry with CATEGORY "${userInput?.categoryParams}" and ID "${userInput?.id}" updated successfully.`, updatedDocument, request);
};

// Named export for the POST request handler (Create faculty)
const handleUpdateFacultyByCategoryAndId = async (request, context) => {
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
    const userInput = await parseAndValidateFormData(request, context, 'update', () => facultySchema.updateSchema());

    // Check if faculty entry with the same title already exists
    const existingEntry = await model.findUnique({
        where: {
            id: userInput?.id,
            category: userInput?.categoryParams,
        },
        select: {
            id: true,
            imageId: true,
        }
    });
    if (!existingEntry) {
        return NOT_FOUND(`Faculty entry with ID "${userInput?.id}" and CATEGORY ${userInput?.categoryParams} not found.`, request);
    }

    // Dynamically build the OR condition based on provided fields
    const conditions = [];
    if (userInput?.email) {
        conditions.push({ email: userInput.email });
    }
    if (userInput?.mobile) {
        conditions.push({ mobile: userInput.mobile });
    }
    if (userInput?.portfolio) {
        conditions.push({ portfolio: userInput.portfolio });
    }

    // Only perform the query if at least one condition is provided
    if (conditions.length > 0) {
        const existingEntry = await model.findFirst({
            where: {
                OR: conditions
            },
            select: {
                id: true,
                imageId: true,
            }
        });

        if (existingEntry) {
            return CONFLICT(`Faculty entry with email: "${userInput?.email}", mobile: ${userInput?.mobile} and portfolio "${userInput?.portfolio}" already exists.`, request);
        }
    }

    if (userInput[facultyConstants.imageFieldName]) {
        await localFileOperations.deleteFile(existingEntry.imageId)

        // Upload file and generate link
        const newFile = userInput[facultyConstants.imageFieldName][0];
        const { fileId, fileLink } = await localFileOperations.uploadFile(request, newFile);

        userInput.imageId = fileId;
        userInput.image = fileLink;
    }

    delete userInput.categoryParams;

    // Create the faculty entry and send the response
    return updateFacultyEntry(userInput, request);
};

const deleteFacultyByCategoryAndId = async (request, context) => {
    // Validate admin
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response; // Return early with the authorization failure response
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, context, 'delete', () => facultySchema.categoryAndIdSchema());

    // Check if data exists
    const data = await model.findUnique({
        where: {
            id: userInput?.id,
            category: userInput?.categoryParams,
        },
        select: {
            id: true, // Only return the ID of the deleted document
            imageId: true,
        },
    });
    if (!data) {
        return NOT_FOUND(`Faculty entry with ID "${userInput?.id}" and CATEGORY "${userInput?.categoryParams}" not found.`, request);
    }

    if (data?.imageId) {
        await localFileOperations.deleteFile(data?.imageId); // Delete the file physically
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
        return NOT_FOUND(`Failed to delete faculty entry with ID "${userInput?.id}" and CATEGORY "${userInput?.categoryParams}".`, request);
    }

    // Send a success response
    return OK(`Faculty entry with ID "${userInput?.id}" and CATEGORY "${userInput?.categoryParams}" deleted successfully.`, {}, request);
};

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateFacultyByCategoryAndId);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(deleteFacultyByCategoryAndId);

