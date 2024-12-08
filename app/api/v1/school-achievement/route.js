import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";
import faqSchema from "@/app/api/v1/faq/faq.schema";

import asyncHandler from "@/util/asyncHandler";
import schoolAchievementSelectionCriteria from "@/app/api/v1/school-achievement/school.achievement.selection.criteria";

const prisma = new PrismaClient();

const model = prisma.SchoolAchievement;

// Named export for the GET request handler
const handleGetSchoolAchievementList = async (request, context) => {
    const selectionCriteria = schoolAchievementSelectionCriteria();

    return serviceShared.fetchEntryList(request, context, model, selectionCriteria, 'School achievement', faqSchema.getDataByQuery);
};

// Export the routes wrapped with asyncHandler
export const GET = asyncHandler(handleGetSchoolAchievementList);