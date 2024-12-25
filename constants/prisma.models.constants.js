import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

const AboutUs = prisma.AboutUs;

const prismaModelsConstants = {
    AboutUs,
};

export default prismaModelsConstants;