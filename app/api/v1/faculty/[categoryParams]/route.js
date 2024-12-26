'use strict';

import { FacultyModel } from '@/shared/prisma.model.shared';
import serviceShared from '@/shared/service.shared';
import facultySchema from '@/app/api/v1/faculty/faculty.schema';

import asyncHandler from '@/util/asyncHandler';
import facultySelectionCriteria from '@/app/api/v1/faculty/faculty.selection.criteria';

/**
 * Handles the retrieval of faculty data by category.
 *
 * This asynchronous function processes a request to fetch faculty information
 * filtered by specific categories. It utilizes a shared service method to fetch
 * entries by category, applying a defined selection criteria and a specific schema.
 *
 * @param {Object} request - The incoming request object containing parameters and payload for the operation.
 * @param {Object} context - The contextual information related to the request for additional processing.
 * @returns {Promise<Object>} - Resolves with the faculty information filtered by the specified category.
 */
export const handleGetFacultyByCategory = async (request, context) => {
    const selectionCriteria = facultySelectionCriteria();

    return serviceShared.fetchEntryByCategory(
        request,
        context,
        FacultyModel,
        selectionCriteria,
        'Faculty',
        () => facultySchema.categorySchema()
    );
};

/**
 * Asynchronous middleware function used to handle HTTP GET requests.
 * This constant utilizes an async handler to execute the `handleGetFacultyByCategory` function,
 * encapsulating it to manage potential errors and ensuring proper asynchronous execution.
 *
 * `handleGetFacultyByCategory` is expected to handle the logic for retrieving faculty based on specific categories.
 *
 * Useful in route definitions to manage faculty retrieval operations categorized by certain parameters.
 *
 * @constant
 * @type {Function}
 */
export const GET = asyncHandler(handleGetFacultyByCategory);
