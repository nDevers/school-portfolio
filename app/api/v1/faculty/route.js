import { FacultyModel } from '@/shared/prisma.model.shared';
import serviceShared from '@/shared/service.shared';
import facultySchema from '@/app/api/v1/faculty/faculty.schema';

import asyncHandler from '@/util/asyncHandler';
import facultySelectionCriteria from '@/app/api/v1/faculty/faculty.selection.criteria';

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

    return serviceShared.fetchEntryByCategory(
        request,
        context,
        FacultyModel,
        selectionCriteria,
        'Faculty',
        () => facultySchema.getDataByQuery()
    );
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
