import { PrismaClient } from '@prisma/client';

import galleryPhotoSchema from "@/app/api/v1/gallery/photo/gallery.photo.schema";
import galleryPhotoConstants from "@/app/api/v1/gallery/photo/gallery.photo.constants";
import sharedResponseTypes from "@/shared/shared.response.types";
import localFileOperations from "@/util/localFileOperations";

import asyncHandler from "@/util/asyncHandler";
import validateUnsupportedContent from "@/util/validateUnsupportedContent";
import parseAndValidateFormData from "@/util/parseAndValidateFormData";
import validateToken from "@/util/validateToken";
import galleryPhotoSelectionCriteria from "@/app/api/v1/gallery/photo/gallery.photo.selection.criteria";

const prisma = new PrismaClient();

const { INTERNAL_SERVER_ERROR, CONFLICT, CREATED, NOT_FOUND } = sharedResponseTypes;

const model = prisma.GalleryPhoto;

// Helper function to create and respond with the FAQ
const createGalleryPhotoEntry = async (userInput, request) => {
    const newDocument = await model.create({
        data: userInput,
        select: {
            id: true, // Only return the ID of the updated document
        },
    });

    const selectionCriteria = galleryPhotoSelectionCriteria();

    const createdDocument = await model.findUnique({
        where: {
            id: newDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!createdDocument?.id) {
        return INTERNAL_SERVER_ERROR(`Failed to create gallery photo entry with title "${userInput?.title}".`, request);
    }

    // No need for an aggregation pipeline; Prisma returns the created document
    return CREATED(`Gallery photo entry with title "${userInput?.title}" created successfully.`, createdDocument, request);
};

// Named export for the POST request handler (Create FAQ)
const handleCreateGalleryPhoto = async (request, context) => {
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
    const userInput = await parseAndValidateFormData(request, context, 'create', galleryPhotoSchema.createSchema);

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

    // Upload files and construct the `files` array for documents
    const images = await Promise.all(
        (userInput[galleryPhotoConstants.imagesFieldName]).map(async (fileEntry) => {
            // Call your file upload operation
            const { fileId, fileLink } = await localFileOperations.uploadFile(request, fileEntry);
            return {
                imageId: fileId,
                image: fileLink
            };
        })
    );

    userInput.images = images;

    // Create the FAQ entry and send the response
    return createGalleryPhotoEntry(userInput, request);
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleCreateGalleryPhoto);
