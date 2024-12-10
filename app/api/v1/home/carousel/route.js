import {PrismaClient} from "@prisma/client";

import sharedResponseTypes from "@/shared/shared.response.types";

import asyncHandler from "@/util/asyncHandler";
import homeCarouselSelectionCriteria from "@/app/api/v1/home/carousel/home.carousel.selection.criteria";

const prisma = new PrismaClient();

const model = prisma.HomeCarousel;

const { NOT_FOUND, OK } = sharedResponseTypes;

// Named export for the GET request handler
const handleGetGalleryPhotoList = async (request, context) => {
    // Fetch the single record from the HomeCarousel table
    const data = await model.findFirst({
        select: homeCarouselSelectionCriteria,
    });

    if (!data.images.length) {
        return NOT_FOUND('No home carousel images available at this time.', request);
    }

    return OK('Home carousel images retrieved successfully.', data.images, request);
};

// Export the routes wrapped with asyncHandler
export const GET = asyncHandler(handleGetGalleryPhotoList);