'use strict';

/**
 * A function that defines the criteria for selecting career-related data.
 * It returns an object with properties set to `true` to indicate
 * the inclusion of specific fields. The returned object typically
 * represents fields that should be selected when querying career data.
 *
 * @returns {Object} An object representing the selected fields for career data:
 * - `id`: Include the unique identifier.
 * - `title`: Include the main title of the career entry.
 * - `subTitle`: Include the subtitle or secondary title.
 * - `description`: Include the description or detailed information.
 * - `date`: Include the date associated with the career entry.
 * - `files`: Include any related file attachments or references.
 */
const careerSelectionCriteria = () => ({
    id: true,
    title: true,
    subTitle: true,
    description: true,
    date: true,
    files: true,
});

export default careerSelectionCriteria;
