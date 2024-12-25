import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";

import asyncHandler from "@/util/asyncHandler";
import schoolSpeechSelectionCriteria from "@/app/api/v1/school/speech/school.speech.selection.criteria";

/**
 * An instance of the PrismaClient used to interact with a database.
 *
 * PrismaClient provides an interface to query and manipulate data in a database.
 * It acts as an abstraction over raw SQL queries, allowing easier interaction
 * with the database using a type-safe and auto-completed query builder.
 *
 * This instance can be used to perform CRUD operations, execute raw queries,
 * and perform database migrations.
 *
 * Ensure to properly manage the PrismaClient lifecycle by connecting, using,
 * and disconnecting the instance when needed, especially in long-running
 * applications, to avoid connection pool exhaustion or memory leaks.
 */
const prisma = new PrismaClient();

/**
 * Represents the `SchoolSpeech` model from the Prisma Client.
 * This model is typically used to interact with the `SchoolSpeech` table in the database.
 * It allows for querying, creating, updating, and deleting records related to school speeches.
 */
const model = prisma.SchoolSpeech;

/**
 * Asynchronous handler function to retrieve a school speech by its unique identifier.
 *
 * @param {Object} request - The request object containing the parameters necessary for fetching the speech.
 * @param {Object} context - The execution context for the function, potentially containing additional information or configurations.
 * @returns {Promise<Object>} - A promise resolving to the school speech entry that matches the specified ID.
 *
 * This function uses the `schoolSpeechSelectionCriteria` utility to determine the criteria for selecting the speech,
 * and it delegates the actual fetch operation to the `serviceShared.fetchEntryById` method. The function is specific
 * to handling the fetching of entries classified as "School speech."
 */
export const handleGetSpeechById = async (request, context) => {
    const selectionCriteria = schoolSpeechSelectionCriteria();

    return serviceShared.fetchEntryById(request, context, model, selectionCriteria,  'School speech');
};

/**
 * GET is an asynchronous function that handles HTTP GET requests to retrieve a specific speech by its ID.
 * It utilizes the `handleGetSpeechById` function to process the request and is wrapped with `asyncHandler`
 * to manage errors during the asynchronous operation.
 *
 * The function expects a valid ID parameter in the request and returns the corresponding speech data
 * if found, or an error if the ID does not exist or the operation encounters an issue.
 *
 * This function is typically used within a route handler for handling specific GET endpoints.
 *
 * Dependencies:
 * - asyncHandler: A middleware function that simplifies error handling in asynchronous functions.
 * - handleGetSpeechById: The core function responsible for fetching the speech by ID.
 *
 * Usage Context:
 * Used as a route handler to process GET requests targeting a specific speech resource.
 */
export const GET = asyncHandler(handleGetSpeechById);
