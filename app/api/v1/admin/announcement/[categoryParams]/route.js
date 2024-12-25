import moment from "moment";

import { AnnouncementModel } from "@/shared/prisma.model.shared";
import announcementSchema from "@/app/api/v1/announcement/announcement.schema";
import announcementConstants from "@/app/api/v1/announcement/announcement.constants";
import sharedResponseTypes from "@/shared/shared.response.types";
import localFileOperations from "@/util/localFileOperations";

import asyncHandler from "@/util/asyncHandler";
import validateUnsupportedContent from "@/util/validateUnsupportedContent";
import parseAndValidateFormData from "@/util/parseAndValidateFormData";
import validateToken from "@/util/validateToken";
import announcementSelectionCriteria from "@/app/api/v1/announcement/announcement.selection.criteria";


const { INTERNAL_SERVER_ERROR, CONFLICT, CREATED } = sharedResponseTypes;

/**
 * Asynchronously creates a new announcement entry in the database based on the provided user input
 * and returns the newly created document or an appropriate error response.
 *
 * @async
 * @function createAnnouncementEntry
 * @param {Object} userInput - The data provided by the user to create the announcement entry.
 * @param {Object} request - The HTTP request object, used for error handling and response generation.
 * @returns {Object} A response object containing the status of the creation process,
 *                   the created document details, or an error response in case of failure.
 * @throws {Error} Throws an internal server error if the creation process fails due to database or other issues.
 */
const createAnnouncementEntry = async (userInput, request) => {
    const newDocument = await AnnouncementModel.create({
        data: userInput,
        select: {
            id: true, // Only return the ID of the updated document
        },
    });

    const selectionCriteria = announcementSelectionCriteria();

    const createdDocument = await AnnouncementModel.findUnique({
        where: {
            id: newDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!createdDocument?.id) {
        return INTERNAL_SERVER_ERROR(`Failed to create announcement entry with title "${userInput?.title}".`, request);
    }

    // No need for an aggregation pipeline; Prisma returns the created document
    return CREATED(`Announcement entry with title "${userInput?.title}" created successfully.`, createdDocument, request);
};

/**
 * Handles the creation of an announcement based on its category.
 * This method performs the following steps:
 * 1. Validates the content type of the incoming request against allowed content types.
 * 2. Verifies if the user making the request is authorized (e.g., an admin).
 * 3. Parses and validates the form data based on a predefined schema.
 * 4. Checks if an announcement with the same title and category already exists.
 * 5. Uploads files (if any) associated with the announcement and constructs a `files` array.
 * 6. Processes and formats date-related user input.
 * 7. Constructs the appropriate data structure for creating the announcement entry.
 * 8. Creates the announcement entry in the database and returns the response.
 *
 * @param {Object} request The request object containing the incoming data and payload.
 * @param {Object} context An optional context object providing additional metadata or dependencies.
 * @returns {Promise<Object>} The response object indicating success or containing error details.
 */
const handleCreateAnnouncementByCategory = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(request, announcementConstants.allowedContentTypes);
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Validate if the user is authorized (admin)
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, context, 'create', () => announcementSchema.createSchema());

    // Check if announcement entry with the same email, mobile, or portfolio already exists
    const existingEntry = await AnnouncementModel.findUnique({
        where: {
            title: userInput?.title,
            category: userInput?.categoryParams,
        },
        select: {
            id: true,
        }
    });
    if (existingEntry) {
        return CONFLICT(`Faculty entry with TITLE "${userInput?.title}" and CATEGORY ${userInput?.categoryParams} not found.`, request);
    }

    // Upload files and construct the `files` array for documents
    const files = await Promise.all(
        (userInput[announcementConstants.filesFieldName] || []).map(async (fileEntry) => {
            // Call your file upload operation
            const { fileId, fileLink } = await localFileOperations.uploadFile(request, fileEntry);
            return {
                fileId: fileId,
                file: fileLink
            };
        })
    );

    userInput.files = files;
    userInput.date = moment(userInput.date, ['DD/MM/YYYY', moment.ISO_8601], true).toDate();
    userInput.advertiseMailTime = moment(userInput.advertiseMailTime, ['DD/MM/YYYY', moment.ISO_8601], true).toDate();

    userInput.category = userInput.categoryParams;
    userInput.isHeadline = userInput.isHeadline === true;
    userInput.isAdvertise = userInput.isAdvertise === true;

    delete userInput.categoryParams;

    // Create the announcement entry and send the response
    return createAnnouncementEntry(userInput, request);
};

/**
 * An asynchronous middleware function used to handle creating announcements by category.
 * This function wraps around `handleCreateAnnouncementByCategory` and utilizes the `asyncHandler`
 * utility to handle asynchronous errors gracefully, avoiding the need for repetitive try-catch blocks.
 *
 * @constant {Function} POST
 * @async
 * @function
 * @param {Object} req - The request object containing client request details, such as body and parameters.
 * @param {Object} res - The response object used to return data to the client.
 * @param {Function} next - The next middleware function in the Express.js route lifecycle.
 */
export const POST = asyncHandler(handleCreateAnnouncementByCategory);
