import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";
import blogSchema from "@/app/api/v1/blog/blog.schema";

import asyncHandler from "@/util/asyncHandler";
import blogSelectionCriteria from "@/app/api/v1/blog/blog.selection.criteria";

const prisma = new PrismaClient();

const model = prisma.Blog;

// Named export for the GET request handler
const handleGetBlogList = async (request, context) => {
    const selectionCriteria = blogSelectionCriteria();

    return serviceShared.fetchEntryList(request, context, model, selectionCriteria, 'Blog', blogSchema.getDataByQuery);
};

// Export the routes wrapped with asyncHandler
export const GET = asyncHandler(handleGetBlogList);
