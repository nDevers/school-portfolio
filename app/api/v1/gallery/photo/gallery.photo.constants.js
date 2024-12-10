import contentTypesConstants from "@/constants/contentTypes.constants";
import mimeTypesConstants from "@/constants/mimeTypes.constants";

const allowedContentTypes = [contentTypesConstants.FORM_DATA];
const allowedMimeTypes = [mimeTypesConstants.JPEG, mimeTypesConstants.JPG, mimeTypesConstants.PNG, mimeTypesConstants.GIF];
const imagesFieldName = 'images';

const allowedBannerFileSize = 5 * 1024 * 1024;
const questionMaxCharacter = 100;

const galleryPhotoConstants = {
    allowedContentTypes,
    allowedMimeTypes,
    imagesFieldName,
    allowedBannerFileSize,
    questionMaxCharacter,
};

export default galleryPhotoConstants;
