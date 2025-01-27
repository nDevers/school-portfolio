import { fetchDataAsServer } from './axios';

/**
 * Fetches data from a specified API endpoint and extracts specific fields if provided.
 *
 * @param {string} api - The API endpoint URL from which to fetch data.
 * @param {string[]} fields - An array of field names to extract from the fetched data. If not provided or empty, the full response data is returned.
 * @return {Object|null} Returns the full response data or an object containing only the specified fields. Returns null in case of an error.
 */
export default async function getSpecificApiData(api, fields) {
    try {
        // Fetch data from the provided API endpoint
        const responseData = await fetchDataAsServer(api);

        // If `fields` is not an array or is empty, return the full response data
        if (!Array.isArray(fields) || fields.length === 0) {
            return responseData;
        }

        // Extract only the specified fields from the response data
        const extractedData = {};
        fields.forEach((field) => {
            if (Object.prototype.hasOwnProperty.call(responseData, field)) {
                extractedData[field] = responseData[field];
            }
        });

        return extractedData;
    } catch (error) {
        console.error('Error fetching data from API:', error);
        return null; // or handle error appropriately
    }
}
