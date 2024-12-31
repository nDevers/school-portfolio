import cron from 'node-cron';
import logger from '@/lib/logger';

import sendLogsViaEmail from '@/util/sendLogsViaEmail';
import createDefaultAdmin from '@/util/createDefaultAdmin';

let isCronJobRunning = false; // Flag to prevent multiple initiations

const scheduleCronJob = () => {
    if (isCronJobRunning) {
        logger.warn('Cron job is already running. Skipping re-initiation.');

        return;
    }

    isCronJobRunning = true;
    logger.info('Scheduling the cron job...');

    cron.schedule('0 * * * *', async () => {
        logger.info('Initiating email log sending task...');
        await sendLogsViaEmail();

        logger.info('Initiating create default admin task...');
        await createDefaultAdmin();
    });

    logger.info('Cron job scheduled successfully.');
};

export default scheduleCronJob;
