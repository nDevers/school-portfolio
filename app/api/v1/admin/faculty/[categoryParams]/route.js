import { PrismaClient } from '@prisma/client';

import facultySchema from "@/app/api/v1/faculty/faculty.schema";
import facultyConstants from "@/app/api/v1/faculty/faculty.constants";
import sharedResponseTypes from "@/shared/shared.response.types";
import localFileOperations from "@/util/localFileOperations";

import asyncHandler from "@/util/asyncHandler";
import validateUnsupportedContent from "@/util/validateUnsupportedContent";
import parseAndValidateFormData from "@/util/parseAndValidateFormData";
import validateToken from "@/util/validateToken";
import facultySelectionCriteria from "@/app/api/v1/faculty/faculty.selection.criteria";

/**
 * Represents an instance of the Prisma Client used for database operations.
 *
 * The `PrismaClient` provides methods to interact with the database, enabling
 * data querying, creation, updating, and deletion. It serves as the primary
 * interface between the application and the underlying database.
 *
 * This instance should be properly managed to establish and close the database
 * connections where necessary. Use caution to avoid creating multiple instances
 * unnecessarily, as this may lead to resource exhaustion or connection conflicts.
 *
 * Typically, this object is used to control and execute all database
 * interactions in the application, such as retrieving records, running
 * transactions, or filtering query results.
 */
const prisma = new PrismaClient();

const { INTERNAL_SERVER_ERROR, CONFLICT, CREATED } = sharedResponseTypes;

/**
 * Represents the Faculty model from Prisma schema.
 *
 * The Faculty model typically refers to the teaching and administrative staff
 * associated with an educational institution. It may include various attributes
 * to identify and describe faculty members.
 *
 * Note: The structure and fields of the Faculty model are defined within the Prisma schema.
 * Ensure that the Prisma schema is properly configured to match application requirements.
 */
const model = prisma.Faculty;

/**
 * Creates a new faculty entry in the database and retrieves the created document.
 *
 * This function accepts user input data and creates a new faculty entry. It then retrieves
 * the newly created document using a specific selection criteria for the response. If the
 * faculty entry creation fails, it returns an error response. On success, it provides a response
 * indicating successful creation along with the created document data.
 *
 * @param {Object} userInput - The input data provided by the user to create the faculty entry.
 * @param {Object} request - The incoming request object associated with the operation.
 * @returns {Promise<Object>} - Returns a response indicating the result of the operation, including
 * the created faculty entry data or an error message in case of failure.
 */
const createFacultyEntry = async (userInput, request) => {
    const newDocument = await model.create({
        data: userInput,
        select: {
            id: true, // Only return the ID of the updated document
        },
    });

    const selectionCriteria = facultySelectionCriteria();

    const createdDocument = await model.findUnique({
        where: {
            id: newDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!createdDocument?.id) {
        return INTERNAL_SERVER_ERROR(`Failed to create faculty entry with title "${userInput?.title}".`, request);
    }

    // No need for an aggregation pipeline; Prisma returns the created document
    return CREATED(`Faculty entry with title "${userInput?.title}" created successfully.`, createdDocument, request);
};

/**
 * Asynchronously handles the creation of a faculty entry by category.
 *
 * This function performs the following operations:
 * - Validates the content type of the incoming request.
 * - Validates the user authorization, ensuring the user has admin privileges.
 * - Parses and validates the form data against the defined schema for faculty creation.
 * - Checks for duplicate faculty entries based on email, mobile, or portfolio.
 * - Uploads the faculty image and generates a file link.
 * - Prepares and formats the data required for the faculty entry creation.
 * - Creates a new faculty entry and generates the corresponding response.
 *
 * @param {Object} request - The HTTP request object containing the incoming data.
 * @param {Object} context - The execution context or environment for processing the request.
 * @returns {Promise<Object>} A response object indicating success or failure of the operation.
 */
const handleCreateFacultyByCategory = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(request, facultyConstants.allowedContentTypes);
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Validate if the user is authorized (admin)
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, context, 'create', () => facultySchema.createSchema());

    // Check if faculty entry with the same email, mobile, or portfolio already exists
    const existingEntry = await model.findFirst({
        where: {
            OR: [
                { email: userInput?.email },
                { mobile: userInput?.mobile },
                { portfolio: userInput?.portfolio }
            ]
        },
        select: {
            id: true,
        }
    });
    if (existingEntry) {
        return CONFLICT(`Faculty entry with email: "${userInput?.email}", mobile: ${userInput?.mobile} and portfolio "${userInput?.portfolio}" already exists.`, request);
    }

    // Upload file and generate link
    const newImage = userInput[facultyConstants.imageFieldName][0];
    const { fileId, fileLink } = await localFileOperations.uploadFile(request, newImage);

    userInput.imageId = fileId;
    userInput.image = fileLink;
    userInput.category = userInput.categoryParams;

    delete userInput.categoryParams;

    // Create the faculty entry and send the response
    return createFacultyEntry(userInput, request);
};

/**
 * POST is an asynchronous function wrapped with `asyncHandler` middleware.
 * It encapsulates the logic for creating a faculty entity grouped by category.
 * The middleware provides error handling for asynchronous operations.
 *
 * The `asyncHandler` ensures that any exception or promise rejection
 * encountered during the execution of `handleCreateFacultyByCategory`
 * is properly caught and passed to the error-handling middleware.
 *
 * @constant {function} POST
 */
export const POST = asyncHandler(handleCreateFacultyByCategory);
