import contentTypesConstants from "@/constants/contentTypes.constants";
import mimeTypesConstants from "@/constants/mimeTypes.constants";

const allowedContentTypes = [contentTypesConstants.FORM_DATA];
const allowedFilesMimeTypes = [mimeTypesConstants.PDF, mimeTypesConstants.JPG, mimeTypesConstants.PNG, mimeTypesConstants.GIF];
const allowedImagesMimeTypes = [mimeTypesConstants.JPEG, mimeTypesConstants.JPG, mimeTypesConstants.PNG, mimeTypesConstants.GIF];
const fileFieldName = 'files';
const imageFieldName = 'images';

const allowedFileSize = 5 * 1024 * 1024;
const titleMaxCharacter = 100;

const aboutUsConstants = {
    allowedContentTypes,
    allowedFilesMimeTypes,
    allowedImagesMimeTypes,
    fileFieldName,
    imageFieldName,
    allowedFileSize,
    titleMaxCharacter,
};

export default aboutUsConstants;
