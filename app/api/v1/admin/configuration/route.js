import { PrismaClient } from '@prisma/client';

import configurationSchema from "@/app/api/v1/configuration/configuration.schema";
import configurationConstants from "@/app/api/v1/configuration/configuration.constants";
import sharedResponseTypes from "@/shared/shared.response.types";
import localFileOperations from "@/util/localFileOperations";

import asyncHandler from "@/util/asyncHandler";
import validateUnsupportedContent from "@/util/validateUnsupportedContent";
import parseAndValidateFormData from "@/util/parseAndValidateFormData";
import validateToken from "@/util/validateToken";
import configurationSelectionCriteria from "@/app/api/v1/configuration/configuration.selection.criteria";

const prisma = new PrismaClient();

const { OK, CREATED, BAD_REQUEST, NOT_FOUND } = sharedResponseTypes;

const model = prisma.Configuration;

const selectionCriteria = configurationSelectionCriteria();

// Helper function to create and respond with the FAQ
const createOrUpdateConfiguration = async (existingEntry, userInput, request) => {
    if (existingEntry) {
        // Update the existing entry
        const updatedEntry = await model.update({
            where: { id: existingEntry.id },
            data: {
                ...userInput,
                updatedAt: new Date(),
            },
        });
        return OK('Configuration updated successfully.', updatedEntry, request);
    }

    // Create a new entry
    const newDocument = await model.create({
        data: userInput,
        select: selectionCriteria,
    });

    if (!newDocument?.id) {
        throw new Error('Failed to create home carousel entry.');
    }

    return CREATED('Configuration entry created successfully.', newDocument, request);
};

// Named export for the POST request handler (Create or Update Home Carousel)
const handleCreateConfiguration = async (request) => {
    // Validate content type
    const contentValidation = validateUnsupportedContent(request, configurationConstants.allowedContentTypes);
    if (!contentValidation.isValid) return contentValidation.response;

    // Validate user authorization
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) return authResult.response;

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, {}, 'create', configurationSchema.createSchema);

    // Fetch the existing carousel entry
    const existingEntry = await model.findFirst({
        select: selectionCriteria,
    });

    if (userInput[configurationConstants.bannerFieldName]) {
        const newBanner = userInput[configurationConstants.bannerFieldName][0];
        const { fileId, fileLink } = await localFileOperations.uploadFile(request, newBanner);

        userInput.banner = fileLink;
        userInput.bannerId = fileId;
    }

    if (userInput[configurationConstants.logoFieldName]) {
        const newLogo = userInput[configurationConstants.logoFieldName][0];
        const { fileId, fileLink } = await localFileOperations.uploadFile(request, newLogo);

        userInput.logo = fileLink;
        userInput.logoId = fileId;
    }

    // Create or update carousel entry
    return await createOrUpdateConfiguration(existingEntry, userInput, request);
};

// Named export for the PATCH request handler
const handleUpdateConfiguration = async (request) => {
    // Validate content type
    const contentValidation = validateUnsupportedContent(request, configurationConstants.allowedContentTypes);
    if (!contentValidation.isValid) return contentValidation.response;

    // Validate user authorization
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) return authResult.response;

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, {}, 'update', configurationSchema.updateSchema);

    // Fetch the existing configuration entry
    const existingEntry = await model.findFirst({
        select: selectionCriteria,
    });
    if (!existingEntry) {
        return NOT_FOUND("Configuration entry not found.", request);
    }

    if (userInput[configurationConstants.bannerFieldName]) {
        const newBanner = userInput[configurationConstants.bannerFieldName][0];
        const { fileId, fileLink } = await localFileOperations.uploadFile(request, newBanner);

        userInput.banner = fileLink;
        userInput.bannerId = fileId;
    }

    if (userInput[configurationConstants.logoFieldName]) {
        const newLogo = userInput[configurationConstants.logoFieldName][0];
        const { fileId, fileLink } = await localFileOperations.uploadFile(request, newLogo);

        userInput.logo = fileLink;
        userInput.logoId = fileId;
    }

    // // Handle emails
    // let updatedEmails = existingEntry.emails || [];
    // if (userInput?.deleteEmails) {
    //     updatedEmails = updatedEmails.filter(email => !userInput.deleteEmails.includes(email));
    //
    //     delete userInput.deleteEmails;
    // }
    // if (userInput?.emails) {
    //     updatedEmails = [...updatedEmails, ...userInput.emails];
    // }
    //
    // // Handle contacts
    // let updatedContacts = existingEntry.contacts || [];
    // if (userInput?.deleteContacts) {
    //     updatedContacts = updatedContacts.filter(contact => !userInput.deleteContacts.includes(contact));
    //
    //     delete userInput.deleteContacts;
    // }
    // if (userInput?.contacts) {
    //     updatedContacts = [...updatedContacts, ...userInput.contacts];
    // }
    //
    // // Handle social links
    // let updatedSocialLinks = existingEntry.socialLinks || [];
    // if (userInput?.deleteSocialLinks) {
    //     updatedSocialLinks = updatedSocialLinks.filter(link => !userInput.deleteSocialLinks.includes(link));
    //
    //     delete userInput.deleteSocialLinks;
    // }
    // if (userInput?.socialLinks) {
    //     updatedSocialLinks = [...updatedSocialLinks, ...userInput.socialLinks];
    // }

    // Perform the update
    const updatedEntry = await model.update({
        where: { id: existingEntry.id },
        data: {
            ...userInput,
            // emails: updatedEmails,
            // contacts: updatedContacts,
            // socialLinks: updatedSocialLinks,
            updatedAt: new Date(),
        },
        select: selectionCriteria,
    });

    return OK("Configuration entry updated successfully.", updatedEntry, request);
};

// Named export for the DELETE request handler
const deleteConfiguration = async (request) => {
    // Validate user authorization
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) return authResult.response;

    // Fetch the existing carousel entry
    const existingEntry = await model.findFirst({
        select: {
            ...selectionCriteria,
            logoId: true,
            bannerId: true,
        },
    });
    if (!existingEntry) {
        return NOT_FOUND("Configuration entry not found.", request);
    }

    // Delete logo associated with the entry
    if (existingEntry.logoId) {
        localFileOperations.deleteFile(existingEntry.logoId)
    }

    // Delete banner associated with the entry
    if (existingEntry.bannerId) {
        localFileOperations.deleteFile(existingEntry.bannerId)
    }

    // Delete the entry
    await model.delete({
        where: { id: existingEntry.id },
    });

    return OK("Configuration entry deleted successfully.", {}, request);
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleCreateConfiguration);

// Export the route wrapped with asyncHandler
export const PATCH = asyncHandler(handleUpdateConfiguration);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(deleteConfiguration);
