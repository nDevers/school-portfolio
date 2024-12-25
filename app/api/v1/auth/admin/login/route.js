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

import { PrismaClient } from '@prisma/client';

/**
 * Initializes a new instance of the PrismaClient, which provides
 * a database connection and methods for interacting with the database.
 *
 * The PrismaClient instance is used to perform CRUD operations and other
 * database queries in applications. It acts as the database client,
 * bridging the application with the database through Prisma's ORM.
 *
 * Note: Ensure to properly manage the lifecycle of the PrismaClient instance,
 * such as connecting and disconnecting, to avoid excessive connection pooling
 * or memory issues.
 *
 * Variable: prisma
 * Type: PrismaClient
 */
const prisma = new PrismaClient();

/**
 * Handles the login process for administrators.
 *
 * This asynchronous function authenticates admin users by validating their request content,
 * verifying credentials, and generating access tokens upon successful login. It performs
 * several operations including form data validation, user existence verification, password
 * validation, and notification email dispatch.
 *
 * Steps performed:
 * - Validates that the request content type is allowed.
 * - Parses and validates the request form data against a predefined schema.
 * - Checks for the existence of the admin user in the database (using Prisma).
 * - Validates the submitted password after decryption.
 * - Identifies the device type based on the User-Agent header.
 * - If authentication is successful, generates access and refresh tokens for the admin user.
 * - Encrypts the tokens before including them in the response.
 * - Sends a login notification email to the admin user.
 * - Returns an authorized response with tokens upon success or an appropriate error response on failure.
 *
 * @param {Object} request - The incoming request object containing the admin login data.
 * @param {Object} context - The context object, typically containing environmental details.
 * @returns {Promise<Object>} An HTTP response object indicating the result of the login operation.
 */
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

/**
 * The `POST` variable is an asynchronous function that handles the login logic for administrators.
 * It uses the `asyncHandler` middleware to efficiently manage asynchronous operations and error handling.
 *
 * @constant {Function} POST
 */
export const POST = asyncHandler(handleAdminLogin);
