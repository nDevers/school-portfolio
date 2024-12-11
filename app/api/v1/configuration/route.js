import {PrismaClient} from "@prisma/client";

import sharedResponseTypes from "@/shared/shared.response.types";

import asyncHandler from "@/util/asyncHandler";
import configurationSelectionCriteria from "@/app/api/v1/configuration/configuration.selection.criteria";

const prisma = new PrismaClient();

const model = prisma.Configuration;

const selectionCriteria = configurationSelectionCriteria();

const { NOT_FOUND, OK } = sharedResponseTypes;

// Named export for the GET request handler
const handleGetConfiguration = async (request) => {
    // Fetch the existing carousel entry
    const data = await model.findFirst({
        select: selectionCriteria,
    });
    if (!data) {
        return NOT_FOUND('No configuration found.', request);
    }

    return OK('Configuration retrieved successfully.', data, request);
};

// Export the routes wrapped with asyncHandler
export const GET = asyncHandler(handleGetConfiguration);
