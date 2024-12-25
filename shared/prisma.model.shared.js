import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export const AboutUsModel = prisma.AboutUs;
export const AcademicModel = prisma.Academic;
export const AnnouncementModel = prisma.Announcement;
export const BlogModel = prisma.Blog;
export const CareerModel = prisma.Career;
export const ConfigurationModel = prisma.Configuration;
export const FacultyModel = prisma.Faculty;
export const FaqModel = prisma.Faq;