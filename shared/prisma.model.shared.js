import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export const AboutUsModel = prisma.AboutUs;
export const AcademicModel = prisma.Academic;
export const AnnouncementModel = prisma.Announcement;