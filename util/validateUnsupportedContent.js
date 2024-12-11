import sharedResponseTypes from "@/shared/shared.response.types";

import getContentType from "@/util/getContentType";

const { UNSUPPORTED_MEDIA_TYPE } = sharedResponseTypes;

const validateUnsupportedContent = (request, allowedContentTypes) => {
    const contentType = getContentType(request);

    const isValid = allowedContentTypes.some((type) => contentType.includes(type));
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