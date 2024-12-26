'use strict';

import { Schema, model, models } from 'mongoose';

import schemaModelShared from '@/shared/schema.model.shared';

const { requiredString } = schemaModelShared;

/**
 * Represents the schema definition for FAQ (Frequently Asked Questions) entries.
 * This schema is used to store and retrieve questions and their corresponding answers.
 *
 * @constant {Schema} faqSchema - The Mongoose schema for FAQ items.
 * @property {String} question - Represents the content of the FAQ question. This field is required.
 * @property {String} answer - Represents the content of the FAQ answer. This field is required.
 * @property {Object} timestamps - Automatically manages createdAt and updatedAt timestamps for each document.
 */
const faqSchema = new Schema(
    {
        question: requiredString('FAQ question'),
        answer: requiredString('FAQ answer'),
    },
    { timestamps: true }
);

/**
 * CareerModel represents the data model for frequently asked questions (FAQs) related to careers.
 *
 * This variable is initialized by first checking if the `Faqs` model is already defined in `models`.
 * If not, it will create a new `Faqs` model using the specified `faqSchema`.
 *
 * CareerModel is used for querying, updating, and managing FAQ-related data in the database.
 */
const CareerModel = models.Faqs || model('Faqs', faqSchema);

export default CareerModel;
