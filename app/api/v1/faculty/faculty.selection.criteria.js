'use strict';

/**
 * A function that defines the selection criteria for faculty members.
 * It returns an object with specific properties set to true to indicate
 * that these fields should be included in the selection criteria.
 *
 * @function
 * @returns {Object} An object representing the selection criteria with the following properties:
 * - id: Indicates the unique identifier for a faculty member.
 * - category: Represents the category or department the faculty member belongs to.
 * - name: The name of the faculty member.
 * - designation: The job title or designation of the faculty member.
 * - image: A link or reference to the faculty member's image.
 * - email: The email address of the faculty member.
 * - mobile: The mobile phone number of the faculty member.
 * - portfolio: A reference to the portfolio or additional information about the faculty member.
 */
const facultySelectionCriteria = () => ({
    id: true,
    category: true,
    name: true,
    designation: true,
    image: true,
    email: true,
    mobile: true,
    portfolio: true,
});

export default facultySelectionCriteria;
