import { SchoolInfoModel } from '@/shared/prisma.model.shared';
import serviceShared from '@/shared/service.shared';

import asyncHandler from '@/util/asyncHandler';
import schoolInfoSelectionCriteria from '@/app/api/v1/school/info/school.info.selection.criteria';

/**
 * Asynchronous function to handle retrieving school information by ID.
 *
 * @param {Object} request - The request object containing necessary information for processing the request.
 * @param {Object} context - The context object providing additional information about the request execution environment.
 * @returns {Promise<Object>} - A promise that resolves with the retrieved school information.
 *
 * This function defines the selection criteria for retrieving school information
 * and invokes the shared service method `fetchEntryById` with the provided request,
 * context, model, selection criteria, and a description label.
 */
export const handleGetInfoById = async (request, context) => {
    const selectionCriteria = schoolInfoSelectionCriteria();

    return serviceShared.fetchEntryById(
        request,
        context,
        SchoolInfoModel,
        selectionCriteria,
        'School info'
    );
};

/**
 * GET is an asynchronous function created using the `asyncHandler` wrapper.
 * It is responsible for handling HTTP GET requests. The function internally
 * uses `handleGetInfoById` to process the request and retrieve information
 * based on a unique identifier.
 *
 * This function ensures proper error handling by leveraging
 * the functionality provided by `asyncHandler`.
 *
 * @constant {Function} GET
 */
export const GET = asyncHandler(handleGetInfoById);
