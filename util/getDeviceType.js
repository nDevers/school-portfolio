// Helper function to detect device type from User-Agent
/**
 * Determines the device type based on the user agent string.
 *
 * @param {string} userAgent - The user agent string to be analyzed.
 * @returns {string} - The type of device: 'Mobile', 'Tablet', or 'Desktop'.
 */
const getDeviceType = (userAgent) => {
    if (/mobile/i.test(userAgent)) return 'Mobile';
    if (/tablet/i.test(userAgent)) return 'Tablet';
    return 'Desktop';
};

export default getDeviceType;
