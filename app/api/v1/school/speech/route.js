import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";
import schoolSpeechSchema from "@/app/api/v1/school/speech/school.speech.schema";

import asyncHandler from "@/util/asyncHandler";
import schoolSpeechSelectionCriteria from "@/app/api/v1/school/speech/school.speech.selection.criteria";

/**
 * An instance of the PrismaClient class used to interact with a database
 * through Prisma ORM. It provides methods for querying and manipulating
 * data stored in the database, as well as managing database connections.
 *
 * The `prisma` variable is a singleton instance that should be used
 * throughout the application for database operations. It auto-generates
 * types and methods based on the database schema defined in the Prisma schema file.
 *
 * Ensure to properly manage the lifecycle of the PrismaClient instance by
 * calling its `connect()` and `disconnect()` methods if explicitly managing
 * connections, though it is typically handled automatically.
 */
const prisma = new PrismaClient();

/**
 * Represents the SchoolSpeech model within the Prisma ORM.
 * This model is typically used to interact with the corresponding
 * database table for storing and managing data related to school speeches.
 *
 * The model encapsulates all properties and relationships defined in the
 * Prisma schema for "SchoolSpeech".
 */
const model = prisma.SchoolSpeech;

/**
 * An asynchronous function that handles fetching a list of school speeches
 * based on predefined selection criteria. This function utilizes a shared
 * service for querying and retrieving the relevant data.
 *
 * @param {Object} request - The request object containing relevant query parameters
 * or data necessary for processing the request.
 * @param {Object} context - The context object containing additional
 * metadata or contextual information required for handling the request.
 * @returns {Promise<Object>} A promise that resolves to the fetched list
 * of school speeches.
 */
const handleGetSchoolSpeechList = async (request, context) => {
    const selectionCriteria = schoolSpeechSelectionCriteria();

    return serviceShared.fetchEntryList(request, context, model, selectionCriteria, 'School speech', schoolSpeechSchema.getDataByQuery);
};

/**
 * GET is an asynchronous middleware function that handles HTTP GET requests.
 * It utilizes the `asyncHandler` wrapper to manage asynchronous operations
 * and error handling within the `handleGetSchoolSpeechList` function.
 *
 * The main purpose of this variable is to process and respond to incoming requests
 * for retrieving a list of school speeches.
 *
 * Dependencies:
 * - asyncHandler: A higher-order function that simplifies error handling in asynchronous routes.
 * - handleGetSchoolSpeechList: A function that contains the logic for retrieving the school speech list.
 */
export const GET = asyncHandler(handleGetSchoolSpeechList);