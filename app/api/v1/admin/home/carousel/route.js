import { PrismaClient } from '@prisma/client';

import homeCarouselSchema from "@/app/api/v1/home/carousel/home.carousel.schema";
import homeCarouselConstants from "@/app/api/v1/home/carousel/home.carousel.constants";
import sharedResponseTypes from "@/shared/shared.response.types";
import localFileOperations from "@/util/localFileOperations";

import asyncHandler from "@/util/asyncHandler";
import validateUnsupportedContent from "@/util/validateUnsupportedContent";
import parseAndValidateFormData from "@/util/parseAndValidateFormData";
import validateToken from "@/util/validateToken";
import homeCarouselSelectionCriteria from "@/app/api/v1/home/carousel/home.carousel.selection.criteria";

const prisma = new PrismaClient();

const { OK, CREATED, BAD_REQUEST, NOT_FOUND } = sharedResponseTypes;

const model = prisma.HomeCarousel;

const selectionCriteria = homeCarouselSelectionCriteria();

// Helper function to create and respond with the FAQ
const createOrUpdateHomeCarousel = async (existingEntry, userInput, request) => {
    if (existingEntry) {
        // Update the existing entry
        const updatedEntry = await model.update({
            where: { id: existingEntry.id },
            data: {
                images: userInput.images,
                updatedAt: new Date(),
            },
        });
        return OK('Home carousel updated successfully.', updatedEntry, request);
    }

    // Create a new entry
    const newDocument = await model.create({
        data: userInput,
        select: selectionCriteria,
    });

    if (!newDocument?.id) {
        throw new Error('Failed to create home carousel entry.');
    }

    return CREATED('Home carousel entry created successfully.', newDocument, request);
};

// Named export for the POST request handler (Create or Update Home Carousel)
const handleCreateHomeCarousel = async (request) => {
    // Validate content type
    const contentValidation = validateUnsupportedContent(request, homeCarouselConstants.allowedContentTypes);
    if (!contentValidation.isValid) return contentValidation.response;

    // Validate user authorization
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) return authResult.response;

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, {}, 'create', homeCarouselSchema.createSchema);

    // Fetch the existing carousel entry
    const existingEntry = await model.findFirst({
        select: selectionCriteria,
    });

    if (userInput?.images?.length > 0) {
        // Validate image count
        const existingImages = existingEntry?.images || [];
        const newImages = userInput[homeCarouselConstants.imagesFieldName] || [];
        if (existingImages.length + newImages.length > homeCarouselConstants.maxImage) {
            return BAD_REQUEST(
                `The total number of images cannot exceed ${homeCarouselConstants.maxImage}. Current: ${existingImages.length}, New: ${newImages.length}.`,
                request
            );
        }

        // Upload new images
        const uploadedImages = await Promise.all(
            newImages.map(async (file) => {
                const { fileId, fileLink } = await localFileOperations.uploadFile(request, file);
                return { imageId: fileId, image: fileLink };
            })
        );

        userInput.images = [...existingImages, ...uploadedImages];
    }

    // Create or update carousel entry
    return await createOrUpdateHomeCarousel(existingEntry, userInput, request);
};

// Named export for the PATCH request handler
const handleUpdateHomeCarousel = async (request) => {
    // Validate content type
    const contentValidation = validateUnsupportedContent(request, homeCarouselConstants.allowedContentTypes);
    if (!contentValidation.isValid) return contentValidation.response;

    // Validate user authorization
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) return authResult.response;

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, {}, 'update', homeCarouselSchema.updateSchema);

    // Fetch the existing carousel entry
    const existingEntry = await model.findFirst({
        select: selectionCriteria,
    });
    if (!existingEntry) {
        return NOT_FOUND("Home carousel entry not found.", request);
    }

    // Handle image updates
    let updatedImages = existingEntry.images || [];
    if (userInput?.images?.length > 0) {
        // Upload new images
        const uploadedImages = await Promise.all(
            userInput.images.map(async (file) => {
                const { fileId, fileLink } = await localFileOperations.uploadFile(request, file);
                return { imageId: fileId, image: fileLink };
            })
        );
        updatedImages = [...updatedImages, ...uploadedImages];
    }

    if (userInput?.deleteImages?.length > 0) {
        // Delete specified images
        const deletePromises = userInput.deleteImages.map((imageId) =>
            localFileOperations.deleteFile(imageId)
        );
        await Promise.all(deletePromises);

        // Remove deleted images from the updatedImages array
        updatedImages = updatedImages.filter(
            (image) => !userInput.deleteImages.includes(image.imageId)
        );
    }

    // Perform the update
    const updatedEntry = await model.update({
        where: { id: existingEntry.id },
        data: {
            images: updatedImages,
            updatedAt: new Date(),
        },
        select: selectionCriteria,
    });

    return OK("Home carousel entry updated successfully.", updatedEntry, request);
};

// Named export for the DELETE request handler
const deleteHomeCarousel = async (request) => {
    // Validate user authorization
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) return authResult.response;

    // Fetch the existing carousel entry
    const existingEntry = await model.findFirst({
        select: selectionCriteria,
    });
    if (!existingEntry) {
        return NOT_FOUND("Home carousel entry not found.", request);
    }

    // Delete images associated with the entry
    if (existingEntry.images?.length > 0) {
        const deletePromises = existingEntry.images.map((image) =>
            localFileOperations.deleteFile(image.imageId)
        );
        await Promise.all(deletePromises);
    }

    // Delete the entry
    await model.delete({
        where: { id: existingEntry.id },
    });

    return OK("Home carousel entry deleted successfully.", {}, request);
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleCreateHomeCarousel);

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateHomeCarousel);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(deleteHomeCarousel);
