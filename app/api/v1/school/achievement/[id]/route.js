import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";

import asyncHandler from "@/util/asyncHandler";
import schoolAchievementSelectionCriteria from "@/app/api/v1/school/achievement/school.achievement.selection.criteria";

/**
 * An instance of the PrismaClient used to interact with the database.
 *
 * The `prisma` variable provides an interface for executing queries
 * and mutations on the database. It serves as the primary method
 * for communicating with the database in a type-safe manner.
 *
 * This client is auto-generated based on the Prisma schema and provides
 * a set of methods for performing database operations on defined models.
 *
 * Example use cases include creating, reading, updating, and deleting
 * records in the database, as well as handling more advanced queries.
 *
 * Note: Ensure proper connection management for the PrismaClient,
 * including closing the connection when the application shuts down,
 * to prevent connection leaks.
 */
const prisma = new PrismaClient();

/**
 * Represents the `SchoolAchievement` model from the Prisma schema.
 * This model is used to interact with the `SchoolAchievement` table in the database.
 *
 * The `SchoolAchievement` model typically contains data related to achievements or accomplishments
 * associated with a school or an educational institution. It is managed and queried using Prisma's ORM capabilities.
 *
 * The structure and properties of this model are defined in the Prisma schema file, including its
 * fields, data types, relationships, and constraints.
 *
 * Use this model through Prisma Client to perform operations such as creating, retrieving,
 * updating, and deleting records in the `SchoolAchievement` table.
 *
 * Example use cases for the `SchoolAchievement` model include:
 * - Storing details about awards or recognitions received by a school.
 * - Querying achievements related to a specific school or a group of schools.
 * - Updating information about existing school achievements.
 * - Deleting obsolete or incorrect achievement records.
 */
const model = prisma.SchoolAchievement;

/**
 * Handles the retrieval of a school achievement by its unique identifier.
 *
 * This asynchronous function processes a request to fetch a school achievement record
 * from the data source based on a specified ID. It utilizes a shared service function
 * to perform the fetch operation and applies predefined selection criteria specific to
 * school achievements.
 *
 * @async
 * @param {Object} request - The request object containing necessary parameters, including the ID of the school achievement.
 * @param {Object} context - The context object, providing additional metadata or utilities for processing the request.
 * @returns {Promise<Object>} A promise that resolves with the fetched school achievement record if found, or an appropriate error if not.
 */
export const handleGetAchievementById = async (request, context) => {
    const selectionCriteria = schoolAchievementSelectionCriteria();

    return serviceShared.fetchEntryById(request, context, model, selectionCriteria,  'School achievement');
};

/**
 * GET is an asynchronous function wrapped with the asyncHandler utility to manage
 * HTTP GET requests for fetching achievements by their unique identifier.
 * It utilizes handleGetAchievementById as its core logic for processing the request
 * and generating the appropriate response.
 *
 * This function is expected to handle routes where achievement-specific data is retrieved
 * based on the given ID and ensures proper error handling during the process.
 *
 * @constant
 * @type {Function}
 */
export const GET = asyncHandler(handleGetAchievementById);
