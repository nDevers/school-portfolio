import { PrismaClient } from '@prisma/client';
import moment from "moment";

import announcementSchema from "@/app/api/v1/announcement/announcement.schema";
import announcementConstants from "@/app/api/v1/announcement/announcement.constants";
import sharedResponseTypes from "@/shared/shared.response.types";
import localFileOperations from "@/util/localFileOperations";

import asyncHandler from "@/util/asyncHandler";
import validateUnsupportedContent from "@/util/validateUnsupportedContent";
import parseAndValidateFormData from "@/util/parseAndValidateFormData";
import validateToken from "@/util/validateToken";
import announcementSelectionCriteria from "@/app/api/v1/announcement/announcement.selection.criteria";

const prisma = new PrismaClient();

const { INTERNAL_SERVER_ERROR, CONFLICT, CREATED } = sharedResponseTypes;

const model = prisma.Announcement;

// Helper function to create and respond with the announcement
const createAnnouncementEntry = async (userInput, request) => {
    const newDocument = await model.create({
        data: userInput,
        select: {
            id: true, // Only return the ID of the updated document
        },
    });

    const selectionCriteria = announcementSelectionCriteria();

    const createdDocument = await model.findUnique({
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

// Named export for the POST request handler (Create announcement)
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
    const existingEntry = await model.findUnique({
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

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleCreateAnnouncementByCategory);
