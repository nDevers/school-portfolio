import {PrismaClient} from "@prisma/client";
import {CryptoError} from "@/util/asyncHandler";

import sharedResponseTypes from "@/shared/shared.response.types";

import getAuthToken from "./getAuthToken";
import {decryptData} from "@/util/crypto";
import verifyToken from "@/util/verifyToken";
import convertToObjectId from "@/util/convertToObjectId";
import getDeviceType from "@/util/getDeviceType";

/**
 * An instance of the PrismaClient used to interact with the database.
 *
 * The PrismaClient allows querying, creating, updating, and deleting
 * records in the connected database through generated methods for the defined
 * schema.
 *
 * This variable is typically used throughout the application for database operations,
 * ensuring centralized access to Prisma's functionality.
 */
const prisma = new PrismaClient();
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
        throw new CryptoError('Invalid token provided.')
    }

    const tokenDetails = await verifyToken(token, type);

    if (!tokenDetails?.currentUser?._id) {
        return {
            isAuthorized: false,
            response: FORBIDDEN('Authorization failed. User is not authorized to perform this action.', request),
        };
    }

    let existingUser = {};
    const userId = convertToObjectId(tokenDetails?.currentUser?._id);

    if (tokenDetails?.currentUser?.userType === 'admin') {
        existingUser = await prisma.admin.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                email: true,
                name: true,
            }
        });

        existingUser.userType = tokenDetails?.currentUser?.userType;
    } else if (tokenDetails?.currentUser?.userType === 'super-admin') {
        existingUser = await prisma.admin.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
            }
        });

        existingUser.userType = tokenDetails?.currentUser?.userType;
    } else {

    }

    if (!existingUser) {
        return {
            isAuthorized: false,
            response: FORBIDDEN('Authorization failed. User is not authorized to perform this action.', request),
        };
    }

    // Get device type
    const userAgent = request.headers.get('User-Agent') || '';

    existingUser.deviceType = getDeviceType(userAgent);

    return { isAuthorized: true, user: existingUser };
};

export default validateToken;
