/**
 * A regular expression pattern to validate Mongoose ObjectId strings.
 *
 * This regex matches a 24-character hexadecimal string, which is the standard
 * format for MongoDB ObjectIds. The pattern includes:
 * - Exactly 24 characters
 * - Characters can be any digit (0-9) or any lowercase/uppercase letter from a-f
 * - Case-insensitive matching is enabled
 *
 * The regex ensures that a string adheres to the expected format of a Mongoose ObjectId.
 */
const mongooseIdRegex = /^[a-f\d]{24}$/i;
/**
 * A regular expression pattern used to match any uppercase English alphabet character (A-Z).
 *
 * This regex is case-sensitive and will identify only characters in the range of uppercase
 * letters in the English alphabet. It can be utilized for validation, searching, or replacing
 * uppercase characters in a given string.
 *
 * Regex pattern: /[A-Z]/
 */
const uppercaseRegex = /[A-Z]/;
/**
 * A regular expression pattern that matches any single lowercase letter
 * from 'a' to 'z' in the English alphabet.
 *
 * This variable can be used to test or validate if a string contains
 * at least one lowercase English letter.
 */
const lowercaseRegex = /[a-z]/;
/**
 * Regular expression to match any single numeric digit (0-9).
 * This regex identifies individual numeric characters in a string.
 * It can be used for validating or extracting numeric values.
 */
const numberRegex = /[0-9]/;
/**
 * A regular expression to match one or more special characters.
 *
 * This regex is designed to identify the presence of any of the following special characters:
 * @, $, !, %, *, ?, &, or #.
 * It is case-sensitive and will match characters exactly as specified.
 */
const specialCharacterRegex = /[@$!%*?&#]/;
/**
 * Regular expression to validate if a password meets certain complexity requirements.
 *
 * The password must include at least one uppercase letter, one lowercase letter,
 * one numeric digit, and one special character. It combines multiple regex patterns
 * for different character types, ensuring compliance with each requirement.
 */
const passwordRegex = new RegExp(
    `^(?=.*${uppercaseRegex.source})(?=.*${lowercaseRegex.source})(?=.*${numberRegex.source})(?=.*${specialCharacterRegex.source})`
);
/**
 * Regular expression to validate Bangladeshi mobile phone numbers.
 *
 * This regex matches phone numbers that:
 * - Start with either "+8801" or "01".
 * - The next digit falls within the range [3-9].
 * - Follows with exactly 8 numeric digits.
 *
 * The regex ensures both proper formatting and validity based on Bangladeshi
 * mobile number conventions.
 */
const bangladeshMobileRegex = /^(?:\+8801|01)[3-9]\d{8}$/;
/**
 * A regular expression pattern used to validate email address formats.
 *
 * This pattern ensures that the email address:
 * - Starts with alphanumeric characters, and may include dots (.), underscores (_),
 *   percentage signs (%), plus signs (+), or hyphens (-).
 * - Contains the "@" symbol separating the local part and the domain.
 * - Has a domain name that allows alphanumeric characters and hyphens (-),
 *   with at least one dot (.) separating the domain and top-level domain (TLD).
 * - Ends with a TLD of at least two alphabetic characters.
 *
 * Note: This pattern enforces basic email format validation but may not
 * cover all edge cases or conform to every specification in the RFC standard.
 */
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Regular expression to validate and match strings written in the Bengali language script.
 * This regex checks if the input string contains only Bengali characters,
 * which fall within the Unicode range U+0980 to U+09FF, as well as whitespace characters.
 *
 * The regex components are:
 * - [\u0980-\u09FF]: Matches any Bengali character within the Unicode range U+0980 to U+09FF.
 * - \s: Matches whitespace characters such as spaces, tabs, and line breaks.
 * - *: Allows zero or more occurrences of the preceding characters/groups.
 * - ^ and $: Ensure the string starts and ends within these bounds.
 *
 * Use this regex to validate text fields that require input in the Bengali language script.
 */
const bangliLanguageRegex = /^[\u0980-\u09FF\s]*$/;
/**
 * Regular expression for matching strings containing only English alphabet characters (both uppercase and lowercase)
 * and whitespace. This regex ensures that no digits, special characters, or non-English letters are included.
 *
 * Pattern Details:
 * - ^: Asserts the start of the string.
 * - [A-Za-z\s]*: Matches any combination of uppercase letters (A-Z), lowercase letters (a-z), and whitespace (\s),
 *   allowing zero or more occurrences of these characters.
 * - $: Asserts the end of the string.
 *
 * Usage: Use this regex to validate or test whether a given string contains only English alphabetic characters
 * and spaces without any other symbols or digits.
 */
const englishLanguageRegex = /^[A-Za-z\s]*$/;

/**
 * Regular expression pattern for validating Bangladeshi National ID numbers.
 *
 * This regex matches exactly 10 numeric digits, which is a common format
 * for Bangladeshi National ID numbers. It does not allow letters, special
 * characters, or spaces.
 *
 * Use this pattern to verify that a given string represents a valid
 * Bangladeshi NID number adhering to the 10-digit requirement.
 */
const bangladeshNidRegex = /^\d{10}$/;

/**
 * An array containing the valid blood group types based on the ABO and RhD blood group system.
 * The array includes all possible combinations of A, B, AB, and O blood types with positive (+)
 * and negative (-) RhD factors.
 *
 * Each entry in this array represents a unique blood group classification.
 *
 * Example blood groups include:
 * - A+
 * - O-
 * - AB+
 *
 * This is typically used in applications related to medical, healthcare, or blood donation systems.
 */
const bloodGroupTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

/**
 * Regular expression for validating Mongoose Object IDs.
 * Matches 24-character hexadecimal strings.
 */
const constants = {
    mongooseIdRegex,
    uppercaseRegex,
    lowercaseRegex,
    numberRegex,
    specialCharacterRegex,
    passwordRegex,
    bangladeshMobileRegex,
    emailRegex,
    bangliLanguageRegex,
    englishLanguageRegex,
    bangladeshNidRegex,
    bloodGroupTypes,
};

export default constants;
