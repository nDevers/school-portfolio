import serviceShared from "@/shared/service.shared";

import asyncHandler from "@/util/asyncHandler";

/**
 * Asynchronously handles the password reset process.
 *
 * This function invokes the shared service method to manage the password reset,
 * leveraging the provided request and context parameters to execute the operation.
 *
 * @param {Object} request - The request object containing relevant data required for the password reset operation.
 * @param {Object} context - The execution context providing supplementary information for the operation.
 * @returns {Promise<*>} A promise that resolves with the result of the password reset operation.
 */
const handleResetPassword = async (request, context) => {
    return await serviceShared.handlePasswordReset(
        request,
        context,
    );
};

/**
 * PUT is an asynchronous function wrapped with an asyncHandler utility.
 * It is intended to handle the password reset functionality for users.
 *
 * The function leverages the handleResetPassword middleware to process
 * incoming requests related to resetting user passwords. It ensures proper
 * error handling and asynchrony due to the asyncHandler wrapper.
 *
 * The function adheres to the structure and syntax required for handling
 * HTTP PUT requests as a middleware in web frameworks such as Express.js.
 *
 * handleResetPassword is a pre-defined function that contains the specific
 * logic for verifying and resetting passwords.
 */
export const PUT = asyncHandler(handleResetPassword);
