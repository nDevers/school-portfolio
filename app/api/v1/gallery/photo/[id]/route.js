import { GalleryPhotoModel } from '@/shared/prisma.model.shared';
import serviceShared from '@/shared/service.shared';

import asyncHandler from '@/util/asyncHandler';
import galleryPhotoSelectionCriteria from '@/app/api/v1/gallery/photo/gallery.photo.selection.criteria';

/**
 * Asynchronous function to handle retrieving a gallery photo by its ID.
 *
 * This function uses predefined selection criteria and invokes a shared service's
 * method to fetch a gallery photo entry from the data source. It processes the
 * request and context to ensure proper execution, and specifies the target model
 * and entity type for fetching.
 *
 * @param {Object} request - The request object containing information required to identify the gallery photo, including its ID and other necessary parameters.
 * @param {Object} context - The contextual information related to the current execution or runtime, such as user details or environment settings.
 * @returns {Promise<Object>} - A promise that resolves to the fetched gallery photo object.
 */
export const handleGetGalleryPhotoById = async (request, context) => {
    const selectionCriteria = galleryPhotoSelectionCriteria();

    return serviceShared.fetchEntryById(
        request,
        context,
        GalleryPhotoModel,
        selectionCriteria,
        'Gallery photo'
    );
};

/**
 * GET is an asynchronous middleware function that utilizes the `asyncHandler` wrapper
 * to handle requests for retrieving a gallery photo by its unique identifier.
 * It delegates the request handling logic to the `handleGetGalleryPhotoById` function.
 *
 * This variable is intended to handle HTTP GET requests, ensuring error-handling capabilities
 * by wrapping the core logic inside `asyncHandler`. Any errors occurring within the
 * delegated function will be passed to the next middleware or error handler.
 */
export const GET = asyncHandler(handleGetGalleryPhotoById);
