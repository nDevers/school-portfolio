import { PrismaClient } from '@prisma/client';

import serviceShared from "@/shared/service.shared";
import careerSchema from "@/app/api/v1/career/career.schema";
import careerConstants from "@/app/api/v1/career/career.constants";
import sharedResponseTypes from "@/shared/shared.response.types";
import localFileOperations from "@/util/localFileOperations";
import schemaShared from "@/shared/schema.shared";

import asyncHandler from "@/util/asyncHandler";
import parseAndValidateFormData from "@/util/parseAndValidateFormData";
import validateToken from "@/util/validateToken";
import validateUnsupportedContent from "@/util/validateUnsupportedContent";
import careerSelectionCriteria from "@/app/api/v1/career/career.selection.criteria";

const prisma = new PrismaClient();

const { INTERNAL_SERVER_ERROR, NOT_FOUND, CONFLICT, OK } = sharedResponseTypes;
const { idValidationSchema } = schemaShared;

const model = prisma.Career;

// Helper function to update and respond with the FAQ
const updateCareerEntry = async (userInput, request) => {
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

    const selectionCriteria = careerSelectionCriteria();

    const updatedDocument = await model.findUnique({
        where: {
            id: updateDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!updatedDocument?.id) {
        return INTERNAL_SERVER_ERROR(`Failed to update career entry with the ID "${userInput?.id}".`, request);
    }

    return OK(`Career entry with the ID "${userInput?.id}" updated successfully.`, updatedDocument, request);
};

// Named export for the GET request handler
const handleUpdateCareerById = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(request, careerConstants.allowedContentTypes);
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Validate if the user is authorized (admin)
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, context, 'update', careerSchema.updateSchema);

    // Check if FAQ entry with the same title already exists
    const existingCareer = await model.findUnique({
        where: {
            id: userInput?.id,
        },
        select: {
            id: true,
            files: true,
        }
    });
    if (!existingCareer) {
        return NOT_FOUND(`Career entry with ID "${userInput?.id}" not found.`, request);
    }

    if (userInput?.title) {
        // Check if FAQ entry with the same title already exists
        const existingQuestion = await model.findUnique({
            where: {
                title: userInput?.title,
            },
            select: {
                id: true,
            }
        });
        if (existingQuestion) {
            return CONFLICT(`Career entry with title "${userInput?.title}" already exists.`, request);
        }
    }

    if (userInput?.files?.length) {
        // Upload files and construct the `files` array for documents
        const files = await Promise.all(
            (userInput[careerConstants.fileFieldName] || []).map(async (fileEntry) => {
                // Call your file upload operation
                const { fileId, fileLink } = await localFileOperations.uploadFile(request, fileEntry);
                return {
                    fileId: fileId,
                    file: fileLink
                };
            })
        );

        userInput.files = files;
        userInput.date = new Date(userInput.date);
    }

    let files = {};

    if (userInput?.deleteFiles && Array.isArray(userInput.deleteFiles)) {
        // Check if all files in deleteFiles actually exist in the current files array
        const nonExistingFiles = userInput.deleteFiles.filter(fileId =>
            !existingCareer?.files?.some(file => file.fileId === fileId)
        );

        if (nonExistingFiles.length > 0) {
            // If any file to be deleted is not found in the database, return 404 with the missing file IDs
            return NOT_FOUND(`File(s) with IDs [${nonExistingFiles.join(', ')}] not found in the database.`, request);
        }

        // Create an array of promises for each file deletion
        const deletePromises = userInput.deleteFiles.map(fileId => {
            return localFileOperations.deleteFile(fileId); // Delete the file physically
        });

        // Filter out files that are being deleted (those in deleteFiles)
        files = existingCareer?.files?.filter(file => !userInput.deleteFiles.includes(file?.fileId));

        // Delete the files physically using Promise.all
        await Promise.all(deletePromises);

        // After deletion, update the database to remove the deleted file objects
        await model.update({
            where: { id: existingCareer.id }, // Assuming the record is identified by id
            data: {
                files: files // Update the files field in the database, only keeping non-deleted files
            }
        });
    }

    delete userInput.deleteFiles;  // Remove deleteFiles field from userInput

    userInput.files = files; // Assign the updated files list to userInput

    // Create the FAQ entry and send the response
    return updateCareerEntry(userInput, request);
};

const deleteCareerById = async (request, context) => {
    // Validate admin
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response; // Return early with the authorization failure response
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, context, 'delete', idValidationSchema);

    // Check if data exists
    const data = await model.findUnique({
        where: {
            id: userInput?.id,
        },
        select: {
            id: true, // Only return the ID of the deleted document
            files: true,
        },
    });
    if (!data) {
        return NOT_FOUND(`Career entry with ID "${userInput?.id}" not found.`, request);
    }

    // Create an array of promises for each file deletion
    const deletePromises = data.files.map(file => {
        return localFileOperations.deleteFile(file?.fileId); // Delete the file physically
    });

    // Delete the files physically using Promise.all
    await Promise.all(deletePromises);

    // Perform the deletion with the specified projection field for optional file handling
    await model.delete({
        where: {
            id: userInput?.id,
        },
    });

    // If no document is found, send a 404 response
    const deletedData = await model.findUnique({
        where: {
            id: userInput?.id,
        },
        select: {
            id: true // Only return the ID of the deleted document
        },
    });
    if (deletedData) {
        return NOT_FOUND(`Failed to delete career entry with ID "${userInput?.id}".`, request);
    }

    // Send a success response
    return OK(`Career entry with ID "${userInput?.id}" deleted successfully.`, {}, request);
};

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateCareerById);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(deleteCareerById);
