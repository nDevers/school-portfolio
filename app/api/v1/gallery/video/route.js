import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";
import galleryVideoSchema from "@/app/api/v1/gallery/video/gallery.video.schema";

import asyncHandler from "@/util/asyncHandler";
import galleryVideoSelectionCriteria from "@/app/api/v1/gallery/video/gallery.video.selection.criteria";

const prisma = new PrismaClient();

const model = prisma.GalleryVideo;

const selectionCriteria = galleryVideoSelectionCriteria();

// Named export for the GET request handler
const handleGetGalleryVideoList = async (request, context) => {
    return serviceShared.fetchEntryList(request, context, model, selectionCriteria, 'Gallery video', galleryVideoSchema.getDataByQuery);
};

// Export the routes wrapped with asyncHandler
export const GET = asyncHandler(handleGetGalleryVideoList);
