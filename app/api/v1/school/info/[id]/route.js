import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";

import asyncHandler from "@/util/asyncHandler";
import schoolInfoSelectionCriteria from "@/app/api/v1/school/info/school.info.selection.criteria";

/**
 * An instance of PrismaClient, used to interact with the database.
 *
 * This variable allows for querying, mutating, and managing the underlying database
 * using Prisma ORM. It provides an abstraction for accessing the database
 * through its intuitive API and is designed to work with multiple database
 * providers such as PostgreSQL, MySQL, SQLite, etc.
 *
 * Note:
 * - Ensure to properly handle database connections by appropriately managing
 *   the lifecycle of PrismaClient (e.g., invoking `prisma.$disconnect()` when
 *   shutting down the application).
 * - This instance should generally be reused across the application to avoid
 *   creating multiple active connections to the database.
 */
const prisma = new PrismaClient();

/**
 * Represents the `SchoolInfo` model from Prisma schema.
 * This model defines the structure and relationships of the school information data
 * in the database, including fields and any associations with other models as declared in
 * the Prisma schema.
 *
 * The `SchoolInfo` model is typically used to manage and query school-related data,
 * and might include attributes such as the name of the school, location, contact information, and more.
 *
 * Ensure to use this model for all operations concerning the `SchoolInfo` entity within the database.
 */
const model = prisma.SchoolInfo;

/**
 * Asynchronous function to handle retrieving school information by ID.
 *
 * @param {Object} request - The request object containing necessary information for processing the request.
 * @param {Object} context - The context object providing additional information about the request execution environment.
 * @returns {Promise<Object>} - A promise that resolves with the retrieved school information.
 *
 * This function defines the selection criteria for retrieving school information
 * and invokes the shared service method `fetchEntryById` with the provided request,
 * context, model, selection criteria, and a description label.
 */
export const handleGetInfoById = async (request, context) => {
    const selectionCriteria = schoolInfoSelectionCriteria();

    return serviceShared.fetchEntryById(request, context, model, selectionCriteria,  'School info');
};

/**
 * GET is an asynchronous function created using the `asyncHandler` wrapper.
 * It is responsible for handling HTTP GET requests. The function internally
 * uses `handleGetInfoById` to process the request and retrieve information
 * based on a unique identifier.
 *
 * This function ensures proper error handling by leveraging
 * the functionality provided by `asyncHandler`.
 *
 * @constant {Function} GET
 */
export const GET = asyncHandler(handleGetInfoById);
