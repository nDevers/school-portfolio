import AdminModel from "@/app/api/v1/admin/admin.model";
import sharedResponseTypes from "@/shared/shared.response.types";

import asyncHandler from "@/util/asyncHandler";
import convertToObjectId from "@/util/convertToObjectId";

const { NOT_FOUND, OK } = sharedResponseTypes;

const handleVerifyUser = async (request, context) => {
    const { params } = context;
    const userId = convertToObjectId(params.id);
    const existingUser = await AdminModel.findOne({_id: userId}).lean();

    if (!existingUser) {
        return NOT_FOUND('User not found.', request);
    }

    return OK('User verified.', existingUser, request);
};

// Export the route wrapped with asyncHandler
export const GET = asyncHandler(handleVerifyUser);
