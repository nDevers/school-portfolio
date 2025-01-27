'use strict';

import fs from 'fs';
import path from 'path';

/**
 * Represents the file system path to the 'shared' directory.
 * The path is constructed by resolving the current working directory and appending 'shared' to it.
 * It can be used to reference or access files and sub-directories located within the 'shared' directory.
 *
 * The generated path ensures compatibility across different operating systems by using
 * appropriate path separators and resolving platform-specific differences.
 *
 * @type {string}
 */
const directoryPath = path.join(path.resolve(), 'shared');

/**
 * An array of directory names that should be excluded from specific operations
 * or processes, such as file scanning or builds.
 *
 * This list typically contains directories that are either unnecessary or
 * irrelevant for the intended operation, such as temporary files, build artifacts,
 * or documentation sources.
 *
 * @type {string[]}
 */
const excludedDirectories = ['node_modules', 'build', 'documentation'];

/**
 * A list of file extensions to be included in a specific operation or process.
 *
 * This variable specifies the file extensions that are considered valid or acceptable.
 * It is used to filter or limit the scope to files matching the specified extensions.
 *
 * The variable currently contains a single item, representing JavaScript files.
 * Typically, it can be expanded to include additional extensions as required.
 *
 * @type {string[]}
 */
const includedExtensions = ['.js'];

/**
 * An array containing filenames that should be excluded from a specific operation
 * (e.g., processing, logging, or cleanup). The filenames are specified as strings,
 * matching their respective extensions or names.
 *
 * This variable is typically used to ignore files with specific characteristics
 * or extensions, such as log files.
 */
const excludedFiles = ['.log'];

/**
 * Adds the 'use strict'; directive to the top of a given JavaScript file if it is not already present.
 * Reads the content of the specified file, checks for the existence of 'use strict'; at the top,
 * and adds it if necessary. Writes the updated content back to the same file.
 *
 * @param {string} filePath - The path to the JavaScript file to be updated.
 */
const addUseStrictToFile = (filePath) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file: ${filePath}`, err);
            return;
        }

        // Check if 'use strict'; is already at the top of the file
        if (!data.startsWith("'use strict';")) {
            const result = `'use strict';\n\n${data}`;
            fs.writeFile(filePath, result, 'utf8', (err) => {
                if (err) {
                    console.error(`Error writing to file: ${filePath}`, err);
                } else {
                    console.info(`Added 'use strict'; to ${filePath}`);
                }
            });
        }
    });
};

/**
 * Recursively traverses a given directory, processing files based on inclusion and exclusion criteria.
 *
 * This function reads the contents of a directory and processes its entries. If an entry is a directory
 * and not part of the excluded directories list, the function will recursively call itself to traverse
 * deeper into the directory. For files, it checks whether the file has an included extension and does
 * not match any exclusion patterns. Matching files are processed by adding "use strict" to them.
 *
 * @param {string} dir - The absolute or relative path to the directory to traverse.
 *
 * @throws {Error} If there is an error reading the directory, an error message will be logged
 *                 and the process will exit with a failure code.
 */
const traverseDirectory = (dir) => {
    fs.readdir(dir, { withFileTypes: true }, (err, entries) => {
        if (err) {
            console.error(`Could not list the directory: ${dir}`, err);
            process.exit(1);
        }

        entries.forEach((entry) => {
            const filePath = path.join(dir, entry.name);

            // Skip excluded directories
            if (
                entry.isDirectory() &&
                !excludedDirectories.includes(entry.name)
            ) {
                traverseDirectory(filePath);
            }

            // Process files with included extensions, excluding specific patterns
            if (
                entry.isFile() &&
                includedExtensions.some((ext) => filePath.endsWith(ext)) &&
                !excludedFiles.some((pattern) => filePath.includes(pattern))
            ) {
                addUseStrictToFile(filePath);
            }
        });
    });
};

// Start the directory traversal from the specified directory path
traverseDirectory(directoryPath);
