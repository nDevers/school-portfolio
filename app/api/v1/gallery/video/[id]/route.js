import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";

import asyncHandler from "@/util/asyncHandler";
import galleryVideoSelectionCriteria from "@/app/api/v1/gallery/video/gallery.video.selection.criteria";

const prisma = new PrismaClient();

const model = prisma.GalleryVideo;

const selectionCriteria = galleryVideoSelectionCriteria();

// Named export for the GET request handler
export const handleGetGalleryVideoById = async (request, context) => {
    return serviceShared.fetchEntryById(request, context, model, selectionCriteria,  'Gallery video');
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetGalleryVideoById);
