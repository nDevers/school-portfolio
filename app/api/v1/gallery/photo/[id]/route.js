import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";

import asyncHandler from "@/util/asyncHandler";
import galleryPhotoSelectionCriteria from "@/app/api/v1/gallery/photo/gallery.photo.selection.criteria";

const prisma = new PrismaClient();

const model = prisma.GalleryPhoto;

// Named export for the GET request handler
export const handleGetGalleryPhotoById = async (request, context) => {
    const selectionCriteria = galleryPhotoSelectionCriteria();

    return serviceShared.fetchEntryById(request, context, model, selectionCriteria,  'Gallery photo');
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetGalleryPhotoById);
