import { SchoolInfoModel } from '@/shared/prisma.model.shared';
import serviceShared from '@/shared/service.shared';
import schoolInfoSchema from '@/app/api/v1/school/info/school.info.schema';

import asyncHandler from '@/util/asyncHandler';
import schoolInfoSelectionCriteria from '@/app/api/v1/school/info/school.info.selection.criteria';

/**
 * Asynchronous function to handle the retrieval of a list of school information entries.
 *
 * This function utilizes predefined selection criteria and schema mapping to fetch
 * the relevant data based on the provided request and context. The fetched data is
 * retrieved using the serviceShared utility method `fetchEntryList`.
 *
 * @param {Object} request - The request object containing parameters and data necessary for processing.
 * @param {Object} context - The contextual object containing details about the execution environment or session.
 * @returns {Promise<Object[]>} A promise resolving to an array of school information entries that match the defined criteria.
 */
const handleGetSchoolInfoList = async (request, context) => {
    const selectionCriteria = schoolInfoSelectionCriteria();

    return serviceShared.fetchEntryList(
        request,
        context,
        SchoolInfoModel,
        selectionCriteria,
        'School info',
        schoolInfoSchema.getDataByQuery
    );
};

/**
 * Asynchronous function to handle the retrieval of school information list.
 * This variable represents a request handler responsible for processing
 * requests and returning the appropriate response asynchronously.
 *
 * The function is wrapped with `asyncHandler` to ensure proper handling
 * of asynchronous operations and errors.
 *
 * @constant {Function} GET
 */
export const GET = asyncHandler(handleGetSchoolInfoList);
