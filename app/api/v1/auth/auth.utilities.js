import sharedResponseTypes from "@/shared/shared.response.types";

const { UNAUTHORIZED, OK } = sharedResponseTypes;

// Utility function for unauthorized response
const unauthorizedResponse = (message, request) => {
    return UNAUTHORIZED(message, request);
};

// Utility function for authorized response
const authorizedResponse = (message, returnData, request) => {
    return OK(
        message,
        returnData,
        request
    );
};

const authUtilities = {
    unauthorizedResponse,
    authorizedResponse,
};

export default authUtilities;
