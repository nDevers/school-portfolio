import { Schema, model, models } from 'mongoose';

import schemaModelShared from '@/shared/schema.model.shared';

const { requiredString } = schemaModelShared;

/**
 * Represents the schema for an FAQ (Frequently Asked Questions) entry in the database.
 * This schema includes fields for the question and answer, both of which are required strings.
 * Timestamps are enabled to track the creation and update times of each entry.
 *
 * @constant {Schema} faqSchema
 */
const faqSchema = new Schema(
    {
        question: requiredString('FAQ question'),
        answer: requiredString('FAQ answer'),
    },
    { timestamps: true }
);

/**
 * FaqModel is a Mongoose model object that represents the structure and
 * behavior of a FAQ (Frequently Asked Questions) collection in the database.
 * It is created using a pre-defined Mongoose schema (faqSchema).
 * If a model named 'Faqs' already exists in the application, it uses
 * that existing model; otherwise, it initializes a new model named 'Faqs'.
 */
const FaqModel = models.Faqs || model('Faqs', faqSchema);

export default FaqModel;
