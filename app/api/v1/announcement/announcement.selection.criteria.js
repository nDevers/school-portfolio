'use strict';

/**
 * A function that defines the selection criteria for announcements.
 * This criteria specifies the fields that should be included when retrieving announcement data.
 *
 * @returns {Object} An object containing boolean values indicating whether each field should be selected:
 * - id: Indicates whether the ID of the announcement should be included.
 * - category: Indicates whether the category of the announcement should be included.
 * - title: Indicates whether the title of the announcement should be included.
 * - description: Indicates whether the description of the announcement should be included.
 * - files: Indicates whether the files associated with the announcement should be included.
 * - date: Indicates whether the date of the announcement should be included.
 * - isHeadline: Indicates whether it is a headline announcement.
 * - isAdvertise: Indicates whether the announcement is marked as an advertisement.
 * - advertiseMailTime: Indicates whether the time for advertisement-related emails should be included.
 */
const announcementSelectionCriteria = () => ({
    id: true,
    category: true,
    title: true,
    description: true,
    files: true,
    date: true,
    isHeadline: true,
    isAdvertise: true,
    advertiseMailTime: true,
});

export default announcementSelectionCriteria;
