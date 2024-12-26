/**
 * Extracts the YouTube video ID from a given URL.
 *
 * This function uses a regular expression to parse the specified URL
 * and attempt to locate a valid YouTube video ID. A valid video ID
 * is a string of 11 characters. If the URL contains a valid video ID,
 * the function returns the ID. If not, it returns null.
 *
 * @param {string} url - The URL from which to extract the video ID.
 * @returns {(string|null)} The YouTube video ID if valid, otherwise null.
 */
const id = (url) => {
    const regExp =
        /^.*(?:youtu.be\/|v\/|watch\?v=|embed\/|watch\?.*v=)([^#]*).*/;
    const match = url.match(regExp);
    return match && match[1].length === 11 ? match[1] : null;
};

/**
 * Generates the URL for the high-quality thumbnail image of a YouTube video.
 *
 * @param {string} id - The unique identifier of the YouTube video.
 * @returns {string} The URL for the high-quality thumbnail image of the specified YouTube video.
 */
const thumbnail = (id) => {
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
};

/**
 * Represents a YouTube video with specific details.
 *
 * @typedef {Object} getYoutubeVideo
 * @property {string} id - The unique identifier for the YouTube video.
 * @property {string} thumbnail - The URL of the thumbnail image associated with the YouTube video.
 */
const getYoutubeVideo = {
    id,
    thumbnail,
};

export default getYoutubeVideo;
