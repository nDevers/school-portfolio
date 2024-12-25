import { z } from 'zod';

import schemaShared from '@/shared/schema.shared';

import { decryptData } from '@/util/crypto';

const { validPassword, validEmail, nonEmptyString } = schemaShared;

/**
 * Represents a variable that stores a validated email address.
 * The email string is processed using the `validEmail` function to ensure it meets
 * the required email format and validation rules.
 * This variable is intended to contain an email address in a valid state.
 */
const email = validEmail('Email');

/**
 * The `password` variable holds the result of a function call to `validPassword`,
 * which validates and potentially processes a password string.
 *
 * The validation ensures the password conforms to specific criteria:
 * 1. The password must be a string.
 * 2. The password should have a minimum length of 8 characters.
 * 3. The password should have a maximum length of 20 characters.
 *
 * This variable represents the processed or validated password after the function's execution.
 */
const password = validPassword('Password', 8, 20);

/**
 * Represents the schema definition for user login validation.
 * Designed to validate the structure of an object containing email and password fields.
 * Ensures strict adherence to the defined schema with no additional properties allowed.
 */
const loginSchema = z
    .object({
        email,
        password,
    })
    .strict(); // Enforce strict mode to disallow extra fields

/**
 * Schema definition for requesting a new password.
 *
 * The `requestNewPassword` object ensures that the input strictly adheres
 * to the defined structure. This schema is used for validating the user-provided
 * data when requesting a password reset.
 *
 * Properties:
 * - email: Represents the email address of the user requesting a new password.
 */
const requestNewPassword = z
    .object({
        email,
    })
    .strict(); // Enforce strict mode to disallow extra fields

/**
 * Schema definition for the `resetPassword` variable.
 *
 * The `resetPassword` schema validates the user input for resetting a password.
 * The schema includes three required fields:
 * - `token`: A non-empty string that represents the reset token.
 * - `password`: The user's new password, expected to meet certain validation rules.
 * - `confirmPassword`: Reconfirmation of the new password, validated for minimum and maximum length.
 *
 * Validation rules applied:
 * - Enforces strict mode, disallowing extra fields in the input object.
 * - Decodes the `password` and `confirmPassword` fields using a decryption utility.
 * - Ensures that the decoded `password` and `confirmPassword` values match. If decoding fails or the passwords do not match, a custom validation error is added.
 *
 * Custom error messages are provided for the following scenarios:
 * - Both `password` and `confirmPassword` are invalid after decryption.
 * - The decoded `password` and `confirmPassword` do not match.
 *
 * This schema is used to ensure secure and consistent validation when a user initiates a password reset process.
 */
const resetPassword = z
    .object({
        token: nonEmptyString('Token'),
        password,
        confirmPassword: validPassword('Confirm password', 8, 20),
    })
    .strict() // Enforce strict mode to disallow extra fields
    .superRefine((data, ctx) => {
        let decodedPassword, decodedConfirmPassword;
        try {
            decodedPassword = decryptData(data?.password); // Decode password
            decodedConfirmPassword = decryptData(data?.confirmPassword); // Decode confirmPassword
        } catch (err) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Invalid encrypted password or confirmPassword',
                path: ['password', 'confirmPassword'],
            });
            return;
        }

        // Check if passwords match after decryption
        if (decodedPassword !== decodedConfirmPassword) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Passwords must match',
                path: ['confirmPassword'],
            });
        }
    });

/**
 * Represents the authentication schema containing various methods related
 * to user authentication processes.
 *
 * @typedef {Object} authSchema
 * @property {Object} loginSchema - The schema object defining the structure and validation rules for user login.
 * @property {Object} requestNewPassword - The schema object representing the structure and rules for requesting a new password.
 * @property {Object} resetPassword - The schema object representing the structure and rules for resetting a user's password.
 */
const authSchema = {
    loginSchema,
    requestNewPassword,
    resetPassword,
};

export default authSchema;
