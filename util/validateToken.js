'use strict';

import { CryptoError } from '@/lib/customError';

import { AdminModel } from '@/shared/prisma.model.shared';
import sharedResponseTypes from '@/shared/shared.response.types';

import getAuthToken from './getAuthToken';
import { decryptData } from '@/util/crypto';
import verifyToken from '@/util/verifyToken';
import getDeviceType from '@/util/getDeviceType';
import logger from '@/lib/logger';

const { FORBIDDEN } = sharedResponseTypes;

/**
 * Asynchronously validates the token from an incoming request and verifies the user's authorization.
 *
 * The function extracts and decrypts the token from the request, verifies its validity and type,
 * and retrieves the associated user information from the database. The function determines the
 * authorization status of the user and identifies additional user information such as device type.
 * If the token is invalid, or if the user is unauthorized, the function returns a forbidden response.
 *
 * @param {Object} request - The incoming HTTP request object containing headers and other request details.
 * @param {string} type - The type of token to be verified.
 * @returns {Promise<Object>} A promise that resolves to an object indicating authorization status.
 *                             If authorized, the object includes information about the user.
 *                             If unauthorized, the object includes a forbidden response.
 * @throws {CryptoError} Throws a `CryptoError` if the token decryption fails.
 */
const validateToken = async (request, type = 'access') => {
    const encryptedToken = getAuthToken(request);
    let token;

    try {
        token = decryptData(encryptedToken);
    } catch (error) {
        logger.error('Token decryption failed:', error.message);

        throw new CryptoError('Invalid token provided.');
    }

    const tokenDetails = await verifyToken(token, type);

    if (!tokenDetails?.currentUser?._id) {
        return {
            isAuthorized: false,
            response: FORBIDDEN(
                'Authorization failed. User is not authorized to perform this action.',
                request
            ),
        };
    }

    let existingUser = {};
    const userId = tokenDetails?.currentUser?._id;

    if (tokenDetails?.currentUser?.userType === 'admin') {
        existingUser = await AdminModel.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                email: true,
                name: true,
            },
        });

        existingUser.userType = tokenDetails?.currentUser?.userType;
    } else if (tokenDetails?.currentUser?.userType === 'super-admin') {
        existingUser = await AdminModel.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
            },
        });

        existingUser.userType = tokenDetails?.currentUser?.userType;
    }

    if (!existingUser) {
        return {
            isAuthorized: false,
            response: FORBIDDEN(
                'Authorization failed. User is not authorized to perform this action.',
                request
            ),
        };
    }

    // Get device type
    const userAgent = request.headers.get('User-Agent') || '';

    existingUser.deviceType = getDeviceType(userAgent);

    return { isAuthorized: true, user: existingUser };
};

export default validateToken;
