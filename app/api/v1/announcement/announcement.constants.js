import contentTypesConstants from "@/constants/contentTypes.constants";
import mimeTypesConstants from "@/constants/mimeTypes.constants";

const allowedContentTypes = [contentTypesConstants.FORM_DATA];
const allowedMimeTypes = [mimeTypesConstants.JPEG, mimeTypesConstants.JPG, mimeTypesConstants.PNG, mimeTypesConstants.GIF];
const filesFieldName = 'files';
const allowedFileSize = 5 * 1024 * 1024;

const titleMaxCharacter = 50;
const descriptionMaxCharacter = 50;

const categories = {
    notice: "notice",
    leaveCalender: "leave_calender",
    transportation: "transportation",
    admissionInfo: "admission_info",
};

const allowedCategories = Object.values(categories);

const facultyConstants = {
    allowedContentTypes,

    allowedMimeTypes,
    filesFieldName,
    allowedFileSize,

    titleMaxCharacter,
    descriptionMaxCharacter,

    categories,
    allowedCategories,
};

export default facultyConstants;
