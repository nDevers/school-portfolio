import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";
import facultySchema from "@/app/api/v1/faculty/faculty.schema";

import asyncHandler from "@/util/asyncHandler";
import facultySelectionCriteria from "@/app/api/v1/faculty/faculty.selection.criteria";

const prisma = new PrismaClient();

const model = prisma.Faculty;

// Named export for the GET request handler
export const handleGetFacultyByCategoryAndId = async (request, context) => {
    const selectionCriteria = facultySelectionCriteria();

    return serviceShared.fetchEntryByCategoryAndId(request, context, model, selectionCriteria,  'Faculty', () => facultySchema.categoryAndIdSchema());
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetFacultyByCategoryAndId);
