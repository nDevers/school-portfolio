import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";
import careerSchema from "@/app/api/v1/career/career.schema";

import asyncHandler from "@/util/asyncHandler";
import careerSelectionCriteria from "@/app/api/v1/career/career.selection.criteria";

/**
 * An instance of PrismaClient used to interact with a database.
 *
 * The `prisma` variable provides an interface for performing database
 * operations such as queries and mutations using the Prisma ORM. It acts
 * as a bridge between the application and the database, allowing developers
 * to work with the database in a type-safe manner.
 *
 * This instance should be used to execute operations like creating, reading,
 * updating, and deleting records in the configured database. Ensure proper
 * lifecycle management, including initiating connections and closing the
 * client, when appropriate.
 *
 * Note: Avoid creating multiple instances of `PrismaClient` to prevent
 * potential connection overhead or resource issues.
 */
const prisma = new PrismaClient();

/**
 * Represents a Prisma model for a Career entity.
 * This model is typically used to interact with the `Career` table in the database
 * through Prisma's ORM.
 *
 * This variable allows querying, creating, updating, deleting, and managing
 * `Career` records in the database.
 *
 * It includes default methods provided by Prisma such as `findUnique`,
 * `findMany`, `create`, `update`, `delete`, and other related operations.
 *
 * Note: Ensure that the Prisma schema contains a definition for `Career`
 * to avoid runtime errors when using this model.
 */
const model = prisma.Career;

/**
 * Asynchronous function to handle retrieving a list of careers.
 *
 * Retrieves a list of career entries based on predefined selection criteria and the provided request and context.
 * Utilizes a shared service method to fetch the data from the data source.
 *
 * @param {Object} request - The request object containing information about the incoming request.
 * @param {Object} context - The context object providing additional information such as user details or environment.
 * @returns {Promise<Object>} A promise that resolves to the list of career entries.
 */
const handleGetCareerList = async (request, context) => {
    const selectionCriteria = careerSelectionCriteria();

    return serviceShared.fetchEntryList(request, context, model, selectionCriteria, 'Career', careerSchema.getDataByQuery);
};

/**
 * GET is an asynchronous constant that utilizes the asyncHandler middleware
 * to handle incoming HTTP GET requests. It is designed to execute the
 * handleGetCareerList function, which processes and responds to client requests
 * for retrieving a list of careers.
 *
 * The asyncHandler ensures that errors occurring during the execution
 * of handleGetCareerList are efficiently caught and passed to error-handling
 * middleware within the application.
 *
 * Usage context: Typically used in server-side routing to handle
 * GET requests for fetching career-related data.
 *
 * @type {Function}
 */
export const GET = asyncHandler(handleGetCareerList);