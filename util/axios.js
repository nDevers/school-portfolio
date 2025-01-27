import axios from 'axios';
import { toast } from 'sonner';
import { setCookie } from 'cookies-next';

import apiConfig from '@/configs/apiConfig';
import appConfig from '@/configs/appConfig';

import { getRefreshTokenFromCookie, getTokenFromCookie, logout } from './auth';
// import getEnvironmentData from '@/util/getEnvironmentData';

const NEXT_PUBLIC_TIMEOUT_IN_MILI_SECONDS = parseInt(
    process.env.NEXT_PUBLIC_TIMEOUT_IN_MILI_SECONDS
);
const NEXT_PUBLIC_AUTH_X_SITE_IDENTIFIER =
    process.env.NEXT_PUBLIC_AUTH_X_SITE_IDENTIFIER;

const axiosInstance = axios.create({
    baseURL: apiConfig?.BASE_URL,
    timeout: NEXT_PUBLIC_TIMEOUT_IN_MILI_SECONDS,
    headers: {
        // 'Content-Type': 'application/json',
        'X-Site-Identifier': NEXT_PUBLIC_AUTH_X_SITE_IDENTIFIER,
    },
});

const refreshAxiosInstance = axios.create({
    baseURL: apiConfig?.BASE_URL,
    timeout: NEXT_PUBLIC_TIMEOUT_IN_MILI_SECONDS,
    headers: {
        // 'Content-Type': 'application/json',
        'X-Site-Identifier': NEXT_PUBLIC_AUTH_X_SITE_IDENTIFIER,
    },
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = getTokenFromCookie();
        if (token) config.headers['Authorization'] = `Bearer ${token}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

refreshAxiosInstance.interceptors.request.use(
    async (config) => {
        const refreshToken = getRefreshTokenFromCookie();
        if (refreshToken)
            config.headers['Authorization'] = `Bearer ${refreshToken}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const getMessageFromResponse = (response) => {
    if (response?.data?.message) {
        return response.data.message;
    }

    // Fallback if the "message" field is not present
    return 'No response from server';
};

export const handleAxiosError = (error) => {
    if (axios.isCancel(error)) {
        toast.warning('Request was canceled.');
        return;
    }

    if (error.code === 'ECONNABORTED') {
        toast.error('Request timed out. Please try again.');
        return; // Stop further execution
    }

    if (error.response) {
        const code = error.response.status;
        const errorMessage =
            error.response?.data?.data?.message ||
            error.response?.data?.message;

        if (code === 401) {
            logout(true);
        }

        if (code === 404) {
            return []; // Handle 404 differently, return empty array
        }

        toast.error(`Server error: ${code} - ${errorMessage}`);
    } else if (error.request) {
        toast.error('Network error: No response received from server.');
    } else {
        toast.error(`Axios error: ${error.message}`);
    }

    throw error; // Propagate the error for further handling
};

export const handleAxiosErrorAsServer = (error) => {
    if (axios.isCancel(error)) {
        console.warn('Request was canceled.');
        return null;
    }

    if (error.code === 'ECONNABORTED') {
        console.error('Request timed out. Please try again later.');
        return null; // Stop further execution
    }

    if (error.response) {
        const code = error.response.status;
        const errorMessage = error.response?.data?.message;

        if (code === 404) {
            console.warn(
                `Resource not found (404): ${errorMessage || 'No additional message'}`
            );
            return null; // Return null for missing data
        } else {
            console.error(`Server error: ${code} - ${errorMessage}`);
            return null;
        }
    } else if (error.request) {
        console.error('Network error: No response received from server.');
    } else {
        console.error(`Axios error: ${error.message}`);
    }

    throw error; // Propagate error if necessary
};

export async function fetchData(endpoint) {
    try {
        const response = await axiosInstance.get(endpoint);
        return response?.data?.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function fetchDataAsServer(endpoint) {
    try {
        const response = await axiosInstance.get(endpoint);
        return response?.data?.data;
    } catch (error) {
        handleAxiosErrorAsServer(error);
    }
}

export async function postData(endpoint, data, isFileRequest = false) {
    try {
        const isFormData = data instanceof FormData;
        const requestData = isFormData ? data : JSON.stringify({ ...data });

        const headers = isFormData
            ? { 'Content-Type': 'multipart/form-data' }
            : { 'Content-Type': 'application/json' };

        // If the request is for a file, we set the responseType to 'blob'
        const config = isFileRequest
            ? { headers, responseType: 'blob' }
            : { headers };

        const response = await axiosInstance.post(
            endpoint,
            requestData,
            config
        );

        // If it's a file request, we don't return a success toast, just return the file
        if (isFileRequest) {
            return response.data; // This will be the Blob
        }

        const message = getMessageFromResponse(response);
        toast.success(message);
        return response?.data?.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function updateData(endpoint, data) {
    try {
        const isFormData = data instanceof FormData;
        const requestData = isFormData ? data : JSON.stringify({ ...data });

        const headers = isFormData
            ? { 'Content-Type': 'multipart/form-data' }
            : { 'Content-Type': 'application/json' };

        const response = await axiosInstance.patch(endpoint, requestData, {
            headers,
        });

        const message = getMessageFromResponse(response);
        toast.success(message);
        return response?.data?.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function deleteData(endpoint, id) {
    const url = endpoint + id;
    try {
        const response = await axiosInstance.delete(url);

        const message = getMessageFromResponse(response);
        toast.success(message);
        return response?.data?.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

// async function axiosRefreshToken() {
//     const refreshToken = getRefreshTokenFromCookie();
//     if (!refreshToken) return;
//
//     try {
//         const response = await refreshAxiosInstance.get(
//             apiConfig.REFRESH_TOKEN
//         );
//         const { accessToken, refreshToken: newRefreshToken } =
//             response?.data?.data || {};
//
//         if (accessToken)
//             setCookie(appConfig.CurrentUserToken, accessToken, { path: '/' });
//         if (newRefreshToken)
//             setCookie(appConfig.CurrentUserRefToken, newRefreshToken, {
//                 path: '/',
//             });
//     } catch (error) {
//         console.error('Error refreshing token:', error.message);
//         handleAxiosError(error);
//         throw error;
//     }
// }

// (async () => {
//     await axiosRefreshToken();
//
//     // setInterval(axiosRefreshToken, parseInt(getEnvironmentData('NEXT_PUBLIC_REFRESH_TOKEN_INTERVAL'), 10));
//     setInterval(axiosRefreshToken, 60000);
// })();

export default axiosInstance;
