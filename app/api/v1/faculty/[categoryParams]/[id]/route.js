import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";
import facultySchema from "@/app/api/v1/faculty/faculty.schema";

import asyncHandler from "@/util/asyncHandler";
import facultySelectionCriteria from "@/app/api/v1/faculty/faculty.selection.criteria";

/**
 * An instance of the PrismaClient, which is used to interact with a database
 * through the Prisma ORM. This client provides a type-safe and performant API
 * to perform operations such as querying, creating, updating, and deleting
 * data in the database.
 *
 * Use the PrismaClient instance to access database models and execute
 * operations using Prisma's query engine. Make sure to properly handle
 * connection management, such as opening and closing the connection to avoid
 * potential database connection issues.
 */
const prisma = new PrismaClient();

/**
 * Represents the `Faculty` model in the Prisma schema.
 * This model defines the structure and relationships for faculty entities in the database.
 * It is used to perform various database operations related to the faculty data.
 *
 * The `Faculty` model may include properties such as identifiers, names, email addresses, departments, or any other faculty-specific attributes as defined in the Prisma schema.
 */
const model = prisma.Faculty;

/**
 * Asynchronous handler function to fetch faculty information based on category and ID.
 *
 * This function retrieves faculty data by applying a specified selection criteria and schema for category and ID validation.
 * It utilizes the `serviceShared.fetchEntryByCategoryAndId` method to perform the retrieval operation.
 *
 * @function handleGetFacultyByCategoryAndId
 * @async
 * @param {Object} request - The request object containing relevant data for processing the fetch operation.
 * @param {Object} context - The context object providing additional information or dependencies for the request.
 * @returns {Promise<Object>} Resolves with the fetched faculty data that matches the specified category and ID.
 * @throws {Error} Throws an error if the fetch operation fails or the input validation criteria are not met.
 */
export const handleGetFacultyByCategoryAndId = async (request, context) => {
    const selectionCriteria = facultySelectionCriteria();

    return serviceShared.fetchEntryByCategoryAndId(request, context, model, selectionCriteria,  'Faculty', () => facultySchema.categoryAndIdSchema());
};

/**
 * Asynchronous function that wraps the given `handleGetFacultyByCategoryAndId`
 * function with an error-handling middleware using `asyncHandler`.
 *
 * The `GET` variable is used as a route handler for handling GET HTTP requests,
 * specifically for retrieving faculty details filtered by category and ID.
 *
 * The `asyncHandler` ensures that any errors during the execution of
 * `handleGetFacultyByCategoryAndId` are properly caught and passed to the next
 * middleware for appropriate handling.
 *
 * @type {Function}
 */
export const GET = asyncHandler(handleGetFacultyByCategoryAndId);
