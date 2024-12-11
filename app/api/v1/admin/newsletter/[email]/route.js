import { PrismaClient } from '@prisma/client';

import serviceShared from "@/shared/service.shared";
import newsletterSchema from "@/app/api/v1/newsletter/newsletter.schema";

import asyncHandler from "@/util/asyncHandler";
import newsletterSelectionCriteria from "@/app/api/v1/newsletter/newsletter.selection.criteria";
import validateToken from "@/util/validateToken";

const prisma = new PrismaClient();

const model = prisma.Newsletter;

const selectionCriteria = newsletterSelectionCriteria();

// Named export for the POST request handler
const handleGetNewsletterSubscriberByEmail = async (request, context) => {
    // Validate if the user is authorized (admin)
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    return serviceShared.fetchEntryByEmail(request, context, model, selectionCriteria, 'Newsletter', newsletterSchema);
};

// Named export for the POST request handler
const handleDeleteNewsletterSubscriberByEmail = async (request, context) => {
    return serviceShared.deleteEntryByEmail(request, context, model, '', 'Newsletter', newsletterSchema);
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetNewsletterSubscriberByEmail);

// Export the route wrapped with asyncHandler
export const DELETE = asyncHandler(handleDeleteNewsletterSubscriberByEmail);
