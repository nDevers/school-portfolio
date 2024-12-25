import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";
import faqSchema from "@/app/api/v1/faq/faq.schema";

import asyncHandler from "@/util/asyncHandler";
import faqSelectionCriteria from "@/app/api/v1/faq/faq.selection.criteria";

/**
 * The `prisma` variable is an instance of the `PrismaClient` class.
 * It is used to interact with a connected database using Prisma's ORM capabilities.
 *
 * This client provides generated methods for performing CRUD operations and
 * querying the database efficiently. The methods are dynamically created based on
 * the Prisma schema definition.
 *
 * Ensure that the Prisma schema is properly configured and the database connection
 * is established before using this client.
 *
 * Note: It is important to manage the lifecycle of the PrismaClient instance properly.
 * Typically, you should avoid instantiating multiple clients in an application to
 * prevent issues with database connections.
 */
const prisma = new PrismaClient();

/**
 * The `model` variable refers to the Prisma model for interacting with the `faq` table or collection in the database.
 * This model provides methods for querying, creating, updating, and deleting FAQ (Frequently Asked Questions) records.
 *
 * Typical use cases for this model include:
 * - Fetching FAQ records from the database.
 * - Adding new FAQs to the database.
 * - Updating existing FAQ entries.
 * - Deleting FAQs from the database.
 *
 * The `faq` model is managed by Prisma and reflects the structure defined in the Prisma schema.
 * It enables communication between the application and the FAQ-related data in the underlying database.
 */
const model = prisma.faq;

/**
 * Asynchronous function that handles the retrieval of a list of FAQs based on specified criteria.
 *
 * @function
 * @async
 * @param {Object} request - The request object containing necessary information for processing the FAQ list retrieval.
 * @param {Object} context - The context object providing additional information for the operation.
 * @returns {Promise<Object>} - A promise resolving to the list of FAQs that match the specified selection criteria.
 */
const handleGetFaqList = async (request, context) => {
    const selectionCriteria = faqSelectionCriteria();

    return serviceShared.fetchEntryList(request, context, model, selectionCriteria, 'FAQ', faqSchema.getDataByQuery);
};

/**
 * GET is a variable assigned to an asynchronous handler function wrapped by `asyncHandler`.
 * This handler function is typically used to process HTTP GET requests.
 *
 * The purpose of this variable is to handle the retrieval operation for a list of FAQs.
 * It is designed to manage asynchronous operations, such as fetching data from a database,
 * and handle errors effectively during the execution of the request.
 */
export const GET = asyncHandler(handleGetFaqList);