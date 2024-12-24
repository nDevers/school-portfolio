/**
 * Converts the given text to sentence case.
 *
 * The function trims any leading or trailing whitespace, converts the entire
 * text to lowercase, and then capitalizes the first letter of the resulting
 * sentence.
 *
 * @param {string} text - The input text to be converted to sentence case.
 * @returns {string} The sentence-cased version of the input text. If the input
 * text is falsy, an empty string is returned.
 */
const toSentenceCase = (text) => {
    if (!text) return '';

    // Trim any leading or trailing whitespace and convert to lowercase
    const lowerCaseText = text.trim().toLowerCase();

    // Capitalize the first letter of the sentence
    return lowerCaseText.charAt(0).toUpperCase() + lowerCaseText.slice(1);
};

export default toSentenceCase;
