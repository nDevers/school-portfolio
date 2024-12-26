'use strict';

import middlewareConstants from '@/constants/middleware.constants';
import httpStatusConstants from '@/constants/httpStatus.constants';

/**
 * Asynchronous function to validate request permissions based on headers and user-agent.
 *
 * This validator checks the request headers for specific conditions to restrict or allow access.
 * It ensures that requests meet certain criteria such as user-agent compliance and origin/referer presence.
 * If the request does not meet these criteria, access may be denied. If an error occurs during the
 * validation process, a "Service unavailable" response is returned.
 *
 * @param {Request} request - The incoming request object containing headers and other request information.
 * @returns {Promise<null|Response>} Resolves to `null` if the request passes all validation checks, or a
 * Response object indicating an error or access denial if validation fails.
 */
const permissionValidator = async (request) => {
    try {
        const userAgent = request.headers.get('user-agent') || '';
        const referer = request.headers.get('referer');
        const origin = request.headers.get('origin') ?? '';
        const requestedSite = request.headers.get('X-Site-Identifier') ?? '';

        // Block requests from specific user agents or missing headers
        const isBlockedUserAgent = middlewareConstants.blockedUserAgents.some(
            (ua) => userAgent.includes(ua)
        );

        if (isBlockedUserAgent || (!referer && !origin)) {
            // return new Response('Access Denied', { status: httpStatusConstants.FORBIDDEN });
        }

        // If everything passes, return null
        return null;
    } catch (error) {
        return new Response('Service unavailable', {
            status: httpStatusConstants.SERVICE_UNAVAILABLE,
        });
    }
};

export default permissionValidator;
