import { AnnouncementModel } from '@/shared/prisma.model.shared';
import serviceShared from '@/shared/service.shared';
import announcementSchema from '@/app/api/v1/announcement/announcement.schema';

import asyncHandler from '@/util/asyncHandler';
import announcementSelectionCriteria from '@/app/api/v1/announcement/announcement.selection.criteria';

/**
 * Asynchronous function that handles fetching an announcement by category and ID.
 *
 * This function utilizes the provided request and context to execute a service call,
 * retrieving an entry of type 'Announcement' by utilizing specific selection criteria.
 * It leverages the `announcementSelectionCriteria` function to generate the criteria
 * required for the selection process while adhering to a schema for category and ID
 * validation.
 *
 * @param {Object} request - The request object containing necessary data for fetching an announcement.
 * @param {Object} context - The context object providing additional runtime information.
 * @returns {Promise<Object>} A promise that resolves to the fetched announcement entry.
 */
export const handleGetAnnouncementByCategoryAndId = async (
    request,
    context
) => {
    const selectionCriteria = announcementSelectionCriteria();

    return serviceShared.fetchEntryByCategoryAndId(
        request,
        context,
        AnnouncementModel,
        selectionCriteria,
        'Announcement',
        () => announcementSchema.categoryAndIdSchema()
    );
};

/**
 * Handles GET requests for fetching announcements by category and ID.
 *
 * This variable represents an asynchronous request handler that uses the
 * `asyncHandler` to wrap the `handleGetAnnouncementByCategoryAndId` function.
 * It ensures that any asynchronous errors during the request handling are
 * caught and passed to the error-handling middleware.
 *
 * The `handleGetAnnouncementByCategoryAndId` function is invoked to process
 * the request and retrieve the announcement based on the provided category
 * and identifier parameters.
 */
export const GET = asyncHandler(handleGetAnnouncementByCategoryAndId);
