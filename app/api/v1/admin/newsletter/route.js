import { PrismaClient } from '@prisma/client';

import newsletterConstants from "@/app/api/v1/newsletter/newsletter.constants";
import serviceShared from "@/shared/service.shared";

import asyncHandler from "@/util/asyncHandler";
import validateUnsupportedContent from "@/util/validateUnsupportedContent";
import newsletterSelectionCriteria from "@/app/api/v1/newsletter/newsletter.selection.criteria";
import validateToken from "@/util/validateToken";

const prisma = new PrismaClient();

const model = prisma.Newsletter;

const selectionCriteria = newsletterSelectionCriteria();

// Named export for the POST request handler
const handleGetNewsletterSubscriber = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(request, newsletterConstants.allowedContentTypes);
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Validate if the user is authorized (admin)
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    return serviceShared.fetchEntryList(request, context, model, selectionCriteria, 'Newsletter', null);
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetNewsletterSubscriber);
