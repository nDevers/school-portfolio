import { PrismaClient } from '@prisma/client';
import moment from 'moment';

import blogSchema from "@/app/api/v1/blog/blog.schema";
import blogConstants from "@/app/api/v1/blog/blog.constants";
import sharedResponseTypes from "@/shared/shared.response.types";
import localFileOperations from "@/util/localFileOperations";

import asyncHandler from "@/util/asyncHandler";
import validateUnsupportedContent from "@/util/validateUnsupportedContent";
import parseAndValidateFormData from "@/util/parseAndValidateFormData";
import validateToken from "@/util/validateToken";
import blogSelectionCriteria from "@/app/api/v1/blog/blog.selection.criteria";

const prisma = new PrismaClient();

const { INTERNAL_SERVER_ERROR, CONFLICT, CREATED, NOT_FOUND } = sharedResponseTypes;

const model = prisma.Blog;

// Helper function to create and respond with the FAQ
const createAboutUsEntry = async (userInput, request) => {
    const newDocument = await model.create({
        data: userInput,
        select: {
            id: true, // Only return the ID of the updated document
        },
    });

    const selectionCriteria = blogSelectionCriteria();

    const createdDocument = await model.findUnique({
        where: {
            id: newDocument?.id,
        },
        select: selectionCriteria,
    });

    if (!createdDocument?.id) {
        return INTERNAL_SERVER_ERROR(`Failed to create blog entry with title "${userInput?.title}".`, request);
    }

    // No need for an aggregation pipeline; Prisma returns the created document
    return CREATED(`Blog entry with title "${userInput?.title}" created successfully.`, createdDocument, request);
};

// Named export for the POST request handler (Create FAQ)
const handleCreateAboutUs = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(request, blogConstants.allowedContentTypes);
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Validate if the user is authorized (admin)
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, context, 'create', blogSchema.createSchema);

    // Check if FAQ entry with the same title already exists
    const existingQuestion = await model.findUnique({
        where: {
            title: userInput?.title,
        },
        select: {
            id: true,
        }
    });
    if (existingQuestion) {
        return CONFLICT(`Blog entry with title "${userInput?.title}" already exists.`, request);
    }

    // Upload file and generate link
    const newFile = userInput[blogConstants.bannerFieldName][0];
    const { fileId, fileLink } = await localFileOperations.uploadFile(request, newFile);

    // Upload files and construct the `files` array for documents
    const files = await Promise.all(
        (userInput[blogConstants.fileFieldName] || []).map(async (fileEntry) => {
            // Call your file upload operation
            const { fileId, fileLink } = await localFileOperations.uploadFile(request, fileEntry);
            return {
                fileId: fileId,
                file: fileLink
            };
        })
    );

    // Upload files and construct the `files` array for documents
    const images = await Promise.all(
        (userInput[blogConstants.imageFieldName] || []).map(async (imageEntry) => {
            // Call your file upload operation
            const { fileId, fileLink } = await localFileOperations.uploadFile(request, imageEntry);
            return {
                imageId: fileId,
                image: fileLink
            };
        })
    );

    userInput.bannerId = fileId;
    userInput.banner = fileLink;
    userInput.files = files;
    userInput.images = images;

    // Convert the date using Moment.js
    userInput.date = moment(userInput.date, ['DD/MM/YYYY', moment.ISO_8601], true).toDate();

    console.log(userInput);

    // Create the FAQ entry and send the response
    return createAboutUsEntry(userInput, request);
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleCreateAboutUs);
