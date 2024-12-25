import serviceShared from "@/shared/service.shared";
import SuperAdminModel from "@/app/api/v1/auth/super-admin/super.admin.model";

import asyncHandler from "@/util/asyncHandler";

/**
 * Asynchronously handles a new password reset request.
 *
 * This function processes password reset requests by delegating the request to
 * the `serviceShared.handlePasswordResetRequest` method. It provides the necessary
 * `request` object, the execution `context`, and the `SuperAdminModel` to the service.
 *
 * @param {Object} request - The request object containing the password reset details.
 * @param {Object} context - The execution context, which may include authentication details or other metadata.
 * @returns {Promise<*>} Resolves with the outcome of the password reset request process.
 */
const handleRequestNewPassword = async (request, context) => {
    return await serviceShared.handlePasswordResetRequest(
        request,
        context,
        SuperAdminModel
    );
};

/**
 * PUT is an asynchronous handler for processing requests to set or update a new password.
 * It utilizes a request handler method to manage the logic for creating or resetting a user's password.
 *
 * The function leverages an async handler to catch and handle any errors or exceptions that may occur
 * during the execution of the password-related request.
 *
 * This variable is typically used in a routing system to define the endpoint logic for PUT requests to a password management route.
 *
 * Note: The asyncHandler function is responsible for error-handling logic and should wrap the handleRequestNewPassword function.
 */
export const PUT = asyncHandler(handleRequestNewPassword);
