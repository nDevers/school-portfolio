import { PrismaClient } from '@prisma/client';

import galleryVideoSchema from "@/app/api/v1/gallery/video/gallery.video.schema";
import galleryVideoConstants from "@/app/api/v1/gallery/video/gallery.video.constants";
import sharedResponseTypes from "@/shared/shared.response.types";

import asyncHandler from "@/util/asyncHandler";
import parseAndValidateFormData from "@/util/parseAndValidateFormData";
import validateToken from "@/util/validateToken";
import validateUnsupportedContent from "@/util/validateUnsupportedContent";
import galleryVideoSelectionCriteria from "@/app/api/v1/gallery/video/gallery.video.selection.criteria";
import serviceShared from "@/shared/service.shared";

const prisma = new PrismaClient();

const { INTERNAL_SERVER_ERROR, NOT_FOUND, CONFLICT, OK } = sharedResponseTypes;

const model = prisma.GalleryVideo;

const selectionCriteria = galleryVideoSelectionCriteria();

// Helper function to update and respond with the FAQ
const updateGalleryVideoEntry = async (userInput, request) => {
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

    const updatedDocument = await model.findUnique({
        where: {
            id: updateDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!updatedDocument?.id) {
        return INTERNAL_SERVER_ERROR(`Failed to update gallery video entry with the ID "${userInput?.id}".`, request);
    }

    return OK(`Gallery video entry with the ID "${userInput?.id}" updated successfully.`, updatedDocument, request);
};

// Named export for the GET request handler
const handleUpdateGalleryVideoById = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(request, galleryVideoConstants.allowedContentTypes);
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Validate if the user is authorized (admin)
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, context, 'update', galleryVideoSchema.updateSchema);

    // Check if FAQ entry with the same title already exists
    const existingGalleryVideo = await model.findUnique({
        where: {
            id: userInput?.id,
        },
        select: {
            id: true,
            youtubeLinks: true,
        }
    });
    if (!existingGalleryVideo) {
        return NOT_FOUND(`Gallery video entry with ID "${userInput?.id}" not found.`, request);
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
            return CONFLICT(`Gallery video entry with title "${userInput?.title}" already exists.`, request);
        }
    }

    // Handle deletion of specific YouTube links
    let updatedYoutubeLinks = existingGalleryVideo.youtubeLinks || [];
    if (userInput?.deleteYoutubeLinks?.length > 0) {
        // Ensure only existing YouTube links are being deleted
        const nonExistingLinks = userInput.deleteYoutubeLinks.filter(
            (link) => !updatedYoutubeLinks.includes(link)
        );

        if (nonExistingLinks.length > 0) {
            return NOT_FOUND(
                `YouTube link(s) [${nonExistingLinks.join(', ')}] not found in the database.`,
                request
            );
        }

        // Remove specified links from the current list
        updatedYoutubeLinks = updatedYoutubeLinks.filter(
            (link) => !userInput.deleteYoutubeLinks.includes(link)
        );
    }

    // Add new YouTube links (if provided)
    if (userInput?.youtubeLinks?.length > 0) {
        updatedYoutubeLinks = [...new Set([...updatedYoutubeLinks, ...userInput.youtubeLinks])]; // Ensure no duplicates
    }

    userInput.youtubeLinks = updatedYoutubeLinks;

    delete userInput.deleteYoutubeLinks;

    // Create the FAQ entry and send the response
    return updateGalleryVideoEntry(userInput, request);
};

const deleteGalleryVideoById = async (request, context) => {
    return serviceShared.deleteEntryById(request, context, model, '', 'Gallery video');
};

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateGalleryVideoById);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(deleteGalleryVideoById);
