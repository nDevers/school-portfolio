import localFileOperations from "@/util/localFileOperations";
import authConstants from "@/app/api/v1/auth/auth.constants";
import authSchema from "@/app/api/v1/auth/auth.schema";
import authUtilities from "@/app/api/v1/auth/auth.utilities";
import authEmailTemplate from "@/app/api/v1/auth/auth.email.template";
import environments from "@/constants/enviornments.constants";
import sharedResponseTypes from "@/shared/shared.response.types";
import schemaShared from "@/shared/schema.shared";

import toSentenceCase from "@/util/toSentenceCase";
import validateToken from "@/util/validateToken";
import parseAndValidateFormData from "@/util/parseAndValidateFormData";
import validateUnsupportedContent from "@/util/validateUnsupportedContent";
import comparePassword from "@/util/comparePassword";
import {decryptData, encryptData} from "@/util/crypto";
import getDeviceType from "@/util/getDeviceType";
import createAuthenticationToken from "@/util/createAuthenticationToken";
import generateVerificationToken from "@/util/generateVerificationToken";
import configurations from "@/configs/configurations";
import createHashedPassword from "@/util/createHashedPassword";
import prepareSearchQuery from "@/util/prepareSearchQuery";

const configuration = await configurations();
const { NOT_FOUND, OK, CREATED, CONFLICT, BAD_REQUEST, INTERNAL_SERVER_ERROR } = sharedResponseTypes;
const { idValidationSchema } = schemaShared;

// Common function for fetching and projecting MongoDB data with custom aggregation
const fetchEntryList = async (request, context, model, selectionCriteria, message, schema = null) => {
    let userInput = {};

    // Parse and validate form data for GET request if schema is provided
    if (schema) {
        userInput = await parseAndValidateFormData(request, context, 'get', schema);
    }

    // Build the where condition dynamically based on userInput
    const whereCondition = prepareSearchQuery(userInput);

    // Fetch data from the database with the dynamic where condition
    const data = await model.findMany({
        where: whereCondition,
        select: selectionCriteria,
    });

    // Get the total count of matching records
    const total = await model.count({
        where: whereCondition,
    });

    if (!data.length) {
        return NOT_FOUND(`No ${message} available at this time.`, request);
    }

    return OK(`${total} ${message} retrieved successfully.`, data, request);
};

// Common function for fetching data by id and projecting MongoDB data with custom aggregation
const fetchEntryById = async (request, context, model, selectionCriteria, message) => {
    const userInput = await parseAndValidateFormData(request, context, 'get', idValidationSchema);

    // Use findUnique instead of findById
    const data = await model.findUnique({
        where: {
            id: userInput?.id,
        },
        select: selectionCriteria,
    });

    // Check if data exists
    if (!data) {
        return NOT_FOUND(`No ${message} available at this time.`, request);
    }

    // Send a success response with the fetched data
    return OK(`${toSentenceCase(message)} retrieved successfully.`, data, request);
};

const deleteEntryById = async (request, context, model, fileIdField, message) => {
    // Validate admin
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response; // Return early with the authorization failure response
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, context, 'delete', idValidationSchema);

    // Check if data exists
    const data = await model.findUnique({
        where: {
            id: userInput?.id,
        },
        select: {
            id: true, // Only return the ID of the deleted document
            ...(fileIdField && { [fileIdField]: true }) // Conditionally include fileIdField
        },
    });
    if (!data) {
        return NOT_FOUND(`${message} entry with ID "${userInput?.id}" not found.`, request);
    }

    // Perform the deletion with the specified projection field for optional file handling
    await model.delete({
        where: {
            id: userInput?.id,
        },
    });

    const fileId = data[fileIdField];
    if (fileId) {
        await localFileOperations.deleteFile(fileId); // Delete old file
    }

    // If no document is found, send a 404 response
    const deletedData = await model.findUnique({
        where: {
            id: userInput?.id,
        },
        select: {
            id: true // Only return the ID of the deleted document
        },
    });
    if (deletedData) {
        return NOT_FOUND(`Failed to delete ${message} entry with ID "${userInput?.id}".`, request);
    }

    // Send a success response
    return OK(`${message} entry with ID "${userInput?.id}" deleted successfully.`, {}, request);
};

const createStatusEntry = async (request, context, model, schema, contentTypes, statusFieldName, message) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(request, contentTypes);
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Validate admin
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, context, 'create', schema);

    // Check if a document with the specified status already exists
    const existingStatus = await model.exists({ [statusFieldName]: userInput?.[statusFieldName] });
    if (existingStatus) {
        return CONFLICT(`${statusFieldName.charAt(0).toUpperCase() + statusFieldName.slice(1)} entry with status "${userInput?.[statusFieldName]}" already exists.`, request);
    }

    // Attempt to create a new document with the provided details
    const createdDocument = await model.create(userInput);

    // Validate if the document was successfully created
    if (!createdDocument) {
        return INTERNAL_SERVER_ERROR(`Failed to create ${message} entry.`, request);
    }

    // Retrieve the created document
    const statusData = await model.findOne(
        { _id: createdDocument._id },
        {
            _id: 1,
            [statusFieldName]: 1,
        }
    ).lean();

    // Send a success response with the created document data
    return CREATED(
        `${toSentenceCase(message)} entry with ${statusFieldName} "${userInput?.[statusFieldName]}" created successfully.`,
        statusData,
        request
    );
};

const createTypeEntry = async (request, context, model, schema, contentTypes, typeFieldName, message) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(request, contentTypes);
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Validate admin
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, context, 'create', schema);

    // Check if a document with the specified type already exists
    const existingEntry = await model.exists({ [typeFieldName]: userInput?.[typeFieldName] });
    if (existingEntry) {
        return CONFLICT(`${message} entry with ${typeFieldName} "${userInput?.[typeFieldName]}" already exists.`, request);
    }

    // Create a new document with the provided details
    const createdDocument = await model.create(userInput);

    // Validate if the document was successfully created
    if (!createdDocument) {
        return INTERNAL_SERVER_ERROR(`Failed to create ${typeFieldName.charAt(0).toUpperCase() + typeFieldName.slice(1)} entry.`, request);
    }

    // Retrieve the created document
    const typeData = await model.findOne(
        { _id: createdDocument._id },
        {
            _id: 1,
            [typeFieldName]: 1,
        }
    ).lean();

    // Send a success response with the created document data
    return CREATED(
        `${typeFieldName.charAt(0).toUpperCase() + typeFieldName.slice(1)} entry with type "${userInput?.[typeFieldName]}" created successfully.`,
        typeData,
        request
    );
};

const handleUserLogin = async (request, context, userType, userModel) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(request, authConstants.allowedContentTypes);
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, context, 'create', authSchema.loginSchema);

    // Check if the user exists
    const existingUser = await userModel.findOne({ email: userInput.email }).lean();
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
        _id: existingUser._id,
        deviceType,
        userType,
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

const handlePasswordResetRequest = async (request, context, userModel) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(request, authConstants.allowedContentTypes);
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, context, 'create', authSchema.requestNewPassword);

    // Check if the user exists
    const existingUser = await userModel.findOne({ email: userInput.email }).lean();
    if (!existingUser) {
        return NOT_FOUND('User not found. Please sign up first.', request);
    }

    // Generate reset password token
    const { verifyToken, token } = await generateVerificationToken();

    // Calculate token expiration
    const expirationTime = configuration.jwt.resetPasswordToken.expiration;

    // Update user's reset password token and expiration in the database
    const updateResult = await userModel.updateOne(
        { _id: existingUser._id },
        {
            resetPasswordToken: token,
            resetPasswordTokenExpiration: expirationTime,
        }
    );

    if (updateResult.modifiedCount === 0) {
        throw new Error('Failed to proceed reset password request.');
    }

    // Prepare reset password verification email
    const hostname = request.nextUrl.hostname;
    const emailVerificationLink =
        configuration.env === environments.PRODUCTION
            ? `https://${hostname}/auth/reset-password/${token}`
            : `http://${hostname}:3000/auth/reset-password/${token}`;

    // Send reset password email
    await authEmailTemplate.resetPasswordRequestNotification(existingUser.email, existingUser.name, emailVerificationLink);

    // Return success response
    return OK(
        'Password reset email sent successfully.',
        {},
        request
    );
};

const handlePasswordReset = async (request, context, userModel) => {
    // Validate content type
    const contentValidationResult = validateUnsupportedContent(request, authConstants.allowedContentTypes);
    if (!contentValidationResult.isValid) {
        return contentValidationResult.response;
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, context, 'update', authSchema.resetPassword);

    // Decrypt token
    const decryptedToken = userInput.token;

    // Check if the user with the token exists
    const existingUser = await userModel.findOne({
        resetPasswordToken: decryptedToken,
    }).lean();
    if (!existingUser) {
        return BAD_REQUEST('Invalid reset password token.', request);
    }

    // Decrypt the new password and hash it
    const decryptedPassword = decryptData(userInput.password);
    const hashedPassword = await createHashedPassword(decryptedPassword);

    // Update the user's password and clear the reset token
    const updateResult = await userModel.updateOne(
        { _id: existingUser._id },
        {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordTokenExpiration: null,
        }
    );

    if (updateResult.modifiedCount === 0) {
        throw new Error('Failed to reset the password.');
    }

    // Send notification email about the successful password reset
    await authEmailTemplate.resetPasswordSuccessfulNotification(existingUser.email, existingUser.name);

    // Return success response
    return OK(
        'Password reset successful.',
        {},
        request
    );
};

const handleGetProfile = async (request) => {
    // Validate admin
    const authResult = await validateToken(request);

    if (!authResult.isAuthorized) {
        return authResult.response; // Return early with the authorization failure response
    }

    // Send a success response with the created document data
    return OK('Profile fetched successfully.', authResult.user, request);
};

const serviceShared = {
    fetchEntryList,
    fetchEntryById,
    deleteEntryById,
    createStatusEntry,
    createTypeEntry,

    handleUserLogin,
    handlePasswordResetRequest,
    handlePasswordReset,

    handleGetProfile,
};

export default serviceShared;
