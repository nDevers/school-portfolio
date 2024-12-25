import prismaModelsConstants from "@/constants/prisma.models.constants";
import serviceShared from "@/shared/service.shared";

import asyncHandler from "@/util/asyncHandler";
import aboutUsSelectionCriteria from "@/app/api/v1/about-us/about.us.selection.criteria";


const model = prismaModelsConstants.AboutUs;

/**
 * Asynchronous handler function to retrieve the "About Us" entry by its unique identifier.
 *
 * @param {Object} request - The incoming request object containing necessary parameters such as the ID.
 * @param {Object} context - The context object containing information required for the execution of the function.
 * @returns {Promise<Object>} Resolves with the fetched "About Us" entry object or an error if the retrieval fails.
 */
export const handleGetAboutUsById = async (request, context) => {
    const selectionCriteria = aboutUsSelectionCriteria();

    return serviceShared.fetchEntryById(request, context, model, selectionCriteria,  'About us');
};

/**
 * GET variable is assigned an asynchronous handler function.
 * This handler is responsible for processing GET requests, specifically those
 * related to retrieving information about "About Us" content by a given ID.
 *
 * The assigned function typically uses the `asyncHandler` utility to manage
 * asynchronous request processing and error handling.
 *
 * @type {Function}
 */
export const GET = asyncHandler(handleGetAboutUsById);
