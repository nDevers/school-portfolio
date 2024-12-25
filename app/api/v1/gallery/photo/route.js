import { GalleryPhotoModel } from "@/shared/prisma.model.shared";
import serviceShared from "@/shared/service.shared";
import galleryPhotoSchema from "@/app/api/v1/gallery/photo/gallery.photo.schema";

import asyncHandler from "@/util/asyncHandler";
import galleryPhotoSelectionCriteria from "@/app/api/v1/gallery/photo/gallery.photo.selection.criteria";

/**
 * Handles the retrieval of a list of gallery photos based on the provided request and context.
 *
 * This asynchronous function constructs the selection criteria for gallery photos
 * and invokes a shared service to fetch the entry list from the database or other data source.
 *
 * @param {Object} request - The incoming request object containing parameters or query data.
 * @param {Object} context - The context object providing additional metadata or configurations.
 * @returns {Promise<Array>} A promise that resolves to an array of gallery photo entries.
 */
const handleGetGalleryPhotoList = async (request, context) => {
    const selectionCriteria = galleryPhotoSelectionCriteria();

    return serviceShared.fetchEntryList(request, context, GalleryPhotoModel, selectionCriteria, 'Gallery photo', galleryPhotoSchema.getDataByQuery);
};

/**
 * An asynchronous variable wrapping a handler function for processing GET requests.
 *
 * This variable is assigned to an asynchronous handler using `asyncHandler`.
 * It is utilized to handle the process of fetching a list of gallery photos.
 *
 * The handler function (`handleGetGalleryPhotoList`) processes the logic for retrieving
 * the gallery photos, likely interacting with a database or an external API to return
 * the appropriate data as part of the request-response cycle.
 *
 * Errors encountered during the execution of the handler are automatically processed
 * by the `asyncHandler` to ensure proper asynchronous error handling.
 */
export const GET = asyncHandler(handleGetGalleryPhotoList);