import { PrismaClient } from '@prisma/client';

import serviceShared from "@/shared/service.shared";
import newsletterSchema from "@/app/api/v1/newsletter/newsletter.schema";

import asyncHandler from "@/util/asyncHandler";
import newsletterSelectionCriteria from "@/app/api/v1/newsletter/newsletter.selection.criteria";
import validateToken from "@/util/validateToken";

/**
 * An instance of the PrismaClient, which serves as the primary method for interacting with a database in a Prisma application.
 * Provides connectivity and CRUD operations for defined database models.
 *
 * This variable should be used to perform database queries, mutations, or any interaction
 * involving the Prisma ORM within the application.
 *
 * It is recommended to manage the lifecycle of this instance carefully and ensure proper
 * connection handling to avoid potential issues with long-running applications.
 *
 * Note: PrismaClient automatically infers connected data models via the schema defined in `schema.prisma`.
 */
const prisma = new PrismaClient();

/**
 * Represents the Prisma model for the `Newsletter`.
 * This model is used to interact with the `Newsletter` table
 * within the database, providing methods to query, create, update,
 * and delete records related to newsletters.
 */
const model = prisma.Newsletter;

/**
 * Represents the criteria used to filter and select newsletters.
 *
 * The `selectionCriteria` variable holds the result of the `newsletterSelectionCriteria` function,
 * encapsulating the rules and parameters used to determine which newsletters meet specific requirements.
 */
const selectionCriteria = newsletterSelectionCriteria();

/**
 * Handles the retrieval of a newsletter subscriber by email.
 *
 * This asynchronous function validates if a user is authorized to fetch
 * newsletter subscriber details by checking their token. If the user is
 * authorized, it fetches the subscriber's entry using the provided email.
 *
 * @async
 * @function
 * @param {Object} request - The request object containing necessary data, such as the email address.
 * @param {Object} context - The application context or environment information.
 * @returns {Promise<Object>} The subscriber's data or an appropriate error response if unauthorized.
 */
const handleGetNewsletterSubscriberByEmail = async (request, context) => {
    // Validate if the user is authorized (admin)
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    return serviceShared.fetchEntryByEmail(request, context, model, selectionCriteria, 'Newsletter', newsletterSchema);
};

/**
 * Asynchronous function to handle the deletion of a newsletter subscriber by their email address.
 *
 * This function uses `serviceShared.deleteEntryByEmail` to delete a newsletter entry
 * associated with the provided email address. It requires a `request` object with
 * necessary information and a `context` for processing the deletion request.
 *
 * @param {Object} request - The request object containing details for the deletion;
 *                           generally includes the email address of the subscriber.
 * @param {Object} context - The context object providing relevant data or configuration
 *                           for processing the operation.
 * @returns {Promise<Object>} A promise resolving to the result of the deletion operation.
 */
const handleDeleteNewsletterSubscriberByEmail = async (request, context) => {
    return serviceShared.deleteEntryByEmail(request, context, model, '', 'Newsletter', newsletterSchema);
};

/**
 * Handles the HTTP GET request for retrieving a newsletter subscriber by email.
 * This variable is an asynchronous function wrapped with `asyncHandler`,
 * which is used to handle errors within asynchronous route handlers in an Express application.
 * It delegates the actual handling logic to the `handleGetNewsletterSubscriberByEmail` function.
 *
 * `asyncHandler` ensures that any errors occurring in the asynchronous
 * `handleGetNewsletterSubscriberByEmail` function are properly caught
 * and passed to the Express error-handling middleware.
 */
export const GET = asyncHandler(handleGetNewsletterSubscriberByEmail);

/**
 * DELETE is an asynchronous handler function used to process the deletion of a newsletter subscriber by their email address.
 *
 * This variable utilizes the `asyncHandler` middleware to handle asynchronous errors gracefully
 * while invoking the `handleDeleteNewsletterSubscriberByEmail` logic.
 *
 * It is designed to ensure reliable and error-managed handling during subscriber deletion requests.
 *
 * Requirements:
 * - Must be connected to the `asyncHandler` for proper functionality.
 * - The `handleDeleteNewsletterSubscriberByEmail` function should be defined to perform the deletion process.
 */
export const DELETE = asyncHandler(handleDeleteNewsletterSubscriberByEmail);
