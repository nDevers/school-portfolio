'use server';

import { promises as fs } from 'fs';

/**
 * The `decoder` variable is an instance of the `TextDecoder` class,
 * designed to decode text from a specific encoding standard.
 * This particular instance utilizes the "utf-8" character encoding,
 * allowing it to decode UTF-8 encoded bytes into readable text.
 *
 * The `TextDecoder` is useful for working with binary data, converting
 * it into human-readable string formats, particularly when dealing
 * with file data or streams that are UTF-8 encoded.
 */
const decoder = new TextDecoder('utf-8');

/**
 * Asynchronously reads the content of a file.
 *
 * @param {string} filePath - The path to the file that needs to be read.
 * @param {boolean} [parseAsJson=false] - Optional flag to indicate if the file content should be parsed as JSON.
 * @returns {Promise<string|Object|null>} Resolves to the file content as a string,
 * or as a JavaScript object if `parseAsJson` is true. Returns null if an error occurs.
 */
const readFileContent = async (filePath, parseAsJson = false) => {
    try {
        // Read the file contents as a Buffer
        const data = await fs.readFile(filePath);

        // Decode the file contents into a string
        const content = decoder.decode(data);

        // If JSON parsing is requested, parse the content as JSON
        if (parseAsJson) {
            return JSON.parse(content);
        }

        // Return the file content as a string
        return content;
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        return null;
    }
};

export default readFileContent;
