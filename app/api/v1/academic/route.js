import prismaModelsConstants from "@/constants/prisma.models.constants";
import serviceShared from "@/shared/service.shared";
import academicSchema from "@/app/api/v1/academic/academic.schema";

import asyncHandler from "@/util/asyncHandler";
import academicSelectionCriteria from "@/app/api/v1/academic/academic.selection.criteria";


const model = prismaModelsConstants.Academic;

/**
 * Asynchronous function to handle fetching the academic list based on specified criteria.
 *
 * This function utilizes a predefined academic selection criteria and invokes a shared service
 * to fetch entries categorized under 'Academic'. It also provides a method to retrieve data by query
 * through the academic schema.
 *
 * @async
 * @param {Object} request - The request object containing details for processing the fetch operation.
 * @param {Object} context - The context object providing additional metadata for the request processing.
 * @returns {Promise<Object>} A promise that resolves to the fetched academic list.
 */
const handleGetAcademicList = async (request, context) => {
    const selectionCriteria = academicSelectionCriteria();

    return serviceShared.fetchEntryByCategory(request, context, model, selectionCriteria, 'Academic', () => academicSchema.getDataByQuery());
};

/**
 * GET is an asynchronous middleware function utilized in handling HTTP GET requests.
 * It is wrapped with `asyncHandler` to manage potential asynchronous errors.
 * Specifically, it is designed to invoke the `handleGetAcademicList` function,
 * which is expected to process and respond to incoming requests for retrieving
 * an academic list.
 *
 * This variable ensures clean error handling and a structured, asynchronous
 * response mechanism for retrieving academic data.
 *
 * @type {Function}
 */
export const GET = asyncHandler(handleGetAcademicList);
