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

const configuration = await configurations();
const prisma = new PrismaClient();

const { OK, UNPROCESSABLE_ENTITY } = sharedResponseTypes;

const model = prisma.Contact;

const selectionCriteria = galleryVideoSelectionCriteria();

// Named export for the GET request handler
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

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleSendContactEmail);
