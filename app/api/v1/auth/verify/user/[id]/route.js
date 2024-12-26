'use strict';

import AdminModel from '@/app/api/v1/admin/admin.model';
import sharedResponseTypes from '@/shared/shared.response.types';

import asyncHandler from '@/util/asyncHandler';
import convertToObjectId from '@/util/convertToObjectId';

const { NOT_FOUND, OK } = sharedResponseTypes;

/**
 * Asynchronous function to handle user verification.
 *
 * This function takes in a request and context, extracts the user ID from the context parameters,
 * and verifies if the user exists in the database using the AdminModel. If the user is found,
 * a successful response is returned along with user details. If the user is not found, a "not found"
 * response is returned.
 *
 * @param {Object} request - The incoming request object.
 * @param {Object} context - The context object containing parameters and other relevant data.
 * @returns {Object} A response object indicating whether the user was successfully verified or not.
 */
const handleVerifyUser = async (request, context) => {
    const { params } = context;
    const userId = convertToObjectId(params.id);
    const existingUser = await AdminModel.findOne({ _id: userId }).lean();

    if (!existingUser) {
        return NOT_FOUND('User not found.', request);
    }

    return OK('User verified.', existingUser, request);
};

/**
 * An asynchronous function wrapped with the `asyncHandler` utility to handle the user verification process.
 * The `GET` variable is assigned a function that facilitates the verification of a user, typically used in HTTP GET requests.
 *
 * This function leverages asynchronous operations and error handling through the `asyncHandler` middleware.
 * It processes user verification by delegating logic to the `handleVerifyUser` function.
 *
 * Usage: Primarily utilized in routing as a handler for specific verification endpoints.
 */
export const GET = asyncHandler(handleVerifyUser);
