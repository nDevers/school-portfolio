import { z } from 'zod';

import schemaShared from "@/shared/schema.shared";

// Define reusable schema parts
const { validEmail } = schemaShared;

// Define the Zod validation schema based on the Mongoose model
const newsletterSchema = z
    .object({
        email: validEmail('Newsletter email'),
    })
    .strict() // Enforce strict mode to disallow extra fields

export default newsletterSchema;
