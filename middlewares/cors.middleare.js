import { NextResponse } from 'next/server';

import httpStatusConstants from '@/constants/httpStatus.constants';
import middlewareConstants from '@/constants/middleware.constants';

import getEnvironmentData from '@/util/getEnvironmentData';

/**
 * Middleware function to handle CORS (Cross-Origin Resource Sharing) validation,
 * other security checks, and detect if the API is being accessed via browser URL.
 *
 * @param {Request} request - The incoming HTTP request object.
 * @returns {Promise<Response>} - A Next.js Response object with appropriate headers and status codes.
 */
const corsMiddleware = async (request) => {
    const headers = request.headers;
    const response = NextResponse.next();

    // Retrieve environment variables for CORS configuration
    const allowedOrigins =
        getEnvironmentData('CORS_ALLOWED_ORIGIN')?.split(',') || [];
    const allowedMethods = getEnvironmentData('CORS_ALLOWED_METHODS');
    const allowedHeaders = getEnvironmentData('CORS_ALLOWED_HEADERS');
    const allowedSiteIdentifier = getEnvironmentData('AUTH_X_SITE_IDENTIFIER');
    const allowedUserAgentForDebug = getEnvironmentData(
        'DEBUG_ALLOWED_USER_AGENT'
    );
    const debugKey = getEnvironmentData('DEBUG_KEY');

    // Extract headers from the request
    const origin = headers.get('origin') ?? '';
    const userAgent = headers.get('user-agent') || '';
    const referer = headers.get('referer') || '';

    const requestedSiteIdentifier = headers.get('X-Site-Identifier') ?? '';
    const requestedSiteDebugKey = headers.get('X-Site-Debug-Key') ?? '';

    // Detect if the request is being accessed through a browser
    const isBrowserAccess =
        userAgent.includes('Mozilla/') && (referer || origin);

    if (isBrowserAccess) {
        console.warn('Request accessed via browser URL.');
    } else {
        console.info('Request accessed programmatically.');
    }

    // Define CORS response headers
    const corsOptions = {
        'Access-Control-Allow-Methods': allowedMethods,
        'Access-Control-Allow-Headers': allowedHeaders,
    };

    // Check if the request origin is allowed
    const isAllowedOrigin = allowedOrigins.some((ao) => ao.includes(origin));

    // If the origin is not allowed, return a 403 response
    if (!isAllowedOrigin) {
        return new Response('CORS Origin Not Allowed', { status: 403 });
    }

    // Set CORS headers for valid requests
    response.headers.set('Access-Control-Allow-Origin', origin);
    Object.entries(corsOptions).forEach(([key, value]) =>
        response.headers.set(key, value)
    );

    // Define blocked user agents from constants
    const blockedUserAgents = middlewareConstants.blockedUserAgents;
    const isBlockedUserAgent = blockedUserAgents.some((ua) =>
        userAgent.includes(ua)
    );

    // Check if the requested site identifier matches the allowed identifier
    const isBlockedSite = requestedSiteIdentifier !== allowedSiteIdentifier;

    // Check if the user agent matches the debug allowed user agent
    const isDebugUserAgent = userAgent.includes(allowedUserAgentForDebug);

    // Determine if the request is blocked
    const isBlockedRequest = isBlockedUserAgent || isBlockedSite;

    // Check if the debug key matches the requested site debug key
    const isDebugAuthorized = debugKey === requestedSiteDebugKey;

    // Determine if the request is allowed for debug purposes
    const isRequestAllowedForDebug =
        isDebugUserAgent &&
        isAllowedOrigin &&
        !isBlockedSite &&
        isDebugAuthorized;

    if (!isRequestAllowedForDebug) {
        // If the request is blocked, return a 403 response
        if (isBlockedRequest) {
            return new Response('Access Denied', {
                status: httpStatusConstants.FORBIDDEN,
            });
        }
    }

    // Return the response for valid requests
    return response;
};

export default corsMiddleware;
