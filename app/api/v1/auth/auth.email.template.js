import sendEmail from '@/lib/email';

/**
 * Sends a notification email to the user upon detecting a successful login to their account.
 *
 * @param {string} email - The email address of the user to send the notification to.
 * @param {string} name - The name of the user to personalize the notification message.
 * @param {string} deviceType - The type of device used for the login (e.g., mobile, desktop).
 * @returns {Promise<void>} Resolves when the email has been successfully sent.
 */
const successfulLoginNotification = async (email, name, deviceType) => {
    const subject = 'New login detected';
    const htmlContent = `
        <h3>Dear ${name},</h3>
        
        <p>A new login was detected from a ${deviceType} device on your account.</p>
        <p>If this wasn't you, please contact support immediately.</p>
        
        <p>Thank you for being with us!</p>
        <p>Warm regards,</p>
        <p>BCS Management Team</p>
    `;

    await sendEmail(email, subject, htmlContent);
};

/**
 * Sends a notification email to a user regarding a failed login attempt.
 * This function informs the user of a failed login attempt on their account
 * and provides recommendations to ensure account security.
 *
 * @param {string} email - The email address of the recipient.
 * @param {string} name - The name of the recipient.
 * @param {string} deviceType - The type of device from which the failed login attempt was detected.
 * @returns {Promise<void>} - A promise that resolves once the email has been successfully sent.
 */
const failedLoginNotification = async (email, name, deviceType) => {
    const subject = 'Failed login attempt detected';
    const htmlContent = `
        <h3>Dear ${name},</h3>
        
        <p>We detected a failed login attempt on your account from a ${deviceType} device.</p>
        <p>If this was you, please ensure you are using the correct credentials.</p>
        <p>If this wasn't you, we strongly recommend updating your password and contacting support immediately.</p>
        
        <p>Thank you for being with us!</p>
        <p>Warm regards,</p>
        <p>BCS Management Team</p>
    `;

    await sendEmail(email, subject, htmlContent);
};

/**
 * Sends a password reset notification email to a user.
 *
 * The email includes a personalized message with the user's name and
 * a reset link to reset their password. The reset link is valid for a limited time.
 * This function is designed to notify users about password reset requests
 * and provide instructions to securely reset their account password.
 *
 * @param {string} email - The email address of the recipient.
 * @param {string} name - The name of the recipient to personalize the message.
 * @param {string} resetLink - The URL link allowing the recipient to reset their password.
 * @returns {Promise<void>} Resolves when the email is successfully sent.
 */
const resetPasswordRequestNotification = async (email, name, resetLink) => {
    const subject = 'Reset Your Password';
    const htmlContent = `
        <h3>Dear ${name},</h3>
        
        <p>We received a request to reset your password.</p>
        <p>If you made this request, please click the link below to reset your password:</p>
        <p><a href="${resetLink}" style="color: #007bff; text-decoration: none;">Reset My Password</a></p>
        <p>This link will expire in 5 min. If you did not request a password reset, you can safely ignore this email.</p>
        
        <p>Thank you for being with us!</p>
        <p>Warm regards,</p>
        <p>BCS Management Team</p>
    `;

    await sendEmail(email, subject, htmlContent);
};

/**
 * Sends a notification email to inform the user that their password has been successfully reset.
 *
 * @async
 * @function resetPasswordSuccessfulNotification
 * @param {string} email - The email address of the user to send the notification to.
 * @param {string} name - The name of the user to personalize the notification email.
 * @returns {Promise<void>} A promise that resolves when the email has been sent successfully.
 */
const resetPasswordSuccessfulNotification = async (email, name) => {
    const subject = 'Password Reset Successful';
    const htmlContent = `
        <h3>Dear ${name},</h3>
        
        <p>Your password has been successfully reset.</p>
        <p>If you did not request this password reset, please contact our support team immediately.</p>
        
        <p>Thank you for being with us!</p>
        <p>Warm regards,</p>
        <p>BCS Management Team</p>
    `;

    await sendEmail(email, subject, htmlContent);
};

/**
 * Sends a notification email to the user indicating that their password reset attempt has failed.
 *
 * @param {string} email - The email address of the recipient.
 * @param {string} name - The name of the recipient.
 *
 * This function informs the user about a failed password reset attempt. It provides reasons such as an
 * expired or invalid password reset link and advises the user to request a new link. Additionally, it
 * encourages users to contact support if the action was not initiated by them.
 */
const resetPasswordFailedNotification = async (email, name) => {
    const subject = 'Password Reset Failed';
    const htmlContent = `
        <h3>Dear ${name},</h3>
        
        <p>We attempted to reset your password, but the request could not be completed due to an issue.</p>
        <p>This could happen if the reset link has expired or is invalid.</p>
        <p>If you still need to reset your password, please request a new password reset link and try again.</p>
        
        <p>If this wasn't you, please contact our support team immediately.</p>
        
        <p>Thank you for being with us!</p>
        <p>Warm regards,</p>
        <p>BCS Management Team</p>
    `;

    await sendEmail(email, subject, htmlContent);
};

/**
 * Represents a collection of email notification templates used for authentication events.
 *
 * @type {Object}
 * @property {Function} successfulLoginNotification - Template for notifying about a successful login.
 * @property {Function} failedLoginNotification - Template for notifying about a failed login attempt.
 * @property {Function} resetPasswordRequestNotification - Template for notifying about a password reset request.
 * @property {Function} resetPasswordSuccessfulNotification - Template for notifying about a successful password reset.
 * @property {Function} resetPasswordFailedNotification - Template for notifying about a failed password reset attempt.
 */
const authEmailTemplate = {
    successfulLoginNotification,
    failedLoginNotification,
    resetPasswordRequestNotification,
    resetPasswordSuccessfulNotification,
    resetPasswordFailedNotification,
};

export default authEmailTemplate;
