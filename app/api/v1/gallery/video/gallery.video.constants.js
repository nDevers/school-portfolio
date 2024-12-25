import contentTypesConstants from "@/constants/contentTypes.constants";

/**
 * An array defining the content types that are permitted in a specific context.
 * It is used to enforce and validate the type of content being processed or received.
 * The array values are derived from predefined constants in `contentTypesConstants`.
 */
const allowedContentTypes = [contentTypesConstants.JSON];

/**
 * Represents the maximum number of characters allowed in a question.
 * This variable is used to enforce a limit on the length of questions
 * to maintain consistency and ensure readability.
 *
 * @type {number}
 */
const questionMaxCharacter = 100;

/**
 * An object containing constants related to gallery video configurations.
 *
 * @constant {Object} galleryVideoConstants
 * @property {Array} allowedContentTypes - Specifies the list of acceptable video content types.
 * @property {number} questionMaxCharacter - Indicates the maximum number of characters allowed for a question.
 */
const galleryVideoConstants = {
    allowedContentTypes,
    questionMaxCharacter,
};

export default galleryVideoConstants;
