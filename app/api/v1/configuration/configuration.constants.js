import contentTypesConstants from "@/constants/contentTypes.constants";
import mimeTypesConstants from "@/constants/mimeTypes.constants";

const allowedContentTypes = [contentTypesConstants.FORM_DATA];
const allowedMimeTypes = [mimeTypesConstants.JPEG, mimeTypesConstants.JPG, mimeTypesConstants.PNG, mimeTypesConstants.GIF];
const bannerFieldName = 'banner';
const logoFieldName = 'logo';

const allowedLogoFileSize = 5 * 1024 * 1024;
const allowedBannerFileSize = 5 * 1024 * 1024;
const nameMaxCharacter = 100;
const addressMaxCharacter = 100;

const configurationConstants = {
    allowedContentTypes,
    allowedMimeTypes,
    bannerFieldName,
    logoFieldName,
    allowedLogoFileSize,
    allowedBannerFileSize,
    nameMaxCharacter,
    addressMaxCharacter,
};

export default configurationConstants;
