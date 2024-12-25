import { Schema, models, model } from 'mongoose';

/**
 * Schema definition for SuperAdmin data.
 *
 * Defines the structure and constraints for SuperAdmin data, including fields such as name, email,
 * password, and tokens for account verification or password reset. It is designed to ensure data
 * integrity and validation for the SuperAdmin entity.
 *
 * @property {String} name - The name of the super admin; required, trimmed string.
 * @property {String} dateOfBirth - Date of birth of the super admin; required field as a string.
 * @property {String} email - Unique email address; required with specific format validation.
 * @property {String} password - Password for the account; required with minimum length and pattern validation.
 * @property {String} [emailVerifyToken] - Token used for email verification; optional, trimmed string.
 * @property {String} [resetPasswordToken] - Token used for resetting the password; optional, trimmed string.
 * @property {Date} [resetPasswordTokenExpiration] - Expiration date and time for the reset password token; optional.
 * @property {Object} timestamps - Automatically includes `createdAt` and `updatedAt` timestamps for the schema.
 */
const superAdminSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        dateOfBirth: {
            type: String, // Use `Date` if you want date parsing, or `String` for flexibility in formats
            required: [true, 'Date of Birth is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
            validate: {
                validator: function (value) {
                    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(
                        value
                    );
                },
                message:
                    'Password must contain an uppercase letter, lowercase letter, number, and special character',
            },
        },
        emailVerifyToken: {
            type: String,
            trim: true,
            description:
                "Token used to verify the (users)'s identity for account creation process.",
        },
        resetPasswordToken: {
            type: String,
            trim: true,
            description:
                "Token used to verify the (users)'s identity for password reset process.",
        },
        resetPasswordTokenExpiration: {
            type: Date,
            trim: true,
            description:
                ' Expiration date and time for the reset password verification token.',
        },
    },
    { timestamps: true }
);

// Virtual field for confirmPassword
superAdminSchema
    .virtual('confirmPassword')
    .get(function () {
        return this._confirmPassword;
    })
    .set(function (value) {
        this._confirmPassword = value;
    });

// Password match validation before saving
superAdminSchema.pre('save', function (next) {
    if (this.password !== this._confirmPassword) {
        const err = new Error('Passwords must match');
        next(err);
    } else {
        next();
    }
});

/**
 * AdminModel serves as the Mongoose model for managing and interacting with the "SuperAdmins" collection in the database.
 * It is initialized either by referencing an existing "SuperAdmins" model from the models registry
 * or by creating a new model using the specified superAdminSchema.
 *
 * The model is used to perform CRUD operations and schema validations for the "SuperAdmins" collection.
 */
const AdminModel =
    models?.SuperAdmins || model('SuperAdmins', superAdminSchema);

export default AdminModel;
