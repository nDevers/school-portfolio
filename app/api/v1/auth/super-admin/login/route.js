'use strict';

import SuperAdminModel from '@/app/api/v1/auth/super-admin/super.admin.model';
import serviceShared from '@/shared/service.shared';

import asyncHandler from '@/util/asyncHandler';

/**
 * Handles the login process specifically for super-admin users.
 *
 * This function processes the super-admin login by delegating the authentication
 * and validation process to the shared user login handling mechanism. It uses
 * predefined parameters to differentiate super-admins from other user roles.
 *
 * @param {Object} request - The request object containing login credentials and other necessary information.
 * @param {Object} context - The context object providing additional metadata or configuration needed during the login process.
 * @returns {Promise<Object>} Resolves with the login response containing authentication details and/or session data.
 */
const handleSuperAdminLogin = (request, context) => {
    return serviceShared.handleUserLogin(
        request,
        context,
        'super-admin',
        SuperAdminModel
    );
};

/**
 * POST is an asynchronous handler function that processes the request
 * and response for the Super Admin login functionality. It wraps the
 * provided `handleSuperAdminLogin` function with an `asyncHandler`
 * to handle asynchronous operations and errors.
 *
 * @type {Function}
 * @function
 */
export const POST = asyncHandler(handleSuperAdminLogin);
