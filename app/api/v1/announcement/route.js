'use strict';

import { AnnouncementModel } from '@/shared/prisma.model.shared';
import serviceShared from '@/shared/service.shared';
import announcementSchema from '@/app/api/v1/announcement/announcement.schema';

import asyncHandler from '@/util/asyncHandler';
import announcementSelectionCriteria from '@/app/api/v1/announcement/announcement.selection.criteria';

/**
 * Handles the retrieval of the announcement list based on the provided request and context.
 *
 * This asynchronous function uses predefined selection criteria and service logic to
 * fetch announcements from the database. It invokes the `fetchEntryByCategory` method
 * to retrieve the entries that match the criteria within the 'Announcement' category.
 *
 * @param {Object} request - The request object containing necessary parameters for the query.
 * @param {Object} context - The context object providing additional information for the operation.
 * @returns {Promise<Object[]>} A promise that resolves to an array of announcements matching the criteria.
 */
const handleGetAnnouncementList = async (request, context) => {
    const selectionCriteria = announcementSelectionCriteria();

    return serviceShared.fetchEntryByCategory(
        request,
        context,
        AnnouncementModel,
        selectionCriteria,
        'Announcement',
        () => announcementSchema.getDataByQuery()
    );
};

/**
 * GET is an asynchronous function that handles retrieving a list of announcements.
 * It utilizes an async handler middleware to process the request and response cycles.
 * The function executes the `handleGetAnnouncementList` operation, which is expected
 * to manage the fetching and returning of an announcement list from the server
 * or database.
 *
 * The `asyncHandler` wrapper is used to handle and propagate any asynchronous
 * errors that might occur during the execution of `handleGetAnnouncementList`,
 * ensuring proper error handling within the application.
 */
export const GET = asyncHandler(handleGetAnnouncementList);
