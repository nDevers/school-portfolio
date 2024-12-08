import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";
import aboutUsSchema from "@/app/api/v1/about-us/about.us.schema";

import asyncHandler from "@/util/asyncHandler";
import aboutUsSelectionCriteria from "@/app/api/v1/about-us/about.us.selection.criteria";

const prisma = new PrismaClient();

const model = prisma.AboutUs;

// Named export for the GET request handler
const handleGetCareerList = async (request, context) => {
    const selectionCriteria = aboutUsSelectionCriteria();

    return serviceShared.fetchEntryList(request, context, model, selectionCriteria, 'About us', aboutUsSchema.getDataByQuery);
};

// Export the routes wrapped with asyncHandler
export const GET = asyncHandler(handleGetCareerList);