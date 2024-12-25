import { AboutUsModel } from "@/shared/prisma.model.shared";
import aboutUsSchema from "@/app/api/v1/about-us/about.us.schema";
import aboutUsConstants from "@/app/api/v1/about-us/about.us.constants";
import sharedResponseTypes from "@/shared/shared.response.types";
import localFileOperations from "@/util/localFileOperations";
import schemaShared from "@/shared/schema.shared";

import asyncHandler from "@/util/asyncHandler";
import parseAndValidateFormData from "@/util/parseAndValidateFormData";
import validateToken from "@/util/validateToken";
import validateUnsupportedContent from "@/util/validateUnsupportedContent";
import aboutUsSelectionCriteria from "@/app/api/v1/about-us/about.us.selection.criteria";


const { INTERNAL_SERVER_ERROR, NOT_FOUND, CONFLICT, OK } = sharedResponseTypes;
const { idValidationSchema } = schemaShared;

/**
 * Asynchronous function to update an "About Us" entry in the database.
 *
 * Filters the input to exclude null or undefined values, and fields named "id" before updating the database.
 * It updates the specific entry in the database based on the provided `id` and then retrieves the updated data based on pre-defined selection criteria.
 * Returns a success response with the updated document or an error response if the update fails.
 *
 * @param {Object} userInput - The user-provided data for updating the "About Us" entry. Must include an `id` field for identifying the entry.
 * @param {Object} request - The HTTP request object associated with the update operation.
 * @returns {Promise<Object>} A promise that resolves to an HTTP response indicating the success or failure of the update operation.
 * @throws {Error} Throws an error if the update process fails or the entry cannot be retrieved.
 */
const updateAboutUsEntry = async (userInput, request) => {
    // Filter `userInput` to only include fields with non-null values
    const fieldsToUpdate = Object.keys(userInput).reduce((acc, key) => {
        if (userInput[key] !== undefined && userInput[key] !== null && key !== 'id') {
            acc[key] = userInput[key];
        }
        return acc;
    }, {});

    // Update the document with the filtered data
    const updateDocument = await AboutUsModel.update({
        where: { id: userInput?.id },
        data: fieldsToUpdate,
        select: {
            id: true, // Only return the ID of the updated document
        },
    });

    const selectionCriteria = aboutUsSelectionCriteria();

    const updatedDocument = await AboutUsModel.findUnique({
        where: {
            id: updateDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!updatedDocument?.id) {
        return INTERNAL_SERVER_ERROR(`Failed to update aboutUs entry with the ID "${userInput?.id}".`, request);
    }

    return OK(`AboutUs entry with the ID "${userInput?.id}" updated successfully.`, updatedDocument, request);
};

/**
 * Asynchronous function to handle the update of an "About Us" entry by its ID.
 * The function performs a series of operations to validate the request, authorize the user,
 * parse and validate input data, process file and image uploads or deletions, and finally
 * update the entry in the database.
 *
 * Key operations:
 * - Validates the content type of the request against allowed content types.
 * - Validates the authorization token to ensure the user has the required access.
 * - Parses and validates the input data based on the provided schema.
 * - Checks for potential conflicts, such as an entry with the same title already existing.
 * - Handles file and image additions or deletions, uploading or removing them physically
 *   and updating the corresponding database records.
 * - Updates the "About Us" database entry with the modified data.
 *
 * @param {Object} request - The incoming request object containing data and parameters.
 * @param {Object} context - The context object with relevant details for handling the request.
 * @returns {Promise<Object>} A response object indicating the success or failure of the operation.
 */
const handleUpdateAboutUsById = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(request, aboutUsConstants.allowedContentTypes);
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Validate if the user is authorized (admin)
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, context, 'update', aboutUsSchema.updateSchema);

    // Check if FAQ entry with the same title already exists
    const existingCareer = await AboutUsModel.findUnique({
        where: {
            id: userInput?.id,
        },
        select: {
            id: true,
            files: true,
            images: true,
        }
    });
    if (!existingCareer) {
        return NOT_FOUND(`About us entry with ID "${userInput?.id}" not found.`, request);
    }

    if (userInput?.title) {
        // Check if FAQ entry with the same title already exists
        const existingQuestion = await AboutUsModel.findUnique({
            where: {
                title: userInput?.title,
            },
            select: {
                id: true,
            }
        });
        if (existingQuestion) {
            return CONFLICT(`About us entry with title "${userInput?.title}" already exists.`, request);
        }
    }

    if (userInput?.files?.length) {
        // Upload files and construct the `files` array for documents
        const files = await Promise.all(
            (userInput[aboutUsConstants.fileFieldName] || []).map(async (fileEntry) => {
                // Call your file upload operation
                const { fileId, fileLink } = await localFileOperations.uploadFile(request, fileEntry);
                return {
                    fileId: fileId,
                    file: fileLink
                };
            })
        );

        userInput.files = files;
    }

    let files = {};
    let images = {};

    if (userInput?.deleteFiles && Array.isArray(userInput.deleteFiles)) {
        // Check if all files in deleteFiles actually exist in the current files array
        const nonExistingFiles = userInput.deleteFiles.filter(fileId =>
            !existingCareer?.files?.some(file => file?.fileId === fileId)
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
        await AboutUsModel.update({
            where: { id: existingCareer.id }, // Assuming the record is identified by id
            data: {
                files: files, // Update the files field in the database, only keeping non-deleted files
            }
        });
    }

    if (userInput?.deleteImages && Array.isArray(userInput.deleteImages)) {
        // Check if all images in deleteImages actually exist in the current images array
        console.log(existingCareer?.images)
        const nonExistingImages = userInput.deleteImages.filter(imageId =>
            !existingCareer?.images?.some(image => image?.imageId === imageId)
        );

        if (nonExistingImages.length > 0) {
            // If any image to be deleted is not found in the database, return 404 with the missing image IDs
            return NOT_FOUND(`Image(s) with IDs [${nonExistingImages.join(', ')}] not found in the database.`, request);
        }

        // Create an array of promises for each image deletion
        const deleteImagePromises = userInput.deleteImages.map(imageId => {
            return localFileOperations.deleteFile(imageId); // Delete the image physically
        });

        // Filter out images that are being deleted (those in deleteImages)
        images = existingCareer?.images?.filter(image => !userInput.deleteImages.includes(image?.imageId));

        // Delete the images physically using Promise.all
        await Promise.all(deleteImagePromises);

        // After deletion, update the database to remove the deleted image objects
        await AboutUsModel.update({
            where: { id: existingCareer.id }, // Assuming the record is identified by id
            data: {
                images: images, // Update the images field in the database, only keeping non-deleted images
            }
        });
    }

    delete userInput?.deleteFiles;  // Remove deleteFiles field from userInput
    delete userInput?.deleteImages;  // Remove deleteImages field from userInput

    userInput.files = files; // Assign the updated files list to userInput
    userInput.images = images; // Assign the updated images list to userInput

    // Create the About Us entry and send the response
    return updateAboutUsEntry(userInput, request);
};

/**
 * Handles the deletion of a "career" entity by its ID.
 *
 * This asynchronous function validates the request, checks if the "career" entity exists, deletes any associated files
 * or images, and then deletes the entity from the database. It ensures proper error handling and returns appropriate
 * responses, including error messages if the entity is not found or deletion fails.
 *
 * Steps:
 * 1. Validates the admin user via token verification.
 * 2. Parses and validates the input data using the provided schema.
 * 3. Checks if the "career" entity exists in the database.
 * 4. Deletes associated files and images from the file system if applicable.
 * 5. Deletes the "career" entity from the database.
 * 6. Returns success or failure messages based on the operation's results.
 *
 * @param {Object} request - The incoming HTTP request containing the data required for deletion.
 * @param {Object} context - The execution context containing relevant data and utilities for the operation.
 * @returns {Promise<Object>} A response object indicating the result of the delete operation.
 */
const deleteCareerById = async (request, context) => {
    // Validate admin
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response; // Return early with the authorization failure response
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, context, 'delete', idValidationSchema);

    // Check if data exists
    const data = await AboutUsModel.findUnique({
        where: {
            id: userInput?.id,
        },
        select: {
            id: true, // Only return the ID of the deleted document
            files: true,
            images: true,
        },
    });
    if (!data) {
        return NOT_FOUND(`About us entry with ID "${userInput?.id}" not found.`, request);
    }

    if (data?.files?.length) {
        // Create an array of promises for each file deletion
        const deleteFilesPromises = data.files.map(file => {
            return localFileOperations.deleteFile(file?.fileId); // Delete the file physically
        });

        // Delete the files physically using Promise.all
        await Promise.all(deleteFilesPromises);
    }

    if (data.images?.length) {
        // Create an array of promises for each file deletion
        const deleteImagesPromises = data.images.map(image => {
            return localFileOperations.deleteFile(image?.imageId); // Delete the file physically
        });
        // Delete the files physically using Promise.all
        await Promise.all(deleteImagesPromises);
    }

    // Perform the deletion with the specified projection field for optional file handling
    await AboutUsModel.delete({
        where: {
            id: userInput?.id,
        },
    });

    // If no document is found, send a 404 response
    const deletedData = await AboutUsModel.findUnique({
        where: {
            id: userInput?.id,
        },
        select: {
            id: true // Only return the ID of the deleted document
        },
    });
    if (deletedData) {
        return NOT_FOUND(`Failed to delete about us entry with ID "${userInput?.id}".`, request);
    }

    // Send a success response
    return OK(`About us entry with ID "${userInput?.id}" deleted successfully.`, {}, request);
};

/**
 * PATCH variable assigned to an asynchronous route handler for updating an "About Us" entry by its ID.
 *
 * This handler leverages an async error-handling middleware (`asyncHandler`) to manage execution flow
 * and ensure proper error handling during the update process. It uses the `handleUpdateAboutUsById`
 * function which encapsulates the logic for updating the specified resource in a data store or database.
 */
export const PATCH = asyncHandler(handleUpdateAboutUsById);

/**
 * DELETE is a constant that represents an asynchronous handler function for deleting a career entry by its identifier.
 * The function utilizes an asyncHandler utility to handle any asynchronous operations and errors during the process.
 *
 * The primary purpose of this variable is to encapsulate the logic for deleting a specific career record using its unique ID.
 * It ensures that the operation is handled asynchronously with proper error handling.
 *
 * The handler is expected to be used in an Express.js route or similar framework to handle HTTP DELETE requests.
 */
export const DELETE = asyncHandler(deleteCareerById);
