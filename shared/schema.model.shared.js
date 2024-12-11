// Define a function to return the schema definition for required string fields
const requiredString = (fieldName) => ({
    type: String,
    required: [true, `${fieldName} is required`],
    trim: true,
});

const schemaModelShared = {
    requiredString,
};

export default schemaModelShared;
