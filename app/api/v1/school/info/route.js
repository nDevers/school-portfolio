import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";
import faqSchema from "@/app/api/v1/faq/faq.schema";

import asyncHandler from "@/util/asyncHandler";
import schoolInfoSelectionCriteria from "@/app/api/v1/school/info/school.info.selection.criteria";

const prisma = new PrismaClient();

const model = prisma.SchoolInfo;

// Named export for the GET request handler
const handleGetSchoolInfoList = async (request, context) => {
    const selectionCriteria = schoolInfoSelectionCriteria();

    return serviceShared.fetchEntryList(request, context, model, selectionCriteria, 'School info', faqSchema.getDataByQuery);
};

// Export the routes wrapped with asyncHandler
export const GET = asyncHandler(handleGetSchoolInfoList);