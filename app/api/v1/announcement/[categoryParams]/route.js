'use strict';

import { AnnouncementModel } from '@/shared/prisma.model.shared';
import serviceShared from '@/shared/service.shared';
import announcementSchema from '@/app/api/v1/announcement/announcement.schema';

import asyncHandler from '@/util/asyncHandler';
import announcementSelectionCriteria from '@/app/api/v1/announcement/announcement.selection.criteria';

/**
 * Handles the retrieval of announcements filtered by category.
 *
 * This asynchronous function processes the provided `request` and `context`
 * to fetch announcements based on their category. The function uses predefined
 * selection criteria and a schema for category validation to ensure the
 * retrieved data adheres to expected formats.
 *
 * The function relies on the `serviceShared.fetchEntryByCategory` method
 * to interact with the data source and fetch the announcements.
 *
 * @param {Object} request - The request object containing necessary parameters to perform the category filtering.
 * @param {Object} context - The context object that provides additional metadata or dependencies for processing.
 * @returns {Promise<Object>} - A promise that resolves to the list of filtered announcements.
 */
export const handleGetAnnouncementByCategory = async (request, context) => {
    const selectionCriteria = announcementSelectionCriteria();

    return serviceShared.fetchEntryByCategory(
        request,
        context,
        AnnouncementModel,
        selectionCriteria,
        'Announcement',
        () => announcementSchema.categorySchema()
    );
};

/**
 * GET is an asynchronous function that handles the retrieval of announcements by category.
 * It utilizes an asynchronous middleware handler to manage the request and response cycle effectively.
 * This variable is assigned the result of invoking the `asyncHandler` function,
 * wrapping the `handleGetAnnouncementByCategory` logic to streamline error handling.
 */
export const GET = asyncHandler(handleGetAnnouncementByCategory);
