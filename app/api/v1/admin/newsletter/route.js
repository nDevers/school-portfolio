import { PrismaClient } from '@prisma/client';

import newsletterConstants from "@/app/api/v1/newsletter/newsletter.constants";
import serviceShared from "@/shared/service.shared";

import asyncHandler from "@/util/asyncHandler";
import validateUnsupportedContent from "@/util/validateUnsupportedContent";
import newsletterSelectionCriteria from "@/app/api/v1/newsletter/newsletter.selection.criteria";
import validateToken from "@/util/validateToken";

/**
 * An instance of PrismaClient, a database client to interact with a Prisma-managed database.
 * PrismaClient facilitates querying, creating, updating, and deleting records in the database
 * while offering type-safe and efficient database transactions.
 *
 * Initialized as a singleton object to manage database connections and perform
 * operations defined in the Prisma schema.
 *
 * Note: Ensure proper connection and disconnection lifecycle management
 * when using this instance, especially in server-side applications.
 *
 * Avoid creating multiple instances of PrismaClient in a single application runtime.
 */
const prisma = new PrismaClient();

/**
 * Represents the Newsletter model from Prisma schema.
 *
 * This model is mapped to the `Newsletter` table in the database, and it is typically used
 * to handle newsletter-related data such as content, subscribers, and status. It provides
 * an interface to perform operations like create, read, update, and delete for newsletter records.
 *
 * Ensure proper use of the model to manage newsletter-specific functionality within the application.
 *
 * Note: The exact structure of the model is defined in your Prisma schema.
 */
const model = prisma.Newsletter;

/**
 * Represents the criteria used to filter and select newsletters.
 * This variable stores the result of the `newsletterSelectionCriteria` function,
 * which defines and returns the rules or parameters for newsletter selection.
 *
 * The selection criteria may include, but are not limited to, filters, sorting rules,
 * category preferences, or user-specific conditions that determine
 * which newsletters are included in a particular operation.
 */
const selectionCriteria = newsletterSelectionCriteria();

/**
 * Asynchronous function to handle the retrieval of newsletter subscribers.
 *
 * This function performs validations on the content type and access token
 * to ensure that the request is coming from an authenticated and authorized
 * user. If the validations pass, it fetches a list of newsletter subscribers
 * based on the provided criteria.
 *
 * @param {Object} request - The incoming HTTP request object containing
 * details such as headers, query parameters, and body.
 * @param {Object} context - Additional context for the request, which might
 * include metadata or dependency injections.
 * @returns {Promise<Object>} A promise resolving to the response object,
 * which can either be a validation error response or the list of newsletter
 * subscribers.
 */
const handleGetNewsletterSubscriber = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(request, newsletterConstants.allowedContentTypes);
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Validate if the user is authorized (admin)
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    return serviceShared.fetchEntryList(request, context, model, selectionCriteria, 'Newsletter', null);
};

/**
 * GET variable represents an asynchronous handler function for processing
 * HTTP GET requests in the context of retrieving newsletter subscribers.
 * It utilizes an async error-handling middleware to ensure proper error
 * management during the request lifecycle.
 *
 * The function encapsulated in this handler may include logic to fetch
 * subscriber details, perform necessary data validation, or interact with
 * a database or any external services responsible for managing subscribers.
 *
 * This variable is intended to be used in a routing mechanism for handling
 * GET requests targeting a specific API endpoint for newsletter subscribers.
 */
export const GET = asyncHandler(handleGetNewsletterSubscriber);
