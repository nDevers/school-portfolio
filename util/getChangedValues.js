/**
 * Compares two objects and identifies the changed values between them.
 *
 * This method recursively checks the properties of `initialValues` and `currentValues`
 * and returns an object containing only the properties that have changed. It supports
 * deep comparisons for nested objects and arrays.
 *
 * @param {Object} initialValues - The initial reference object to compare against.
 * @param {Object} currentValues - The object containing potentially updated values.
 * @returns {Object} An object representing the properties that have changed, including
 *                   nested changes. If there are no differences, an empty object is returned.
 */
export const getChangedValues = (initialValues, currentValues) => {
    const changedValues = {};

    Object.keys(currentValues).forEach((key) => {
        const initialValue = initialValues[key];
        const currentValue = currentValues[key];

        if (Array.isArray(initialValue) && Array.isArray(currentValue)) {
            // Deep check for arrays
            const arrayChanges = currentValue.filter((item, index) => {
                return (
                    JSON.stringify(item) !== JSON.stringify(initialValue[index])
                );
            });
            if (arrayChanges.length) {
                changedValues[key] = currentValue;
            }
        } else if (
            typeof initialValue === 'object' &&
            initialValue !== null &&
            typeof currentValue === 'object' &&
            currentValue !== null
        ) {
            // Recursively check nested objects
            const nestedChanges = getChangedValues(initialValue, currentValue);
            if (Object.keys(nestedChanges).length > 0) {
                changedValues[key] = nestedChanges;
            }
        } else if (initialValue !== currentValue) {
            // Direct comparison for primitive types
            changedValues[key] = currentValue;
        }
    });

    return changedValues;
};
