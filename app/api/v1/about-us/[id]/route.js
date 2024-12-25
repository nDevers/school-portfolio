import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";

import asyncHandler from "@/util/asyncHandler";
import aboutUsSelectionCriteria from "@/app/api/v1/about-us/about.us.selection.criteria";

/**
 * An instance of PrismaClient used to interact with a database.
 * Provides methods for querying, inserting, updating, and deleting
 * data in a Prisma-supported database. This instance establishes
 * a connection to the database based on the configuration provided
 * in the Prisma schema file.
 *
 * PrismaClient includes features such as query batching, transaction
 * support, and query optimization to efficiently manage database
 * interactions.
 *
 * This instance should be reused throughout the application to avoid
 * creating multiple database connections.
 */
const prisma = new PrismaClient();

/**
 * Represents the AboutUs model from Prisma schema.
 *
 * This model corresponds to the 'AboutUs' table in the database.
 * It defines the structure and relationships for the 'AboutUs' entity.
 */
const model = prisma.AboutUs;

/**
 * Asynchronous function to handle retrieving "About Us" information by ID.
 *
 * This function uses a selection criteria specific to "About Us" entries to fetch
 * the desired record from the database or service using the provided model and handler.
 *
 * @param {Object} request - The request object containing information about the ID and other request parameters.
 * @param {Object} context - The context object providing additional metadata or processing context for the operation.
 * @returns {Promise<Object>} A promise that resolves to the fetched "About Us" entry.
 */
export const handleGetAboutUsById = async (request, context) => {
    const selectionCriteria = aboutUsSelectionCriteria();

    return serviceShared.fetchEntryById(request, context, model, selectionCriteria,  'About us');
};

/**
 * GET variable is an asynchronous route handler.
 * It is used to process HTTP GET requests by handling
 * "About Us" data retrieval based on a specific ID.
 * This handler ensures that the associated logic is executed
 * safely within an error-handling wrapper provided by asyncHandler.
 *
 * The operation performed by GET includes:
 * - Receiving the "About Us" ID from the route parameter.
 * - Delegating the ID to the handleGetAboutUsById function.
 * - Returning the corresponding "About Us" data as a response.
 *
 * It uses the asyncHandler utility to handle potential asynchronous
 * errors that may occur in the handleGetAboutUsById function.
 */
export const GET = asyncHandler(handleGetAboutUsById);
