/**
 * Represents a function that returns the criteria used for selecting contact fields.
 *
 * @function contactSelectionCriteria
 * @returns {Object} An object containing the fields to be included in the contact selection.
 * @property {boolean} email Indicates whether the email field is selected.
 * @property {boolean} subject Indicates whether the subject field is selected.
 * @property {boolean} message Indicates whether the message field is selected.
 */
const contactSelectionCriteria = () => ({
    email: true,
    subject: true,
    message: true,
});

export default contactSelectionCriteria;
