import { PrismaClient } from '@prisma/client';

import galleryPhotoSchema from "@/app/api/v1/gallery/photo/gallery.photo.schema";
import galleryPhotoConstants from "@/app/api/v1/gallery/photo/gallery.photo.constants";
import sharedResponseTypes from "@/shared/shared.response.types";
import localFileOperations from "@/util/localFileOperations";
import schemaShared from "@/shared/schema.shared";

import asyncHandler from "@/util/asyncHandler";
import parseAndValidateFormData from "@/util/parseAndValidateFormData";
import validateToken from "@/util/validateToken";
import validateUnsupportedContent from "@/util/validateUnsupportedContent";
import galleryPhotoSelectionCriteria from "@/app/api/v1/gallery/photo/gallery.photo.selection.criteria";

const prisma = new PrismaClient();

const { INTERNAL_SERVER_ERROR, NOT_FOUND, CONFLICT, OK } = sharedResponseTypes;
const { idValidationSchema } = schemaShared;

const model = prisma.GalleryPhoto;

// Helper function to update and respond with the FAQ
const updateGalleryPhotoEntry = async (userInput, request) => {
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

    const selectionCriteria = galleryPhotoSelectionCriteria();

    const updatedDocument = await model.findUnique({
        where: {
            id: updateDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!updatedDocument?.id) {
        return INTERNAL_SERVER_ERROR(`Failed to update gallery photo entry with the ID "${userInput?.id}".`, request);
    }

    return OK(`Gallery photo entry with the ID "${userInput?.id}" updated successfully.`, updatedDocument, request);
};

// Named export for the GET request handler
const handleUpdateGalleryPhotoById = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(request, galleryPhotoConstants.allowedContentTypes);
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Validate if the user is authorized (admin)
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, context, 'update', galleryPhotoSchema.updateSchema);

    // Check if FAQ entry with the same title already exists
    const existingGalleryPhoto = await model.findUnique({
        where: {
            id: userInput?.id,
        },
        select: {
            id: true,
            images: true,
        }
    });
    if (!existingGalleryPhoto) {
        return NOT_FOUND(`Gallery photo entry with ID "${userInput?.id}" not found.`, request);
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
            return CONFLICT(`Gallery photo entry with title "${userInput?.title}" already exists.`, request);
        }
    }

    if (userInput?.images?.length > 0) {
        // Upload images and construct the `images` array for documents
        const images = await Promise.all(
            (userInput[galleryPhotoConstants.imagesFieldName] || []).map(async (imageEntry) => {
                // Call your image upload operation
                const { fileId, fileLink } = await localFileOperations.uploadFile(request, imageEntry);
                return {
                    imageId: fileId,
                    image: fileLink
                };
            })
        );

        userInput.images = images;
    }

    let images = {};

    if (userInput?.deleteImages && Array.isArray(userInput.deleteImages)) {
        // Check if all images in deleteImages actually exist in the current images array
        const nonExistingFiles = userInput.deleteImages.filter(imageId =>
            !existingGalleryPhoto?.images?.some(image => image.imageId === imageId)
        );

        if (nonExistingFiles.length > 0) {
            // If any image to be deleted is not found in the database, return 404 with the missing image IDs
            return NOT_FOUND(`File(s) with IDs [${nonExistingFiles.join(', ')}] not found in the database.`, request);
        }

        // Create an array of promises for each image deletion
        const deletePromises = userInput.deleteImages.map(imageId => {
            return localFileOperations.deleteFile(imageId); // Delete the image physically
        });

        // Filter out images that are being deleted (those in deleteImages)
        images = existingGalleryPhoto?.images?.filter(image => !userInput.deleteImages.includes(image?.imageId));

        // Delete the images physically using Promise.all
        await Promise.all(deletePromises);

        // After deletion, update the database to remove the deleted image objects
        await model.update({
            where: { id: existingGalleryPhoto.id }, // Assuming the record is identified by id
            data: {
                images: images // Update the images field in the database, only keeping non-deleted images
            }
        });

        delete userInput.deleteImages;  // Remove deleteImages field from userInput
    }

    console.log(userInput)

    // Create the FAQ entry and send the response
    return updateGalleryPhotoEntry(userInput, request);
};

const deleteGalleryPhotoById = async (request, context) => {
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
            images: true,
        },
    });
    if (!data) {
        return NOT_FOUND(`Gallery photo entry with ID "${userInput?.id}" not found.`, request);
    }

    if (data?.images?.length) {
        // Create an array of promises for each image deletion
        const deleteImagesPromises = data.images.map(image => {
            return localFileOperations.deleteFile(image?.imageId); // Delete the image physically
        });

        // Delete the images physically using Promise.all
        await Promise.all(deleteImagesPromises);
    }

    // Perform the deletion with the specified projection field for optional image handling
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
        return NOT_FOUND(`Failed to delete gallery photo entry with ID "${userInput?.id}".`, request);
    }

    // Send a success response
    return OK(`Gallery photo entry with ID "${userInput?.id}" deleted successfully.`, {}, request);
};

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateGalleryPhotoById);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(deleteGalleryPhotoById);
