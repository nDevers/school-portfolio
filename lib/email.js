import nodemailer from 'nodemailer';

import logger from "@/lib/logger";

import configurations from "@/configs/configurations";

/**
 * Represents the configuration settings retrieved asynchronously.
 *
 * The `configuration` variable holds the result of calling the
 * `configurations()` function, which is expected to return
 * application-specific settings or environmental configurations.
 *
 * This variable is resolved asynchronously and can be used to access
 * various settings required for the operation of the application.
 */
const configuration = await configurations();

// Create a transporter object with the configuration from environment variables
/**
 * A configured Nodemailer transporter instance for sending emails.
 *
 * The transporter is set up using the SMTP configuration provided in the application configuration.
 * It allows sending emails through the specified SMTP server with authentication.
 *
 * Configuration properties used:
 * - `host`: The hostname or IP address of the SMTP server.
 * - `port`: The port number to connect to the SMTP server. Defaults to 587 if not specified.
 * - `secure`: Boolean indicating if the connection should use TLS. It is true only for port 465.
 * - `auth.user`: The username for SMTP server authentication.
 * - `auth.pass`: The password for SMTP server authentication.
 */
const transporter = nodemailer.createTransport({
    host: configuration.email.smtp.host,
    port: Number(configuration.email.smtp.port), // Default to port 587 if not specified
    secure: Number(configuration.email.smtp.port) === 465, // Use TLS if port 465
    auth: {
        user: configuration.email.smtp.auth.user,
        pass: configuration.email.smtp.auth.pass,
    },
});

/**
 * Asynchronously sends an email using the configured email transporter.
 *
 * This function sends an email with the specified subject and HTML content
 * to the provided email address. If the emailAddress parameter is not supplied,
 * the default email address from the systemAdmin configuration is used.
 *
 * @param {string} [emailAddress=configuration.systemAdmin.email] - The recipient's email address. Defaults to the system administrator's email address from the configuration.
 * @param {string} subject - The subject line for the email.
 * @param {string} html - The HTML content of the email.
 * @throws {Error} Throws an error if the email cannot be sent.
 * @returns {Promise<Object>} A promise that resolves to an object containing information about the sent email.
 */
const sendEmail = async (emailAddress = configuration.systemAdmin.email, subject, html) => {
    try {
        // Send the email using the transporter
        const info = await transporter.sendMail({
            from: configuration.email.from,
            to: emailAddress,
            subject,
            html,
        });

        logger.info(`Email sent: ${info.messageId}`);
        return info;
    } catch (error) {
        logger.error("Email sending failed:", error);

        throw new Error("Failed to send email");
    }
};

export default sendEmail;
