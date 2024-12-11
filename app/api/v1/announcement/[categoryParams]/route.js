import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";
import announcementSchema from "@/app/api/v1/announcement/announcement.schema";

import asyncHandler from "@/util/asyncHandler";
import announcementSelectionCriteria from "@/app/api/v1/announcement/announcement.selection.criteria";

const prisma = new PrismaClient();

const model = prisma.Announcement;

// Named export for the GET request handler
export const handleGetAnnouncementByCategory = async (request, context) => {
    const selectionCriteria = announcementSelectionCriteria();

    return serviceShared.fetchEntryByCategory(request, context, model, selectionCriteria,  'Announcement', () => announcementSchema.categorySchema());
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetAnnouncementByCategory);
