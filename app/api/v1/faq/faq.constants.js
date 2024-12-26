'use strict';

import contentTypesConstants from '@/constants/contentTypes.constants';

/**
 * An array that defines the content types allowed for a specific operation or request.
 * This variable is used to restrict or validate the types of content processed or accepted.
 *
 * The values in the array are derived from predefined constants,
 * ensuring consistency and reducing the chance of errors from hardcoding.
 *
 * Contains a single value of `JSON` content type from `contentTypesConstants`.
 */
const allowedContentTypes = [contentTypesConstants.JSON];

/**
 * Represents the maximum number of characters allowed for a question.
 * This value is used to enforce a character limit on question inputs.
 * It helps maintain a consistent length for question strings.
 *
 * @type {number}
 */
const questionMaxCharacter = 100;

/**
 * Represents constants used throughout the FAQ module.
 *
 * @typedef {Object} faqConstants
 * @property {Array<string>} allowedContentTypes - A list of allowed content types for the FAQ.
 * @property {number} questionMaxCharacter - The maximum number of characters allowed for a question.
 */
const faqConstants = {
    allowedContentTypes,
    questionMaxCharacter,
};

export default faqConstants;
