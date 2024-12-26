'use strict';

/**
 * Defines the selection criteria for retrieving data for a home carousel.
 * The returned object specifies which fields should be included in the data:
 * - `id`: Indicates that the unique identifier of each carousel item is included.
 * - `images`: Indicates that the images associated with each carousel item are included.
 *
 * @function
 * @returns {Object} An object containing the selection criteria for the home carousel.
 */
const homeCarouselSelectionCriteria = () => ({
    id: true,
    images: true,
});

export default homeCarouselSelectionCriteria;
