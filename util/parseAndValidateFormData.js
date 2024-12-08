import { BadRequestError } from "@/util/asyncHandler";

import logger from "@/lib/logger";
import contentTypesConstants from "@/constants/contentTypes.constants";

import prepareFormDataForLogging from "@/util/prepareFormDataForLogging";
import convertToObjectId from "@/util/convertToObjectId";
import getQueryParams from "@/util/getQueryParams";

const getNestedField = (obj, path) => {
    return path.split('.').reduce((o, key) => (o ? o[key] : undefined), obj);
};

const setNestedField = (obj, path, value) => {
    path.split('.').reduce((o, key, idx, arr) => {
        if (idx === arr.length - 1) {
            if (o[key] !== undefined) {
                // Convert to array if key already exists
                if (Array.isArray(o[key])) {
                    o[key].push(value);
                } else {
                    o[key] = [o[key], value];
                }
            } else {
                o[key] = value;
            }
        } else {
            o[key] = o[key] || {};
        }
        return o[key];
    }, obj);
};

const parseAndValidateFormData = async (request, context, mode, schema) => {
    const { params } = context;

    let data = {};
    let userInput = {};
    const arrayFields = {}; // Temporary storage for indexed array fields

    // Automatically detect and parse JSON or FormData
    const contentType = request.headers.get('Content-Type');
    const method = request.method.toUpperCase();

    // if (method === 'GET' && contentType && contentType?.includes(contentTypesConstants.JSON) || contentType?.includes(contentTypesConstants.FORM_DATA)) {
    //     // Check if there is any body content
    //     throw new BadRequestError("GET request should not have a body.");
    // }

    if (contentType && contentType.includes(contentTypesConstants.JSON)) {
        try {
            data = await request.json();
            // Check if data is empty in JSON mode for "create" or "update" mode
            if ((mode === 'create' || mode === 'update') && Object.keys(data).length === 0) {
                throw new BadRequestError("Request body is empty, expected data in JSON format.");
            }
        } catch (error) {
            // Handle JSON parsing error, typically for an empty body
            throw new BadRequestError("Invalid JSON body or empty request body.");
        }
    } else if (contentType && contentType.includes(contentTypesConstants.FORM_DATA) && typeof request.formData === 'function') {
        const formData = await request.formData();
        formData.forEach((value, key) => {
            const arrayFieldMatch = key.match(/^(\w+)\[(\d+)]\[(\w+)]$/);

            if (arrayFieldMatch) {
                // Matches fields like "links[0][name]"
                const [, fieldName, index, propName] = arrayFieldMatch;

                // Initialize array if it doesn't exist
                if (!arrayFields[fieldName]) arrayFields[fieldName] = [];

                // Ensure the current index exists in the array
                if (!arrayFields[fieldName][index]) arrayFields[fieldName][index] = {};

                // Set the property for the object at this index
                arrayFields[fieldName][index][propName] = value;
            } else if (value instanceof File) {
                // Handle file input by placing directly into userInput
                if (!userInput[key]) {
                    userInput[key] = [];
                }
                userInput[key].push(value);
            } else {
                // Handle normal fields
                setNestedField(userInput, key, value);
            }
        });
    } else if (contentType === null) {
        // No content type, do nothing
    } else {
        throw new BadRequestError("Unsupported content type");
    }

    // Merge params and query data into the data object
    const queryAndParams = { query: params?.query || {}, params };
    data = { ...data, ...queryAndParams.query, ...queryAndParams.params };

    // Log the request data
    logger.info(`Request: ${JSON.stringify(await prepareFormDataForLogging(data, queryAndParams))}`);

    // "Create" mode validation: ensure fields are defined
    if (mode === 'create') {
        Object.keys(data).forEach((key) => {
            const value = getNestedField(data, key);

            if (value === undefined) throw new BadRequestError(`Got undefined data in field: ${key}`);

            setNestedField(userInput, key, value);
        });
    } else if (mode === 'update') {
        Object.keys(data).forEach((key) => {
            const value = getNestedField(data, key);
            if (value !== undefined) {
                setNestedField(userInput, key, value);
            }
        });
    } else {
        // Ensure at least one field is defined
        if (Object.keys(data).length < 0) {
            throw new BadRequestError('Invalid request data');
        }

        if (data.type) {
            userInput.type = data.type;
        }
    }

    if (data.id) {
        userInput.id = data.id;
    }

    if (data.categoryParams) {
        userInput.categoryParams = data.categoryParams;
    }

    // Assign array fields back to the main data object
    Object.keys(arrayFields).forEach((key) => {
        userInput[key] = arrayFields[key];
    });

    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);

    userInput = { ...userInput, ...getQueryParams(searchParams) };

    // Validate userInput with schema
    schema.parse(userInput);

    return userInput;
};

export default parseAndValidateFormData;