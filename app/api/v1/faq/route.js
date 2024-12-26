'use strict';

import { FaqModel } from '@/shared/prisma.model.shared';
import serviceShared from '@/shared/service.shared';
import faqSchema from '@/app/api/v1/faq/faq.schema';

import asyncHandler from '@/util/asyncHandler';
import faqSelectionCriteria from '@/app/api/v1/faq/faq.selection.criteria';

/**
 * Asynchronous function that handles the retrieval of a list of FAQs based on specified criteria.
 *
 * @function
 * @async
 * @param {Object} request - The request object containing necessary information for processing the FAQ list retrieval.
 * @param {Object} context - The context object providing additional information for the operation.
 * @returns {Promise<Object>} - A promise resolving to the list of FAQs that match the specified selection criteria.
 */
const handleGetFaqList = async (request, context) => {
    const selectionCriteria = faqSelectionCriteria();

    return serviceShared.fetchEntryList(
        request,
        context,
        FaqModel,
        selectionCriteria,
        'FAQ',
        faqSchema.getDataByQuery
    );
};

/**
 * GET is a variable assigned to an asynchronous handler function wrapped by `asyncHandler`.
 * This handler function is typically used to process HTTP GET requests.
 *
 * The purpose of this variable is to handle the retrieval operation for a list of FAQs.
 * It is designed to manage asynchronous operations, such as fetching data from a database,
 * and handle errors effectively during the execution of the request.
 */
export const GET = asyncHandler(handleGetFaqList);
