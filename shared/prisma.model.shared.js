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
export const GalleryPhotoModel = prisma.GalleryPhoto;
export const GalleryVideoModel = prisma.GalleryVideo;
export const HomeCarouselModel = prisma.HomeCarousel;
export const NewsletterModel = prisma.Newsletter;
export const SchoolAchievementModel = prisma.SchoolAchievement;
export const SchoolInfoModel = prisma.SchoolInfo;
export const SchoolSpeechModel = prisma.SchoolSpeech;
export const ContactModel = prisma.Contact;
export const AdminModel = prisma.Admin;