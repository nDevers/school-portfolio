import { z } from 'zod';

import schemaShared from "@/shared/schema.shared";
import configurationConstants from "@/app/api/v1/configuration/configuration.constants";

// Define reusable schema parts
const { nonEmptyString, nonEmptyStringArray, validMongooseId, validDate, filesValidator, validEmailArray, validMobileNumberArray, validUrlArray } = schemaShared;
const { nameMaxCharacter, addressMaxCharacter, allowedMimeTypes, allowedLogoFileSize, allowedBannerFileSize } = configurationConstants;

const name = nonEmptyString('Configuration name', nameMaxCharacter);
const description = nonEmptyString('Configuration description');
const logo = filesValidator('Configuration logo', allowedMimeTypes, allowedLogoFileSize, 1, 1);
const banner = filesValidator('Configuration banner', allowedMimeTypes, allowedBannerFileSize, 1, 1).optional();
const address = nonEmptyString('Configuration address', addressMaxCharacter);
const emails = validEmailArray('Configuration emails');
const contacts = validMobileNumberArray('Configuration contacts');
const socialLinks = validUrlArray('Configuration social links');

// Define the Zod validation schema
const createSchema = z.object({
    name,
    description,
    logo,
    banner,
    address,
    emails,
    contacts,
    socialLinks,
}).strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const getDataByQuery = z.object({
    name: name.optional(),
    description: description.optional(),
    createdAt: validDate('Configuration creation time').optional(),
    updatedAt: validDate('Configuration last update time').optional(),
}).strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const updateSchema = z.object({
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
            message: 'At least one of "name" or "description" is required along with "id".',
        }
    );

const configurationSchema = {
    createSchema,
    getDataByQuery,
    updateSchema,
};

export default configurationSchema;
