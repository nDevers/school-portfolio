import {PrismaClient} from "@prisma/client";

import serviceShared from "@/shared/service.shared";
import schoolSpeechSchema from "@/app/api/v1/school/speech/school.speech.schema";

import asyncHandler from "@/util/asyncHandler";
import schoolSpeechSelectionCriteria from "@/app/api/v1/school/speech/school.speech.selection.criteria";

const prisma = new PrismaClient();

const model = prisma.SchoolSpeech;

// Named export for the GET request handler
const handleGetSchoolSpeechList = async (request, context) => {
    const selectionCriteria = schoolSpeechSelectionCriteria();

    return serviceShared.fetchEntryList(request, context, model, selectionCriteria, 'School speech', schoolSpeechSchema.getDataByQuery);
};

// Export the routes wrapped with asyncHandler
export const GET = asyncHandler(handleGetSchoolSpeechList);