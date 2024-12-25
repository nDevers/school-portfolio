import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";
import facultySchema from "@/app/api/v1/faculty/faculty.schema";

import asyncHandler from "@/util/asyncHandler";
import facultySelectionCriteria from "@/app/api/v1/faculty/faculty.selection.criteria";

/**
 * Instance of PrismaClient for interacting with a Prisma database.
 *
 * PrismaClient provides a type-safe database client to connect to and
 * query a database. It acts as an ORM to handle database operations
 * such as creating, reading, updating, and deleting records.
 *
 * This variable represents the main connection interface to perform
 * database operations. The Prisma schema is used to define the data
 * models, relationships, and database queries that can be executed
 * through this client.
 *
 * Ensure to properly manage the lifecycle of the PrismaClient instance,
 * especially in long-running applications, to avoid resource leaks like
 * unclosed database connections.
 *
 * Note: Always call the `disconnect` or `$disconnect` method when
 * shutting down the application to close active database connections.
 */
const prisma = new PrismaClient();

/**
 * Represents the Faculty model from the Prisma schema.
 *
 * The Faculty model typically corresponds to a table in the database that contains
 * details and attributes specific to faculty members or organizational faculties,
 * as defined in the Prisma client.
 *
 * This model is used to interact with the Faculty data within the database, allowing
 * for operations such as creating, reading, updating, and deleting faculty-related records.
 *
 * Note: The structure and fields of this model are defined in the Prisma schema file.
 */
const model = prisma.Faculty;

/**
 * Asynchronous function to handle the retrieval of the faculty list.
 * This function uses predefined selection criteria and fetches entries
 * categorized under 'Faculty' from the shared service.
 *
 * @param {Object} request - The incoming request object containing necessary data for processing.
 * @param {Object} context - The context object providing additional environmental information.
 * @returns {Promise<Object>} A promise resolving to the fetched faculty data.
 */
const handleGetFacultyList = async (request, context) => {
    const selectionCriteria = facultySelectionCriteria();

    return serviceShared.fetchEntryByCategory(request, context, model, selectionCriteria, 'Faculty', () => facultySchema.getDataByQuery());
};

/**
 * The `GET` variable is an asynchronous handler for managing HTTP GET requests.
 * It is wrapped with the `asyncHandler` utility to handle errors gracefully.
 * Primarily used to execute the `handleGetFacultyList` function, which processes
 * and retrieves a list of faculty data from the server.
 *
 * Dependencies:
 * - asyncHandler: A function or middleware designed to handle asynchronous errors.
 * - handleGetFacultyList: A callback function responsible for retrieving faculty list details.
 *
 * Purpose:
 * - Handles incoming GET requests.
 * - Fetches and returns a list of faculty data upon successful execution.
 *
 * Error Handling:
 * - Errors occurring during the execution of `handleGetFacultyList` are automatically
 *   caught and passed to the associated error handler middleware through `asyncHandler`.
 */
export const GET = asyncHandler(handleGetFacultyList);
