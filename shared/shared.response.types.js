import httpStatusConstants from "@/constants/httpStatus.constants";

import sendResponse from "@/util/sendResponse";

const CREATED = (message, date, request) => sendResponse(
    true,
    httpStatusConstants.CREATED,
    message,
    date,
    request
);

const OK = (message, date, request) => sendResponse(
    true,
    httpStatusConstants.OK,
    message,
    date,
    request
);

const INTERNAL_SERVER_ERROR = (message, request) => sendResponse(
    false,
    httpStatusConstants.INTERNAL_SERVER_ERROR,
    message,
    {},
    request
);

const CONFLICT = (message, request) => sendResponse(
    false,
    httpStatusConstants.CONFLICT,
    message,
    {},
    request
);

const NOT_FOUND = (message, request) => sendResponse(
    false,
    httpStatusConstants.NOT_FOUND,
    message,
    {},
    request
);

const BAD_REQUEST = (message, request) => sendResponse(
    false,
    httpStatusConstants.NOT_FOUND,
    message,
    {},
    request
);

const UNAUTHORIZED = (message, request) => sendResponse(
    false,
    httpStatusConstants.UNAUTHORIZED,
    message,
    {},
    request
);

const FORBIDDEN = (message, request) => sendResponse(
    false,
    httpStatusConstants.FORBIDDEN,
    message,
    {},
    request
);

const UNSUPPORTED_MEDIA_TYPE = (message, request) => sendResponse(
    false,
    httpStatusConstants.UNSUPPORTED_MEDIA_TYPE,
    message,
    {},
    request
);

const sharedResponseTypes = {
    CREATED,
    OK,
    INTERNAL_SERVER_ERROR,
    CONFLICT,
    NOT_FOUND,
    BAD_REQUEST,
    UNAUTHORIZED,
    FORBIDDEN,
    UNSUPPORTED_MEDIA_TYPE,
};

export default sharedResponseTypes;