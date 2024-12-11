import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";
import facultySchema from "@/app/api/v1/faculty/faculty.schema";

import asyncHandler from "@/util/asyncHandler";
import facultySelectionCriteria from "@/app/api/v1/faculty/faculty.selection.criteria";

const prisma = new PrismaClient();

const model = prisma.Faculty;

// Named export for the GET request handler
export const handleGetFacultyByCategory = async (request, context) => {
    const selectionCriteria = facultySelectionCriteria();

    return serviceShared.fetchEntryByCategory(request, context, model, selectionCriteria,  'Faculty', () => facultySchema.categorySchema());
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetFacultyByCategory);
