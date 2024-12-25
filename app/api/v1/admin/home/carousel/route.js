import { HomeCarouselModel } from "@/shared/prisma.model.shared";
import homeCarouselSchema from "@/app/api/v1/home/carousel/home.carousel.schema";
import homeCarouselConstants from "@/app/api/v1/home/carousel/home.carousel.constants";
import sharedResponseTypes from "@/shared/shared.response.types";
import localFileOperations from "@/util/localFileOperations";

import asyncHandler from "@/util/asyncHandler";
import validateUnsupportedContent from "@/util/validateUnsupportedContent";
import parseAndValidateFormData from "@/util/parseAndValidateFormData";
import validateToken from "@/util/validateToken";
import homeCarouselSelectionCriteria from "@/app/api/v1/home/carousel/home.carousel.selection.criteria";


const { OK, CREATED, BAD_REQUEST, NOT_FOUND } = sharedResponseTypes;

/**
 * Represents the selection criteria for the home carousel.
 * This variable holds the configuration or criteria used
 * to determine the content to be displayed in the home carousel component.
 * The content displayed may vary based on various dynamic conditions
 * or pre-defined logic encapsulated in the `homeCarouselSelectionCriteria` function.
 */
const selectionCriteria = homeCarouselSelectionCriteria();

/**
 * Handles the creation or updating of a home carousel entry.
 *
 * Based on the presence of an existing entry, this function either updates the existing
 * carousel entry or creates a new one. It updates the provided data for an existing
 * entry or creates a new document if no existing entry is specified. The operation
 * ensures that relevant fields, such as the images and timestamps, are properly handled.
 *
 * @async
 * @function
 * @param {Object|null} existingEntry - The existing home carousel entry to update. If null, a new entry will be created.
 * @param {Object} userInput - The input data provided by the user, which includes details for the home carousel.
 * @param {Object} request - The HTTP request object associated with the operation, used for constructing responses.
 * @returns {Object} A response object indicating the success of the operation with appropriate status and data.
 * @throws {Error} Throws an error if the creation of a new home carousel entry fails.
 */
const createOrUpdateHomeCarousel = async (existingEntry, userInput, request) => {
    if (existingEntry) {
        // Update the existing entry
        const updatedEntry = await HomeCarouselModel.update({
            where: { id: existingEntry.id },
            data: {
                images: userInput.images,
                updatedAt: new Date(),
            },
        });
        return OK('Home carousel updated successfully.', updatedEntry, request);
    }

    // Create a new entry
    const newDocument = await HomeCarouselModel.create({
        data: userInput,
        select: selectionCriteria,
    });

    if (!newDocument?.id) {
        throw new Error('Failed to create home carousel entry.');
    }

    return CREATED('Home carousel entry created successfully.', newDocument, request);
};

/**
 * Asynchronous function to handle the creation or update of a home carousel entry.
 *
 * This function validates the incoming request, checks authorization, validates content type,
 * and ensures the user input adheres to the predefined schema. It manages the addition of new
 * images to the carousel, ensures the total image count does not exceed the allowed limit, and
 * handles file uploads.
 *
 * If an existing carousel entry is found, it merges the new images with existing ones. Otherwise,
 * it creates a new carousel entry with the provided data. Returns an appropriate response depending
 * on the validation and execution outcomes.
 *
 * @param {Object} request - The incoming request object containing user input and metadata.
 * @returns {Promise<Object>} A response object indicating success or failure of the operation.
 */
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
    const existingEntry = await HomeCarouselModel.findFirst({
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

/**
 * Handles updating the home carousel entry.
 *
 * This asynchronous method performs necessary validations, user authorization,
 * and updates the home carousel entry with the provided data.
 *
 * Steps performed:
 * - Validates the content type of the incoming request.
 * - Verifies user authorization using a token.
 * - Parses and validates the form data according to the predefined schema.
 * - Fetches the existing home carousel entry and ensures it exists.
 * - Handles image operations, including uploading new images and deleting specified images.
 * - Performs the actual update on the carousel entry in the database.
 *
 * Returns an appropriate response based on the outcome of the operation:
 * - If input is invalid or user authorization fails, a relevant response is returned.
 * - If the carousel entry is not found, returns a "not found" response.
 * - On successful update, returns an "OK" response along with the updated entry details.
 *
 * @param {Object} request - The incoming request object containing necessary parameters and data.
 * @returns {Promise<Object>} The response object with the status and relevant data or error message.
 */
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
    const existingEntry = await HomeCarouselModel.findFirst({
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
    const updatedEntry = await HomeCarouselModel.update({
        where: { id: existingEntry.id },
        data: {
            images: updatedImages,
            updatedAt: new Date(),
        },
        select: selectionCriteria,
    });

    return OK("Home carousel entry updated successfully.", updatedEntry, request);
};

/**
 * Asynchronous function to delete the home carousel entry.
 *
 * This function handles the deletion of a home carousel entry, including:
 * - Validating the user's authorization token.
 * - Fetching the existing carousel entry based on predefined selection criteria.
 * - Deleting images associated with the carousel entry by removing them from local file storage.
 * - Deleting the carousel entry from the database if it exists.
 *
 * @param {Object} request - The request object containing details needed for processing,
 * including user credentials or tokens used for authorization.
 * @returns {Promise<Object>} A response object indicating the success or failure of the operation.
 * If the operation fails, it includes the reason for the failure (e.g., authorization failure or missing entry).
 */
const deleteHomeCarousel = async (request) => {
    // Validate user authorization
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) return authResult.response;

    // Fetch the existing carousel entry
    const existingEntry = await HomeCarouselModel.findFirst({
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
    await HomeCarouselModel.delete({
        where: { id: existingEntry.id },
    });

    return OK("Home carousel entry deleted successfully.", {}, request);
};

/**
 * The `POST` variable represents an asynchronous handler function that manages HTTP POST requests.
 * It utilizes the `asyncHandler` middleware to handle any asynchronous operations effectively and
 * ensure proper error handling during the execution of the `handleCreateHomeCarousel` function.
 *
 * The purpose of the `POST` handler is to create and manage the home carousel content for the application.
 *
 * @type {function} POST - An asynchronous function wrapped with error-handling middleware.
 */
export const POST = asyncHandler(handleCreateHomeCarousel);

/**
 * PATCH is an asynchronous middleware function designed to handle HTTP PATCH requests.
 * It is wrapped with asyncHandler to manage errors effectively during the execution of the handler function.
 * The handleUpdateHomeCarousel function processes updates to the home carousel resource.
 *
 * This variable is intended to be used as a route handler in server-side applications,
 * typically within an Express.js framework, to manage updates to a specific resource.
 */
export const PATCH = asyncHandler(handleUpdateHomeCarousel);

/**
 * DELETE is an asynchronous handler function for the deletion of a home carousel.
 * It processes incoming HTTP requests to delete a specified home carousel entry.
 * The function is wrapped with an asyncHandler utility to handle errors and asynchronous operations.
 */
export const DELETE = asyncHandler(deleteHomeCarousel);
