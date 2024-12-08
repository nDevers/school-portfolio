import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";

import asyncHandler from "@/util/asyncHandler";
import schoolAchievementSelectionCriteria from "@/app/api/v1/school/achievement/school.achievement.selection.criteria";

const prisma = new PrismaClient();

const model = prisma.SchoolAchievement;

// Named export for the GET request handler
export const handleGetAchievementById = async (request, context) => {
    const selectionCriteria = schoolAchievementSelectionCriteria();

    return serviceShared.fetchEntryById(request, context, model, selectionCriteria,  'School achievement');
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetAchievementById);
