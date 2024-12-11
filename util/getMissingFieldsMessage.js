// Helper function to dynamically check which optional fields are missing
const getMissingFieldsMessage = (data, schema) => {
    const optionalFields = Object.keys(schema.shape).filter(field => {
        const fieldDef = schema.shape[field];
        return fieldDef instanceof z.ZodOptional;
    });

    const missingFields = optionalFields.filter(field => !data[field]);
    return `At least one of "${missingFields.join('" or "')}" is required along with "id".`;
}

export default getMissingFieldsMessage;
