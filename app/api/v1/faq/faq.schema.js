import { z } from 'zod';

import schemaShared from "@/shared/schema.shared";

// Define reusable schema parts
const { nonEmptyString, validMongooseId, validDate } = schemaShared;

const question = nonEmptyString('Faq question');
const answer = nonEmptyString('Faq answer');
const id = validMongooseId('Status ID');

// Define the Zod validation schema
const createSchema = z.object({
    question,
    answer,
}).strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const getDataByQuery = z.object({
    id: id.optional(),
    question: question.optional(),
    answer: answer.optional(),
    createdAt: validDate('Creation time').optional(),
    updatedAt: validDate('last update time').optional(),
}).strict(); // Enforce strict mode to disallow extra fields

// Define the Zod validation schema
const updateSchema = z.object({
    id,
    question: question.optional(),
    answer: answer.optional(),
})
    .strict() // Enforce strict mode to disallow extra fields
    .refine(
        (data) => Object.keys(data).length > 1, // Must include `id` and at least one other field
        {
            message: 'At least one of "question" or "answer" is required along with "id".',
        }
    );

const faqSchema = {
    createSchema,
    getDataByQuery,
    updateSchema,
};

export default faqSchema;
