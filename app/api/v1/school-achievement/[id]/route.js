import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";

import asyncHandler from "@/util/asyncHandler";
import faqSelectionCriteria from "@/app/api/v1/faq/faq.selection.criteria";

const prisma = new PrismaClient();

const model = prisma.SchoolAchievement;

// Named export for the GET request handler
export const handleGetFaqById = async (request, context) => {
    const selectionCriteria = faqSelectionCriteria();

    return serviceShared.fetchEntryById(request, context, model, selectionCriteria,  'School achievement');
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetFaqById);
