import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";
import academicSchema from "@/app/api/v1/academic/academic.schema";

import asyncHandler from "@/util/asyncHandler";
import academicSelectionCriteria from "@/app/api/v1/academic/academic.selection.criteria";

/**
 * An instance of the PrismaClient used to interact with a database.
 * This enables performing database operations such as queries and mutations
 * using the Prisma query engine. It provides methods for accessing and
 * manipulating data in various connected models/tables of the database.
 *
 * Ensure to properly handle the connection lifecycle by connecting,
 * disconnecting, or utilizing it within the scope of your application
 * context.
 *
 * For advanced configurations, PrismaClient can accept options such
 * as logging, error formatting, or custom middlewares.
 */
const prisma = new PrismaClient();

/**
 * Represents the Academic model associated with the Prisma ORM.
 * This model is typically used to interact with and manipulate data
 * in the academic domain within the application's database.
 * The structure and properties of this model are predefined within
 * the Prisma schema and correspond to database fields.
 */
const model = prisma.Academic;

/**
 * Asynchronous handler to retrieve academic entries by category and ID.
 *
 * This function utilizes the `fetchEntryByCategoryAndId` service shared method
 * to fetch an academic entry. It uses a specified selection criteria and schema
 * to ensure the data is filtered and validated appropriately.
 *
 * @param {Object} request - The incoming request object containing parameters and data.
 * @param {Object} context - The context object containing metadata and environment-related configurations.
 * @returns {Promise<Object>} A promise resolving to the academic entry fetched based on the category and ID.
 */
export const handleGetAcademicByCategoryAndId = async (request, context) => {
    const selectionCriteria = academicSelectionCriteria();

    return serviceShared.fetchEntryByCategoryAndId(request, context, model, selectionCriteria,  'Academic', () => academicSchema.categoryAndIdSchema());
};

/**
 * GET is an asynchronous handler function used to execute the handleGetAcademicByCategoryAndId function.
 * This handler is wrapped with the asyncHandler utility to manage promise-based error handling.
 *
 * @constant
 * @type {Function}
 * @function
 * @returns {Promise<void>} Executes the specified logic and handles asynchronous operations for fetching
 * academic details by category and ID.
 */
export const GET = asyncHandler(handleGetAcademicByCategoryAndId);
