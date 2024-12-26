'use strict';

import httpStatusConstants from '@/constants/httpStatus.constants';
import contentTypesConstants from '@/constants/contentTypes.constants';
import logger from '@/lib/logger';

import getCallerFunctionName from '@/util/getCallerFunctionName';
import getDeviceType from '@/util/getDeviceType';

/**
 * Sends a standardized HTTP response to the client with additional metadata.
 *
 * @param {boolean} success - Indicates whether the response represents a successful operation.
 * @param {number} [status=httpStatusConstants.OK] - HTTP status code for the response.
 * @param {string} message - A descriptive message to provide additional context for the response.
 * @param {Object} [data={}] - The response payload containing data relevant to the request.
 * @param {Request} request - The original HTTP request object, used for extracting metadata.
 * @param {Object} [headers={"Content-Type": contentTypesConstants.JSON}] - Key-value pairs representing the response headers.
 * @param {string} [functionName=getCallerFunctionName()] - Name of the calling function, used for logging purposes.
 *
 * @returns {Response} A Response object with JSON-formatted data, incorporating metadata like timestamp, method, route, and more.
 *
 * @throws {Error} Logs and handles different response conditions based on the status code, specifically for successes, client errors, and server errors.
 */
const sendResponse = (
    success,
    status = httpStatusConstants.OK,
    message,
    data = {},
    request,
    headers = { 'Content-Type': contentTypesConstants.JSON },
    functionName = getCallerFunctionName()
) => {
    // Detecting device type from User-Agent
    const userAgent = request.headers.get('User-Agent') || '';
    const deviceType = getDeviceType(userAgent);

    // Detecting timezone from headers, if available
    const timezone =
        request.headers.get('Time-Zone') ||
        Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Logging based on the status
    if (status >= 200 && status < 300) {
        logger.info(`RESPONSE SUCCESS: ${functionName} ${status}`);
    } else if (status >= 400 && status < 500) {
        logger.warn(`CLIENT ERROR: ${functionName} ${status}`);
    } else if (status >= 500) {
        logger.error(`SERVER ERROR: ${functionName} ${status}`);
    }

    const response = {
        timeStamp: new Date().toISOString(),
        method: request.method,
        route: request.url,
        deviceType,
        timezone,
        success,
        status,
        message,
        data,
    };

    logger.info(`Response: ${JSON.stringify(response)}`);

    return new Response(JSON.stringify(response), {
        status: status,
        headers: { ...headers },
    });
};

export default sendResponse;
