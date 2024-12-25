import { PrismaClient } from '@prisma/client';

import contactSchema from "@/app/api/v1/contact/contact.schema";
import contactConstants from "@/app/api/v1/contact/contact.constants";
import sharedResponseTypes from "@/shared/shared.response.types";

import asyncHandler from "@/util/asyncHandler";
import validateUnsupportedContent from "@/util/validateUnsupportedContent";
import parseAndValidateFormData from "@/util/parseAndValidateFormData";
import sendEmail from "@/lib/email";
import configurations from "@/configs/configurations";
import galleryVideoSelectionCriteria from "@/app/api/v1/gallery/video/gallery.video.selection.criteria";

/**
 * Holds the application configurations.
 *
 * The `configuration` variable contains the settings and parameters
 * retrieved from the `configurations` asynchronous function. It typically
 * includes customizable options used to define the behavior of the
 * application or system.
 *
 * This value is resolved asynchronously and may include various
 * configuration properties depending on the implementation of
 * `configurations()`.
 *
 * Ensure this variable is awaited before accessing its properties or
 * using it within the program logic to avoid potential undefined behavior.
 */
const configuration = await configurations();

/**
 * An instance of PrismaClient, a database client used to interact with a Prisma-based database.
 * This client provides methods for querying, creating, updating, and deleting data
 * in a connected database as defined in the Prisma schema.
 *
 * It manages the database connection pool and supports various operations with
 * transactional integrity. The PrismaClient instance should be reused throughout
 * the application to optimize performance and resource management.
 *
 * Note: Ensure that the database connection is closed when the application terminates
 * to avoid connection leaks.
 */
const prisma = new PrismaClient();

const { OK, UNPROCESSABLE_ENTITY } = sharedResponseTypes;

/**
 * Represents the `Contact` model mapped from the database using Prisma ORM.
 *
 * The `Contact` model typically defines the structure and relationships of a contact entity in the database.
 * It is used to perform CRUD operations and interact with the `Contact` table.
 *
 * This model should be manipulated using Prisma client queries to ensure type safety and proper database interaction.
 */
const model = prisma.Contact;

/**
 * Represents the criteria used for selecting videos from a gallery.
 * This variable stores the result of the `galleryVideoSelectionCriteria` function call.
 * It defines the rules or conditions for filtering and retrieving specific videos
 * based on the implemented selection logic within the function.
 */
const selectionCriteria = galleryVideoSelectionCriteria();

/**
 * Handles the process of validating, storing, and dispatching contact email information.
 *
 * This asynchronous function performs the following operations:
 * 1. Validates the content type of the request against the allowed content types.
 * 2. Parses and validates the provided form data using a predefined schema.
 * 3. Creates a new contact entry in the database with the parsed data, including sender's email, subject, message,
 *    and timestamp.
 * 4. Prepares and sends an email notification to the system administrator with the contact details.
 * 5. Prepares and sends a confirmation email to the sender acknowledging receipt of their message.
 * 6. Returns appropriate success or failure responses based on the outcome of the operations.
 *
 * @param {Object} request - The HTTP request object containing the contact email information.
 * @param {Object} context - The context object providing additional information or dependencies required for the operation.
 * @returns {Promise<Object>} A response object indicating the success or failure of handling the contact email.
 */
const handleSendContactEmail = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(request, contactConstants.allowedContentTypes);
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, context, 'create', contactSchema);

    // Create a new "contact" entry in the database
    const createdContact = await model.create({
        data: {
            email: userInput?.email,
            subject: userInput?.subject,
            message: userInput?.message,
            createdAt: new Date(),
        },
        select: selectionCriteria,
    });

    if (!createdContact) {
        return OK('Failed to save contact email data.', {}, request);
    }

    // Prepare email details for the receiver (Admin)
    const receiverEmailSubject = `New message - ${userInput.subject}`;
    const receiverHtml = `
        <h3>Dear Admin,</h3>
        <p>We have received a new message from <strong>${userInput.email}</strong>:</p>
        <blockquote>
            <p>${userInput.message}</p>
        </blockquote>
        <p>Subject: ${userInput.subject}</p>
        <p>Thank you for your attention!</p>
    `;

    // Prepare email details for the sender (User)
    const senderEmailSubject = `Thank you for reaching out to us!`;
    const senderHtml = `
        <h3>Dear ${userInput.email},</h3>
        <p>We have successfully received your message:</p>
        <blockquote>
            <p>${userInput.message}</p>
        </blockquote>
        <p>Subject: ${userInput.subject}</p>
        <p>Thank you for getting in touch with us! We will respond to your query as soon as possible.</p>
    `;

    // Send email to the sender
    const sendEmailToSenderResponse = await sendEmail(userInput.email, senderEmailSubject, senderHtml);
    if (!sendEmailToSenderResponse?.messageId) {
        return UNPROCESSABLE_ENTITY(
            `Failed to send email to sender ${userInput.email}.`,
            request
        );
    }

    // Send email to the admin/receiver
    const sendEmailToReceiverResponse = await sendEmail(configuration.systemAdmin.email, receiverEmailSubject, receiverHtml);
    if (!sendEmailToReceiverResponse?.messageId) {
        return UNPROCESSABLE_ENTITY(
            `Failed to send contact email to receiver ${configuration.systemAdmin.email}.`,
            request
        );
    }

    // Send a success response
    return OK(
        'Contact email sent successfully.',
        createdContact,
        request
    );
};

/**
 * POST is an asynchronous function wrapped using the `asyncHandler` utility to handle errors.
 * It is used to process contact email submissions.
 *
 * The handler function `handleSendContactEmail` processes incoming requests and sends contact emails.
 * Designed to be used as a route handler in an Express application.
 *
 * @type {Function}
 */
export const POST = asyncHandler(handleSendContactEmail);
