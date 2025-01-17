/**
 * PM2 configuration file for managing the application processes.
 * This configuration ensures efficient resource utilization and optimal performance.
 *
 * @module PM2Config
 */

module.exports = {
    /**
     * List of applications to be managed by PM2.
     * Each application is defined as an object with its specific configuration.
     */
    apps: [
        {
            /**
             * Name of the application for identification in PM2.
             * @type {string}
             */
            name: 'school-portfolio',

            /**
             * The script to execute for running the application.
             * In this case, it runs the npm command.
             * @type {string}
             */
            script: 'npm',

            /**
             * Arguments to pass to the script.
             * Here, it specifies the 'start' command for npm.
             * @type {string}
             */
            args: 'start',

            /**
             * Number of instances to spawn.
             * Use 'max' to spawn as many instances as the number of CPU cores available.
             * @type {string}
             */
            instances: 'max',

            /**
             * Execution mode for the application.
             * 'cluster' mode allows the application to scale across all available CPU cores.
             * @type {string}
             */
            exec_mode: 'cluster',

            /**
             * Whether to enable live reload for the application.
             * Set to `true` for development environments to watch for file changes.
             * @type {boolean}
             */
            watch: false,

            /**
             * Environment variables specific to the application.
             * These are accessible within the application at runtime.
             * @type {Object}
             */
            env: {
                /**
                 * The environment in which the application is running.
                 * Typical values: 'development', 'production', etc.
                 * @type {string}
                 */
                NODE_ENV: 'production',

                /**
                 * The port on which the application will listen for requests.
                 * @type {number}
                 */
                PORT: 3000,
            },
        },
    ],
};
