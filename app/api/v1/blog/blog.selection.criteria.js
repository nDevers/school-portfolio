'use strict';

/**
 * A function that defines criteria for selecting specific information about a blog.
 * The returned object determines the fields to include when querying or retrieving blog data.
 *
 * @function blogSelectionCriteria
 * @returns {Object} An object specifying the criteria for blog selection,
 * indicating the inclusion of fields such as id, title, description, banner, files, images, and date.
 */
const blogSelectionCriteria = () => ({
    id: true,
    title: true,
    description: true,
    banner: true,
    files: true,
    images: true,
    date: true,
});

export default blogSelectionCriteria;
