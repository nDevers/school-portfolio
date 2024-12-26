'use strict';

import { SchoolSpeechModel } from '@/shared/prisma.model.shared';
import serviceShared from '@/shared/service.shared';
import schoolSpeechSchema from '@/app/api/v1/school/speech/school.speech.schema';

import asyncHandler from '@/util/asyncHandler';
import schoolSpeechSelectionCriteria from '@/app/api/v1/school/speech/school.speech.selection.criteria';

/**
 * An asynchronous function that handles fetching a list of school speeches
 * based on predefined selection criteria. This function utilizes a shared
 * service for querying and retrieving the relevant data.
 *
 * @param {Object} request - The request object containing relevant query parameters
 * or data necessary for processing the request.
 * @param {Object} context - The context object containing additional
 * metadata or contextual information required for handling the request.
 * @returns {Promise<Object>} A promise that resolves to the fetched list
 * of school speeches.
 */
const handleGetSchoolSpeechList = async (request, context) => {
    const selectionCriteria = schoolSpeechSelectionCriteria();

    return serviceShared.fetchEntryList(
        request,
        context,
        SchoolSpeechModel,
        selectionCriteria,
        'School speech',
        schoolSpeechSchema.getDataByQuery
    );
};

/**
 * GET is an asynchronous middleware function that handles HTTP GET requests.
 * It utilizes the `asyncHandler` wrapper to manage asynchronous operations
 * and error handling within the `handleGetSchoolSpeechList` function.
 *
 * The main purpose of this variable is to process and respond to incoming requests
 * for retrieving a list of school speeches.
 *
 * Dependencies:
 * - asyncHandler: A higher-order function that simplifies error handling in asynchronous routes.
 * - handleGetSchoolSpeechList: A function that contains the logic for retrieving the school speech list.
 */
export const GET = asyncHandler(handleGetSchoolSpeechList);
