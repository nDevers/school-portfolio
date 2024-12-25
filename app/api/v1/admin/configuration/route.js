import { ConfigurationModel } from '@/shared/prisma.model.shared';
import configurationSchema from '@/app/api/v1/configuration/configuration.schema';
import configurationConstants from '@/app/api/v1/configuration/configuration.constants';
import sharedResponseTypes from '@/shared/shared.response.types';
import localFileOperations from '@/util/localFileOperations';

import asyncHandler from '@/util/asyncHandler';
import validateUnsupportedContent from '@/util/validateUnsupportedContent';
import parseAndValidateFormData from '@/util/parseAndValidateFormData';
import validateToken from '@/util/validateToken';
import configurationSelectionCriteria from '@/app/api/v1/configuration/configuration.selection.criteria';

const { OK, CREATED, NOT_FOUND } = sharedResponseTypes;

/**
 * Represents the criteria used for selecting a specific configuration.
 *
 * The `selectionCriteria` variable is initialized by calling the
 * `configurationSelectionCriteria()` method, which defines the logic
 * for determining applicable configurations.
 *
 * This variable is typically used in processes where filtering or
 * prioritizing configurations based on predefined standards or rules
 * is required.
 */
const selectionCriteria = configurationSelectionCriteria();

/**
 * Asynchronously creates a new configuration entry or updates an existing one.
 *
 * @param {Object|null} existingEntry - The existing configuration entry, if it exists. If null, a new entry will be created.
 * @param {Object} userInput - The data provided by the user for creating or updating the configuration entry.
 * @param {Object} request - The request object, typically used for providing additional context or metadata.
 * @returns {Promise<Object>} A promise that resolves to a success response containing the status, message, and the created or updated entry.
 * @throws {Error} If creating a new configuration entry fails.
 */
const createOrUpdateConfiguration = async (
    existingEntry,
    userInput,
    request
) => {
    if (existingEntry) {
        // Update the existing entry
        const updatedEntry = await ConfigurationModel.update({
            where: { id: existingEntry.id },
            data: {
                ...userInput,
                updatedAt: new Date(),
            },
        });
        return OK('Configuration updated successfully.', updatedEntry, request);
    }

    // Create a new entry
    const newDocument = await ConfigurationModel.create({
        data: userInput,
        select: selectionCriteria,
    });

    if (!newDocument?.id) {
        throw new Error('Failed to create home carousel entry.');
    }

    return CREATED(
        'Configuration entry created successfully.',
        newDocument,
        request
    );
};

/**
 * Asynchronously handles the creation or update of a configuration entry.
 *
 * This function validates the incoming request for unsupported content types,
 * user authorization, and form data compliance with the expected schema. It
 * processes specific fields like banners and logos by uploading their files
 * to the local file system and attaching their links and IDs to the user input.
 * If an existing configuration entry exists, it updates it; otherwise, a new
 * configuration is created.
 *
 * @param {Object} request - The request object containing the necessary data for processing.
 * @returns {Promise<Object>} A response object indicating the success or failure of the operation.
 */
const handleCreateConfiguration = async (request) => {
    // Validate content type
    const contentValidation = validateUnsupportedContent(
        request,
        configurationConstants.allowedContentTypes
    );
    if (!contentValidation.isValid) return contentValidation.response;

    // Validate user authorization
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) return authResult.response;

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        {},
        'create',
        configurationSchema.createSchema
    );

    // Fetch the existing carousel entry
    const existingEntry = await ConfigurationModel.findFirst({
        select: selectionCriteria,
    });

    if (userInput[configurationConstants.bannerFieldName]) {
        const newBanner = userInput[configurationConstants.bannerFieldName][0];
        const { fileId, fileLink } = await localFileOperations.uploadFile(
            request,
            newBanner
        );

        userInput.banner = fileLink;
        userInput.bannerId = fileId;
    }

    if (userInput[configurationConstants.logoFieldName]) {
        const newLogo = userInput[configurationConstants.logoFieldName][0];
        const { fileId, fileLink } = await localFileOperations.uploadFile(
            request,
            newLogo
        );

        userInput.logo = fileLink;
        userInput.logoId = fileId;
    }

    // Create or update carousel entry
    return await createOrUpdateConfiguration(existingEntry, userInput, request);
};

/**
 * Asynchronously handles the update of a configuration entry.
 *
 * This function performs the following steps:
 * 1. Validates the content type of the incoming request against a list of allowed content types.
 * 2. Validates the user's authorization by verifying the provided token.
 * 3. Parses and validates the form data present in the request using the supplied schema.
 * 4. Fetches the existing configuration entry from the database.
 * 5. Processes and uploads banner or logo files if included in the request payload.
 * 6. Updates the configuration entry in the database with the new data from the user input.
 *    Commented-out sections handle optional updates for fields such as emails, contacts, and social links.
 * 7. Returns a response indicating success or failure.
 *
 * @async
 * @function handleUpdateConfiguration
 * @param {Object} request - The incoming HTTP request object containing data for updating the configuration.
 * @returns {Promise<Object>} A promise that resolves to the response object indicating the outcome of the operation.
 *    The response may include a success message, error message, or updated entry data.
 */
const handleUpdateConfiguration = async (request) => {
    // Validate content type
    const contentValidation = validateUnsupportedContent(
        request,
        configurationConstants.allowedContentTypes
    );
    if (!contentValidation.isValid) return contentValidation.response;

    // Validate user authorization
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) return authResult.response;

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(
        request,
        {},
        'update',
        configurationSchema.updateSchema
    );

    // Fetch the existing configuration entry
    const existingEntry = await ConfigurationModel.findFirst({
        select: selectionCriteria,
    });
    if (!existingEntry) {
        return NOT_FOUND('Configuration entry not found.', request);
    }

    if (userInput[configurationConstants.bannerFieldName]) {
        const newBanner = userInput[configurationConstants.bannerFieldName][0];
        const { fileId, fileLink } = await localFileOperations.uploadFile(
            request,
            newBanner
        );

        userInput.banner = fileLink;
        userInput.bannerId = fileId;
    }

    if (userInput[configurationConstants.logoFieldName]) {
        const newLogo = userInput[configurationConstants.logoFieldName][0];
        const { fileId, fileLink } = await localFileOperations.uploadFile(
            request,
            newLogo
        );

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
    const updatedEntry = await ConfigurationModel.update({
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

    return OK(
        'Configuration entry updated successfully.',
        updatedEntry,
        request
    );
};

/**
 * Deletes a configuration entry.
 *
 * This asynchronous function validates user authorization, retrieves an existing
 * configuration entry, deletes associated files (e.g., logo and banner), and
 * removes the entry from the database. Returns an appropriate response based on
 * the operation outcome.
 *
 * @async
 * @function deleteConfiguration
 * @param {Object} request - The request object containing user authorization and
 * operational details.
 * @returns {Promise<Object>} A response object indicating the result of the
 * deletion process.
 */
const deleteConfiguration = async (request) => {
    // Validate user authorization
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) return authResult.response;

    // Fetch the existing carousel entry
    const existingEntry = await ConfigurationModel.findFirst({
        select: {
            ...selectionCriteria,
            logoId: true,
            bannerId: true,
        },
    });
    if (!existingEntry) {
        return NOT_FOUND('Configuration entry not found.', request);
    }

    // Delete logo associated with the entry
    if (existingEntry.logoId) {
        await localFileOperations.deleteFile(existingEntry.logoId);
    }

    // Delete banner associated with the entry
    if (existingEntry.bannerId) {
        await localFileOperations.deleteFile(existingEntry.bannerId);
    }

    // Delete the entry
    await ConfigurationModel.delete({
        where: { id: existingEntry.id },
    });

    return OK('Configuration entry deleted successfully.', {}, request);
};

/**
 * POST is an asynchronous handler function used to manage HTTP POST requests.
 * It incorporates custom logic for creating configurations.
 * The function is wrapped with an async handler to properly manage asynchronous
 * operations and handle potential errors.
 *
 * This variable is assigned to a middleware, ensuring streamlined
 * error handling for the associated operation.
 *
 * The wrapped function, handleCreateConfiguration, executes specific logic tied
 * to creating configurations as part of the application's workflow.
 */
export const POST = asyncHandler(handleCreateConfiguration);

/**
 * The `PATCH` constant is an asynchronous middleware function designed
 * to handle HTTP PATCH requests for updating a specific configuration.
 * It utilizes `asyncHandler` to handle potential errors during asynchronous
 * operations and executes the `handleUpdateConfiguration` function to
 * perform the update logic.
 *
 * This middleware is suitable for use in routes where partial updates
 * to configuration resources are required.
 *
 * Dependencies:
 * - `asyncHandler`: A utility function to wrap asynchronous route handlers
 *   to simplify error handling.
 * - `handleUpdateConfiguration`: A function that contains the update logic
 *   for processing incoming PATCH requests.
 */
export const PATCH = asyncHandler(handleUpdateConfiguration);

/**
 * DELETE is an asynchronous handler function used to process deletion requests for configuration data.
 * It is wrapped with the `asyncHandler` utility to encapsulate asynchronous operations
 * and to handle errors efficiently during the delete operation.
 *
 * The function performs operations to remove specific configuration settings or entities
 * in the system based on the provided input.
 */
export const DELETE = asyncHandler(deleteConfiguration);
