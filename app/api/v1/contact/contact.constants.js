'use strict';

import contentTypesConstants from '@/constants/contentTypes.constants';

/**
 * A constant that defines the allowed content types for a specific application or module.
 * This variable is typically used to restrict or validate the types of content that can be processed or accepted.
 * The content types are defined as constants within the `contentTypesConstants` module.
 */
const allowedContentTypes = [contentTypesConstants.JSON];

/**
 * An object that holds constants related to contact configurations.
 *
 * Properties:
 * - `allowedContentTypes`: Specifies the allowed content types.
 */
const contactConstants = {
    allowedContentTypes,
};

export default contactConstants;
