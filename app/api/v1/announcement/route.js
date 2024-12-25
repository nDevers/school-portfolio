import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";
import announcementSchema from "@/app/api/v1/announcement/announcement.schema";

import asyncHandler from "@/util/asyncHandler";
import announcementSelectionCriteria from "@/app/api/v1/announcement/announcement.selection.criteria";

/**
 * An instance of the PrismaClient, which provides the ability to interact with the database
 * through Prisma's query engine. It enables CRUD operations and complex queries using the Prisma schema.
 *
 * The `prisma` variable is used to access the Prisma Client, allowing interaction with
 * database models and ensuring type safety and ease of use in database operations.
 *
 * Caution: Properly manage database connections by closing the PrismaClient instance when
 * it's no longer needed to avoid potential memory leaks or connection issues.
 */
const prisma = new PrismaClient();

/**
 * Represents the Announcement model from Prisma schema.
 * This model is used to interact with the Announcement table/entity in the database.
 * It typically contains properties and methods for managing announcements data.
 *
 * @typedef {Object} Announcement
 */
const model = prisma.Announcement;

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

    return serviceShared.fetchEntryByCategory(request, context, model, selectionCriteria, 'Announcement', () => announcementSchema.getDataByQuery());
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
