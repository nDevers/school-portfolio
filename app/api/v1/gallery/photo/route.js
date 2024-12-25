import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";
import galleryPhotoSchema from "@/app/api/v1/gallery/photo/gallery.photo.schema";

import asyncHandler from "@/util/asyncHandler";
import galleryPhotoSelectionCriteria from "@/app/api/v1/gallery/photo/gallery.photo.selection.criteria";

/**
 * An instance of the PrismaClient class, used to interact with the database.
 *
 * The PrismaClient provides methods to perform database operations such as
 * querying, creating, updating, and deleting data. It acts as a bridge
 * between the application and the connected database, enabling
 * type-safe and efficient data handling.
 *
 * This variable should be used to execute all database queries and
 * mutations in the application. Ensure to properly manage the lifecycle
 * of this instance, including opening and closing database connections.
 */
const prisma = new PrismaClient();

/**
 * Represents a GalleryPhoto model from Prisma.
 *
 * This model is used to manage and interact with photo entries in a gallery.
 * It typically contains attributes and relationships pertaining to a single photo entity
 * within a gallery context. The model enables CRUD operations as well as associations with
 * other models where applicable.
 */
const model = prisma.GalleryPhoto;

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

    return serviceShared.fetchEntryList(request, context, model, selectionCriteria, 'Gallery photo', galleryPhotoSchema.getDataByQuery);
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