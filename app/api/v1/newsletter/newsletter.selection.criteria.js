/**
 * Function representing the selection criteria for newsletters.
 * Returns an object specifying which fields to include in the selection.
 *
 * @returns {Object} Object containing fields to include in newsletter selection.
 * @returns {boolean} [returns.id] Flag indicating inclusion of the 'id' field in the selection.
 * @returns {boolean} [returns.email] Flag indicating inclusion of the 'email' field in the selection.
 */
const newsletterSelectionCriteria = () => ({
    id: true,
    email: true,
});

export default newsletterSelectionCriteria;
