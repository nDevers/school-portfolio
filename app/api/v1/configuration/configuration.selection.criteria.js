/**
 * Represents a function that returns the selection criteria for the home carousel.
 * The returned object defines the properties to be included in the selection.
 *
 * @returns {Object} An object containing boolean flags indicating the selected fields:
 * - id: Includes the ID field if true.
 * - name: Includes the name field if true.
 * - description: Includes the description field if true.
 * - logo: Includes the logo field if true.
 * - banner: Includes the banner field if true.
 * - address: Includes the address field if true.
 * - emails: Includes the emails field if true.
 * - contacts: Includes the contacts field if true.
 * - socialLinks: Includes the social links field if true.
 */
const homeCarouselSelectionCriteria = () => ({
    id: true,
    name: true,
    description: true,
    logo: true,
    banner: true,
    address: true,
    emails: true,
    contacts: true,
    socialLinks: true,
});

export default homeCarouselSelectionCriteria;
