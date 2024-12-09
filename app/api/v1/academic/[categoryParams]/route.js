import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";
import academicSchema from "@/app/api/v1/academic/academic.schema";

import asyncHandler from "@/util/asyncHandler";
import blogSelectionCriteria from "@/app/api/v1/blog/blog.selection.criteria";

const prisma = new PrismaClient();

const model = prisma.Academic;

// Named export for the GET request handler
export const handleGetAcademicByCategory = async (request, context) => {
    const selectionCriteria = blogSelectionCriteria();

    return serviceShared.fetchEntryByCategory(request, context, model, selectionCriteria,  'Academic', academicSchema.categorySchema);
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetAcademicByCategory);
