import {z} from "zod";
import {Types} from "mongoose";

import constants from "@/constants/constants";

import {decryptData} from "@/util/crypto";

const nonEmptyString = (fieldName, maxCharacter = 100000) => z.string()
    .nonempty(`${fieldName} is required`)
    .max(maxCharacter, `${fieldName} can not be more than ${maxCharacter} characters.`);
const nonEmptyBangliString = (fieldName) => nonEmptyString(fieldName)
    .refine((value) => constants.bangliLanguageRegex.test(value), {
        message: `${fieldName} must contain only Bangla characters.`,
    });
const nonEmptyEnglishString = (fieldName) => nonEmptyString(fieldName)
    .refine((value) => constants.englishLanguageRegex.test(value), {
        message: `${fieldName} must contain only English characters.`,
    });

const nonEmptyStringArray = (fieldName) => z.array(nonEmptyString(fieldName));
const nonEmptyBangliStringArray = (fieldName) => z.array(nonEmptyBangliString(fieldName));
const nonEmptyEnglishStringArray = (fieldName) => z.array(nonEmptyEnglishString(fieldName));

const optionalNonEmptyString = (fieldName) => nonEmptyString(fieldName).optional();
const optionalNonEmptyBangliString = (fieldName) => nonEmptyBangliString(fieldName).optional();
const optionalNonEmptyEnglishString = (fieldName) => nonEmptyEnglishString(fieldName).optional();

const nonNegativeNumber = (fieldName) => z.number().nonnegative(`${fieldName} is required and cannot be negative`);
const booleanString = (fieldName) =>
    z.union([z.boolean(), z.literal('true'), z.literal('false')]).transform(value => {
        if (typeof value === 'boolean') return value;
        return value === 'true'; // Convert 'true' string to boolean true, and 'false' to boolean false
    }).refine(
        (value) => value === true || value === false,
        {
            message: `${fieldName} must be a valid boolean value (true or false)`, // Custom error message with field name
        }
    );

// Dynamic file validator with size check
const validFile = (fieldName, allowedTypes, maxSize) =>
    z.instanceof(File, { message: `${fieldName} must be a file` })
        .refine((file) => file.size > 0, { message: `${fieldName} file cannot be empty` })
        .refine((file) => allowedTypes.includes(file.type), {
            message: `${fieldName} file type must be one of ${allowedTypes.join(", ")}`,
        })
        .refine((file) => file.size <= maxSize, {
            message: `${fieldName} file size must be less than or equal to ${maxSize / (1024 * 1024)}MB`,
        });

// Reusable schema for file arrays with dynamic validation, including min and max limits
const filesValidator = (fieldName, allowedTypes, maxSize, minFiles = 1, maxFiles = Infinity) =>
    z.array(validFile(fieldName, allowedTypes, maxSize))
        .nonempty({ message: "At least one file is required" })
        .min(minFiles, { message: `At least ${minFiles} file(s) must be provided` })
        .max(maxFiles, { message: `No more than ${maxFiles} file(s) can be provided` })
        .refine(files => files.every(file => file.size > 0), {  // Check that no file in the array is empty
            message: `All files in ${fieldName} must be non-empty`
        });

const validPassword = (fieldName = 'Password', minLength = 8, maxLength = 128) =>
    z.string()
        .nonempty(`${fieldName} is required`)
        .transform((val) => decryptData(val)) // Decrypt password before validation
        .refine((val) => val.length >= minLength, { message: `${fieldName} must be at least ${minLength} characters` })
        .refine((val) => val.length <= maxLength, { message: `${fieldName} must be at most ${maxLength} characters` })
        .refine(
            (val) => constants.passwordRegex.test(val),
            { message: `${fieldName} must contain an uppercase letter, lowercase letter, number, and special character` }
        );

const validEmail = (fieldName = 'Email') =>
    nonEmptyString(fieldName) // First, ensure the string is non-empty
        .email(`Invalid ${fieldName.toLowerCase()}`) // Use Zod's email method to check general format
        .regex(
            constants.emailRegex,
            `Invalid ${fieldName.toLowerCase()} format` // Apply the custom regex for stricter validation
        );

const validEmailArray = (fieldName) => z.array(validEmail(fieldName));

const validMobileNumber = (fieldName) => nonEmptyString(fieldName)
    .regex(constants.bangladeshMobileRegex, `${fieldName} must be a valid Bangladeshi mobile number`);

const validMobileNumberArray = (fieldName) => z.array(validMobileNumber(fieldName));

const validBangladeshiNidCardNumber = (fieldName) => nonEmptyString(fieldName)
    .regex(constants.bangladeshNidRegex, {
        message: `${fieldName} must be a valid 10-digit Bangladeshi NID number.`,
    })
    .refine((value) => value.length === 10, {
        message: `${fieldName} must be a 10-digit number.`,
    });

const validMongooseId = (fieldName) => nonEmptyString(`${fieldName} is required`)
    .refine(
        (id) => Types.ObjectId.isValid(id), // Validate if the string is a valid ObjectId format
        { message: `${fieldName} must be a valid ObjectId format` } // Use fieldName in the message
    );

// Define the Zod validation schema
const idValidationSchema = z.object({
    id: validMongooseId('ID'),
}).strict(); // Enforce strict mode to disallow extra fields

const validMongooseIdArray = (fieldName) => z.array(validMongooseId(fieldName));

const validUrl = (fieldName) => nonEmptyString(fieldName).url(`${fieldName} must be a valid URL and must start with "https://"`);

const validUrlArray = (fieldName) => z.array(validUrl(fieldName));

const bankInformation = (fieldName) => z.object({
    bankName: nonEmptyString('Bank name'),
    branchName: nonEmptyString('Branch name'),
}).partial().refine(
    (data) => Object.values(data).some((value) => value?.trim() !== ''),
    {
        message: `${fieldName} must include "bankName" or "branchName" when "hasBankDetails" is true.`,
    }
);

const addressDetails = (fieldName) => z.object({
    village: nonEmptyString(`${fieldName} village`).optional(),
    postOffice: nonEmptyString(`${fieldName} post office`).optional(),
    subdistrict: nonEmptyString(`${fieldName} subdistrict`).optional(),
    district: nonEmptyString(`${fieldName} district`).optional(),
});

const uploadedFile = (fieldName) => z.object({
    id: nonEmptyString(`${fieldName} ID`),
    link: validUrl(`${fieldName} link`),
});

const validDate = (fieldName) => nonEmptyString(fieldName)
    .refine((date) => !isNaN(new Date(date).getTime()), {
        message: `${fieldName} must be a valid date`,
    });

const enumValidation = (fieldName, allowedTypes) => {
    return z.enum(allowedTypes, {
        required_error: `${fieldName} is required`,
        invalid_type_error: `${fieldName} must be one of ${allowedTypes.join(", ")}`
    });
};

const validBloodGroup = (fieldName = 'Blood group') => enumValidation(fieldName, constants.bloodGroupTypes);

const schemaShared = {
    idValidationSchema,

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
