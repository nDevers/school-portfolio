import serviceShared from "@/shared/service.shared";
import SuperAdminModel from "@/app/api/v1/auth/super-admin/super.admin.model";

import asyncHandler from "@/util/asyncHandler";

/**
 * Asynchronous function to handle password reset functionality for users.
 *
 * This function manages the password reset process by delegating the task
 * to a shared service. It accepts a request object containing the password
 * reset details and a context object for additional execution context, then
 * utilizes the SuperAdminModel to perform the necessary operations.
 *
 * @param {Object} request - The request object containing details for the password reset operation.
 * @param {Object} context - Contextual information that may be required for processing the reset.
 * @returns {Promise<*>} A promise that resolves with the result of the password reset process.
 */
const handleResetPassword = async (request, context) => {
    return await serviceShared.handlePasswordReset(
        request,
        context,
        SuperAdminModel,
    );
};

/**
 * PUT is an asynchronous function wrapped with an asyncHandler to manage errors effectively.
 *
 * It is used to handle the reset password functionality by leveraging the `handleResetPassword` method.
 * The function deals with HTTP PUT requests to update or reset user credentials securely.
 *
 * This ensures proper error handling and provides a clean mechanism to manage asynchronous code execution.
 *
 * @type {Function}
 */
export const PUT = asyncHandler(handleResetPassword);
