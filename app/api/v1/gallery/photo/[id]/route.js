import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";

import asyncHandler from "@/util/asyncHandler";
import galleryPhotoSelectionCriteria from "@/app/api/v1/gallery/photo/gallery.photo.selection.criteria";

/**
 * The `prisma` variable is an instance of the `PrismaClient` class,
 * which provides an interface for interacting with a Prisma-managed database.
 * It enables the execution of database queries, mutations, and transactions
 * using the defined Prisma schema.
 *
 * This instance should be used to perform operations such as reading,
 * creating, updating, and deleting records within the connected database.
 *
 * Ensure to properly manage the lifecycle of the `PrismaClient` instance,
 * including closing it when it is no longer needed, to prevent resource leaks.
 */
const prisma = new PrismaClient();

/**
 * Represents the database model for a gallery photo in the Prisma schema.
 * This model defines the structure and relationships of the GalleryPhoto entity.
 *
 * The `GalleryPhoto` model typically includes fields that describe
 * the metadata, attributes, and associations of a photo within a gallery.
 *
 * Note: Exact fields and relationships depend on the Prisma schema configuration.
 */
const model = prisma.GalleryPhoto;

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

    return serviceShared.fetchEntryById(request, context, model, selectionCriteria,  'Gallery photo');
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
