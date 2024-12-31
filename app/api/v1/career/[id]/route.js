'use strict';

import { CareerModel } from '@/shared/prisma.model.shared';
import serviceShared from '@/shared/service.shared';

import asyncHandler from '@/util/asyncHandler';
import careerSelectionCriteria from '@/app/api/v1/career/career.selection.criteria';

/**
 * Asynchronously handles the retrieval of a career entry by its identifier.
 *
 * @param {Object} request - The request object containing the necessary information to perform the operation.
 * @param {Object} context - The context object providing additional information needed for processing the request.
 * @returns {Promise<Object>} A promise that resolves to the career entry fetched by its identifier.
 *
 * This function leverages shared service functionality to fetch a career entry from the database
 * or an external system using predefined selection criteria. The retrieved entry corresponds
 * to the 'Career' model.
 */
export const handleGetCareerById = async (request, context) => {
    const selectionCriteria = careerSelectionCriteria();

    return serviceShared.fetchEntryById(
        request,
        context,
        CareerModel,
        selectionCriteria,
        'Career'
    );
};

/**
 * GET is an asynchronous function wrapped with an asyncHandler to process HTTP GET requests.
 * It invokes the handleGetCareerById method to retrieve career information based on a provided ID.
 * This function is part of a request handling logic for accessing specific career-related data.
 *
 * @type {Function}
 */
export const GET = asyncHandler(handleGetCareerById);
