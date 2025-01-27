'use strict';

import mongodb from '@/lib/mongodb';
import authUtilities from '@/app/api/v1/auth/auth.utilities';

import asyncHandler from '@/util/asyncHandler';
import { encryptData } from '@/util/crypto';
import createAuthenticationToken from '@/util/createAuthenticationToken';
import validateToken from '@/util/validateToken';

/**
 * Asynchronously handles the process of refreshing authentication tokens.
 *
 * This function validates the incoming request's refresh token, ensures the user is authorized,
 * generates a new set of authentication tokens (access and refresh tokens), encrypts them,
 * and returns the encrypted tokens in the response. It also connects to MongoDB as part of the process.
 *
 * @async
 * @function handleRefreshToken
 * @param {Object} request - The incoming request object containing the refresh token and user data.
 * @returns {Object} - The response object containing the status and the encrypted authentication tokens
 *                     or an error response if the validation fails.
 */
const handleRefreshToken = async (request) => {
    // Check if the "membership" type already exists in MongoDB
    await mongodb.connect();

    // Validate admin
    const authResult = await validateToken(request, 'refresh');
    if (!authResult.isAuthorized) {
        return authResult.response; // Return early with the authorization failure response
    }

    // Generate authentication token
    const userTokenData = {
        _id: authResult?.user?._id,
        deviceType: authResult?.user?.deviceType,
        userType: authResult?.user?.userType,
    };

    const { accessToken, refreshToken } =
        await createAuthenticationToken(userTokenData);

    // Encrypt the token for response
    const returnData = {
        accessToken: encryptData(accessToken),
        refreshToken: encryptData(refreshToken),
    };

    // Return success response
    return authUtilities.authorizedResponse('Authorized.', returnData, request);
};

/**
 * Represents an HTTP GET request handler for refreshing tokens.
 * Utilizes the asyncHandler middleware to manage asynchronous execution.
 *
 * @constant
 * @type {Function}
 * @function
 * @param {Function} handleRefreshToken - The controller function to handle token refresh logic.
 * @returns {Promise<void>} - A promise resolving to no value after handling the request.
 */
export const GET = asyncHandler(handleRefreshToken);
