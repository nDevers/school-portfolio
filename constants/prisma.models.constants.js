import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

const AboutUs = prisma.AboutUs;
const Academic = prisma.Academic;

const prismaModelsConstants = {
    AboutUs,
    Academic,
};

export default prismaModelsConstants;