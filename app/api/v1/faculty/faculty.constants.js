import contentTypesConstants from "@/constants/contentTypes.constants";
import mimeTypesConstants from "@/constants/mimeTypes.constants";

const allowedContentTypes = [contentTypesConstants.FORM_DATA];
const allowedMimeTypes = [mimeTypesConstants.JPEG, mimeTypesConstants.JPG, mimeTypesConstants.PNG, mimeTypesConstants.GIF];
const imageFieldName = 'image';
const allowedFileSize = 5 * 1024 * 1024;

const nameMaxCharacter = 50;
const designationMaxCharacter = 50;

const categories = {
    teacher: "teacher",
    board: "board",
    exHeadTeacher: "ex_head_teacher",
    meritStudent: "merit_student",
};

const allowedCategories = Object.values(categories);

const facultyConstants = {
    allowedContentTypes,

    allowedMimeTypes,
    imageFieldName,
    allowedFileSize,

    nameMaxCharacter,
    designationMaxCharacter,

    categories,
    allowedCategories,
};

export default facultyConstants;
