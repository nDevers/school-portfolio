/**
 * A function that returns an object defining the selection criteria for school information.
 *
 * The returned object specifies the properties to be included:
 * - id: Indicates the unique identifier of the school.
 * - title: Represents the title or name of the school.
 * - description: Provides a description or additional details about the school.
 * - icon: Denotes the icon associated with the school.
 *
 * @returns {Object} Object containing the selection criteria for school information.
 */
const schoolInfoSelectionCriteria = () => ({
    id: true,
    title: true,
    description: true,
    icon: true,
});

export default schoolInfoSelectionCriteria;
