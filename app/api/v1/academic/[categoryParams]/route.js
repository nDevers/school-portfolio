import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";
import academicSchema from "@/app/api/v1/academic/academic.schema";

import asyncHandler from "@/util/asyncHandler";
import academicSelectionCriteria from "@/app/api/v1/academic/academic.selection.criteria";

/**
 * An instance of the PrismaClient class used to interact with a database.
 *
 * This variable facilitates database operations such as querying, creating,
 * updating, and deleting records. It provides a connection to the database
 * through the Prisma ORM and allows for programmatic access to defined models.
 *
 * The PrismaClient should be used to ensure type-safe and efficient database
 * queries, while managing the underlying database connection pool efficiently.
 *
 * Note: Properly close the PrismaClient instance when the application is
 * shutting down to release database connections.
 */
const prisma = new PrismaClient();

/**
 * Represents the Academic model in the Prisma schema.
 *
 * This model corresponds to the database table for managing
 * Academic-related data. Instances of this model are used
 * to interact with records in the data source, enabling
 * operations such as create, read, update, and delete.
 *
 * The structure and fields of this model are defined in the
 * Prisma schema and mapped to the corresponding database table.
 * Use this model to perform database operations relevant
 * to Academic entities.
 */
const model = prisma.Academic;

/**
 * Handles fetching academic entries by category.
 *
 * This asynchronous function retrieves academic-related data from a given
 * category based on the specified request and context. It utilizes a predefined
 * selection criteria and schema for academic categories to fetch the entries via
 * a shared service method.
 *
 * @function
 * @async
 * @param {Object} request - The request object containing necessary inputs for fetching academic entries.
 * @param {Object} context - The context object providing additional information for the operation.
 * @returns {Promise<Object>} A promise that resolves with the academic entries fetched by category.
 */
export const handleGetAcademicByCategory = async (request, context) => {
    const selectionCriteria = academicSelectionCriteria();

    return serviceShared.fetchEntryByCategory(request, context, model, selectionCriteria,  'Academic', () => academicSchema.categorySchema());
};

/**
 * GET is an asynchronous handler function used to manage
 * HTTP GET requests. It utilizes the asyncHandler middleware
 * to handle errors and processes requests by executing the
 * handleGetAcademicByCategory function. Specifically, this
 * function is responsible for retrieving academic information
 * filtered by a given category.
 *
 * handleGetAcademicByCategory: Function that contains the logic
 * to fetch academic data based on specific categories.
 *
 * asyncHandler: Middleware that wraps asynchronous route handlers
 * and centralizes error handling.
 */
export const GET = asyncHandler(handleGetAcademicByCategory);
