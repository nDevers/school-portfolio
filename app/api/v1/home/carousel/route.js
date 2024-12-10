import {PrismaClient} from "@prisma/client";

import sharedResponseTypes from "@/shared/shared.response.types";

import asyncHandler from "@/util/asyncHandler";
import homeCarouselSelectionCriteria from "@/app/api/v1/home/carousel/home.carousel.selection.criteria";

const prisma = new PrismaClient();

const model = prisma.HomeCarousel;

const selectionCriteria = homeCarouselSelectionCriteria();

const { NOT_FOUND, OK } = sharedResponseTypes;

// Named export for the GET request handler
const handleGetGalleryPhotoList = async (request) => {
    // Fetch the existing carousel entry
    const data = await model.findFirst({
        select: selectionCriteria,
    });
    if (!data) {
        return NOT_FOUND("Home carousel entry not found.", request);
    }

    return OK(`${data?.images?.length} Home carousel images retrieved successfully.`, data?.images, request);
};

// Export the routes wrapped with asyncHandler
export const GET = asyncHandler(handleGetGalleryPhotoList);
