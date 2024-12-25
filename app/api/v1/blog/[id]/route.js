import { BlogModel } from "@/shared/prisma.model.shared";
import serviceShared from "@/shared/service.shared";

import asyncHandler from "@/util/asyncHandler";
import blogSelectionCriteria from "@/app/api/v1/blog/blog.selection.criteria";


/**
 * Asynchronous function to handle the retrieval of a blog post by its ID.
 *
 * This function uses the provided request and context to fetch a blog entry
 * from the data store. The selection criteria for the blog entry is determined
 * via the `blogSelectionCriteria` function. The fetching operation is performed
 * using the `serviceShared.fetchEntryById` method.
 *
 * @param {Object} request - The request object containing parameters needed to fetch the blog.
 * @param {Object} context - The execution context for the function, which may include user and environment details.
 * @returns {Promise<Object>} A promise that resolves to the retrieved blog entry.
 */
export const handleGetBlogById = async (request, context) => {
    const selectionCriteria = blogSelectionCriteria();

    return serviceShared.fetchEntryById(request, context, BlogModel, selectionCriteria,  'Blog');
};

/**
 * A middleware function that handles GET requests for retrieving a blog by its ID.
 *
 * The `GET` variable utilizes the `asyncHandler` middleware to wrap the `handleGetBlogById`
 * function, ensuring that any errors occurring during the asynchronous operation are
 * caught and passed to the error-handling middleware. This helps maintain cleaner
 * code by avoiding repetitive try-catch blocks.
 *
 * The purpose of this function is to fetch and return blog data for a specific blog
 * identified by an ID provided in the request.
 *
 * Variable: `GET`
 * Type: Middleware function
 */
export const GET = asyncHandler(handleGetBlogById);
