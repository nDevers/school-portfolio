import { CareerModel } from '@/shared/prisma.model.shared';
import serviceShared from '@/shared/service.shared';
import careerSchema from '@/app/api/v1/career/career.schema';

import asyncHandler from '@/util/asyncHandler';
import careerSelectionCriteria from '@/app/api/v1/career/career.selection.criteria';

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

    return serviceShared.fetchEntryList(
        request,
        context,
        CareerModel,
        selectionCriteria,
        'Career',
        careerSchema.getDataByQuery
    );
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
