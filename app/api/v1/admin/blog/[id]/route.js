'use strict';

import moment from 'moment';

import { BlogModel } from '@/shared/prisma.model.shared';
import blogSchema from '@/app/api/v1/blog/blog.schema';
import blogConstants from '@/app/api/v1/blog/blog.constants';
import sharedResponseTypes from '@/shared/shared.response.types';
import localFileOperations from '@/util/localFileOperations';
import schemaShared from '@/shared/schema.shared';

import asyncHandler from '@/util/asyncHandler';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import validateToken from '@/util/validateToken';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import blogSelectionCriteria from '@/app/api/v1/blog/blog.selection.criteria';

const { INTERNAL_SERVER_ERROR, NOT_FOUND, CONFLICT, OK } = sharedResponseTypes;
const { idValidationSchema } = schemaShared;

/**
 * Updates a blog entry in the database based on the given user input.
 *
 * The function filters the `userInput` object to include only key-value pairs
 * where the values are non-null and non-undefined, excluding the `id` field.
 * It then updates the document in the database with the filtered fields
 * and retrieves the updated blog entry using predefined selection criteria.
 *
 * If the update operation fails or the updated document cannot be fetched,
 * the function returns an internal server error response. If successful,
 * an OK response is returned along with the updated blog entry.
 *
 * @async
 * @function
 * @param {Object} userInput - Input provided by the user, including the ID of the blog.
 * @param {Object} request - Request object used for tracking API context and adding response metadata.
 * @returns {Promise<Object>} A response object indicating the success or failure of the operation,
 * along with the updated blog entry if the operation succeeds.
 */
const updateBlogEntry = async (userInput, request) => {
    // Filter `userInput` to only include fields with non-null values
    const fieldsToUpdate = Object.keys(userInput).reduce((acc, key) => {
        if (
            userInput[key] !== undefined &&
            userInput[key] !== null &&
            key !== 'id'
        ) {
            acc[key] = userInput[key];
        }
        return acc;
    }, {});

    // Update the document with the filtered data
    const updateDocument = await BlogModel.update({
        where: { id: userInput?.id },
        data: fieldsToUpdate,
        select: {
            id: true, // Only return the ID of the updated document
        },
    });

    const selectionCriteria = blogSelectionCriteria();

    const updatedDocument = await BlogModel.findUnique({
        where: {
            id: updateDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!updatedDocument?.id) {
        return INTERNAL_SERVER_ERROR(
            `Failed to update blog entry with the ID "${userInput?.id}".`,
            request
        );
    }

    return OK(
        `Blog entry with the ID "${userInput?.id}" updated successfully.`,
        updatedDocument,
        request
    );
};

/**
 * Handles the update of a blog entry by its ID, including content validation, authorization,
 * form data parsing, and data manipulation for files and images.
 *
 * @param {Object} request - The incoming HTTP request object containing the blog data to be updated.
 * @param {Object} context - The context object that provides additional metadata or utilities for the operation.
 * @returns {Promise<Object>} - A promise resolving to the response object, which may include success or error details.
 *
 * This function performs the following operations:
 * 1. Validates the request content based on supported content types.
 * 2. Checks the user's authorization using token validation to ensure only authorized users (e.g., admins) can proceed.
 * 3. Parses and validates the provided form data according to the update schema for the blog.
 * 4. Verifies if the blog entry to be updated exists. If not found, returns a "Not Found" response.
 * 5. Validates if the new title conflicts with an existing blog entry title.
 * 6. Handles file and image updates:
 *    - Deletes old file or image if a new one is provided.
 *    - Uploads new files or images if provided, and adds them to the corresponding array (files or images).
 *    - Removes specified files or images if requested, verifying their existence and updating references.
 * 7. Converts dates in the input to a standardized format using Moment.js.
 * 8. Updates the blog entry in the database and removes unnecessary fields from the input data before saving.
 * 9. Sends the appropriate response back, either confirming success or detailing errors.
 */
const handleUpdateBlogById = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(
        request,
        blogConstants.allowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Validate if the user is authorized (admin)
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'update',
        blogSchema.updateSchema
    );

    // Check if FAQ entry with the same title already exists
    const existingBlog = await BlogModel.findUnique({
        where: {
            id: userInput?.id,
        },
        select: {
            id: true,
            bannerId: true,
            files: true,
            images: true,
        },
    });
    if (!existingBlog) {
        return NOT_FOUND(
            `About us entry with ID "${userInput?.id}" not found.`,
            request
        );
    }

    if (userInput?.title) {
        // Check if FAQ entry with the same title already exists
        const existingQuestion = await BlogModel.findUnique({
            where: {
                title: userInput?.title,
            },
            select: {
                id: true,
            },
        });
        if (existingQuestion) {
            return CONFLICT(
                `About us entry with title "${userInput?.title}" already exists.`,
                request
            );
        }
    }

    // Handle file replacement if a new file is provided
    if (
        userInput[blogConstants.bannerFieldName] &&
        userInput[blogConstants.bannerFieldName][0]
    ) {
        await localFileOperations.deleteFile(existingBlog?.bannerId); // Delete old file

        const newBanner = userInput[blogConstants.bannerFieldName][0];
        const { fileId, fileLink } = await localFileOperations.uploadFile(
            request,
            newBanner
        );

        userInput.bannerId = fileId;
        userInput.banner = fileLink;
    }

    if (userInput?.files?.length) {
        // Upload files and construct the `files` array for documents
        const files = await Promise.all(
            (userInput[blogConstants.fileFieldName] || []).map(
                async (fileEntry) => {
                    // Call your file upload operation
                    const { fileId, fileLink } =
                        await localFileOperations.uploadFile(
                            request,
                            fileEntry
                        );
                    return {
                        fileId,
                        file: fileLink,
                    };
                }
            )
        );

        userInput.files = files;
    }

    if (userInput?.images?.length) {
        // Upload files and construct the `files` array for documents
        const images = await Promise.all(
            (userInput[blogConstants.imageFieldName] || []).map(
                async (imageEntry) => {
                    // Call your file upload operation
                    const { fileId, fileLink } =
                        await localFileOperations.uploadFile(
                            request,
                            imageEntry
                        );
                    return {
                        imageId: fileId,
                        image: fileLink,
                    };
                }
            )
        );

        userInput.images = images;
    }

    let files = {};
    let images = {};

    if (userInput?.deleteFiles && Array.isArray(userInput.deleteFiles)) {
        // Check if all files in deleteFiles actually exist in the current files array
        const nonExistingFiles = userInput.deleteFiles.filter(
            (fileId) =>
                !existingBlog?.files?.some((file) => file?.fileId === fileId)
        );

        if (nonExistingFiles.length > 0) {
            // If any file to be deleted is not found in the database, return 404 with the missing file IDs
            return NOT_FOUND(
                `File(s) with IDs [${nonExistingFiles.join(', ')}] not found in the database.`,
                request
            );
        }

        // Create an array of promises for each file deletion
        const deletePromises = userInput.deleteFiles.map((fileId) => {
            return localFileOperations.deleteFile(fileId); // Delete the file physically
        });

        // Filter out files that are being deleted (those in deleteFiles)
        files = existingBlog?.files?.filter(
            (file) => !userInput.deleteFiles.includes(file?.fileId)
        );

        // Delete the files physically using Promise.all
        await Promise.all(deletePromises);

        // After deletion, update the database to remove the deleted file objects
        await BlogModel.update({
            where: { id: existingBlog.id }, // Assuming the record is identified by id
            data: {
                files, // Update the files field in the database, only keeping non-deleted files
            },
        });
    }

    if (userInput?.deleteImages && Array.isArray(userInput.deleteImages)) {
        // Check if all images in deleteImages actually exist in the current images array
        const nonExistingImages = userInput.deleteImages.filter(
            (imageId) =>
                !existingBlog?.images?.some(
                    (image) => image?.imageId === imageId
                )
        );

        if (nonExistingImages.length > 0) {
            // If any image to be deleted is not found in the database, return 404 with the missing image IDs
            return NOT_FOUND(
                `Image(s) with IDs [${nonExistingImages.join(', ')}] not found in the database.`,
                request
            );
        }

        // Create an array of promises for each image deletion
        const deleteImagePromises = userInput.deleteImages.map((imageId) => {
            return localFileOperations.deleteFile(imageId); // Delete the image physically
        });

        // Filter out images that are being deleted (those in deleteImages)
        images = existingBlog?.images?.filter(
            (image) => !userInput.deleteImages.includes(image?.imageId)
        );

        // Delete the images physically using Promise.all
        await Promise.all(deleteImagePromises);

        // After deletion, update the database to remove the deleted image objects
        await BlogModel.update({
            where: { id: existingBlog.id }, // Assuming the record is identified by id
            data: {
                images, // Update the images field in the database, only keeping non-deleted images
            },
        });
    }

    delete userInput?.deleteFiles; // Remove deleteFiles field from userInput
    delete userInput?.deleteImages; // Remove deleteImages field from userInput

    userInput.files = files; // Assign the updated files list to userInput
    userInput.images = images; // Assign the updated images list to userInput

    // Use Moment.js to convert the date
    if (userInput?.date) {
        // Convert the date using Moment.js
        userInput.date = moment(
            userInput.date,
            ['DD/MM/YYYY', moment.ISO_8601],
            true
        ).toDate();
    }

    // Create the About Us entry and send the response
    return updateBlogEntry(userInput, request);
};

/**
 * Deletes a blog entry identified by ID.
 *
 * This asynchronous function performs the following steps:
 * 1. Validates the authorization token of the request to ensure the user has appropriate permissions.
 * 2. Parses and validates the input data in the request against a specified schema.
 * 3. Checks if the specified data (blog entry) exists in the database. If not, it responds with a "not found" error.
 * 4. Deletes associated files, banners, and images in the local file system if they exist.
 * 5. Deletes the blog entry from the database.
 * 6. Confirms the successful deletion of the entry. If the entry still exists, it responds with a failure message.
 * 7. Returns an appropriate success response if the operation is completed successfully.
 *
 * @param {Object} request - The request object containing the details of the operation.
 * @param {Object} context - The context object, providing additional information or services to handle the request.
 * @returns {Object} - A formatted success or failure response based on the result of the operation.
 */
const deleteBlogById = async (request, context) => {
    // Validate admin
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response; // Return early with the authorization failure response
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'delete',
        idValidationSchema
    );

    // Check if data exists
    const data = await BlogModel.findUnique({
        where: {
            id: userInput?.id,
        },
        select: {
            id: true, // Only return the ID of the deleted document
            bannerId: true,
            files: true,
            images: true,
        },
    });
    if (!data) {
        return NOT_FOUND(
            `About us entry with ID "${userInput?.id}" not found.`,
            request
        );
    }

    if (data?.bannerId) {
        await localFileOperations.deleteFile(data?.bannerId); // Delete the file physically
    }

    if (data?.files?.length) {
        // Create an array of promises for each file deletion
        const deleteFilesPromises = data.files.map((file) => {
            return localFileOperations.deleteFile(file?.fileId); // Delete the file physically
        });

        // Delete the files physically using Promise.all
        await Promise.all(deleteFilesPromises);
    }

    if (data.images?.length) {
        // Create an array of promises for each file deletion
        const deleteImagesPromises = data.images.map((image) => {
            return localFileOperations.deleteFile(image?.imageId); // Delete the file physically
        });
        // Delete the files physically using Promise.all
        await Promise.all(deleteImagesPromises);
    }

    // Perform the deletion with the specified projection field for optional file handling
    await BlogModel.delete({
        where: {
            id: userInput?.id,
        },
    });

    // If no document is found, send a 404 response
    const deletedData = await BlogModel.findUnique({
        where: {
            id: userInput?.id,
        },
        select: {
            id: true, // Only return the ID of the deleted document
        },
    });
    if (deletedData) {
        return NOT_FOUND(
            `Failed to delete about us entry with ID "${userInput?.id}".`,
            request
        );
    }

    // Send a success response
    return OK(
        `About us entry with ID "${userInput?.id}" deleted successfully.`,
        {},
        request
    );
};

/**
 * PATCH handler for updating a blog post by its ID.
 *
 * This variable is assigned to an asynchronous route handler that uses
 * `asyncHandler` to manage asynchronous operations and error handling.
 * The handler's main purpose is to update a blog post resource in the
 * data store based on its unique identifier.
 *
 * Dependencies:
 * - `handleUpdateBlogById`: A function that contains the logic to perform
 *   the update operation for a blog post.
 * - `asyncHandler`: A utility function that wraps asynchronous route
 *   handlers to ensure proper error propagation to middleware.
 */
export const PATCH = asyncHandler(handleUpdateBlogById);

/**
 * DELETE is an asynchronous middleware function that handles the deletion of a blog post by its ID.
 * It utilizes the asyncHandler utility to handle errors and exceptions gracefully during the execution.
 *
 * The underlying operation is performed by the deleteBlogById function,
 * which is responsible for locating and removing a blog post from the database.
 *
 * Usage of DELETE streamlines error handling and enhances reliability when performing
 * the delete operation for blog posts in a system.
 */
export const DELETE = asyncHandler(deleteBlogById);
