import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";
import schoolInfoSchema from "@/app/api/v1/school/info/school.info.schema";

import asyncHandler from "@/util/asyncHandler";
import schoolInfoSelectionCriteria from "@/app/api/v1/school/info/school.info.selection.criteria";

/**
 * An instance of PrismaClient used to interact with the database.
 * Provides methods for querying, creating, updating, and deleting data
 * within the connected database using the Prisma ORM.
 *
 * This instance establishes and maintains the database connection,
 * allowing integration with various database providers such as
 * PostgreSQL, MySQL, SQLite, SQL Server, and more.
 *
 * The PrismaClient instance is typically used to execute raw SQL queries,
 * perform CRUD operations, manage transactions, and more, depending on
 * the schema setup defined in the application's Prisma schema file.
 *
 * Ensure to properly manage the client instance and call the `disconnect`
 * method when database interaction is no longer needed to free up resources.
 */
const prisma = new PrismaClient();

/**
 * The `model` variable represents the Prisma schema model for `SchoolInfo`.
 * This model is used to interact with the `SchoolInfo` database table in
 * a Prisma-supported database.
 *
 * This object provides various methods for querying, inserting, updating,
 * and deleting records associated with the `SchoolInfo` entity.
 *
 * The `SchoolInfo` model typically defines properties (fields) and their
 * respective data types, constraints, and relationships to other models,
 * as specified in the Prisma schema.
 *
 * Usage of this model allows developers to perform operations and manage
 * data related to school information efficiently within the database
 * through Prisma ORM.
 */
const model = prisma.SchoolInfo;

/**
 * Asynchronous function to handle the retrieval of a list of school information entries.
 *
 * This function utilizes predefined selection criteria and schema mapping to fetch
 * the relevant data based on the provided request and context. The fetched data is
 * retrieved using the serviceShared utility method `fetchEntryList`.
 *
 * @param {Object} request - The request object containing parameters and data necessary for processing.
 * @param {Object} context - The contextual object containing details about the execution environment or session.
 * @returns {Promise<Object[]>} A promise resolving to an array of school information entries that match the defined criteria.
 */
const handleGetSchoolInfoList = async (request, context) => {
    const selectionCriteria = schoolInfoSelectionCriteria();

    return serviceShared.fetchEntryList(request, context, model, selectionCriteria, 'School info', schoolInfoSchema.getDataByQuery);
};

/**
 * Asynchronous function to handle the retrieval of school information list.
 * This variable represents a request handler responsible for processing
 * requests and returning the appropriate response asynchronously.
 *
 * The function is wrapped with `asyncHandler` to ensure proper handling
 * of asynchronous operations and errors.
 *
 * @constant {Function} GET
 */
export const GET = asyncHandler(handleGetSchoolInfoList);