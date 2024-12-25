import { AdminModel } from '@/shared/prisma.model.shared';
import serviceShared from '@/shared/service.shared';

import asyncHandler from '@/util/asyncHandler';

/**
 * Handles the request to reset a user's password.
 *
 * This asynchronous function is responsible for processing a password reset request by delegating
 * the operation to the relevant service layer. It passes the request and context along with the
 * AdminModel to the shared service method `handlePasswordResetRequest`.
 *
 * @async
 * @function
 * @param {Object} request - The password reset request containing relevant data for the operation.
 * @param {Object} context - The context of the request, which may include user authentication
 *                           details or session information.
 * @returns {Promise<any>} A promise resolving to the result provided by the service layer after
 *                         handling the password reset request.
 */
const handleRequestNewPassword = async (request, context) => {
    return await serviceShared.handlePasswordResetRequest(
        request,
        context,
        AdminModel
    );
};

/**
 * PUT is an asynchronous function that processes the request to update or set a new password.
 * It utilizes the `asyncHandler` middleware to handle errors and the `handleRequestNewPassword` function to execute the core logic for the password update.
 *
 * This variable encapsulates the combined functionality to ensure robust and error-resistant handling of password reset or update requests.
 */
export const PUT = asyncHandler(handleRequestNewPassword);
