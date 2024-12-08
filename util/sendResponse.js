import httpStatusConstants from "@/constants/httpStatus.constants";
import contentTypesConstants from "@/constants/contentTypes.constants";
import logger from "@/lib/logger";

import getCallerFunctionName from "@/util/getCallerFunctionName";
import getDeviceType from "@/util/getDeviceType";

const sendResponse = (
    success,
    status = httpStatusConstants.OK,
    message,
    data = {},
    request,
    headers = { "Content-Type": contentTypesConstants.JSON },
    functionName = getCallerFunctionName(),
) => {
  // Detecting device type from User-Agent
  const userAgent = request.headers.get('User-Agent') || '';
  const deviceType = getDeviceType(userAgent);

  // Detecting timezone from headers, if available
  const timezone = request.headers.get('Time-Zone') || Intl.DateTimeFormat().resolvedOptions().timeZone;

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
