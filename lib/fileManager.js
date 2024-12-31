'use strict';

import fs from 'fs';
import path from 'path';

// Create an `uploads` directory if it doesn't exist
/**
 * Represents the directory path used for storing uploaded files.
 * The path is constructed by joining the current working directory
 * with the 'uploads' folder.
 *
 * It is commonly used in file upload operations to define the
 * destination where uploaded files will be saved.
 *
 * @type {string}
 */
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Handles the process of uploading a file by saving it to a specified directory with a unique name.
 *
 * @param {Object} fileData - The file data object containing details about the file to be uploaded.
 * @param {string} fileData.originalname - The original name of the file provided by the user.
 * @param {Buffer} fileData.buffer - The buffer containing the file content.
 * @returns {Promise<Object|null>} A promise that resolves to an object containing the file ID and file path if successful, or null if an error occurs.
 */
const uploadFile = async (fileData) => {
    const uniqueFileName = `${Date.now()}-${fileData.originalname}`;
    const filePath = path.join(uploadsDir, uniqueFileName);

    try {
        // Write file buffer to the specified path
        await fs.promises.writeFile(filePath, fileData.buffer);
        return { fileId: uniqueFileName, filePath };
    } catch (error) {
        console.error('Error saving file:', error);
        return null;
    }
};

/**
 * Deletes a file with the specified file ID from the uploads directory.
 *
 * This asynchronous function takes the file ID, constructs the file path
 * within the uploads directory, and attempts to delete the file. If an
 * error occurs during the deletion process, it logs the error to the console.
 *
 * @param {string} fileId - The ID of the file to be deleted.
 * @returns {Promise<void>} A promise that resolves when the file is deleted or logs an error message if the operation fails.
 */
const deleteFile = async (fileId) => {
    const filePath = path.join(uploadsDir, fileId);
    try {
        await fs.promises.unlink(filePath);
    } catch (error) {
        console.error('Error deleting file:', error);
    }
};

export default {
    uploadFile,
    deleteFile,
};
