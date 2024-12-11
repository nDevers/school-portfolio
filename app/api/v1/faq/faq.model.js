import { Schema, model, models } from 'mongoose';

import schemaModelShared from "@/shared/schema.model.shared";

const { requiredString } = schemaModelShared;

const faqSchema = new Schema(
    {
        question: requiredString('FAQ question'),
        answer: requiredString('FAQ answer'),
    },
    { timestamps: true }
);

// Use a conditional to check if the model exists or create it
const FaqModel = models.Faqs || model('Faqs', faqSchema);

export default FaqModel;
