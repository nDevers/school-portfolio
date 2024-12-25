import {PrismaClient} from "@prisma/client";

import sharedResponseTypes from "@/shared/shared.response.types";

import asyncHandler from "@/util/asyncHandler";
import configurationSelectionCriteria from "@/app/api/v1/configuration/configuration.selection.criteria";

/**
 * An instance of PrismaClient that provides access to the database.
 *
 * PrismaClient is used to interact with the database through queries,
 * mutations, and other operations. It handles the connection pool and
 * efficiently manages database transactions and queries.
 *
 * This variable is typically initialized once and used throughout the
 * application's lifecycle to maintain a single connection to the database.
 *
 * Note: Ensure proper error handling when using this variable, and
 * close the connection (if required) to prevent resource leaks.
 */
const prisma = new PrismaClient();

/**
 * Represents the Prisma model for configuration data.
 * This model is used to interact with the "Configuration" table in the database.
 *
 * The "Configuration" model manages configuration settings and parameters.
 * It typically includes various fields defining key-value pairs or settings
 * required for application behavior or preferences.
 *
 * This is a generated Prisma model and can be used for database operations
 * like create, read, update, and delete on the "Configuration" data.
 */
const model = prisma.Configuration;

/**
 * Represents the criteria used for selecting a specific configuration.
 *
 * The `selectionCriteria` variable holds the set of rules or conditions
 * which determine how a configuration is chosen or filtered. It may
 * encapsulate logic or parameters that define the selection process,
 * based on the application's needs.
 *
 * This variable is initialized with the result of the `configurationSelectionCriteria`
 * function, which provides the appropriate criteria for selection.
 */
const selectionCriteria = configurationSelectionCriteria();

const { NOT_FOUND, OK } = sharedResponseTypes;

/**
 * Asynchronous function to handle the retrieval of configuration.
 *
 * This function fetches the first entry from the specified model based on predefined selection criteria.
 * If no data is found, it returns a NOT_FOUND response with an appropriate message.
 * Otherwise, it returns an OK response with the retrieved configuration and a success message.
 *
 * @param {Object} request - The incoming request object containing necessary context or data.
 * @returns {Promise<Object>} A response object indicating the result of the operation, either NOT_FOUND or OK.
 */
const handleGetConfiguration = async (request) => {
    // Fetch the existing carousel entry
    const data = await model.findFirst({
        select: selectionCriteria,
    });
    if (!data) {
        return NOT_FOUND('No configuration found.', request);
    }

    return OK('Configuration retrieved successfully.', data, request);
};

/**
 * GET is an asynchronous function that handles the retrieval of configuration settings.
 * It utilizes an asyncHandler middleware to manage asynchronous operations and errors effectively.
 * The underlying functionality is defined by the handleGetConfiguration function, which processes the request and generates the appropriate response.
 * Primarily used for handling HTTP GET requests related to configuration data.
 *
 * @constant {Function} GET
 */
export const GET = asyncHandler(handleGetConfiguration);
