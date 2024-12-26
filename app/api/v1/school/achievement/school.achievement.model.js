'use strict';

import { Schema, model, models } from 'mongoose';

import schemaModelShared from '@/shared/schema.model.shared';

const { requiredString } = schemaModelShared;

/**
 * Represents the schema for Frequently Asked Questions (FAQ).
 *
 * faqSchema defines the structure for storing FAQ entries in the database,
 * including the question and its corresponding answer. It includes timestamp
 * fields for tracking creation and update times.
 *
 * @type {Schema}
 */
const faqSchema = new Schema(
    {
        question: requiredString('FAQ question'),
        answer: requiredString('FAQ answer'),
    },
    { timestamps: true }
);

/**
 * SchoolAchievementModel represents a model for storing and retrieving
 * school achievement-related data in the database. It uses the Faqs collection
 * or initializes the Faqs model based on the provided faqSchema.
 *
 * This model is designed to handle FAQs or similar structured documents
 * related to school achievements, facilitating consistent interactions
 * with the database.
 */
const SchoolAchievementModel = models.Faqs || model('Faqs', faqSchema);

export default SchoolAchievementModel;
