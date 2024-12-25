import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";

import asyncHandler from "@/util/asyncHandler";
import blogSelectionCriteria from "@/app/api/v1/blog/blog.selection.criteria";

/**
 * An instance of PrismaClient used to handle database operations.
 * PrismaClient provides an abstraction layer for interacting with
 * the database, enabling seamless execution of queries, mutations,
 * and other database-related operations using a type-safe approach.
 *
 * This instance should be used to initialize connections to the
 * database and perform queries or transaction management within
 * the application.
 *
 * It is designed to be instantiated once and reused throughout
 * the entire lifecycle of the application in order to manage
 * the database connection pool efficiently.
 */
const prisma = new PrismaClient();

/**
 * Represents the Prisma Blog model.
 * This model corresponds to the `Blog` table in the database.
 * Typically used to interact with the `Blog` data through Prisma ORM.
 */
const model = prisma.Blog;

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

    return serviceShared.fetchEntryById(request, context, model, selectionCriteria,  'Blog');
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
