export const handleCheckboxChange = (formik, fieldName) => (checked) => {
    formik.setFieldValue(fieldName, checked);
};

export const handleImageChange = (formik, fieldName) => (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
        formik.setFieldValue(fieldName, file); // Sets the file in Formik state
    }
};

export const clearField = (formik, fieldName) => {
    formik.setFieldValue(fieldName, ''); // Resets the image field to null
};

// Common function for handling add and remove operations in Formik array fields
export const handleArrayFieldChange = (
    formik,
    actionType,
    fieldName,
    index = null,
    deleteFieldName = null
) => {
    const fieldArray = formik.values[fieldName];
    const deleteArray = deleteFieldName ? formik.values[deleteFieldName] : [];

    if (actionType === 'add') {
        formik.setFieldValue(fieldName, [...fieldArray, '']);
    } else if (actionType === 'remove' && index !== null) {
        // Track the item in the delete array if deleteFieldName is provided
        if (deleteFieldName && fieldArray[index]) {
            formik.setFieldValue(deleteFieldName, [
                ...deleteArray,
                fieldArray[index],
            ]);
        }
        // Remove the item from the main array
        const updatedArray = fieldArray.filter((_, i) => i !== index);
        formik.setFieldValue(fieldName, updatedArray);
    }
};

// export const handleArrayFieldChange = (formik, actionType, fieldName, index = null) => {
//     const fieldArray = formik.values[fieldName];
//     if (actionType === 'add') {
//         formik.setFieldValue(fieldName, [...fieldArray, '']);
//     } else if (actionType === 'remove' && index !== null) {
//         const updatedArray = fieldArray.filter((_, i) => i !== index);
//         formik.setFieldValue(fieldName, updatedArray);
//     }
// };

// #######################################################################
// #######################################################################
// #######################################################################
// #######################################################################

export const handleCheckboxChangeForForm =
    (setFieldValue, fieldName) => (checked) => {
        setFieldValue(fieldName, checked);
    };

export const handleImageChangeForForm =
    (setFieldValue, fieldName) => (event) => {
        const file = event.currentTarget.files[0];
        if (file) {
            setFieldValue(fieldName, file); // Sets the file in Formik state
        }
    };

export const handleArrayFieldChangeForForm = (
    { values, setFieldValue },
    actionType,
    fieldName,
    index = null,
    deleteFieldName = null
) => {
    const fieldArray = values[fieldName];
    const deleteArray = deleteFieldName ? values[deleteFieldName] || [] : [];

    if (actionType === 'add') {
        // Add an empty object for a new document
        setFieldValue(fieldName, [...fieldArray, { name: '', file: null }]);
    } else if (actionType === 'remove' && index !== null) {
        // Track the removed item in the delete array if deleteFieldName is provided
        if (deleteFieldName && fieldArray[index]) {
            setFieldValue(deleteFieldName, [...deleteArray, fieldArray[index]]);
        }
        // Remove the item from the main array
        const updatedArray = fieldArray.filter((_, i) => i !== index);
        setFieldValue(fieldName, updatedArray);
    }
};
