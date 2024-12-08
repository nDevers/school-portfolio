import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";
import faqSchema from "@/app/api/v1/faq/faq.schema";

import asyncHandler from "@/util/asyncHandler";
import faqSelectionCriteria from "@/app/api/v1/faq/faq.selection.criteria";

const prisma = new PrismaClient();

const model = prisma.faq;

// Named export for the GET request handler
const handleGetFaqList = async (request, context) => {
    const selectionCriteria = faqSelectionCriteria();

    return serviceShared.fetchEntryList(request, context, model, selectionCriteria, 'FAQ', faqSchema.getDataByQuery);
};

// Export the routes wrapped with asyncHandler
export const GET = asyncHandler(handleGetFaqList);