import {PrismaClient} from "@prisma/client";
import {CryptoError} from "@/util/asyncHandler";

import sharedResponseTypes from "@/shared/shared.response.types";

import getAuthToken from "./getAuthToken";
import {decryptData} from "@/util/crypto";
import verifyToken from "@/util/verifyToken";
import convertToObjectId from "@/util/convertToObjectId";
import getDeviceType from "@/util/getDeviceType";

const prisma = new PrismaClient();
const { FORBIDDEN } = sharedResponseTypes;

const validateToken = async (request, type) => {
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
