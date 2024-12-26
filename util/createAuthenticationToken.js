'use strict';

import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import configurations from '@/configs/configurations';

/**
 * The `configuration` variable holds the result of an asynchronous call to retrieve various configurations.
 * This may include settings or properties that are critical for application functionality and behavior.
 *
 * The variable is expected to be assigned with the resolved value from the `configurations()` method,
 * which should return a promise that resolves with the configuration data.
 *
 * It is important to ensure that the `configurations()` function is properly implemented
 * and returns the required data structure for the application to function correctly.
 *
 * Any missing or incorrect values in the configuration object might cause unexpected behavior
 * or failures within the application.
 *
 * The structure and content of the resolved configuration should align with
 * the system requirements outlined in the application's documentation.
 */
const configuration = await configurations();

/**
 * Generates an authentication token for a given user.
 *
 * @function createAuthenticationToken
 * @async
 * @param {Object} userDetails - The details of the user for whom the authentication tokens are being created.
 * @returns {Promise<Object>} An object containing the generated access token, refresh token, and token details including expiration and user information.
 * @throws {Error} If an error occurs during the token creation process.
 */
const createAuthenticationToken = async (userDetails) => {
    try {
        const tokenDetails = {
            tokenId: uuidv4(),
            expiry: new Date(
                Date.now() + configuration.jwt.accessToken.expiration
            ),
            currentUser: { ...userDetails },
        };

        const accessTokenDetails = {
            type: 'access',
            ...tokenDetails,
        };

        const refreshTokenDetails = {
            type: 'refresh',
            ...tokenDetails,
        };

        const accessToken = jwt.sign(
            accessTokenDetails,
            configuration.jwt.accessToken.secret,
            {
                expiresIn: `${configuration.jwt.accessToken.expiration}m`,
            }
        );

        const refreshToken = jwt.sign(
            refreshTokenDetails,
            configuration.jwt.refreshToken.secret,
            {
                expiresIn: `${configuration.jwt.refreshToken.expiration}m`,
            }
        );

        return { accessToken, refreshToken, tokenDetails };
    } catch (error) {
        return error;
    }
};

export default createAuthenticationToken;
