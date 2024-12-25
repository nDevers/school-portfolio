import { AboutUsModel } from "@/shared/prisma.model.shared";
import serviceShared from "@/shared/service.shared";
import aboutUsSchema from "@/app/api/v1/about-us/about.us.schema";

import asyncHandler from "@/util/asyncHandler";
import aboutUsSelectionCriteria from "@/app/api/v1/about-us/about.us.selection.criteria";

/**
 * Asynchronous function to handle the retrieval of the career list.
 *
 * This function is responsible for fetching the list of entries based on
 * the "About us" selection criteria. It utilizes shared service logic to
 * retrieve the data and formats it according to the specific schema.
 *
 * @function
 * @async
 * @param {Object} request - The incoming request object containing relevant data for processing.
 * @param {Object} context - Contextual information for the current operation.
 * @returns {Promise<Object>} A promise that resolves to the list of entries.
 */
const handleGetCareerList = async (request, context) => {
    const selectionCriteria = aboutUsSelectionCriteria();

    return serviceShared.fetchEntryList(request, context, AboutUsModel, selectionCriteria, 'About us', aboutUsSchema.getDataByQuery);
};

/**
 * GET is an async function used to handle HTTP GET requests.
 * It leverages the `asyncHandler` utility to manage asynchronous
 * operations and error handling for the `handleGetCareerList` function.
 *
 * `handleGetCareerList` typically manages fetching and returning
 * a list of careers or related resources.
 *
 * The purpose of wrapping it in `asyncHandler` is to simplify error
 * handling by passing any thrown errors to the global error-handling middleware.
 */
export const GET = asyncHandler(handleGetCareerList);