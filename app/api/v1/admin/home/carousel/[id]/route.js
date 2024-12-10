import { PrismaClient } from '@prisma/client';

import galleryPhotoSchema from "@/app/api/v1/gallery/photo/gallery.photo.schema";
import galleryPhotoConstants from "@/app/api/v1/gallery/photo/gallery.photo.constants";
import sharedResponseTypes from "@/shared/shared.response.types";
import localFileOperations from "@/util/localFileOperations";
import schemaShared from "@/shared/schema.shared";

import asyncHandler from "@/util/asyncHandler";
import parseAndValidateFormData from "@/util/parseAndValidateFormData";
import validateToken from "@/util/validateToken";
import validateUnsupportedContent from "@/util/validateUnsupportedContent";
import galleryPhotoSelectionCriteria from "@/app/api/v1/gallery/photo/gallery.photo.selection.criteria";

const prisma = new PrismaClient();

const { INTERNAL_SERVER_ERROR, NOT_FOUND, CONFLICT, OK } = sharedResponseTypes;
const { idValidationSchema } = schemaShared;

const model = prisma.GalleryPhoto;


