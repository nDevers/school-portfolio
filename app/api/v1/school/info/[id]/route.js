import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";

import asyncHandler from "@/util/asyncHandler";
import schoolInfoSelectionCriteria from "@/app/api/v1/school/info/school.info.selection.criteria";

const prisma = new PrismaClient();

const model = prisma.SchoolInfo;

// Named export for the GET request handler
export const handleGetInfoById = async (request, context) => {
    const selectionCriteria = schoolInfoSelectionCriteria();

    return serviceShared.fetchEntryById(request, context, model, selectionCriteria,  'School info');
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetInfoById);
