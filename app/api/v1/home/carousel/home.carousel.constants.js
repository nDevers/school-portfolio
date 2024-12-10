import contentTypesConstants from "@/constants/contentTypes.constants";
import mimeTypesConstants from "@/constants/mimeTypes.constants";

const allowedContentTypes = [contentTypesConstants.FORM_DATA];
const allowedMimeTypes = [mimeTypesConstants.JPEG, mimeTypesConstants.JPG, mimeTypesConstants.PNG, mimeTypesConstants.GIF];
const imagesFieldName = 'images';

const allowedImageFileSize = 5 * 1024 * 1024;
const questionMaxCharacter = 100;

const homeCarouselConstants = {
    allowedContentTypes,
    allowedMimeTypes,
    imagesFieldName,
    allowedImageFileSize,
    questionMaxCharacter,
};

export default homeCarouselConstants;
