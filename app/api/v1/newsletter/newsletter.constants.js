'use strict';

import contentTypesConstants from '@/constants/contentTypes.constants';

/**
 * A constant defining the allowed content types for a specific operation or configuration.
 *
 * This variable contains a predefined list of content types that are permitted. These content
 * types typically define the format of data that the application can accept or process.
 *
 * @type {Array}
 */
const allowedContentTypes = [contentTypesConstants.JSON];

/**
 * An object containing constants related to the newsletter functionality.
 *
 * @property {Array<string>} allowedContentTypes - An array of content types that are permitted
 *                                                 to be included in the newsletter.
 */
const newsletterConstants = {
    allowedContentTypes,
};

export default newsletterConstants;
