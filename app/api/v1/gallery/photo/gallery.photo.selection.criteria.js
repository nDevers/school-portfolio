'use strict';

/**
 * Represents criteria for selecting photo attributes in a gallery.
 *
 * This function returns an object that includes the predefined properties
 * of photos to be selected, such as `id`, `title`, `description`, and `images`.
 *
 * @returns {Object} An object specifying the properties of a gallery photo
 * that should be included in the selection.
 */
const galleryPhotoSelectionCriteria = () => ({
    id: true,
    title: true,
    description: true,
    images: true,
});

export default galleryPhotoSelectionCriteria;
