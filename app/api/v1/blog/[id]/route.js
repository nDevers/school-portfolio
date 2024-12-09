import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";

import asyncHandler from "@/util/asyncHandler";
import blogSelectionCriteria from "@/app/api/v1/blog/blog.selection.criteria";

const prisma = new PrismaClient();

const model = prisma.Blog;

// Named export for the GET request handler
export const handleGetBlogById = async (request, context) => {
    const selectionCriteria = blogSelectionCriteria();

    return serviceShared.fetchEntryById(request, context, model, selectionCriteria,  'Blog');
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetBlogById);
