'use strict';

import { ConfigurationModel } from '@/shared/prisma.model.shared';
import sharedResponseTypes from '@/shared/shared.response.types';

import asyncHandler from '@/util/asyncHandler';
import configurationSelectionCriteria from '@/app/api/v1/configuration/configuration.selection.criteria';

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
    const data = await ConfigurationModel.findFirst({
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
