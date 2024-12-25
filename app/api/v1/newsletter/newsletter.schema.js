import { z } from 'zod';

import schemaShared from '@/shared/schema.shared';

const { validEmail } = schemaShared;

/**
 * Schema representation for the newsletter subscription input validation.
 *
 * This schema defines the structure and validation rules for newsletter subscription requests.
 * It ensures that the input object conforms to a strict structure with the required fields.
 *
 * Structure:
 * - Requires an `email` field that is validated using the `validEmail` function for proper email format.
 *
 * This schema is intended to validate user inputs for subscribing to a newsletter.
 */
const newsletterSchema = z
    .object({
        email: validEmail('Newsletter email'),
    })
    .strict(); // Enforce strict mode to disallow extra fields

export default newsletterSchema;
