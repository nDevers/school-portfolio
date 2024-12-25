import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";

import asyncHandler from "@/util/asyncHandler";
import faqSelectionCriteria from "@/app/api/v1/faq/faq.selection.criteria";

/**
 * The `prisma` variable is an instance of the PrismaClient, which is used to interact with a connected database.
 * PrismaClient provides methods for querying, mutating, and managing data in the database in a type-safe manner.
 *
 * This instance is typically used to execute database operations such as creating, reading, updating, and deleting records.
 * It also supports raw SQL queries and includes middleware capabilities for extending or intercepting behavior.
 *
 * Ensure that the `prisma` instance is properly closed using `prisma.$disconnect()` when it is no longer needed,
 * especially in long-running applications, to prevent resource leaks.
 */
const prisma = new PrismaClient();

/**
 * Represents the FAQ (Frequently Asked Questions) model associated with the Prisma client.
 * This model is typically used to interact with the database table or entity that stores FAQ information.
 */
const model = prisma.faq;

/**
 * Handles the retrieval of a specific FAQ entry by its ID.
 *
 * This asynchronous function processes a request to fetch a FAQ entry based on the provided ID.
 * It utilizes the shared service method `fetchEntryById` to locate and return the desired entry.
 * The function relies on a pre-defined selection criteria specific to FAQs.
 *
 * @param {Object} request - The incoming request object containing details for the operation, such as the FAQ ID.
 * @param {Object} context - The execution context containing relevant data or configurations for the operation.
 * @returns {Promise<Object>} A promise resolving to the FAQ entry matching the provided ID, or an appropriate response if not found.
 */
export const handleGetFaqById = async (request, context) => {
    const selectionCriteria = faqSelectionCriteria();

    return serviceShared.fetchEntryById(request, context, model, selectionCriteria,  'FAQ');
};

/**
 * GET is an asynchronous middleware function that retrieves FAQ data by its unique identifier.
 * It utilizes the `asyncHandler` utility to wrap the `handleGetFaqById` function,
 * allowing for automatic error handling.
 *
 * The wrapped function `handleGetFaqById` is expected to handle the core logic
 * for fetching a specific FAQ entry from a data source using the provided parameters.
 *
 * @constant {Function}
 */
export const GET = asyncHandler(handleGetFaqById);
