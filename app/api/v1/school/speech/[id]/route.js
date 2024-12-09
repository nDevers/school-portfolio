import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";

import asyncHandler from "@/util/asyncHandler";
import schoolSpeechSelectionCriteria from "@/app/api/v1/school/speech/school.speech.selection.criteria";

const prisma = new PrismaClient();

const model = prisma.SchoolSpeech;

// Named export for the GET request handler
export const handleGetSpeechById = async (request, context) => {
    const selectionCriteria = schoolSpeechSelectionCriteria();

    return serviceShared.fetchEntryById(request, context, model, selectionCriteria,  'School speech');
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleGetSpeechById);
