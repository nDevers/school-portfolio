'use strict';

import sharedResponseTypes from '@/shared/shared.response.types';

import getContentType from '@/util/getContentType';

const { UNSUPPORTED_MEDIA_TYPE } = sharedResponseTypes;

/**
 * Validates the content type of a request against a list of allowed content types.
 *
 * This function checks if the content type of the provided request matches any of the
 * content types specified in the allowedContentTypes array. If the content type is not allowed,
 * it returns an object indicating the validation failure and an appropriate response. Otherwise,
 * it returns an object indicating successful validation.
 *
 * @param {Object} request - The request object containing information about the client's request.
 * @param {Array<string>} allowedContentTypes - An array of allowed content type strings to validate against.
 * @returns {Object} An object containing the validation result and, if invalid, a response indicating the unsupported content type.
 */
const validateUnsupportedContent = (request, allowedContentTypes) => {
    const contentType = getContentType(request);

    const isValid = allowedContentTypes.some((type) =>
        contentType.includes(type)
    );
    if (!isValid) {
        // Return early with a response if content type is unsupported
        return {
            isValid: false,
            response: UNSUPPORTED_MEDIA_TYPE(
                `Unsupported Content-Type: ${contentType}`,
                request
            ),
        };
    }
    return { isValid: true };
};

export default validateUnsupportedContent;
