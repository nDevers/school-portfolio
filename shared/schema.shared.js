import { z } from 'zod';
import { Types } from 'mongoose';
import moment from 'moment';

import constants from '@/constants/constants';

import { decryptData } from '@/util/crypto';

/**
 * A function that validates a string to ensure it is non-empty and does not exceed a specified maximum character length.
 *
 * @param {string} fieldName - The name of the field being validated, used in the error messages.
 * @param {number} [maxCharacter=100000] - The maximum allowed character length for the string.
 * @returns {ZodString} A Zod schema object that enforces the string to be non-empty and within the character limit.
 */
const nonEmptyString = (fieldName, maxCharacter = 100000) =>
    z
        .string()
        .nonempty(`${fieldName} is required`)
        .max(
            maxCharacter,
            `${fieldName} can not be more than ${maxCharacter} characters.`
        );
/**
 * A function that validates a non-empty Bangla string.
 *
 * This validator checks if the given value is a non-empty string and conforms to
 * the Bangla language regex pattern. If the value does not match the Bangla character
 * criteria, a message indicating the issue will be returned.
 *
 * @param {string} fieldName - The name of the field being validated.
 * @returns {Refinement} A refinement object that validates the input value as a Bangla string.
 * The refinement ensures the value is a non-empty string and contains only Bangla characters.
 */
const nonEmptyBangliString = (fieldName) =>
    nonEmptyString(fieldName).refine(
        (value) => constants.bangliLanguageRegex.test(value),
        {
            message: `${fieldName} must contain only Bangla characters.`,
        }
    );
/**
 * A function that validates a non-empty string containing only English characters.
 *
 * This function ensures that the input string is not empty and consists only of valid English-language characters,
 * as determined by the `englishLanguageRegex` constant. The validation is designed to check the value against
 * a regular expression and provide a meaningful error message if the input doesn't meet the specified criteria.
 *
 * @param {string} fieldName - The name of the field being validated, included in the error message for clarity.
 * @returns {Object} A refined string validation object that includes checks for non-emptiness and English characters.
 *
 * @throws {Error} If the string is empty or contains non-English characters, an error with the specified message will be thrown.
 */
const nonEmptyEnglishString = (fieldName) =>
    nonEmptyString(fieldName).refine(
        (value) => constants.englishLanguageRegex.test(value),
        {
            message: `${fieldName} must contain only English characters.`,
        }
    );

/**
 * A function that returns a Zod schema for validating an array of non-empty strings.
 *
 * @param {string} fieldName - The name of the field to be included in validation error messages.
 * @returns {ZodArray} A Zod schema for validating an array where every element is a non-empty string.
 */
const nonEmptyStringArray = (fieldName) => z.array(nonEmptyString(fieldName));
/**
 * A utility function that generates a Zod schema for an array of non-empty Bangli strings.
 * This schema ensures that each element of the array adheres to the `nonEmptyBangliString` schema.
 *
 * @param {string} fieldName - The name of the field for validation purposes.
 * @returns {ZodArray} - A Zod array schema that validates an array of non-empty Bangli strings.
 */
const nonEmptyBangliStringArray = (fieldName) =>
    z.array(nonEmptyBangliString(fieldName));
/**
 * A function that returns a Zod array schema where each element is a non-empty English string.
 *
 * @function nonEmptyEnglishStringArray
 * @param {string} fieldName - The name of the field being validated, used for descriptive error messages.
 * @returns {ZodArray} A Zod schema that validates an array of non-empty English strings.
 */
const nonEmptyEnglishStringArray = (fieldName) =>
    z.array(nonEmptyEnglishString(fieldName));

/**
 * A function that returns a validator ensuring an optional non-empty string.
 *
 * This function utilizes the `nonEmptyString` validator to validate a string
 * as non-empty, as well as marking the field as optional.
 *
 * @param {string} fieldName - The name of the field to validate.
 * @returns {Validator} A validator that ensures the field is either not present
 * or a non-empty string.
 */
const optionalNonEmptyString = (fieldName) =>
    nonEmptyString(fieldName).optional();
/**
 * A function that creates an optional validator for non-empty Bangla strings.
 *
 * This function takes a field name as an input and returns a validation rule
 * that ensures the field value is either optional or is a non-empty string in Bangla.
 *
 * @param {string} fieldName - The name of the field to be validated.
 * @returns {object} - A validation rule ensuring the field is optional or a non-empty Bangla string.
 */
const optionalNonEmptyBangliString = (fieldName) =>
    nonEmptyBangliString(fieldName).optional();
/**
 * A variable that represents an optional, non-empty English string.
 *
 * This variable is a function which takes a field name as an argument
 * and applies a validation rule to ensure that the input, when present,
 * is a non-empty string containing English characters. If the input
 * is not provided, it is considered valid as this field is optional.
 *
 * @function
 * @param {string} fieldName - The name of the field being validated.
 * @returns {Object} A validation schema enforcing the optional, non-empty English string rule.
 */
const optionalNonEmptyEnglishString = (fieldName) =>
    nonEmptyEnglishString(fieldName).optional();

/**
 * Defines a validation function that ensures the value is a non-negative number.
 *
 * @param {string} fieldName - The name of the field being validated.
 * @returns {ZodSchema} A Zod schema enforcing that the field is a required non-negative number.
 *
 * The validation will fail if the value is negative, and an appropriate error message
 * will be generated using the provided field name.
 */
const nonNegativeNumber = (fieldName) =>
    z.number().nonnegative(`${fieldName} is required and cannot be negative`);
/**
 * Generates a schema for validating and transforming input values into a boolean.
 * The schema accepts boolean values or string representations of boolean ('true' or 'false').
 *
 * @param {string} fieldName - The name of the field being validated, included in error messages.
 * @returns {ZodType} A Zod schema that validates and transforms the input into a boolean.
 * If the input is 'true' or 'false' as a string, it is converted to its boolean equivalent.
 * Throws a validation error if the input is not a valid boolean representation.
 */
const booleanString = (fieldName) =>
    z
        .union([z.boolean(), z.literal('true'), z.literal('false')])
        .transform((value) => {
            if (typeof value === 'boolean') return value;
            return value === 'true'; // Convert 'true' string to boolean true, and 'false' to boolean false
        })
        .refine((value) => value === true || value === false, {
            message: `${fieldName} must be a valid boolean value (true or false)`, // Custom error message with field name
        });

// Dynamic file validator with size check
/**
 * Validates a file based on specific criteria: type, size, and emptiness.
 *
 * @param {string} fieldName - The name of the field associated with the file, used for error messages.
 * @param {string[]} allowedTypes - An array of allowed MIME types for the file (e.g., ["image/png", "application/pdf"]).
 * @param {number} maxSize - The maximum allowed file size in bytes.
 * @returns {ZodSchema<File>} - A Zod schema to validate the file against the specified criteria.
 *
 * Error messages:
 * - If the value is not an instance of the `File` object, an error will be raised indicating that it must be a file.
 * - An error is raised if the file is empty (i.e., `file.size` is 0).
 * - If the file type is not included in `allowedTypes`, an error is raised specifying the allowed types.
 * - If the file size exceeds `maxSize`, an error is raised specifying the maximum allowed size in MB.
 */
const validFile = (fieldName, allowedTypes, maxSize) =>
    z
        .instanceof(File, { message: `${fieldName} must be a file` })
        .refine((file) => file.size > 0, {
            message: `${fieldName} file cannot be empty`,
        })
        .refine((file) => allowedTypes.includes(file.type), {
            message: `${fieldName} file type must be one of ${allowedTypes.join(', ')}`,
        })
        .refine((file) => file.size <= maxSize, {
            message: `${fieldName} file size must be less than or equal to ${maxSize / (1024 * 1024)}MB`,
        });

// Reusable schema for file arrays with dynamic validation, including min and max limits
/**
 * A function that validates an array of files based on specified criteria.
 *
 * @param {string} fieldName - The name of the field to use in validation messages.
 * @param {string[]} allowedTypes - An array of allowed MIME types for the files.
 * @param {number} maxSize - The maximum allowed size (in bytes) for each file.
 * @param {number} [minFiles=1] - The minimum number of files required. Defaults to 1.
 * @param {number} [maxFiles=Infinity] - The maximum number of files allowed. Defaults to Infinity.
 * @returns {z.ZodArray} A Zod schema for validating an array of files according to the specified rules.
 *
 * The validation ensures:
 * 1. At least one file is provided unless `minFiles` is explicitly set to 0.
 * 2. The number of files is between `minFiles` and `maxFiles` inclusive.
 * 3. Each file meets a non-empty size requirement.
 * 4. Each file conforms to the specified `allowedTypes` and `maxSize`.
 */
const filesValidator = (
    fieldName,
    allowedTypes,
    maxSize,
    minFiles = 1,
    maxFiles = Infinity
) =>
    z
        .array(validFile(fieldName, allowedTypes, maxSize))
        .nonempty({ message: 'At least one file is required' })
        .min(minFiles, {
            message: `At least ${minFiles} file(s) must be provided`,
        })
        .max(maxFiles, {
            message: `No more than ${maxFiles} file(s) can be provided`,
        })
        .refine((files) => files.every((file) => file.size > 0), {
            // Check that no file in the array is empty
            message: `All files in ${fieldName} must be non-empty`,
        });

/**
 * A function to validate a password field with specific constraints.
 *
 * @param {string} [fieldName='Password'] - The name of the field to display in validation messages.
 * @param {number} [minLength=8] - The minimum required length of the password.
 * @param {number} [maxLength=128] - The maximum allowed length of the password.
 * @returns {ZodString} A Zod schema for validating the password field.
 *
 * - The password must not be empty.
 * - The password is decrypted before validation.
 * - The password must have a length that is at least the specified minimum length.
 * - The password must have a length that does not exceed the specified maximum length.
 * - The password must match the specified pattern, requiring at least:
 *   - One uppercase letter.
 *   - One lowercase letter.
 *   - One numeric digit.
 *   - One special character.
 */
const validPassword = (
    fieldName = 'Password',
    minLength = 8,
    maxLength = 128
) =>
    z
        .string()
        .nonempty(`${fieldName} is required`)
        .transform((val) => decryptData(val)) // Decrypt password before validation
        .refine((val) => val.length >= minLength, {
            message: `${fieldName} must be at least ${minLength} characters`,
        })
        .refine((val) => val.length <= maxLength, {
            message: `${fieldName} must be at most ${maxLength} characters`,
        })
        .refine((val) => constants.passwordRegex.test(val), {
            message: `${fieldName} must contain an uppercase letter, lowercase letter, number, and special character`,
        });

/**
 * A function to validate an email address with multiple checks.
 *
 * @function validEmail
 * @param {string} [fieldName='Email'] - Optional field name used for customizable error messages.
 * @returns {Object} A Zod schema that ensures the email address is non-empty,
 *                   matches a general email format, and adheres to a stricter custom regex.
 */
const validEmail = (fieldName = 'Email') =>
    nonEmptyString(fieldName) // First, ensure the string is non-empty
        .email(`Invalid ${fieldName.toLowerCase()}`) // Use Zod's email method to check general format
        .regex(
            constants.emailRegex,
            `Invalid ${fieldName.toLowerCase()} format` // Apply the custom regex for stricter validation
        );

/**
 * Generates a validation schema to ensure an array of valid email addresses for the specified field.
 *
 * This function creates a schema that validates an array of email addresses against the criteria defined
 * in the `validEmail` function for a given field name. It ensures all items in the array conform to valid email formatting.
 *
 * @function
 * @param {string} fieldName - The name of the field to be validated.
 * @returns {z.ZodArray} A Zod array schema validating a list of valid email addresses.
 */
const validEmailArray = (fieldName) => z.array(validEmail(fieldName));

/**
 * Checks if the input value adheres to the rules for a valid Bangladeshi mobile number.
 *
 * This function validates a field by ensuring it contains a non-empty string and matches
 * the specified format for Bangladeshi mobile numbers. If the validation fails, an error
 * message is returned specifying the field must be a valid Bangladeshi mobile number.
 *
 * @param {string} fieldName - The name of the field being validated.
 * @returns {Object} Validation object containing the result of the mobile number check.
 */
const validMobileNumber = (fieldName) =>
    nonEmptyString(fieldName).regex(
        constants.bangladeshMobileRegex,
        `${fieldName} must be a valid Bangladeshi mobile number`
    );

/**
 * Creates a Zod array schema for validating mobile numbers.
 *
 * The function takes in a field name and generates a Zod array schema
 * to validate an array of mobile numbers, ensuring each mobile number
 * adheres to the defined validation rules.
 *
 * @param {string} fieldName - The name of the field to be used in validation messages or processing.
 * @returns {ZodArray} - A Zod array schema containing valid mobile numbers.
 */
const validMobileNumberArray = (fieldName) =>
    z.array(validMobileNumber(fieldName));

/**
 * Validates whether a given field contains a valid Bangladeshi National ID (NID) number.
 *
 * This validation ensures the field is a non-empty string and matches the predefined
 * regex pattern for Bangladeshi NID numbers. Additionally, it verifies that the value
 * is a 10-digit number.
 *
 * @param {string} fieldName - The name of the field being validated.
 * @returns {object} - An object containing validation rules for the NID number format.
 *                     The rules include checking for a non-empty string, matching
 *                     the regex for Bangladeshi NIDs, and ensuring the length is 10 digits.
 */
const validBangladeshiNidCardNumber = (fieldName) =>
    nonEmptyString(fieldName)
        .regex(constants.bangladeshNidRegex, {
            message: `${fieldName} must be a valid 10-digit Bangladeshi NID number.`,
        })
        .refine((value) => value.length === 10, {
            message: `${fieldName} must be a 10-digit number.`,
        });

/**
 * Function to validate if the provided value for a field is a valid MongoDB ObjectId.
 *
 * This function checks if the field is a non-empty string and also verifies
 * that the string is in a valid MongoDB ObjectId format. If the validation fails,
 * an appropriate error message containing the field name is returned.
 *
 * @param {string} fieldName - The name of the field being validated.
 * @returns {function} A validation function that ensures the field is a non-empty
 * string and matches the MongoDB ObjectId format. Upon failure, an error message
 * specifying the issue is provided.
 */
const validMongooseId = (fieldName) =>
    nonEmptyString(`${fieldName} is required`).refine(
        (id) => Types.ObjectId.isValid(id), // Validate if the string is a valid ObjectId format
        { message: `${fieldName} must be a valid ObjectId format` } // Use fieldName in the message
    );

/**
 * A validation schema factory for validating category parameters.
 *
 * @param {string} fieldName - The name of the field to be validated.
 * @param {Array<string>} allowedCategories - An array of allowed category values for validation.
 * @returns {ZodSchema} A strict Zod validation schema object that validates category parameters.
 */
const categoryValidationSchema = (fieldName, allowedCategories) =>
    z
        .object({
            categoryParams: enumValidation(fieldName, allowedCategories),
        })
        .strict();

// Define the Zod validation schema
/**
 * A schema for validating an object containing an `id` property.
 *
 * This schema ensures the `id` property is a valid Mongoose ObjectId using the `validMongooseId` function.
 * The schema is strictly enforced, disallowing any properties not explicitly defined.
 *
 * @type {import('zod').ZodObject}
 */
const idValidationSchema = z
    .object({
        id: validMongooseId('ID'),
    })
    .strict(); // Enforce strict mode to disallow extra fields

/**
 * A function that returns a Zod schema for validating an array of Mongoose ObjectId values.
 *
 * @param {string} fieldName - The name of the field being validated, typically used for error messages or logging.
 * @returns {ZodArray} - A Zod array schema where each item is validated using the validMongooseId schema.
 */
const validMongooseIdArray = (fieldName) => z.array(validMongooseId(fieldName));

/**
 * Validates that a string is a valid URL and begins with "https://".
 *
 * @param {string} fieldName - The name of the field being validated.
 * @returns {Object} A validation rule that ensures the string is non-empty,
 *                   a valid URL, and starts with "https://".
 */
const validUrl = (fieldName) =>
    nonEmptyString(fieldName)
        .url(`${fieldName} must be a valid URL`)
        .refine((url) => url.startsWith('https://'), {
            message: `${fieldName} must start with "https://"`,
        });

/**
 * A function that returns a Zod schema definition for an array of valid URLs.
 *
 * @param {string} fieldName - The name of the field to be validated, used for error messages or schema construction.
 * @returns {ZodArray} A Zod schema representing an array of validated URL strings.
 */
const validUrlArray = (fieldName) => z.array(validUrl(fieldName));

/**
 * A schema validation function for bank information.
 *
 * This function generates a Zod object schema that validates optional fields
 * `bankName` and `branchName`. Both fields must be non-empty strings if provided.
 *
 * The schema also includes a refinement rule that ensures at least one of the fields
 * (`bankName` or `branchName`) is non-empty when `hasBankDetails` is true,
 * throwing an error with a custom message otherwise.
 *
 * @param {string} fieldName - The name of the field for use in the error message.
 * @returns {ZodObject} A Zod schema object for validation.
 */
const bankInformation = (fieldName) =>
    z
        .object({
            bankName: nonEmptyString('Bank name'),
            branchName: nonEmptyString('Branch name'),
        })
        .partial()
        .refine(
            (data) => Object.values(data).some((value) => value?.trim() !== ''),
            {
                message: `${fieldName} must include "bankName" or "branchName" when "hasBankDetails" is true.`,
            }
        );

/**
 * Creates a schema object for validating address details.
 *
 * The `addressDetails` function generates a schema using the `z.object` function
 * that validates an address structure. The schema includes optional fields for
 * village, post office, subdistrict, and district. Each field is validated as a
 * non-empty string, constructed dynamically based on the provided `fieldName`.
 *
 * @param {string} fieldName - The base name to be used in error messages or validation context.
 * @returns {ZodObject} The schema object for validating the address details.
 */
const addressDetails = (fieldName) =>
    z.object({
        village: nonEmptyString(`${fieldName} village`).optional(),
        postOffice: nonEmptyString(`${fieldName} post office`).optional(),
        subdistrict: nonEmptyString(`${fieldName} subdistrict`).optional(),
        district: nonEmptyString(`${fieldName} district`).optional(),
    });

/**
 * Represents a schema definition for an uploaded file object with specific validation rules.
 *
 * @param {string} fieldName - The name of the field for which the uploaded file schema is being defined.
 * This name is used to customize validation error messages.
 * @returns {Object} A schema object containing the following properties:
 *  - id: A non-empty string representing the unique identifier of the uploaded file, validated with a custom message.
 *  - link: A valid URL representing the link to the uploaded file, validated with a custom message.
 */
const uploadedFile = (fieldName) =>
    z.object({
        id: nonEmptyString(`${fieldName} ID`),
        link: validUrl(`${fieldName} link`),
    });

/**
 * A validation function for checking if an input date string satisfies specific formatting rules.
 *
 * The function validates that the provided date is a non-empty string. Additionally, it ensures that the date is in
 * either "DD/MM/YYYY" format or adheres to the ISO 8601 standard. If the date does not conform to either of these
 * formats, an error message will be triggered.
 *
 * @param {string} fieldName - The name of the field being validated.
 * @returns {Function} A refined validation function that validates the date format.
 */
const validDate = (fieldName) =>
    nonEmptyString(fieldName).refine(
        (date) => {
            // Validate if the date is in DD/MM/YYYY or ISO 8601 format
            const isValidDDMMYYYY = moment(date, 'DD/MM/YYYY', true).isValid();
            const isValidISO8601 = moment(
                date,
                moment.ISO_8601,
                true
            ).isValid();

            return isValidDDMMYYYY || isValidISO8601;
        },
        {
            message: `${fieldName} must be a valid date in "DD/MM/YYYY" or ISO 8601 format.`,
        }
    );

/**
 * A function used to validate if a given field's value matches a predefined set of allowed types or values.
 *
 * @param {string} fieldName - The name of the field being validated.
 * @param {Array<string>} allowedTypes - An array of allowed string values for the field.
 * @returns {object} A Zod enum validation object that validates the field against the provided allowed types.
 */
const enumValidation = (fieldName, allowedTypes) => {
    return z.enum(allowedTypes, {
        required_error: `${fieldName} is required`,
        invalid_type_error: `${fieldName} must be one of ${allowedTypes.join(', ')}`,
    });
};

/**
 * A function that validates if the given field value matches a predefined set of valid blood group types.
 *
 * @param {string} [fieldName='Blood group'] - The name of the field to validate. Defaults to 'Blood group' if no value is provided.
 * @returns {Function} A function to perform validation based on the predefined blood group types.
 */
const validBloodGroup = (fieldName = 'Blood group') =>
    enumValidation(fieldName, constants.bloodGroupTypes);

/**
 * A shared schema object containing various validation schemas and utilities
 * used for input data validation. This object groups different validation
 * rules, including string, number, date, file validation, etc., and provides
 * a consistent structure for validating inputs.
 *
 * Properties:
 * - idValidationSchema: Schema to validate unique identifiers.
 * - categoryValidationSchema: Schema for validating category inputs.
 *
 * - validMongooseId: Validation for valid MongoDB ObjectId.
 * - validMongooseIdArray: Validation for an array of valid MongoDB ObjectIds.
 *
 * - nonEmptyString: Validation for non-empty string.
 * - nonEmptyBangliString: Validation for non-empty Bangla strings.
 * - nonEmptyEnglishString: Validation for non-empty English strings.
 *
 * - nonEmptyStringArray: Validation for arrays of non-empty strings.
 * - nonEmptyBangliStringArray: Validation for arrays of non-empty Bangla strings.
 * - nonEmptyEnglishStringArray: Validation for arrays of non-empty English strings.
 *
 * - optionalNonEmptyString: Validation for optional non-empty string.
 * - optionalNonEmptyBangliString: Validation for optional non-empty Bangla strings.
 * - optionalNonEmptyEnglishString: Validation for optional non-empty English strings.
 *
 * - nonNegativeNumber: Validation for non-negative numbers.
 * - validDate: Validation for properly formatted dates.
 * - booleanString: Validation for strings representing boolean values.
 *
 * - validFile: Validation for files with specific criteria.
 * - filesValidator: Handles validation for multiple files.
 * - uploadedFile: Validation for uploaded file objects.
 *
 * - validPassword: Validation for password fields following security policies.
 *
 * - validEmail: Validation for email addresses.
 * - validEmailArray: Validation for an array of email addresses.
 *
 * - validMobileNumber: Validation for valid mobile numbers.
 * - validMobileNumberArray: Validation for an array of valid mobile numbers.
 *
 * - validBangladeshiNidCardNumber: Validation for Bangladeshi NID (National ID) card number.
 *
 * - validUrl: Validation for valid URLs.
 * - validUrlArray: Validation for an array of valid URLs.
 *
 * - bankInformation: Validation for bank information objects.
 * - addressDetails: Validation for address detail objects.
 *
 * - enumValidation: General validation for enum-based values.
 *
 * - validBloodGroup: Validation for blood group string values.
 */
const schemaShared = {
    idValidationSchema,
    categoryValidationSchema,

    validMongooseId,
    validMongooseIdArray,

    nonEmptyString,
    nonEmptyBangliString,
    nonEmptyEnglishString,

    nonEmptyStringArray,
    nonEmptyBangliStringArray,
    nonEmptyEnglishStringArray,

    optionalNonEmptyString,
    optionalNonEmptyBangliString,
    optionalNonEmptyEnglishString,

    nonNegativeNumber,
    validDate,
    booleanString,

    validFile,
    filesValidator,
    uploadedFile,

    validPassword,

    validEmail,
    validEmailArray,

    validMobileNumber,
    validMobileNumberArray,

    validBangladeshiNidCardNumber,

    validUrl,
    validUrlArray,

    bankInformation,
    addressDetails,

    enumValidation,

    validBloodGroup,
};

export default schemaShared;
