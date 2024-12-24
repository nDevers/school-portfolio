import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

import logger from "@/lib/logger";

import generateFileLink from './generateFileLink';
import {BadRequestError} from "@/util/asyncHandler";

/**
 * Generates a unique file name based on the provided name, ensuring uniqueness
 * through the inclusion of a UUID and using a sanitized version of the original name.
 *
 * @function
 * @param {string} name - The original file name including its extension.
 * @returns {string} - A new file name that combines a UUID, the sanitized original name, and the original file extension.
 */
const generateUniqueFileName = (name) => {
    const fileId = uuidv4(); // Generate a unique file ID
    const originalExtension = path.extname(name); // Get the original file extension
    const sanitizedOriginalName = path.basename(name, originalExtension).replaceAll(" ", "_"); // Get the base name without extension

    return `${fileId}_${sanitizedOriginalName}${originalExtension}`;
};

// Convert the file data to a Buffer
/**
 * Asynchronously creates a buffer from the provided file.
 *
 * This function reads the content of the given file and converts it
 * into a buffer using its ArrayBuffer representation.
 *
 * @param {File} file - The file object to process, typically obtained from user input or a file system API.
 * @returns {Promise<Buffer>} A promise that resolves to a Buffer containing the file's binary data.
 */
const createFileBuffer = async (file) => Buffer.from(await file.arrayBuffer());

/**
 * Asynchronously uploads a file, saves it to the specified directory, and generates a file link.
 *
 * @param {Object} request - The request object used to generate the file link.
 * @param {Object} file - The file object containing file data to be saved. Must include a `name` property.
 * @throws {BadRequestError} If no file is provided.
 * @returns {Promise<{fileLink: string, fileId: string}>} An object containing the publicly accessible file link and the unique file identifier.
 */
const uploadFile = async (request, file) => {
    if (!file) throw new BadRequestError("No files received.");

    const buffer = await createFileBuffer(file);
    const fileName = generateUniqueFileName(file.name);
    const filePath = `public/assets/${fileName}`;
    const fullDirPath = path.join(process.cwd(), 'public/assets');

    // Ensure the directory exists (create it if it doesn't)
    await fs.mkdir(fullDirPath, { recursive: true });

    // Write the file to the specified directory with the new filename
    await fs.writeFile(path.join(process.cwd(), filePath), buffer);

    const fileLink = generateFileLink(request, `assets/${fileName}`);

    return { fileLink, fileId: fileName };
};

/**
 * Asynchronously uploads an array of files to the server's public assets directory and returns metadata about the uploaded files.
 *
 * @param {Object} request - The HTTP request object used to generate file links.
 * @param {Array<Object>} files - An array of file objects to upload. Each file object should contain at least a `name` property representing the file name.
 * @throws {BadRequestError} Throws an error if no files are provided or if the `files` array is empty.
 * @returns {Promise<Array<Object>>} Resolves to an array of objects, where each object contains metadata for an uploaded file:
 * - `fileLink`: The URL link to access the uploaded file.
 * - `fileId`: The unique identifier or name of the uploaded file.
 */
const uploadFiles = async (request, files) => {
    if (!files || files.length === 0) throw new BadRequestError("No files received.");

    const fullDirPath = path.join(process.cwd(), 'public/assets');
    await fs.mkdir(fullDirPath, { recursive: true }); // Ensure the directory exists

    const uploadedFiles = await Promise.all(
        files.map(async (file) => {
            const buffer = await createFileBuffer(file);
            const fileName = generateUniqueFileName(file.name);
            const filePath = `public/assets/${fileName}`;

            // Write the file to the specified directory with the new filename
            await fs.writeFile(path.join(process.cwd(), filePath), buffer);

            // Generate the file link and ID
            const fileLink = generateFileLink(request, `/assets/${fileName}`);
            return { fileLink, fileId: fileName };
        })
    );

    return uploadedFiles;
};

/**
 * Asynchronously deletes a file from the file system if it exists.
 *
 * This function attempts to locate and delete the specified file using
 * the provided file identifier. If the file does not exist, it logs
 * an error message and skips the deletion process. If any other error
 * occurs during the operation, the error is re-thrown for handling upstream.
 *
 * @param {string} fileId - The unique identifier for the file to be deleted.
 *                          This is combined with a specific directory path
 *                          to locate the full file path.
 * @throws {Error} Throws an error if the file operation encounters an
 *                 issue other than the file being nonexistent.
 */
const deleteFile = async (fileId) => {
    const filePath = path.join(process.cwd(), 'public/assets', fileId);

    try {
        // Check if file exists before deleting
        await fs.access(filePath);
        await fs.unlink(filePath);

        logger.info(`File ${fileId} deleted successfully.`);
    } catch (err) {
        // If the error is because the file doesn't exist, ignore it
        if (err.code === 'ENOENT') {
            logger.error(`File ${fileId} does not exist. Skipping deletion.`);
        } else {
            // If it's another type of error, throw it
            throw err;
        }
    }
};

/**
 * An object containing methods for handling local file operations.
 *
 * @property {Function} uploadFile - Handles the process of uploading a single file.
 * @property {Function} uploadFiles - Manages the uploading of multiple files.
 * @property {Function} deleteFile - Deletes a specified file from the local system.
 */
const localFileOperations = {
    uploadFile,
    uploadFiles,
    deleteFile,
};

export default localFileOperations;
