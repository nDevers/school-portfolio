import { AcademicModel } from '@/shared/prisma.model.shared';
import serviceShared from '@/shared/service.shared';
import academicSchema from '@/app/api/v1/academic/academic.schema';

import asyncHandler from '@/util/asyncHandler';
import academicSelectionCriteria from '@/app/api/v1/academic/academic.selection.criteria';

/**
 * Handles fetching academic entries by category.
 *
 * This asynchronous function retrieves academic-related data from a given
 * category based on the specified request and context. It utilizes a predefined
 * selection criteria and schema for academic categories to fetch the entries via
 * a shared service method.
 *
 * @function
 * @async
 * @param {Object} request - The request object containing necessary inputs for fetching academic entries.
 * @param {Object} context - The context object providing additional information for the operation.
 * @returns {Promise<Object>} A promise that resolves with the academic entries fetched by category.
 */
export const handleGetAcademicByCategory = async (request, context) => {
    const selectionCriteria = academicSelectionCriteria();

    return serviceShared.fetchEntryByCategory(
        request,
        context,
        AcademicModel,
        selectionCriteria,
        'Academic',
        () => academicSchema.categorySchema()
    );
};

/**
 * GET is an asynchronous handler function used to manage
 * HTTP GET requests. It utilizes the asyncHandler middleware
 * to handle errors and processes requests by executing the
 * handleGetAcademicByCategory function. Specifically, this
 * function is responsible for retrieving academic information
 * filtered by a given category.
 *
 * handleGetAcademicByCategory: Function that contains the logic
 * to fetch academic data based on specific categories.
 *
 * asyncHandler: Middleware that wraps asynchronous route handlers
 * and centralizes error handling.
 */
export const GET = asyncHandler(handleGetAcademicByCategory);
