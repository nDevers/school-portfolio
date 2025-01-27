'use strict';

import jwt from 'jsonwebtoken';

import logger from '@/lib/logger';

import configurations from '@/configs/configurations';

/**
 * Represents the application configuration settings loaded asynchronously.
 * This variable is assigned the result of invoking the `configurations` function.
 * It is expected to hold all necessary configuration details required for
 * the application to function properly.
 *
 * The structure and contents of `configuration` may vary based on the
 * implementation of the `configurations` function.
 *
 * Ensure that the `configurations` function is correctly implemented
 * to return the appropriate settings in the desired format before usage.
 */
const configuration = await configurations();

/**
 * Asynchronously verifies a given JWT (JSON Web Token) based on the specified token type.
 *
 * The function accepts a JWT and verifies it using the appropriate secret key
 * depending on whether it is an access token or a refresh token.
 *
 * The default type is 'access', meaning the token will be verified against the
 * access token secret unless specified otherwise.
 *
 * @param {string} token - The JWT to be verified.
 * @param {string} [type='access'] - The type of token. Can be either 'access' or 'refresh'.
 *
 * @returns {Promise<Object|boolean>} Returns the decoded token object if verification is successful,
 * or `false` if the verification fails or an error occurs.
 */
const verifyToken = async (token, type) => {
    try {
        if (type === 'refresh') {
            return await jwt.verify(
                token,
                configuration.jwt.refreshToken.secret
            );
        } else {
            return await jwt.verify(
                token,
                configuration.jwt.accessToken.secret
            );
        }
    } catch (error) {
        logger.error('Token verification failed:', error.message);
        return false;
    }
};

export default verifyToken;
