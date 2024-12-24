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

/**
 * Represents the configuration settings loaded asynchronously.
 *
 * The `configuration` variable contains application-specific settings
 * or parameters that are retrieved dynamically using the `configurations()`
 * function. This variable is typically used to define configurable
 * options for the application.
 *
 * The content of the configuration depends on the underlying implementation
 * of the `configurations()` function. It may include keys and values
 * specific to the application's requirements.
 *
 * Ensure that `configurations()` is executed and resolves successfully
 * before accessing `configuration`.
 */
const configuration = await configurations();
const { NOT_FOUND, OK, CREATED, CONFLICT, BAD_REQUEST, INTERNAL_SERVER_ERROR } = sharedResponseTypes;
const { idValidationSchema, categoryValidationSchema } = schemaShared;

// Common function for fetching and projecting MongoDB data with custom aggregation
/**
 * Fetches a list of entries from the database based on dynamic search criteria.
 *
 * This asynchronous function retrieves data from the specified database model
 * by building a dynamic search query from user inputs. It also validates input
 * data if a schema is provided and returns the total count of matching records.
 *
 * @param {Object} request - The request object containing details of the current HTTP request.
 * @param {Object} context - The context object, typically containing environment-specific data.
 * @param {Object} model - The database model used to fetch the entries.
 * @param {Object} selectionCriteria - An object specifying which fields to include in the result.
 * @param {string} message - A message used in the response for better contextual understanding.
 * @param {Object} [schema=null] - Optional validation schema for input data, if applicable.
 * @returns {Promise<Object>} A promise resolving to a response object containing the fetched data,
 *                            along with a success message and total count. Returns a not-found message
 *                            if no data matches the search criteria.
 *
 * @throws {Error} Throws an error if schema validation fails or if there is an issue with database operations.
 */
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
/**
 * Asynchronously fetches an entry from the database by its unique identifier.
 *
 * This function validates the input data from the request against a specified schema
 * and retrieves the entry from the given model using the unique identifier.
 * If the entry is found, a success response is returned with the fetched data.
 * If no entry is found, a "not found" response is returned.
 *
 * @param {Object} request - The HTTP request object containing parameters and body data.
 * @param {Object} context - An object providing context for the operation, such as environment-specific settings.
 * @param {Object} model - The database model used to query the data.
 * @param {Object} selectionCriteria - Defines which fields should be selected and returned from the queried entry.
 * @param {string} message - A descriptive term for the entry type, used in response messages (e.g., "user", "order").
 * @returns {Object} A response object containing the status, message, and data (if found).
 *
 * @throws {Error} If the input validation fails or the query encounters an issue.
 */
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
        return NOT_FOUND(`No ${message} entry with the ID: "${userInput?.id}" available at this time.`, request);
    }

    // Send a success response with the fetched data
    return OK(`${toSentenceCase(message)} entry with the ID: "${userInput?.id}" retrieved successfully.`, data, request);
};

// Common function for fetching data by id and projecting MongoDB data with custom aggregation
/**
 * Fetches entries from the database by category.
 *
 * @function
 * @async
 * @param {Object} request - The incoming request object containing necessary request data.
 * @param {Object} context - The context object containing additional data and configurations.
 * @param {Object} model - The database model used to interact with the data source.
 * @param {Object} selectionCriteria - The criteria specifying the fields to be selected in the query.
 * @param {string} message - A descriptive message used in the response.
 * @param {Object} categorySchema - The schema used to validate the category input.
 * @returns {Promise<Object>} Returns a success response with the fetched data and a message if entries are found; otherwise, returns a "not found" response with an appropriate message.
 */
const fetchEntryByCategory = async (request, context, model, selectionCriteria, message, categorySchema) => {
    const userInput = await parseAndValidateFormData(request, context, 'get', categorySchema);

    // Use findUnique instead of findById
    const data = await model.findMany({
        where: {
            category: userInput?.categoryParams,
        },
        select: selectionCriteria,
    });

    // Check if data exists
    if (!data) {
        return NOT_FOUND(`No ${message} entry with the CATEGORY: "${userInput?.categoryParams}" available at this time.`, request);
    }

    // Send a success response with the fetched data
    return OK(`${toSentenceCase(message)} entry with the CATEGORY: "${userInput?.categoryParams}" retrieved successfully.`, data, request);
};

// Common function for fetching data by id and projecting MongoDB data with custom aggregation
/**
 * Fetches entries by a given email address.
 *
 * @param {Object} request - The HTTP request object.
 * @param {Object} context - The context object, containing request-specific details.
 * @param {Object} model - The database model used to query entries.
 * @param {Object} selectionCriteria - Specifies the fields to select from the fetched entries.
 * @param {string} message - A descriptive message indicating the type of entry being queried.
 * @param {Object} emailSchema - The schema for validating the email input from the request.
 *
 * @returns {Promise<Object>} A response object containing the status and queried data if successful,
 * or an error message if no matching entry is found.
 *
 * @throws {Error} If validation of the input email fails or an error occurs during the database query.
 */
const fetchEntryByEmail = async (request, context, model, selectionCriteria, message, emailSchema) => {
    const userInput = await parseAndValidateFormData(request, context, 'get', emailSchema);

    // Use findUnique instead of findById
    const data = await model.findMany({
        where: {
            email: userInput?.email,
        },
        select: selectionCriteria,
    });

    // Check if data exists
    if (!data) {
        return NOT_FOUND(`No ${message} entry with the email: "${userInput?.email}" available at this time.`, request);
    }

    // Send a success response with the fetched data
    return OK(`${toSentenceCase(message)} entry with the email: "${userInput?.email}" retrieved successfully.`, data, request);
};

// Common function for fetching data by id and projecting MongoDB data with custom aggregation
/**
 * Asynchronously fetches an entry from the specified model based on the category and ID provided in the request.
 *
 * This function parses and validates the incoming request's form data, constructs a query to retrieve a unique entry
 * from the provided model based on the resolved category and ID, and returns the data if found. If no matching entry
 * exists, an appropriate 'NOT_FOUND' message is returned.
 *
 * @param {object} request - The request object containing the incoming request data.
 * @param {object} context - The context object for the current execution environment.
 * @param {object} model - The database model to query for the entry.
 * @param {object} selectionCriteria - The fields to select from the model while retrieving the entry.
 * @param {string} message - The message template to use for success or error responses.
 * @param {object} categorySchemaAndId - An object specifying the expected schema for category and ID validation.
 *
 * @returns {Promise<object>} A promise that resolves to the success response with data or an error response if the
 *                            entry is not found.
 */
const fetchEntryByCategoryAndId = async (request, context, model, selectionCriteria, message, categorySchemaAndId) => {
    const userInput = await parseAndValidateFormData(request, context, 'get', categorySchemaAndId);

    // Use findUnique instead of findById
    const data = await model.findUnique({
        where: {
            category: userInput?.categoryParams,
            id: userInput?.id,
        },
        select: selectionCriteria,
    });

    // Check if data exists
    if (!data) {
        return NOT_FOUND(`No ${message} entry with the CATEGORY: "${userInput?.categoryParams}" and ID: "${userInput?.id}" available at this time.`, request);
    }

    // Send a success response with the fetched data
    return OK(`${toSentenceCase(message)} entry with the CATEGORY: "${userInput?.categoryParams}" and ID: "${userInput?.id}" retrieved successfully.`, data, request);
};

/**
 * Asynchronous function to delete an entry by its unique identifier.
 *
 * @param {Object} request - The HTTP request object, containing details such as headers and body.
 * @param {Object} context - Context object providing additional details about the request or execution environment.
 * @param {Object} model - The database model used to interact with the corresponding data entity.
 * @param {string} fileIdField - (Optional) Name of the field in the model representing a related file ID, if applicable.
 * @param {string} message - Descriptive message about the type of entry being deleted, used for responses.
 * @returns {Promise<Object>} Resolves to an HTTP response object indicating success or failure of the deletion operation.
 *
 * @description
 * This function performs the deletion of a database entry identified by its unique ID.
 *
 * The process includes the following key steps:
 * 1. Validates admin authentication using the provided request token.
 * 2. Parses and validates input using a predefined validation schema.
 * 3. Checks if the specified entry exists in the database.
 * 4. Deletes the data from the database if it exists.
 * 5. If a related file ID field is specified, deletes the associated file from the storage system.
 * 6. Verifies that the data has been completely removed.
 * 7. Returns the appropriate HTTP response indicating success or failure.
 *
 * If the entry is not found or if the deletion fails, a 404 Not Found response is returned.
 * If the operation is successful, a success response is returned with a message confirming the deletion.
 */
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
        return NOT_FOUND(`${message} entry with ID: "${userInput?.id}" not found.`, request);
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
        return NOT_FOUND(`Failed to delete ${message} entry with ID: "${userInput?.id}".`, request);
    }

    // Send a success response
    return OK(`${message} entry with ID: "${userInput?.id}" deleted successfully.`, {}, request);
};

/**
 * deleteEntryByEmail is an asynchronous function that handles the deletion of an entry from a database
 * based on the user's email. It validates an admin's authorization, checks the existence of the entry,
 * and performs the deletion while also handling associated file removal if applicable.
 *
 * @param {Object} request - The incoming request object containing necessary data for validation and processing.
 * @param {Object} context - The context object providing environment-specific information and utilities.
 * @param {Object} model - The database model used to interact with the data.
 * @param {string} fileIdField - The name of the field in the database associated with a file ID (optional).
 * @param {string} message - Descriptive message to include in the response indicating the type of resource being handled.
 * @param {Object} schema - The schema object for validating and parsing the form data.
 * @returns {Object} Returns an HTTP-formatted response object indicating success or failure of the operation.
 */
const deleteEntryByEmail = async (request, context, model, fileIdField, message, schema) => {
    // Validate admin
    const authResult = await validateToken(request);
    if (!authResult.isAuthorized) {
        return authResult.response; // Return early with the authorization failure response
    }

    // Parse and validate form data
    const userInput = await parseAndValidateFormData(request, context, 'delete', schema);

    // Ensure the email is provided
    if (!userInput?.email) {
        return BAD_REQUEST('Email is required to delete the entry.', {}, request);
    }

    // Check if data exists
    const data = await model.findUnique({
        where: {
            email: userInput.email, // Use the email from userInput
        },
        select: {
            id: true,
            email: true,
            ...(fileIdField && { [fileIdField]: true }), // Conditionally include fileIdField
        },
    });

    if (!data) {
        return NOT_FOUND(`${message} entry with email: "${userInput.email}" not found.`, request);
    }

    // Perform the deletion
    await model.delete({
        where: {
            email: userInput.email, // Use the email for deletion
        },
    });

    // Handle file deletion if applicable
    const fileId = data[fileIdField];
    if (fileId) {
        await localFileOperations.deleteFile(fileId); // Delete old file if fileIdField is provided
    }

    // Send a success response
    return OK(`${message} entry with email: "${userInput.email}" deleted successfully.`, {}, request);
};

/**
 * Asynchronously creates a status entry in the database following the specified validation and data processing steps.
 *
 * @param {Object} request - Represents the HTTP request object containing details such as headers, body, and parameters.
 * @param {Object} context - Represents the execution context or environment of the operation.
 * @param {Object} model - The database model used for interacting with the collection.
 * @param {Object} schema - Validation schema for user input, used to validate request payloads.
 * @param {Array<string>} contentTypes - Allowed content types for the incoming request.
 * @param {string} statusFieldName - The key representing the status field to validate uniqueness.
 * @param {string} message - Descriptive message for the type of operation being performed.
 *
 * @returns {Promise<Object>} A promise resolving to a response object which could include success or error status and associated data.
 *
 * The function:
 * - Validates the content type of the incoming request.
 * - Authenticates and authorizes the request using a token validation process.
 * - Parses and validates the request payload based on the provided schema.
 * - Prevents duplicate entries by checking if a document with the specified status field already exists in the database.
 * - Attempts to create a new document with the parsed and validated payload.
 * - Returns an appropriate success or error response based on the operation results, including details of the created entry if successful.
 */
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

/**
 * Asynchronously handles the creation of a new type entry in the database.
 *
 * @param {Object} request - The incoming HTTP request object.
 * @param {Object} context - The context object containing additional data relevant to the request.
 * @param {Object} model - The database model used for query and manipulation.
 * @param {Object} schema - The validation schema used to validate the input data.
 * @param {Object} contentTypes - Object containing supported content types for validation.
 * @param {string} typeFieldName - The field name in the database representing the "type" attribute of the entry.
 * @param {string} message - A descriptive message used in response construction.
 * @returns {Promise<Object>} A response object indicating the result of the operation (success or error).
 *
 * @throws {Error} Throws an error if there is an issue with token validation, form data parsing, or database operations.
 */
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

/**
 * Handles the user login process by validating the request, authenticating the user, and generating authentication tokens.
 *
 * @async
 * @function
 * @param {Object} request - The HTTP request object containing the user's login details.
 * @param {Object} context - The context object providing additional request information.
 * @param {string} userType - The type/category of the user attempting to log in.
 * @param {Object} userModel - The user model used to interact with the database for user data.
 * @returns {Object} - Returns an HTTP response object indicating the success or failure of the login process.
 *
 * @description
 * This function performs the following tasks:
 * - Validates the request content type to ensure it complies with allowed content types.
 * - Parses and validates the input data using the defined login schema.
 * - Checks if a user with the provided email exists in the system.
 * - Verifies the provided password against the stored hash for the user.
 * - Identifies the user's device type based on the User-Agent header.
 * - Generates authentication tokens (access and refresh tokens) for the user.
 * - Sends a login success notification email to the user.
 * - Responds with an authorization response including encrypted authentication tokens upon successful login, or an unauthorized response in case of errors (e.g., invalid email, password, or content type).
 */
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

/**
 * Handles a password reset request by validating the incoming request, generating a reset
 * password token, updating the user record with the token and its expiration, and sending
 * a reset password email to the user.
 *
 * @async
 * @function handlePasswordResetRequest
 * @param {Object} request - The HTTP request object containing information about the request.
 * @param {Object} context - The context object providing dependencies and utilities for the operation.
 * @param {Object} userModel - The database model used to interact with the user data.
 * @returns {Promise<Object>} A response object indicating the success or failure of the operation.
 * @throws {Error} Throws an error if the reset password token update fails in the database.
 */
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

/**
 * Handles the password reset process by validating the request, updating the user's password, and clearing the reset token.
 *
 * Steps performed:
 * 1. Validates the request content type.
 * 2. Parses and validates the form data based on the specified schema.
 * 3. Decrypts the reset token provided by the user.
 * 4. Verifies if a user exists with the decrypted reset token.
 * 5. Decrypts and hashes the new password provided by the user.
 * 6. Updates the user's password and clears the reset password token and its expiration date in the database.
 * 7. Sends a notification email to inform the user that their password reset was successful.
 * 8. Returns a success response upon successful completion of the process.
 *
 * @param {Object} request - The incoming request containing user-provided data for password reset.
 * @param {Object} context - The context object containing additional meta-data or configurations required for processing.
 * @param {Object} userModel - The user model used to interact with the database for user operations.
 * @throws {Error} Throws an error if the password update fails in the database.
 * @returns {Object} A response indicating whether the password reset process was successful or failed.
 */
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

/**
 * Asynchronous function to handle the retrieval of a user's profile.
 *
 * This function validates the provided request for proper authentication and authorization,
 * then processes the request to fetch and return the user's profile. If the token validation
 * fails, an authorization failure response is returned immediately. Upon successful validation,
 * the profile fetching operation proceeds, and a success response is returned.
 *
 * @param {Object} request - The request object containing the necessary details for user profile retrieval.
 * @returns {Promise<Object>} A promise that resolves to the response object, either indicating an authorization failure or a successful profile fetch.
 */
const handleGetProfile = async (request) => {
    // Validate admin
    const authResult = await validateToken(request);

    if (!authResult.isAuthorized) {
        return authResult.response; // Return early with the authorization failure response
    }

    // Send a success response with the created document data
    return OK('Profile fetched successfully.', authResult.user, request);
};

/**
 * An object containing a collection of service functions for various operations.
 *
 * Properties:
 * - fetchEntryList: Function to fetch a list of entries.
 * - fetchEntryById: Function to fetch an entry by its unique ID.
 * - fetchEntryByCategory: Function to fetch entries filtered by category.
 * - fetchEntryByEmail: Function to fetch entries filtered by email.
 * - fetchEntryByCategoryAndId: Function to fetch entries filtered by both category and ID.
 *
 * - deleteEntryById: Function to delete an entry by its unique ID.
 * - deleteEntryByEmail: Function to delete an entry by email.
 *
 * - createStatusEntry: Function to create a new status entry.
 * - createTypeEntry: Function to create a new type entry.
 *
 * - handleUserLogin: Function to handle user login operations.
 * - handlePasswordResetRequest: Function to handle requests for password reset.
 * - handlePasswordReset: Function to reset user password after request approval.
 *
 * - handleGetProfile: Function to retrieve a user's profile details.
 */
const serviceShared = {
    fetchEntryList,
    fetchEntryById,
    fetchEntryByCategory,
    fetchEntryByEmail,
    fetchEntryByCategoryAndId,

    deleteEntryById,
    deleteEntryByEmail,

    createStatusEntry,
    createTypeEntry,

    handleUserLogin,
    handlePasswordResetRequest,
    handlePasswordReset,

    handleGetProfile,
};

export default serviceShared;
