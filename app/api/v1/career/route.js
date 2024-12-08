import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";
import careerSchema from "@/app/api/v1/career/career.schema";

import asyncHandler from "@/util/asyncHandler";
import careerSelectionCriteria from "@/app/api/v1/career/career.selection.criteria";

const prisma = new PrismaClient();

const model = prisma.Career;

// Named export for the GET request handler
const handleGetCareerList = async (request, context) => {
    const selectionCriteria = careerSelectionCriteria();

    return serviceShared.fetchEntryList(request, context, model, selectionCriteria, 'Career', careerSchema.getDataByQuery);
};

// Export the routes wrapped with asyncHandler
export const GET = asyncHandler(handleGetCareerList);