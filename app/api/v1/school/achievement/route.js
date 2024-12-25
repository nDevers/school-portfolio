import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";
import faqSchema from "@/app/api/v1/faq/faq.schema";

import asyncHandler from "@/util/asyncHandler";
import schoolAchievementSelectionCriteria from "@/app/api/v1/school/achievement/school.achievement.selection.criteria";

/**
 * An instance of PrismaClient used for database interactions.
 * PrismaClient is an ORM (Object-Relational Mapping) tool that enables communication
 * with a connected database. It provides methods to query, insert, update, and delete
 * data from the database in a type-safe manner.
 *
 * This variable connects to the database as per the configuration settings defined
 * in the Prisma schema file (`schema.prisma`). Initialization of this client establishes
 * a connection, allowing the application to perform database operations.
 *
 * It is recommended to use this instance throughout the application to ensure
 * consistency and maintain a single database connection pool.
 *
 * Be mindful of proper usage patterns, especially in serverless environments,
 * to prevent potential connection issues.
 */
const prisma = new PrismaClient();

/**
 * Represents the SchoolAchievement model from Prisma.
 *
 * This model corresponds to the SchoolAchievement table in the database
 * and is used to perform operations such as querying, creating, updating,
 * and deleting school achievement records.
 *
 * The model includes definitions for all fields and relationships related
 * to school achievements, enabling seamless integration with the Prisma Client.
 *
 * Note:
 * Modifications to the database schema require re-generating the Prisma Client.
 * Ensure that all application logic interacting with this model is
 * updated accordingly to prevent runtime errors.
 */
const model = prisma.SchoolAchievement;

/**
 * Asynchronous function to handle the retrieval of a list of school achievements.
 *
 * This function utilizes a predefined selection criteria to fetch a list of school achievement
 * entries from the database using a service shared method. It ensures that the data conforms
 * to the defined query schema.
 *
 * @async
 * @function handleGetSchoolAchievementList
 * @param {Object} request - The request object containing necessary parameters for the operation.
 * @param {Object} context - The context object providing additional information for the request.
 * @returns {Promise<Object>} A Promise that resolves to the list of school achievements.
 */
const handleGetSchoolAchievementList = async (request, context) => {
    const selectionCriteria = schoolAchievementSelectionCriteria();

    return serviceShared.fetchEntryList(request, context, model, selectionCriteria, 'School achievement', faqSchema.getDataByQuery);
};

/**
 * An asynchronous function that serves as the handler for fetching a list of school achievements.
 * It utilizes the `asyncHandler` utility to manage asynchronous operations and potential errors.
 *
 * This variable is assigned to handle the specific route or functionality where the school achievement list data
 * is processed and retrieved.
 *
 * @constant
 * @type {Function}
 */
export const GET = asyncHandler(handleGetSchoolAchievementList);
