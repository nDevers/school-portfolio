'use strict';

/**
 * A function that defines the criteria for academic selection by returning an object
 * containing a set of properties with boolean values set to `true`.
 *
 * @function
 * @returns {Object} An object containing the selection criteria for academic items:
 * - `id` (boolean): Indicates inclusion of an identifier.
 * - `category` (boolean): Indicates inclusion of the category information.
 * - `title` (boolean): Indicates inclusion of the title.
 * - `description` (boolean): Indicates inclusion of a description.
 * - `file` (boolean): Indicates inclusion of file information.
 * - `publishDate` (boolean): Indicates inclusion of the publishing date.
 * - `badge` (boolean): Indicates inclusion of a badge.
 */
const academicSelectionCriteria = () => ({
    id: true,
    category: true,
    title: true,
    description: true,
    file: true,
    publishDate: true,
    badge: true,
});

export default academicSelectionCriteria;
