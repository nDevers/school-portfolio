// Helper function to check if an entry already exists in any model based on the matcher
const checkExistingEntry = async (model, matcher) => {
    return model.exists(matcher);
};

export default checkExistingEntry;