import { Schema, model, models } from 'mongoose';

import schemaModelShared from '@/shared/schema.model.shared';

const { requiredString } = schemaModelShared;

/**
 * Represents the schema definition for a FAQ (Frequently Asked Questions) document.
 * This schema contains the structure for the FAQ data, including the question and answer fields.
 *
 * @constant
 * @type {Schema}
 * @property {String} question - The text of the FAQ question. This field is required.
 * @property {String} answer - The text of the answer to the FAQ question. This field is required.
 * @property {Object} options - Schema options.
 * @property {boolean} options.timestamps - Indicates whether timestamp fields (`createdAt`, `updatedAt`) are automatically added to the schema.
 */
const faqSchema = new Schema(
    {
        question: requiredString('FAQ question'),
        answer: requiredString('FAQ answer'),
    },
    { timestamps: true }
);

/**
 * AboutUsModel is a data model representing the FAQs (Frequently Asked Questions) for the About Us page or section.
 * It utilizes the Faqs schema and may contain information about common queries and their respective responses.
 * This model is constructed from the existing 'Faqs' model or created dynamically using the provided faqSchema.
 */
const AboutUsModel = models.Faqs || model('Faqs', faqSchema);

export default AboutUsModel;
