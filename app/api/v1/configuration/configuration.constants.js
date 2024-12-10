import contentTypesConstants from "@/constants/contentTypes.constants";
import mimeTypesConstants from "@/constants/mimeTypes.constants";

const allowedContentTypes = [contentTypesConstants.FORM_DATA];
const allowedMimeTypes = [mimeTypesConstants.JPEG, mimeTypesConstants.JPG, mimeTypesConstants.PNG, mimeTypesConstants.GIF];
const bannerFieldName = 'banner';
const logoFieldName = 'logo';

const allowedBannerFileSize = 5 * 1024 * 1024;
const questionMaxCharacter = 100;

const configurationConstants = {
    allowedContentTypes,
    allowedMimeTypes,
    bannerFieldName,
    logoFieldName,
    allowedBannerFileSize,
    questionMaxCharacter,
};

export default configurationConstants;
