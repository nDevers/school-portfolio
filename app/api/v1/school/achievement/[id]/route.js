'use strict';

import { SchoolAchievementModel } from '@/shared/prisma.model.shared';
import serviceShared from '@/shared/service.shared';

import asyncHandler from '@/util/asyncHandler';
import schoolAchievementSelectionCriteria from '@/app/api/v1/school/achievement/school.achievement.selection.criteria';

/**
 * Handles the retrieval of a school achievement by its unique identifier.
 *
 * This asynchronous function processes a request to fetch a school achievement record
 * from the data source based on a specified ID. It utilizes a shared service function
 * to perform the fetch operation and applies predefined selection criteria specific to
 * school achievements.
 *
 * @async
 * @param {Object} request - The request object containing necessary parameters, including the ID of the school achievement.
 * @param {Object} context - The context object, providing additional metadata or utilities for processing the request.
 * @returns {Promise<Object>} A promise that resolves with the fetched school achievement record if found, or an appropriate error if not.
 */
export const handleGetAchievementById = async (request, context) => {
    const selectionCriteria = schoolAchievementSelectionCriteria();

    return serviceShared.fetchEntryById(
        request,
        context,
        SchoolAchievementModel,
        selectionCriteria,
        'School achievement'
    );
};

/**
 * GET is an asynchronous function wrapped with the asyncHandler utility to manage
 * HTTP GET requests for fetching achievements by their unique identifier.
 * It utilizes handleGetAchievementById as its core logic for processing the request
 * and generating the appropriate response.
 *
 * This function is expected to handle routes where achievement-specific data is retrieved
 * based on the given ID and ensures proper error handling during the process.
 *
 * @constant
 * @type {Function}
 */
export const GET = asyncHandler(handleGetAchievementById);
