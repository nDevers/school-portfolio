import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";
import blogSchema from "@/app/api/v1/blog/blog.schema";

import asyncHandler from "@/util/asyncHandler";
import blogSelectionCriteria from "@/app/api/v1/blog/blog.selection.criteria";

/**
 * Instance of PrismaClient, used for database interactions.
 * PrismaClient provides an ORM (Object-Relational Mapping) interface to interact with the database in a type-safe and efficient manner.
 * Allows operations such as creating, reading, updating, and deleting database records.
 * Automatically handles database connection pools for optimized performance.
 *
 * This instance should be properly managed to ensure connection resources are released
 * when no longer needed, especially in serverless environments where connections might persist.
 */
const prisma = new PrismaClient();

/**
 * Represents the Prisma Blog model.
 *
 * The `Blog` model is used to interact with the `Blog` table in the database.
 * It provides functionality to query, create, update, and delete blog records.
 *
 * This model is managed by Prisma's ORM and is designed for data manipulation
 * in blog-related functionalities within the application.
 *
 * Example operations that might be performed using this model include:
 * - Creating new blogs
 * - Retrieving existing blog data
 * - Updating blog records
 * - Deleting blogs from the database
 */
const model = prisma.Blog;

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

    return serviceShared.fetchEntryList(request, context, model, selectionCriteria, 'Blog', blogSchema.getDataByQuery);
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
