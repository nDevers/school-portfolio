import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";
import galleryPhotoSchema from "@/app/api/v1/gallery/photo/gallery.photo.schema";

import asyncHandler from "@/util/asyncHandler";
import galleryPhotoSelectionCriteria from "@/app/api/v1/gallery/photo/gallery.photo.selection.criteria";

const prisma = new PrismaClient();

const model = prisma.GalleryPhoto;

// Named export for the GET request handler
const handleGetGalleryPhotoList = async (request, context) => {
    const selectionCriteria = galleryPhotoSelectionCriteria();

    return serviceShared.fetchEntryList(request, context, model, selectionCriteria, 'Gallery photo', galleryPhotoSchema.getDataByQuery);
};

// Export the routes wrapped with asyncHandler
export const GET = asyncHandler(handleGetGalleryPhotoList);