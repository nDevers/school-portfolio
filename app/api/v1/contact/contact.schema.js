import { z } from 'zod';

import schemaShared from "@/shared/schema.shared";

const { nonEmptyString, validEmail } = schemaShared;

/**
 * Represents the schema for validating a contact form's data using Zod.
 *
 * The `contactSchema` enforces a strict structure for the contact information, ensuring
 * that all required fields are present and adhere to the expected validation rules.
 *
 * - `name`: Requires a non-empty string representing the contact's name.
 * - `email`: Validates a properly formatted email address.
 * - `subject`: Requires a non-empty string for the contact subject.
 * - `message`: Requires a non-empty string for the contact message.
 *
 * The schema is configured to be strict, meaning no additional fields beyond
 * the defined ones are allowed.
 */
const contactSchema = z
    .object({
        name: nonEmptyString('Contact name'),
        email: validEmail('Contact email'),
        subject: nonEmptyString('Contact subject'),
        message: nonEmptyString('Contact message'),
    })
    .strict() // Enforce strict mode to disallow extra fields

export default contactSchema;
