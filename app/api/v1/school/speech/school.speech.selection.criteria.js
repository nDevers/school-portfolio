/**
 * Represents a function that defines the criteria used for selecting specific properties
 * of school speech records.
 *
 * @function
 * @returns {Object} Object containing the selection criteria with the following properties:
 * - `id` (Boolean): Indicates whether the ID property should be selected.
 * - `title` (Boolean): Indicates whether the title property should be selected.
 * - `description` (Boolean): Indicates whether the description property should be selected.
 * - `image` (Boolean): Indicates whether the image property should be selected.
 */
const schoolSpeechSelectionCriteria = () => ({
    id: true,
    title: true,
    description: true,
    image: true,
});

export default schoolSpeechSelectionCriteria;