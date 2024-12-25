import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";
import facultySchema from "@/app/api/v1/faculty/faculty.schema";

import asyncHandler from "@/util/asyncHandler";
import facultySelectionCriteria from "@/app/api/v1/faculty/faculty.selection.criteria";

/**
 * An instance of PrismaClient used to interact with the database.
 *
 * This object serves as the database client and provides a set of methods
 * to perform CRUD operations on the database models defined in the
 * Prisma schema. The PrismaClient automatically handles database connections
 * and manages their lifecycle.
 *
 * Typically used to query, create, update, and delete records in the database.
 */
const prisma = new PrismaClient();

/**
 * The `model` variable represents the Prisma Faculty model.
 * This model is utilized to interact with the `Faculty` table in the database.
 * It provides various methods for performing CRUD operations, queries, and transactions specific to faculty-related data.
 *
 * Use this model to:
 * - Create new faculty entries in the database.
 * - Retrieve existing faculty records.
 * - Update faculty fields and attributes.
 * - Delete faculty data.
 * - Perform complex queries and aggregations related to the Faculty data.
 */
const model = prisma.Faculty;

/**
 * Handles the retrieval of faculty data by category.
 *
 * This asynchronous function processes a request to fetch faculty information
 * filtered by specific categories. It utilizes a shared service method to fetch
 * entries by category, applying a defined selection criteria and a specific schema.
 *
 * @param {Object} request - The incoming request object containing parameters and payload for the operation.
 * @param {Object} context - The contextual information related to the request for additional processing.
 * @returns {Promise<Object>} - Resolves with the faculty information filtered by the specified category.
 */
export const handleGetFacultyByCategory = async (request, context) => {
    const selectionCriteria = facultySelectionCriteria();

    return serviceShared.fetchEntryByCategory(request, context, model, selectionCriteria,  'Faculty', () => facultySchema.categorySchema());
};

/**
 * Asynchronous middleware function used to handle HTTP GET requests.
 * This constant utilizes an async handler to execute the `handleGetFacultyByCategory` function,
 * encapsulating it to manage potential errors and ensuring proper asynchronous execution.
 *
 * `handleGetFacultyByCategory` is expected to handle the logic for retrieving faculty based on specific categories.
 *
 * Useful in route definitions to manage faculty retrieval operations categorized by certain parameters.
 *
 * @constant
 * @type {Function}
 */
export const GET = asyncHandler(handleGetFacultyByCategory);
