'use strict';

import moment from 'moment';

import { BlogModel } from '@/shared/prisma.model.shared';
import blogSchema from '@/app/api/v1/blog/blog.schema';
import blogConstants from '@/app/api/v1/blog/blog.constants';
import sharedResponseTypes from '@/shared/shared.response.types';
import localFileOperations from '@/util/localFileOperations';

import asyncHandler from '@/util/asyncHandler';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import validateToken from '@/util/validateToken';
import blogSelectionCriteria from '@/app/api/v1/blog/blog.selection.criteria';

const { INTERNAL_SERVER_ERROR, CONFLICT, CREATED, NOT_FOUND } =
    sharedResponseTypes;

/**
 * Asynchronously creates an "About Us" blog entry in the database and retrieves the created document with specific selection criteria.
 *
 * This function performs the following steps:
 * 1. Creates a blog document in the database using the provided user input and only fetches its ID.
 * 2. Retrieves the newly created blog document based on its ID, applying selection criteria defined by the `blogSelectionCriteria` function.
 * 3. Returns the created document upon successful operation, or an error response if creation fails.
 *
 * @param {Object} userInput - Object containing the input data to create a new blog entry.
 * @param {Object} request - The request object used for context in the response or logging.
 * @returns {Promise<Object>} A Promise that resolves to the created blog document or an error response.
 * @throws Will throw an error if blog creation fails or the document fetch returns null.
 */
const createAboutUsEntry = async (userInput, request) => {
    const newDocument = await BlogModel.create({
        data: userInput,
        select: {
            id: true, // Only return the ID of the updated document
        },
    });

    const selectionCriteria = blogSelectionCriteria();

    const createdDocument = await BlogModel.findUnique({
        where: {
            id: newDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!createdDocument?.id) {
        return INTERNAL_SERVER_ERROR(
            `Failed to create blog entry with title "${userInput?.title}".`,
            request
        );
    }

    // No need for an aggregation pipeline; Prisma returns the created document
    return CREATED(
        `Blog entry with title "${userInput?.title}" created successfully.`,
        createdDocument,
        request
    );
};

/**
 * Handles the creation of an "About Us" entry in the application.
 *
 * This asynchronous function performs the following tasks:
 * 1. Validates the content type of the incoming request against allowed content types.
 * 2. Validates if the user is authorized to perform the operation, typically requiring admin privileges.
 * 3. Parses and validates form data based on predefined schemas.
 * 4. Ensures no existing "About Us" entry with the same title already exists.
 * 5. Uploads a banner file and generates a corresponding link.
 * 6. Uploads additional files and images, storing their metadata for future use.
 * 7. Converts the provided date input into a valid `Date` object.
 * 8. Finally, constructs and creates the "About Us" entry in the database or application layer.
 *
 * @param {Object} request - The incoming request object containing user input and metadata.
 * @param {Object} context - Contextual information related to the current operation.
 * @returns {Object} A response object detailing the result of the operation, including success or failure.
 */
const handleCreateAboutUs = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(
        request,
        blogConstants.allowedContentTypes
    );
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Validate if the user is authorized (admin)
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        context,
        'create',
        blogSchema.createSchema
    );

    // Check if FAQ entry with the same title already exists
    const existingQuestion = await BlogModel.findUnique({
        where: {
            title: userInput?.title,
        },
        select: {
            id: true,
        },
    });
    if (existingQuestion) {
        return CONFLICT(
            `Blog entry with title "${userInput?.title}" already exists.`,
            request
        );
    }

    // Upload file and generate link
    const newFile = userInput[blogConstants.bannerFieldName][0];
    const { fileId, fileLink } = await localFileOperations.uploadFile(
        request,
        newFile
    );

    // Upload files and construct the `files` array for documents
    const files = await Promise.all(
        (userInput[blogConstants.fileFieldName] || []).map(
            async (fileEntry) => {
                // Call your file upload operation
                const { fileId, fileLink } =
                    await localFileOperations.uploadFile(request, fileEntry);
                return {
                    fileId,
                    file: fileLink,
                };
            }
        )
    );

    // Upload files and construct the `files` array for documents
    const images = await Promise.all(
        (userInput[blogConstants.imageFieldName] || []).map(
            async (imageEntry) => {
                // Call your file upload operation
                const { fileId, fileLink } =
                    await localFileOperations.uploadFile(request, imageEntry);
                return {
                    imageId: fileId,
                    image: fileLink,
                };
            }
        )
    );

    userInput.bannerId = fileId;
    userInput.banner = fileLink;
    userInput.files = files;
    userInput.images = images;

    // Convert the date using Moment.js
    userInput.date = moment(
        userInput.date,
        ['DD/MM/YYYY', moment.ISO_8601],
        true
    ).toDate();

    console.log(userInput);

    // Create the FAQ entry and send the response
    return createAboutUsEntry(userInput, request);
};

/**
 * POST is an asynchronous function that wraps the `handleCreateAboutUs` logic
 * using the `asyncHandler`. It serves as a handler for HTTP POST requests.
 *
 * The primary purpose of this function is to handle the creation of
 * "About Us" information in the application. It uses the `asyncHandler`
 * middleware to properly manage and handle potential errors in an
 * asynchronous operation.
 *
 * The function is generally utilized in a web server or API setup where
 * POST requests target specific resources.
 */
export const POST = asyncHandler(handleCreateAboutUs);
