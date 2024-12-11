import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";
import academicSchema from "@/app/api/v1/academic/academic.schema";

import asyncHandler from "@/util/asyncHandler";
import academicSelectionCriteria from "@/app/api/v1/academic/academic.selection.criteria";

const prisma = new PrismaClient();

const model = prisma.Academic;

// Named export for the GET request handler
export const handleGetAcademicByCategoryAndId = async (request, context) => {
    const selectionCriteria = academicSelectionCriteria();

    return serviceShared.fetchEntryByCategoryAndId(request, context, model, selectionCriteria,  'Academic', () => academicSchema.categoryAndIdSchema());
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetAcademicByCategoryAndId);
