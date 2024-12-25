import { BlogModel } from '@/shared/prisma.model.shared';
import serviceShared from '@/shared/service.shared';
import blogSchema from '@/app/api/v1/blog/blog.schema';

import asyncHandler from '@/util/asyncHandler';
import blogSelectionCriteria from '@/app/api/v1/blog/blog.selection.criteria';

/**
 * Asynchronous function to handle fetching a list of blog entries.
 *
 * This function utilizes shared service logic to fetch blog entries
 * based on specified selection criteria. It takes in the request
 * and context objects to process and retrieve the data using the
 * provided blog schema.
 *
 * @param {Object} request - The request object containing parameters and necessary data for fetching the blog list.
 * @param {Object} context - The context object used for additional processing and operational information.
 * @returns {Promise<Object[]>} A promise that resolves to an array of blog entries.
 */
const handleGetBlogList = async (request, context) => {
    const selectionCriteria = blogSelectionCriteria();

    return serviceShared.fetchEntryList(
        request,
        context,
        BlogModel,
        selectionCriteria,
        'Blog',
        blogSchema.getDataByQuery
    );
};

/**
 * An asynchronous handler function assigned to the GET constant.
 * This function is primarily used to handle the retrieval of a blog list.
 * It utilizes behavior from the provided `asyncHandler` higher-order function
 * to manage asynchronous operations and potential errors.
 *
 * The `handleGetBlogList` function passed to `asyncHandler` is expected
 * to perform the logic for fetching the blog list, potentially from a database
 * or other data source.
 *
 * The `GET` variable encapsulates this functionality for use
 * within larger application routing or endpoint definitions.
 */
export const GET = asyncHandler(handleGetBlogList);
