import AdminModel from "@/app/api/v1/admin/admin.model";
import serviceShared from "@/shared/service.shared";

import asyncHandler from "@/util/asyncHandler";
import validateUnsupportedContent from "@/util/validateUnsupportedContent";
import authConstants from "@/app/api/v1/auth/auth.constants";
import parseAndValidateFormData from "@/util/parseAndValidateFormData";
import authSchema from "@/app/api/v1/auth/auth.schema";
import authUtilities from "@/app/api/v1/auth/auth.utilities";
import getDeviceType from "@/util/getDeviceType";
import comparePassword from "@/util/comparePassword";
import {decryptData, encryptData} from "@/util/crypto";
import createAuthenticationToken from "@/util/createAuthenticationToken";
import authEmailTemplate from "@/app/api/v1/auth/auth.email.template";

// Import the PrismaClient from Prisma client library
import { PrismaClient } from '@prisma/client';

// Instantiate Prisma Client
const prisma = new PrismaClient();

const handleAdminLogin = async (request, context) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(request, authConstants.allowedContentTypes);
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, context, 'create', authSchema.loginSchema);

    // Check if the user exists using Prisma
    const existingUser = await prisma.admin.findUnique({
        where: { email: userInput.email }
    });
    if (!existingUser) {
        return authUtilities.unauthorizedResponse(
            'Unauthorized access. Please check your email and password and try again.',
            request
        );
    }

    // Get device type
    const userAgent = request.headers.get('User-Agent') || '';
    const deviceType = getDeviceType(userAgent);

    // Validate password
    const isPasswordValid = await comparePassword(
        decryptData(userInput.password),
        existingUser.password
    );
    if (!isPasswordValid) {
        return authUtilities.unauthorizedResponse(
            'Incorrect password. Please try again or use the forgot password option to reset it.',
            request
        );
    }

    // Generate authentication token
    const userTokenData = {
        _id: existingUser.id, // Ensure this field matches Prisma's output
        deviceType,
        userType: 'admin',
    };
    const { accessToken, refreshToken } = await createAuthenticationToken(userTokenData);

    // Encrypt the token for response
    const returnData = { accessToken: encryptData(accessToken), refreshToken: encryptData(refreshToken) };

    // Send login notification email
    await authEmailTemplate.successfulLoginNotification(existingUser.email, existingUser.name, deviceType);

    // Return success response
    return authUtilities.authorizedResponse(
        'Authorized.',
        returnData,
        request
    );
};

// Export the route wrapped with asyncHandler
export const POST = asyncHandler(handleAdminLogin);
