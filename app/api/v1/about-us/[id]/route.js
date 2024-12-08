import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";

import asyncHandler from "@/util/asyncHandler";
import aboutUsSelectionCriteria from "@/app/api/v1/about-us/about.us.selection.criteria";

const prisma = new PrismaClient();

const model = prisma.AboutUs;

// Named export for the GET request handler
export const handleGetCareerById = async (request, context) => {
    const selectionCriteria = aboutUsSelectionCriteria();

    return serviceShared.fetchEntryById(request, context, model, selectionCriteria,  'About us');
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetCareerById);
