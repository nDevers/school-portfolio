import { GalleryVideoModel } from "@/shared/prisma.model.shared";
import serviceShared from "@/shared/service.shared";

import asyncHandler from "@/util/asyncHandler";
import galleryVideoSelectionCriteria from "@/app/api/v1/gallery/video/gallery.video.selection.criteria";

/**
 * Represents the criteria used for selecting videos in the gallery.
 * This variable stores the result of invoking the `galleryVideoSelectionCriteria` function,
 * which determines the filtering and selection parameters for videos.
 */
const selectionCriteria = galleryVideoSelectionCriteria();

/**
 * Asynchronous function to handle the retrieval of a gallery video entry by its ID.
 *
 * This function interacts with the shared service to fetch an entry from the database
 * or a related data source. The function processes the request and context to retrieve
 * a specific gallery video entity based on the provided criteria.
 *
 * The function relies on a predefined model and selection criteria tailored
 * to fetching gallery video entity.
 *
 * @param {Object} request - The incoming request object containing necessary parameters for fetching the gallery video entry.
 * @param {Object} context - The context for the request, potentially including user information, authentication, or other metadata.
 * @returns {Promise<Object>} - A promise that resolves to the gallery video entry object, or rejects with an error if fetching fails.
 */
export const handleGetGalleryVideoById = async (request, context) => {
    return serviceShared.fetchEntryById(request, context, GalleryVideoModel, selectionCriteria,  'Gallery video');
};

/**
 * GET is an asynchronous handler function mapped to manage HTTP GET requests for retrieving gallery video data by its ID.
 *
 * This function utilizes an async wrapper (`asyncHandler`) around the core handler (`handleGetGalleryVideoById`) to efficiently manage asynchronous operations
 * and handle potential errors during the execution of the request.
 *
 * The handler is designed to fetch the necessary video information from a gallery based on the provided video ID in the request parameters.
 * It returns the requested data in the response and ensures proper error handling in case the operation fails.
 *
 * Dependencies:
 * - `asyncHandler`: A utility function to streamline error handling in asynchronous functions.
 * - `handleGetGalleryVideoById`: A method that implements the logic for fetching gallery video details.
 */
export const GET = asyncHandler(handleGetGalleryVideoById);
