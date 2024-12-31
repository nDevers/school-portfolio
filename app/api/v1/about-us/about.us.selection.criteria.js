'use strict';

/**
 * Represents a function that defines the selection criteria for
 * the "About Us" section in a database query or data retrieval process.
 *
 * @returns {Object} An object specifying the criteria for selecting
 * data, where each key represents a field to be included and its value
 * set to true indicates the field should be selected:
 * - `id`: A boolean indicating whether the ID field is included.
 * - `title`: A boolean indicating whether the title field is included.
 * - `description`: A boolean indicating whether the description field is included.
 * - `files`: A boolean indicating whether the files field is included.
 * - `images`: A boolean indicating whether the images field is included.
 */
const aboutUsSelectionCriteria = () => ({
    id: true,
    title: true,
    description: true,
    files: true,
    images: true,
});

export default aboutUsSelectionCriteria;
