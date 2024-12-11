import { PrismaClient } from '@prisma/client';

import newsletterSchema from "@/app/api/v1/newsletter/newsletter.schema";
import newsletterConstants from "@/app/api/v1/newsletter/newsletter.constants";
import sharedResponseTypes from "@/shared/shared.response.types";

import asyncHandler from "@/util/asyncHandler";
import validateUnsupportedContent from "@/util/validateUnsupportedContent";
import parseAndValidateFormData from "@/util/parseAndValidateFormData";
import sendEmail from "@/lib/email";
import newsletterSelectionCriteria from "@/app/api/v1/newsletter/newsletter.selection.criteria";

const prisma = new PrismaClient();

const { OK, UNPROCESSABLE_ENTITY } = sharedResponseTypes;

const model = prisma.Newsletter;

const selectionCriteria = newsletterSelectionCriteria();

// Named export for the POST request handler
const handleSubscribeToNewsletter = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(request, newsletterConstants.allowedContentTypes);
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, context, 'create', newsletterSchema);

    // Check if the email is already subscribed
    const existingSubscription = await model.findUnique({
        where: {
            email: userInput?.email,
        },
        select: selectionCriteria,
    });

    if (existingSubscription) {
        // Send "Already Subscribed" email
        const alreadySubscribedSubject = `You're already subscribed!`;
        const alreadySubscribedHtml = `
            <h3>Dear ${userInput.email},</h3>
            <p>You are already subscribed to our newsletter. Thank you for staying connected!</p>
            <p>If you have any questions, feel free to contact us.</p>
        `;

        const sendEmailToSubscriberResponse = await sendEmail(userInput.email, alreadySubscribedSubject, alreadySubscribedHtml);
        if (!sendEmailToSubscriberResponse?.messageId) {
            return UNPROCESSABLE_ENTITY(
                `Failed to send "Already Subscribed" email to ${userInput.email}.`,
                request
            );
        }

        return OK('User is already subscribed to the newsletter.', {}, request);
    }

    // Create a new "newsletter" entry in the database
    const createdNewsletter = await model.create({
        data: {
            email: userInput?.email,
        },
        select: newsletterSelectionCriteria(),
    });

    if (!createdNewsletter) {
        return UNPROCESSABLE_ENTITY('Failed to save newsletter email data.', {}, request);
    }

    // Prepare "Subscription Successful" email details
    const subscriptionSuccessSubject = `Welcome to our Newsletter!`;
    const subscriptionSuccessHtml = `
        <h3>Dear ${userInput.email},</h3>
        <p>Thank you for subscribing to our newsletter!</p>
        <p>You will now receive regular updates and exciting news from us.</p>
        <p>If you have any questions, feel free to contact us.</p>
    `;

    // Send "Subscription Successful" email
    const sendEmailToSubscriberResponse = await sendEmail(userInput.email, subscriptionSuccessSubject, subscriptionSuccessHtml);
    if (!sendEmailToSubscriberResponse?.messageId) {
        return UNPROCESSABLE_ENTITY(
            `Failed to send "Subscription Successful" email to ${userInput.email}.`,
            request
        );
    }

    // Send a success response
    return OK(
        'Newsletter subscription successful.',
        {},
        request
    );
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleSubscribeToNewsletter);
