import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";

import asyncHandler from "@/util/asyncHandler";
import careerSelectionCriteria from "@/app/api/v1/career/career.selection.criteria";

const prisma = new PrismaClient();

const model = prisma.Career;

// Named export for the GET request handler
export const handleGetCareerById = async (request, context) => {
    const selectionCriteria = careerSelectionCriteria();

    return serviceShared.fetchEntryById(request, context, model, selectionCriteria,  'Career');
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetCareerById);
