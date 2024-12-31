'use strict';

import { AdminModel } from '@/shared/prisma.model.shared';
import prisma from '@/lib/prisma';

import createHashedPassword from '@/util/createHashedPassword';
import configurations from '@/configs/configurations';

/**
 * Asynchronously retrieves and stores the application's configuration settings.
 *
 * This variable holds the result of the `configurations()` function, which is expected
 * to load and return the necessary configuration data required by the application.
 *
 * The configuration may include settings such as API keys, environment variables,
 * database connections, feature toggles, and other customizable options.
 *
 * Ensure that the configurations are correctly retrieved before using any dependent
 * functionality within your application.
 *
 * Note: This variable must be awaited to ensure the asynchronous resolution of the
 * configuration process.
 */
const configuration = await configurations();

const createDefaultAdmin = async () => {
    try {
        const email = configuration.systemAdmin.email;
        const password = configuration.systemAdmin.password;

        // Check if an admin user already exists
        const adminExists = await AdminModel.findUnique({
            where: { email },
        });

        if (!adminExists) {
            // Hash the default password
            const hashedPassword = await createHashedPassword(password);

            // Create the admin user
            const adminUser = await AdminModel.create({
                data: {
                    name: 'Default Admin',
                    email,
                    password: hashedPassword,
                },
            });

            console.info(`Default admin user created: ${adminUser.email}`);
        } else {
            console.info(
                `Default admin user with email "${email}" already exists.`
            );
        }
    } catch (error) {
        console.error(`Error creating default admin user: ${error.message}`);
    } finally {
        await prisma.disconnect();
    }
};

export default createDefaultAdmin;
