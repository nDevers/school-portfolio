/**
 * A function that defines the selection criteria for videos in a gallery.
 * It specifies the fields that should be included when selecting videos.
 *
 * @returns {Object} An object containing the fields to be included in the selection:
 * - `id`: A boolean indicating if the video ID should be included.
 * - `title`: A boolean indicating if the video title should be included.
 * - `description`: A boolean indicating if the video description should be included.
 * - `youtubeLinks`: A boolean indicating if the YouTube links for the video should be included.
 */
const galleryVideoSelectionCriteria = () => ({
    id: true,
    title: true,
    description: true,
    youtubeLinks: true,
});

export default galleryVideoSelectionCriteria;
