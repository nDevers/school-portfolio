/**
 * A function that defines the criteria for selecting school achievements by specifying which properties should be included.
 *
 * @function schoolAchievementSelectionCriteria
 * @returns {Object} An object containing the keys of the school achievement properties that should be selected:
 * - `id`: Indicates the inclusion of the unique identifier for the achievement.
 * - `title`: Includes the title or name of the achievement.
 * - `description`: Specifies the inclusion of detailed information about the achievement.
 * - `icon`: Includes the icon representation associated with the achievement.
 */
const schoolAchievementSelectionCriteria = () => ({
    id: true,
    title: true,
    description: true,
    icon: true,
});

export default schoolAchievementSelectionCriteria;
