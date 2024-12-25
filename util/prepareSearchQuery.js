/**
 * Constructs a query object based on the provided user input.
 *
 * @param {Object} userInput - The input provided by the user, containing key-value pairs.
 * @returns {Object} A query object that can be used to filter data based on user input.
 * The function iterates through the input, and for each key-value pair:
 * - If the value is an array, it creates a condition using the "in" operator.
 * - If the key is "id" and the value is a string, it directly assigns the value.
 * - If the key is "createdAt" and the value is a string in 'YYYY-MM-DD' format, it creates a range condition for the start and end of the given day.
 * - If the value is a string (and is not "id" or "createdAt"), it creates a condition using the "contains" operator.
 * - For all other cases, it assigns the value directly to the query object.
 */
const prepareSearchQuery = (userInput) => {
    const whereCondition = {};

    for (const key in userInput) {
        if (userInput[key]) {
            if (Array.isArray(userInput[key])) {
                whereCondition[key] = { in: userInput[key] };
            } else if (typeof userInput[key] === 'string' && key === 'id') {
                whereCondition[key] = userInput[key];
            } else if (
                typeof userInput[key] === 'string' &&
                key === 'createdAt'
            ) {
                // Handle createdAt field correctly, assuming it's a string in 'YYYY-MM-DD' format
                whereCondition[key] = {
                    gte: new Date(`${userInput[key]}T00:00:00.000Z`), // Start of the day
                    lte: new Date(`${userInput[key]}T23:59:59.999Z`), // End of the day
                };
            } else if (typeof userInput[key] === 'string') {
                whereCondition[key] = { contains: userInput[key] };
            } else {
                whereCondition[key] = userInput[key];
            }
        }
    }

    return whereCondition;
};

export default prepareSearchQuery;
