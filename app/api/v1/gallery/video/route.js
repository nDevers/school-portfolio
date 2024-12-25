import { GalleryVideoModel } from '@/shared/prisma.model.shared';
import serviceShared from '@/shared/service.shared';
import galleryVideoSchema from '@/app/api/v1/gallery/video/gallery.video.schema';

import asyncHandler from '@/util/asyncHandler';
import galleryVideoSelectionCriteria from '@/app/api/v1/gallery/video/gallery.video.selection.criteria';

/**
 * Represents the criteria used for selecting videos from a gallery.
 * This variable holds the result of the galleryVideoSelectionCriteria() function,
 * which defines the rules or parameters for choosing specific videos.
 *
 * The selection criteria may include a variety of filters or properties
 * (e.g., video type, resolution, duration, tags) as determined
 * by the galleryVideoSelectionCriteria() function.
 */
const selectionCriteria = galleryVideoSelectionCriteria();

/**
 * Asynchronous function to handle the retrieval of a list of gallery videos.
 *
 * This function interacts with a shared service to fetch entries based on the provided
 * request and context, using specific model and selection criteria. It utilizes the
 * `getDataByQuery` method from the `galleryVideoSchema` to query data related to
 * gallery videos.
 *
 * @param {Object} request - The incoming request object containing necessary data to fetch the gallery video list.
 * @param {Object} context - The context object providing additional information or dependencies required for processing.
 * @returns {Promise<Object>} A promise that resolves to the list of gallery videos fetched from the shared service.
 */
const handleGetGalleryVideoList = async (request, context) => {
    return serviceShared.fetchEntryList(
        request,
        context,
        GalleryVideoModel,
        selectionCriteria,
        'Gallery video',
        galleryVideoSchema.getDataByQuery
    );
};

/**
 * Represents an asynchronous handler for managing HTTP GET requests.
 * This constant is usually used to handle the retrieval
 * of a gallery video list in an API endpoint.
 *
 * GET is assigned an asynchronous function wrapped with a middleware (`asyncHandler`)
 * to manage errors during the execution of the `handleGetGalleryVideoList` process.
 *
 * The `handleGetGalleryVideoList` function specifies the logic for fetching
 * and returning the list of videos in the gallery, typically called with an HTTP GET request.
 *
 * Errors or exceptions that occur during this operation are caught and forwarded
 * to an appropriate error-handling middleware.
 *
 * Usage requires defining this constant as part of an API routing mechanism
 * for responding to GET requests and handling associated business logic for video retrieval.
 */
export const GET = asyncHandler(handleGetGalleryVideoList);
