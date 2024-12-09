import contentTypesConstants from "@/constants/contentTypes.constants";

const allowedContentTypes = [contentTypesConstants.JSON];

const categories = {
    routine: "routine",
    result: "result",
    admissionForm: "admission_form",
};

const allowedCategories = Object.values(categories);

const academicConstants = {
    allowedContentTypes,
    categories,
    allowedCategories,
};

export default academicConstants;
