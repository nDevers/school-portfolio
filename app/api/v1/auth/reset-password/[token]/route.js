import serviceShared from "@/shared/service.shared";

import asyncHandler from "@/util/asyncHandler";

const handleResetPassword = async (request, context) => {
    return await serviceShared.handlePasswordReset(
        request,
        context,
    );
};

// Export the route wrapped with asyncHandler
export const PUT = asyncHandler(handleResetPassword);
