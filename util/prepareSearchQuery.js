const prepareSearchQuery = (userInput) => {
    const whereCondition = {};

    for (const key in userInput) {
        if (userInput[key]) {
            if (Array.isArray(userInput[key])) {
                whereCondition[key] = { in: userInput[key] };
            } else if (typeof userInput[key] === 'string' && key === 'id') {
                whereCondition[key] = userInput[key];
            } else if (typeof userInput[key] === 'string' && key === 'createdAt') {
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