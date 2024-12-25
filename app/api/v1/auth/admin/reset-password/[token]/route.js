import serviceShared from "@/shared/service.shared";
import AdminModel from "@/app/api/v1/admin/admin.model";

import asyncHandler from "@/util/asyncHandler";

/**
 * Asynchronous function to handle the reset password process for an admin user.
 *
 * This function utilizes the shared service to perform the password reset operation
 * by delegating the request and context along with the admin model. It ensures
 * the password reset is properly handled in a secure and consistent manner.
 *
 * @function
 * @async
 * @param {Object} request - The request object containing the details necessary
 *                           for the password reset operation.
 * @param {Object} context - The context object providing additional metadata
 *                           about the request and environment in which it is executed.
 * @returns {Promise<*>} A promise resolving to the result of the password reset operation.
 */
const handleResetPassword = async (request, context) => {
    return await serviceShared.handlePasswordReset(
        request,
        context,
        AdminModel,
    );
};

/**
 * PUT is an asynchronous handler function that processes a password reset operation.
 * It uses the `asyncHandler` middleware to handle exceptions and ensure the smooth execution of the `handleResetPassword` function.
 * This variable facilitates the password reset process triggered by an HTTP PUT request.
 *
 * Dependencies:
 * - asyncHandler: A middleware function for handling asynchronous operations safely.
 * - handleResetPassword: A function that contains the logic for resetting a user's password.
 */
export const PUT = asyncHandler(handleResetPassword);
