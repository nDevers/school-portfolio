'use strict';

import { PrismaClient } from '@prisma/client';

const prismaServiceClient = new PrismaClient();

const connect = async () => {
    await prismaServiceClient.$connect();
};

const disconnect = async () => {
    await prismaServiceClient.$disconnect();
};

const prisma = {
    connect,
    disconnect,
};

export default prisma;
