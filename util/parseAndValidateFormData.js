'use strict';

import { BadRequestError } from '@/util/asyncHandler';

import logger from '@/lib/logger';
import contentTypesConstants from '@/constants/contentTypes.constants';

import prepareFormDataForLogging from '@/util/prepareFormDataForLogging';
import getQueryParams from '@/util/getQueryParams';
import toSentenceCase from '@/util/toSentenceCase';
import convertToObjectId from '@/util/convertToObjectId';

/**
 * Retrieves the value of a deeply nested field within an object using a dot-separated path.
 *
 * This function takes an object and a string representing the path to a nested field.
 * The path is a dot-separated string indicating the hierarchy of keys to traverse.
 * If the field exists, its value is returned. If any of the keys in the path are
 * not found or the object is not defined at any level, the function returns `undefined`.
 *
 * @param {Object} obj - The object to traverse for the nested field.
 * @param {string} path - A dot-separated string indicating the path to the desired field.
 * @returns {*} The value of the nested field if found; otherwise, `undefined`.
 */
const getNestedField = (obj, path) =>
    path.split('.').reduce((o, key) => o?.[key], obj);

/**
 * Sets a nested field in an object at a specified dot-separated path.
 * If the field at the final key already exists, values are merged into an array.
 * Intermediate keys in the path are created if they do not exist.
 *
 * @param {Object} obj - The target object where the nested field will be set.
 * @param {string} path - The string representing the nested key path, with keys separated by dots.
 * @param {*} value - The value to set at the specified nested field.
 */
const setNestedField = (obj, path, value) => {
    path.split('.').reduce((o, key, idx, arr) => {
        if (idx === arr.length - 1) {
            o[key] = o[key] !== undefined ? [].concat(o[key], value) : value;
        } else {
            o[key] = o[key] || {};
        }
        return o[key];
    }, obj);
};

/**
 * Asynchronously parses and validates form data or JSON payload from an incoming request.
 * Ensures that the data is properly structured and matches a defined schema.
 * Supports both JSON and multipart FormData content types.
 *
 * @param {Request} request - The HTTP request object containing the data to be parsed and validated.
 * @param {Object} context - The context for the request, containing any route-specific parameters.
 * @param {string} mode - The mode of operation, typically 'create', 'update', or general validation.
 * @param {Function|Object} schema - A validation schema function or object used to validate the parsed data.
 * @returns {Promise<Object>} A Promise resolving to a structured and validated data object.
 * @throws {BadRequestError} Throws if the request body is invalid, empty, or contains unsupported content types.
 */
const parseAndValidateFormData = async (request, context, mode, schema) => {
    const { params } = context;
    const arrayFields = {};
    const contentType = request.headers.get('Content-Type');

    let data = {};
    let userInput = {};

    if (contentType?.includes(contentTypesConstants.JSON)) {
        try {
            data = await request.json();
            if (
                (mode === 'create' || mode === 'update') &&
                !Object.keys(data).length
            ) {
                throw new BadRequestError(
                    'Request body is empty, expected data in JSON format.'
                );
            }
        } catch {
            throw new BadRequestError(
                'Invalid JSON body or empty request body.'
            );
        }
    } else if (
        contentType?.includes(contentTypesConstants.FORM_DATA) &&
        typeof request.formData === 'function'
    ) {
        const formData = await request.formData();
        formData.forEach((value, key) => {
            const arrayFieldMatch = key.match(/^(\w+\[\d+\])(?:\.(\w+))?$/); // Updated regex to support nested fields
            if (arrayFieldMatch) {
                const [, fieldName, propName] = arrayFieldMatch;
                const [field, index] = fieldName.split('[');
                arrayFields[field] = arrayFields[field] || [];
                arrayFields[field][index] = arrayFields[field][index] || {};
                if (propName) {
                    arrayFields[field][index][propName] = value;
                } else {
                    Object.assign(arrayFields[field][index], value);
                }
            } else if (value instanceof File) {
                userInput[key] = userInput[key] || [];
                userInput[key].push(value);
            } else {
                setNestedField(userInput, key, value);
            }
        });

        Object.keys(arrayFields).forEach((key) => {
            userInput[key] = arrayFields[key];
        });
    } else if (contentType !== null) {
        throw new BadRequestError('Unsupported content type');
    }

    data = { ...data, ...params?.query, ...params };
    logger.info(
        `Request: ${JSON.stringify(await prepareFormDataForLogging(data, { query: params?.query || {}, params }))}`
    );

    if (mode === 'create') {
        Object.keys(data).forEach((key) => {
            const value = getNestedField(data, key);
            if (value === undefined)
                throw new BadRequestError(
                    `Got undefined data in field: ${key}`
                );
            setNestedField(userInput, key, value);
        });
    } else if (mode === 'update') {
        Object.keys(data).forEach((key) => {
            const value = getNestedField(data, key);
            if (value !== undefined) setNestedField(userInput, key, value);
        });
    } else if (!Object.keys(data).length) {
        // throw new BadRequestError('Invalid request data');
    }

    ['id', 'email', 'categoryParams', 'type'].forEach((field) => {
        if (data[field]) userInput[field] = data[field];
    });

    const queryParams = getQueryParams(
        new URLSearchParams(new URL(request.url).search)
    );
    if (Object.keys(queryParams).length) {
        userInput = { ...userInput, ...queryParams };
        userInput.query = { ...queryParams };
    }

    if (typeof schema === 'function') {
        schema(toSentenceCase(params?.categoryParams.replace(/_/g, ' '))).parse(
            userInput
        );
    } else {
        schema.parse(userInput);
    }

    if (userInput['id']) {
        userInput.id = convertToObjectId(userInput.id);
    }

    return userInput;
};

export default parseAndValidateFormData;
