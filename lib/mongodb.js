import mongoose from 'mongoose';

import configurations from '@/configs/configurations';
import logger from '@/lib/logger';

/**
 * Represents the variable `configuration` that holds the result
 * of calling an asynchronous function `configurations`.
 *
 * This variable is expected to store a configuration object or
 * data relevant to the application's setup or settings.
 *
 * The `configurations` function is used to asynchronously fetch
 * or retrieve specific configuration details that may include
 * settings, preferences, or environment variables.
 */
const configuration = await configurations();

// Function to handle reconnection logic
/**
 * An asynchronous function that handles reconnection attempts to the database
 * in case of a disconnection. Logs warnings, success messages, and errors
 * related to the reconnection process.
 *
 * The function attempts to reconnect to the database using the connection
 * string defined in the application configuration. If the reconnection
 * succeeds, it logs a success message. If the reconnection fails, it logs
 * an error message with details.
 *
 * This function utilizes the Mongoose library for database reconnection and
 * relies on a logger to record events.
 */
const handleReconnection = async () => {
    logger.warn('DATABASE DISCONNECTED! ATTEMPTING TO RECONNECT');
    try {
        await mongoose.connect(configuration.database.mongodb.connectionString);
        logger.info('DATABASE RECONNECTED');
    } catch (error) {
        logger.error(`RECONNECTION FAILED: ${error.message}`);
    }
};

// Function to connect to the database
/**
 * Asynchronous function to establish and manage a MongoDB connection using Mongoose.
 *
 * This function sets up event listeners to handle various MongoDB connection states:
 * - Logs an error if a database error occurs.
 * - Logs a message when the database is in the process of disconnecting.
 * - Handles reconnection logic upon disconnection.
 * - Logs a message when the database successfully reconnects.
 *
 * If the database is already connected, it logs the current database name and skips reconnection.
 * Otherwise, it attempts to connect to the database using the connection string specified in
 * the application configuration. Logs an appropriate message when the connection is successful.
 *
 * Throws an error if the initial database connection attempt fails.
 *
 * @function
 * @async
 * @throws {Error} If the initial database connection attempt fails.
 */
const connect = async () => {
    // Set up event listeners for MongoDB
    mongoose.connection.once('error', (error) => {
        logger.error(`DATABASE ERROR: ${error.message}`);
    });

    mongoose.connection.once('disconnecting', () => {
        logger.info('DATABASE DISCONNECTING');
    });

    mongoose.connection.once('disconnected', handleReconnection);

    mongoose.connection.once('reconnected', () => {
        logger.info('DATABASE RECONNECTED SUCCESSFULLY');
    });

    // Attempt to connect to the database
    try {
        if (mongoose.connection.readyState === 1) {
            // @ts-ignore
            logger.info(
                `DATABASE ALREADY CONNECTED TO: ${mongoose.connection.db.databaseName}`
            );
        } else {
            await mongoose.connect(
                configuration.database.mongodb.connectionString
            );
            // @ts-ignore
            logger.info(
                `DATABASE CONNECTED SUCCESSFULLY TO: '${mongoose.connection.db.databaseName}'`
            );
        }
    } catch (error) {
        logger.error(`INITIAL CONNECTION FAILED: ${error.message}`);
        throw error;
    }
};

// Function to disconnect from the database
/**
 * Asynchronous function to disconnect from the database.
 * Logs the disconnecting process and any potential errors that occur during disconnection.
 * Throws an error if the disconnection process fails.
 */
const disconnect = async () => {
    try {
        logger.info('DISCONNECTING DATABASE');
        await mongoose.disconnect();
        logger.info('DATABASE DISCONNECTED');
    } catch (error) {
        logger.error(`DISCONNECTION ERROR: ${error.message}`);
        throw error;
    }
};

/**
 * Asynchronously starts a new session using Mongoose.
 *
 * This function initiates a session for database operations, allowing
 * for transactional operations with MongoDB. The session can be used
 * to perform operations like committing or aborting transactions.
 *
 * @function
 * @async
 * @returns {Promise<ClientSession>} A promise that resolves to a Mongoose ClientSession object.
 */
const startSession = async () => {
    return mongoose.startSession();
};

// Export the DatabaseService with connect and disconnect methods
/**
 * An object representing utilities for interacting with a MongoDB database.
 * Provides methods for connecting to the database, disconnecting, and
 * starting a session for transactional operations.
 *
 * @property {Function} connect - Establishes a connection to the MongoDB database.
 * @property {Function} disconnect - Closes the active connection to the MongoDB database.
 * @property {Function} startSession - Initiates a new session, often used for transactions.
 */
const mongodb = {
    connect,
    disconnect,
    startSession,
};

export default mongodb;
