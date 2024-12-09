import contentTypesConstants from "@/constants/contentTypes.constants";
import mimeTypesConstants from "@/constants/mimeTypes.constants";

const allowedContentTypes = [contentTypesConstants.FORM_DATA];
const allowedMimeTypes = [mimeTypesConstants.JPEG, mimeTypesConstants.JPG, mimeTypesConstants.PNG, mimeTypesConstants.GIF];
const fileFieldName = 'file';
const allowedFileSize = 5 * 1024 * 1024;

const titleMaxCharacter = 100;
const badgeMaxCharacter = 50;

const categories = {
    routine: "routine",
    result: "result",
    admissionForm: "admission_form",
};

const allowedCategories = Object.values(categories);

const academicConstants = {
    allowedContentTypes,
    allowedMimeTypes,
    fileFieldName,
    allowedFileSize,

    titleMaxCharacter,
    badgeMaxCharacter,

    categories,
    allowedCategories,
};

export default academicConstants;
