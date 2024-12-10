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

const { OK, INTERNAL_SERVER_ERROR, CREATED } = sharedResponseTypes;

const model = prisma.HomeCarousel;

// Helper function to create and respond with the FAQ
const createHomeCarouselEntry = async (existingEntry, userInput, request) => {
    // Update the existing entry or create a new one
    if (existingEntry) {
        const updatedEntry = await model.update({
            where: { id: existingEntry.id },
            data: {
                images: userInput.images,
                updatedAt: new Date(),
            },
        });

        return OK('Home carousel updated successfully.', updatedEntry, request);
    }

    const newDocument = await model.create({
        data: userInput,
        select: {
            id: true,
            images: userInput.images,
        },
    });

    const selectionCriteria = homeCarouselSelectionCriteria();

    const createdDocument = await model.findUnique({
        where: {
            id: newDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!createdDocument?.id) {
        return INTERNAL_SERVER_ERROR('Failed to create home carousel entry.', request);
    }

    // No need for an aggregation pipeline; Prisma returns the created document
    return CREATED('Home carousel entry created successfully.', createdDocument, request);
};

// Named export for the POST request handler (Create or Update Home Carousel)
const handleCreateHomeCarousel = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(request, homeCarouselConstants.allowedContentTypes);
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Validate if the user is authorized (admin)
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, context, 'create', homeCarouselSchema.createSchema);

    // Check if a HomeCarousel entry already exists
    const existingEntry = await model.findFirst({
        select: {
            id: true,
            images: true,
        },
    });

    // Check the total number of images
    const existingImages = existingEntry?.images || [];
    const newImages = userInput[homeCarouselConstants.imagesFieldName] || [];

    if (existingImages.length + newImages.length > 10) {
        return BAD_REQUEST(
            `The total number of images cannot exceed 10. You are trying to upload ${newImages.length} new images, and there are already ${existingImages.length} images.`,
            request
        );
    }

    // Upload files and construct the `images` array
    const uploadedImages = await Promise.all(
        newImages.map(async (fileEntry) => {
            const { fileId, fileLink } = await localFileOperations.uploadFile(request, fileEntry);
            return {
                imageId: fileId,
                image: fileLink,
            };
        })
    );

    userInput.images = [...existingImages, ...uploadedImages];

    await createHomeCarouselEntry(existingEntry, userInput, request);
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleCreateHomeCarousel);
