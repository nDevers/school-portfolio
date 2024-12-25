/**
 * A function that returns an object defining the criteria
 * for selecting fields in a FAQ (Frequently Asked Questions) entity.
 *
 * @returns {Object} An object specifying the fields to be selected:
 * - `id`: Boolean indicating whether the FAQ's unique identifier is selected.
 * - `question`: Boolean indicating whether the question text is selected.
 * - `answer`: Boolean indicating whether the answer text is selected.
 */
const faqSelectionCriteria = () => ({
    id: true,
    question: true,
    answer: true,
});

export default faqSelectionCriteria;
