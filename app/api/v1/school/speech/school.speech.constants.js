import contentTypesConstants from "@/constants/contentTypes.constants";
import mimeTypesConstants from "@/constants/mimeTypes.constants";

const allowedContentTypes = [contentTypesConstants.FORM_DATA];
const allowedMimeTypes = [mimeTypesConstants.JPEG, mimeTypesConstants.JPG, mimeTypesConstants.PNG, mimeTypesConstants.GIF];
const imageFieldName = 'image';

const allowedBannerFileSize = 5 * 1024 * 1024;
const questionMaxCharacter = 100;

const schoolSpeechConstants = {
    allowedContentTypes,
    allowedMimeTypes,
    imageFieldName,
    allowedBannerFileSize,
    questionMaxCharacter,
};

export default schoolSpeechConstants;
