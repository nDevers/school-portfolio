import { PrismaClient } from '@prisma/client';
import moment from 'moment';

import blogSchema from "@/app/api/v1/blog/blog.schema";
import blogConstants from "@/app/api/v1/blog/blog.constants";
import sharedResponseTypes from "@/shared/shared.response.types";
import localFileOperations from "@/util/localFileOperations";
import schemaShared from "@/shared/schema.shared";

import asyncHandler from "@/util/asyncHandler";
import parseAndValidateFormData from "@/util/parseAndValidateFormData";
import validateToken from "@/util/validateToken";
import validateUnsupportedContent from "@/util/validateUnsupportedContent";
import blogSelectionCriteria from "@/app/api/v1/blog/blog.selection.criteria";

const prisma = new PrismaClient();

const { INTERNAL_SERVER_ERROR, NOT_FOUND, CONFLICT, OK } = sharedResponseTypes;
const { idValidationSchema } = schemaShared;

const model = prisma.Blog;

// Helper function to update and respond with the FAQ
const updateBlogEntry = async (userInput, request) => {
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

    const selectionCriteria = blogSelectionCriteria();

    const updatedDocument = await model.findUnique({
        where: {
            id: updateDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!updatedDocument?.id) {
        return INTERNAL_SERVER_ERROR(`Failed to update blog entry with the ID "${userInput?.id}".`, request);
    }

    return OK(`Blog entry with the ID "${userInput?.id}" updated successfully.`, updatedDocument, request);
};

// Named export for the GET request handler
const handleUpdateBlogById = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(request, blogConstants.allowedContentTypes);
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Validate if the user is authorized (admin)
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, context, 'update', blogSchema.updateSchema);

    // Check if FAQ entry with the same title already exists
    const existingBlog = await model.findUnique({
        where: {
            id: userInput?.id,
        },
        select: {
            id: true,
            bannerId: true,
            files: true,
            images: true,
        }
    });
    if (!existingBlog) {
        return NOT_FOUND(`About us entry with ID "${userInput?.id}" not found.`, request);
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
            return CONFLICT(`About us entry with title "${userInput?.title}" already exists.`, request);
        }
    }

    // Handle file replacement if a new file is provided
    if (userInput[blogConstants.bannerFieldName] && userInput[blogConstants.bannerFieldName][0]) {
        await localFileOperations.deleteFile(existingBlog?.bannerId); // Delete old file

        const newBanner = userInput[blogConstants.bannerFieldName][0];
        const { fileId, fileLink } = await localFileOperations.uploadFile(request, newBanner);

        userInput.bannerId = fileId;
        userInput.banner = fileLink;
    }

    if (userInput?.files?.length) {
        // Upload files and construct the `files` array for documents
        const files = await Promise.all(
            (userInput[blogConstants.fileFieldName] || []).map(async (fileEntry) => {
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

    if (userInput?.images?.length) {
        // Upload files and construct the `files` array for documents
        const images = await Promise.all(
            (userInput[blogConstants.imageFieldName] || []).map(async (imageEntry) => {
                // Call your file upload operation
                const { fileId, fileLink } = await localFileOperations.uploadFile(request, imageEntry);
                return {
                    imageId: fileId,
                    image: fileLink
                };
            })
        );

        userInput.images = images;
    }

    let files = {};
    let images = {};

    if (userInput?.deleteFiles && Array.isArray(userInput.deleteFiles)) {
        // Check if all files in deleteFiles actually exist in the current files array
        const nonExistingFiles = userInput.deleteFiles.filter(fileId =>
            !existingBlog?.files?.some(file => file?.fileId === fileId)
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
        files = existingBlog?.files?.filter(file => !userInput.deleteFiles.includes(file?.fileId));

        // Delete the files physically using Promise.all
        await Promise.all(deletePromises);

        // After deletion, update the database to remove the deleted file objects
        await model.update({
            where: { id: existingBlog.id }, // Assuming the record is identified by id
            data: {
                files: files, // Update the files field in the database, only keeping non-deleted files
            }
        });
    }

    if (userInput?.deleteImages && Array.isArray(userInput.deleteImages)) {
        // Check if all images in deleteImages actually exist in the current images array
        console.log(existingBlog?.images)
        const nonExistingImages = userInput.deleteImages.filter(imageId =>
            !existingBlog?.images?.some(image => image?.imageId === imageId)
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
        images = existingBlog?.images?.filter(image => !userInput.deleteImages.includes(image?.imageId));

        // Delete the images physically using Promise.all
        await Promise.all(deleteImagePromises);

        // After deletion, update the database to remove the deleted image objects
        await model.update({
            where: { id: existingBlog.id }, // Assuming the record is identified by id
            data: {
                images: images, // Update the images field in the database, only keeping non-deleted images
            }
        });
    }

    delete userInput?.deleteFiles;  // Remove deleteFiles field from userInput
    delete userInput?.deleteImages;  // Remove deleteImages field from userInput

    userInput.files = files; // Assign the updated files list to userInput
    userInput.images = images; // Assign the updated images list to userInput

    // Use Moment.js to convert the date
    if (userInput?.date) {
        // Convert the date using Moment.js
        userInput.date = moment(userInput.date, ['DD/MM/YYYY', moment.ISO_8601], true).toDate();
    }

    // Create the About Us entry and send the response
    return updateBlogEntry(userInput, request);
};

const deleteBlogById = async (request, context) => {
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
            bannerId: true,
            files: true,
            images: true,
        },
    });
    if (!data) {
        return NOT_FOUND(`About us entry with ID "${userInput?.id}" not found.`, request);
    }

    if (data?.bannerId) {
        await localFileOperations.deleteFile(data?.bannerId); // Delete the file physically
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
        return NOT_FOUND(`Failed to delete about us entry with ID "${userInput?.id}".`, request);
    }

    // Send a success response
    return OK(`About us entry with ID "${userInput?.id}" deleted successfully.`, {}, request);
};

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateBlogById);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(deleteBlogById);
