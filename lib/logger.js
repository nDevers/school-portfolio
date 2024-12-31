'use strict';

import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';

/**
 * A custom log format for Winston logger.
 *
 * Combines the timestamp and printf formatters to create a specific log output.
 * The output format consists of a timestamp, log level (in uppercase), and the log message.
 */
const customFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
);

/**
 * A Winston transport for logging messages to rotating daily log files with customized settings.
 *
 * `dailyRotateFileTransport` is configured to save logs to the specified directory and file format.
 * It rotates log files daily based on the specified date pattern and retains logs for a set number of days.
 * The transport also allows logging messages of a certain minimum level and applies a custom format.
 *
 * Configuration options:
 * - `dirname`: Specifies the directory where log files are saved.
 * - `filename`: Defines the filename pattern, including a placeholder for the date.
 * - `datePattern`: Determines the frequency of log rotation, here set to rotate daily.
 * - `maxFiles`: Sets the maximum retention duration for log files (e.g., '30d' for 30 days).
 * - `level`: Specifies the minimum logging level for entries to be captured (e.g., 'info').
 * - `format`: Provides a custom format for the log entries.
 *
 * This transport is part of the winston logging library, particularly useful for time-based log rotation.
 */
const hourlyRotateFileTransport = new winston.transports.DailyRotateFile({
    dirname: path.resolve(process.cwd(), 'logs'),
    filename: 'combined_%DATE%.log',
    datePattern: 'YYYY-MM-DD_HH',
    maxFiles: '30d',
    level: 'info',
    format: customFormat,
});

/**
 * Represents a Winston DailyRotateFile transport for logging error messages.
 *
 * This transport rotates log files daily and stores them in a specified directory,
 * using a filename pattern that includes a date placeholder. It is configured to
 * manage a specific maximum retention period for older log files and works only for
 * error-level logs. Additionally, a custom format is applied to the log output for
 * consistency and readability.
 *
 * @var {hourlyRotateErrorFileTransport} hourlyRotateErrorFileTransport - A transport instance used to log error-level messages with daily rotation.
 */
const hourlyRotateErrorFileTransport = new winston.transports.DailyRotateFile({
    dirname: path.resolve(process.cwd(), 'logs'),
    filename: 'errors_%DATE%.log',
    datePattern: 'YYYY-MM-DD_HH',
    maxFiles: '30d',
    level: 'error',
    format: customFormat,
});

/**
 * Logger instance configured using Winston logging library.
 * Provides flexible logging functionality with various transports and formatting.
 *
 * Properties:
 * - Configured to log messages at the "info" level and above.
 * - Uses a custom logging format defined by the variable `customFormat`.
 * - Includes multiple logging transport mechanisms for different use cases:
 *   - Console transport: Writes formatted logs to the console output.
 *   - File transports with daily file rotation:
 *     - `dailyRotateFileTransport`: Handles general logs with automatic daily file rotation.
 *     - `dailyRotateErrorFileTransport`: Specifically handles error logs with daily file rotation.
 */
const logger = winston.createLogger({
    level: 'info',
    format: customFormat, // Apply the custom format globally
    transports: [
        new winston.transports.Console({
            format: customFormat,
        }),
        hourlyRotateFileTransport, // All logs with daily rotation
        hourlyRotateErrorFileTransport, // Error logs with daily rotation
    ],
});

export default logger;
