'use strict';

import { SchoolAchievementModel } from '@/shared/prisma.model.shared';
import serviceShared from '@/shared/service.shared';
import faqSchema from '@/app/api/v1/faq/faq.schema';

import asyncHandler from '@/util/asyncHandler';
import schoolAchievementSelectionCriteria from '@/app/api/v1/school/achievement/school.achievement.selection.criteria';

/**
 * Asynchronous function to handle the retrieval of a list of school achievements.
 *
 * This function utilizes a predefined selection criteria to fetch a list of school achievement
 * entries from the database using a service shared method. It ensures that the data conforms
 * to the defined query schema.
 *
 * @async
 * @function handleGetSchoolAchievementList
 * @param {Object} request - The request object containing necessary parameters for the operation.
 * @param {Object} context - The context object providing additional information for the request.
 * @returns {Promise<Object>} A Promise that resolves to the list of school achievements.
 */
const handleGetSchoolAchievementList = async (request, context) => {
    const selectionCriteria = schoolAchievementSelectionCriteria();

    return serviceShared.fetchEntryList(
        request,
        context,
        SchoolAchievementModel,
        selectionCriteria,
        'School achievement',
        faqSchema.getDataByQuery
    );
};

/**
 * An asynchronous function that serves as the handler for fetching a list of school achievements.
 * It utilizes the `asyncHandler` utility to manage asynchronous operations and potential errors.
 *
 * This variable is assigned to handle the specific route or functionality where the school achievement list data
 * is processed and retrieved.
 *
 * @constant
 * @type {Function}
 */
export const GET = asyncHandler(handleGetSchoolAchievementList);
