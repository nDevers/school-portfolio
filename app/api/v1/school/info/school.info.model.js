'use strict';

import { Schema, model, models } from 'mongoose';

import schemaModelShared from '@/shared/schema.model.shared';

const { requiredString } = schemaModelShared;

/**
 * Represents the schema definition for an FAQ (Frequently Asked Questions) entry in a database.
 *
 * The schema includes the following properties:
 * - question: Stores the FAQ question as a string, which is required.
 * - answer: Stores the FAQ answer as a string, which is required.
 *
 * The schema also includes automatic timestamp fields:
 * - createdAt: Records the date and time when the document was created.
 * - updatedAt: Records the date and time when the document was last updated.
 */
const faqSchema = new Schema(
    {
        question: requiredString('FAQ question'),
        answer: requiredString('FAQ answer'),
    },
    { timestamps: true }
);

/**
 * Represents the model for managing school information FAQs.
 *
 * SchoolInfoModel is used to interact with the FAQs collection in the database.
 * It either retrieves an existing model or defines a new one using the provided schema.
 */
const SchoolInfoModel = models.Faqs || model('Faqs', faqSchema);

export default SchoolInfoModel;
