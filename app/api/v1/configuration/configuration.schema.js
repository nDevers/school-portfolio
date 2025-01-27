'use strict';

import { z } from 'zod';

import schemaShared from '@/shared/schema.shared';
import configurationConstants from '@/app/api/v1/configuration/configuration.constants';
import constants from '@/constants/constants';

const {
    nonEmptyString,
    validDate,
    filesValidator,
    validEmailArray,
    validMobileNumberArray,
    validUrlArray,
} = schemaShared;
const {
    nameMaxCharacter,
    addressMaxCharacter,
    allowedMimeTypes,
    allowedLogoFileSize,
    allowedBannerFileSize,
} = configurationConstants;

/**
 * Represents a non-empty string used as a configuration name.
 * Ensures that the string is not empty and adheres to the maximum allowed character limit.
 *
 * @param {string} description - A brief description of the intended string purpose.
 * @param {number} nameMaxCharacter - The maximum number of characters allowed for the string.
 * @throws {Error} If the string is empty or exceeds the maximum character limit.
 * @returns {string} A validated configuration name.
 */
const name = nonEmptyString('Configuration name', nameMaxCharacter);

/**
 * Represents a non-empty string that provides a description of the configuration.
 * The value is expected to be a non-empty string and serves as metadata or
 * explanation for the associated configuration.
 */
const description = nonEmptyString('Configuration description');

/**
 * Represents the configuration for a logo file validation process.
 * This validation ensures that the provided file adheres to specified constraints, including
 * acceptable MIME types, file size limits, and the expected number of files to be processed.
 *
 * The function `filesValidator` is used to create this validation, and the parameters define the rules:
 * - The description of the file validation process ("Configuration logo").
 * - The allowable MIME types for the logo.
 * - The maximum allowed file size for the logo file.
 * - The minimum number of files required.
 * - The maximum number of files allowed.
 *
 * The variable `logo` stores this specific configuration for validating logo files.
 */
const logo = filesValidator(
    'Configuration logo',
    allowedMimeTypes,
    allowedLogoFileSize,
    1,
    1
);

/**
 * The `banner` variable represents a configuration option for file validation applied to a banner file.
 * It utilizes the `filesValidator` function to specify validation rules for files associated with the banner.
 *
 * Details:
 * - Description: "Configuration banner".
 * - Allowed Mime Types: Restricts the file to specific mime types defined by `allowedMimeTypes`.
 * - File Size Limit: Validates the file size based on the value set in `allowedBannerFileSize`.
 * - Minimum Files: Requires at least 1 file to be selected.
 * - Maximum Files: Allows a maximum of 1 file to be uploaded.
 * - Optional: This field is marked as optional.
 */
const banner = filesValidator(
    'Configuration banner',
    allowedMimeTypes,
    allowedBannerFileSize,
    1,
    1
).optional();

/**
 * Represents the configuration address.
 *
 * This variable holds a non-empty string value representing a configuration address.
 * The value must be validated to ensure it is non-empty and does not exceed the
 * maximum allowed character limit.
 *
 * @type {string}
 */
const address = nonEmptyString('Configuration address', addressMaxCharacter);

/**
 * Represents a collection of validated email addresses retrieved from the given configuration description.
 *
 * @constant
 * @type {Array<string>}
 */
const emails = validEmailArray('Configuration emails');

/**
 * Represents the validated list of contact mobile numbers for configuration.
 *
 * @variable {Array} contacts
 * @description This variable holds an array of valid mobile phone numbers that are utilized for the
 * configuration of contacts. The provided numbers are expected to pass validation for proper formatting
 * and adherence to mobile number standards.
 *
 * @function validMobileNumberArray
 * @param {string} description - Details or context for the contacts, in this case, "Configuration contacts".
 * @returns {Array} Returns an array containing only mobile numbers that have been verified as valid.
 */
const contacts = validMobileNumberArray('Configuration contacts');

/**
 * An array containing configuration values for social media links.
 *
 * This variable is typically used to store valid URLs pointing to various
 * social media profiles or platforms associated with the configured
 * application or entity.
 *
 * This variable is initialized and validated using the `validUrlArray` function.
 */
const socialLinks = validUrlArray('Configuration social links', [
    constants.facebookUrlRegex,
    constants.instagramUrlRegex,
    constants.xUrlRegex,
    constants.linkedinUrlRegex,
]);

/**
 * A schema definition for validating and enforcing the structure of an object.
 *
 * The `createSchema` variable is designed to ensure that the provided object adheres strictly
 * to the specified properties. Any additional or missing properties will result in a validation error.
 *
 * Properties:
 * - name: Represents the name of the entity.
 * - description: Contains a detailed description of the entity.
 * - logo: Defines the logo associated with the entity.
 * - banner: Specifies the banner image for the entity.
 * - address: Denotes the address related to the entity.
 * - emails: Represents one or more email addresses associated with the entity.
 * - contacts: Holds contact information for the entity.
 * - socialLinks: Defines the social media links related to the entity.
 *
 * The `strict()` modifier enforces that only the specified properties are allowed.
 */
const createSchema = z
    .object({
        name,
        description,
        logo,
        banner,
        address,
        emails,
        contacts,
        socialLinks,
    })
    .strict(); // Enforce strict mode to disallow extra fields

/**
 * Represents a schema definition object for validating query parameters using the Zod library.
 * This schema ensures the query object adheres to strict rules by only allowing the specified properties.
 *
 * Properties:
 * - `name` (optional): Represents the name field, which is an optional property.
 * - `description` (optional): Represents the description field, which is an optional property.
 * - `createdAt` (optional): Validates the configuration creation time as a date. This field is optional.
 * - `updatedAt` (optional): Validates the configuration's last update time as a date. This field is optional.
 */
const getDataByQuery = z
    .object({
        name: name.optional(),
        description: description.optional(),
        createdAt: validDate('Configuration creation time').optional(),
        updatedAt: validDate('Configuration last update time').optional(),
    })
    .strict(); // Enforce strict mode to disallow extra fields

/**
 * `updateSchema` defines a schema for validating updates to an entity using the `zod` library.
 * The schema enforces strict mode to disallow additional or unexpected fields.
 *
 * Fields:
 * - `name`: Optional field to specify the name of the entity.
 * - `description`: Optional field to provide a description for the entity.
 * - `logo`: Optional field to include a logo URL or file reference.
 * - `banner`: Optional field to include a banner URL or file reference.
 * - `address`: Optional field to specify the address of the entity.
 * - `emails`: Optional field to include email information associated with the entity.
 * - `contacts`: Optional field to define contact details.
 * - `socialLinks`: Optional field to include social media link information.
 *
 * Validation Rules:
 * - Enforces that at least two fields are provided, where one must be an identifier (`id`) and the other could be, for instance, "name" or "description".
 * - If the schema validation fails, a specific error message is returned: "At least one of 'name' or 'description' is required along with 'id'."
 */
const updateSchema = z
    .object({
        name: name.optional(),
        description: description.optional(),
        logo: logo.optional(),
        banner: banner.optional(),
        address: address.optional(),
        emails: emails.optional(),
        contacts: contacts.optional(),
        socialLinks: socialLinks.optional(),
        // deleteEmails: emails.optional(),
        // deleteContacts: contacts.optional(),
        // deleteSocialLinks: socialLinks.optional(),
    })
    .strict() // Enforce strict mode to disallow extra fields
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message:
                'At least one of "name" or "description" is required along with "id".',
        }
    );

/**
 * Represents the configuration schema object with various utility functions
 * to manage and interact with schema-related operations.
 *
 * @typedef {Object} configurationSchema
 * @property {Function} createSchema - Function to create a new schema.
 * @property {Function} getDataByQuery - Function to retrieve data by executing queries on the schema.
 * @property {Function} updateSchema - Function to update an existing schema.
 */
const configurationSchema = {
    createSchema,
    getDataByQuery,
    updateSchema,
};

export default configurationSchema;
