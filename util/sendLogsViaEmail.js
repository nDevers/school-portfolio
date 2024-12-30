import fs from 'fs';
import path from 'path';

import logger from '@/lib/logger';

import configurations from '@/configs/configurations';
import sendEmail from '@/lib/email';

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

/**
 * Function to send the logs via email.
 */
const sendLogsViaEmail = async () => {
    const logsDir = path.resolve(process.cwd(), 'logs');
    const currentDate = new Date().toISOString().split('T')[0];
    const currentHour = new Date().getHours();
    const logFilePath = path.join(
        logsDir,
        `combined_${currentDate}_${currentHour}.log`
    );

    console.log(`Looking for log file: ${logFilePath}`);
    if (!fs.existsSync(logsDir)) {
        console.warn(
            `Logs directory does not exist. Creating directory at: ${logsDir}`
        );
        fs.mkdirSync(logsDir, { recursive: true });
    }

    if (fs.existsSync(logFilePath)) {
        const subject = `Hourly Logs for ${currentDate}, Hour ${currentHour}`;
        const html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
                <h3 style="color: #2c3e50;">Hello,</h3>
                <p>Attached, you will find the log file for <strong>${currentDate}, Hour ${currentHour}</strong>. Please review it for further details.</p>

                <p>If you encounter any issues or have questions, please feel free to reach out to our support team.</p>

                <p>Thank you for using our service!</p>

                <p style="color: #7f8c8d;">Best regards,</p>
                <p style="color: #7f8c8d;">BCS Management Team</p>
            </div>
        `;
        const attachments = [
            {
                path: logFilePath,
            },
        ];

        try {
            await sendEmail(
                configuration.systemAdmin.email,
                subject,
                html,
                attachments
            );
            logger.info(
                `Logs sent successfully for ${currentDate}, Hour ${currentHour}`
            );
        } catch (error) {
            logger.error(`Failed to send logs: ${error.message}`);
        }
    } else {
        logger.warn(
            `No logs found for ${currentDate}, Hour ${currentHour} to send.`
        );
        console.log(`Logs directory content: ${fs.readdirSync(logsDir)}`);
    }
};

export default sendLogsViaEmail;
