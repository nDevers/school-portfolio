'use strict';

import fs from 'fs';
import path from 'path';

/**
 * The starting directory path where the script will begin processing.
 * Adjust this path based on your project's structure.
 */
const directoryPath = path.join(path.resolve(), 'shared');

/**
 * Directories to exclude from the script's processing.
 */
const excludedDirectories = ['node_modules', 'build', 'documentation'];

/**
 * File extensions to exclude from processing.
 */
const excludedFiles = ['.log'];

/**
 * Adds the 'use strict'; directive to the top of a JavaScript file if it's not already there.
 * @param {string} filePath - The path to the file to modify.
 */
function addUseStrictToFile(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return console.log(err);
        }
        // Check if 'use strict'; is already at the top of the file
        if (!data.startsWith("'use strict';")) {
            const result = "'use strict';\n\n" + data;
            fs.writeFile(filePath, result, 'utf8', (err) => {
                if (err) return console.log(err);
                console.log(`Added 'use strict'; to ${filePath}`);
            });
        } else if (
            entry.isFile() &&
            filePath.endsWith('.js') &&
            !excludedFiles.some((ext) => filePath.endsWith(ext))
        ) {
            addUseStrictToFile(filePath); // Add 'use strict'; to eligible .js files
        }
    });
}

/**
 * Traverses a directory recursively and processes all .js files found by adding 'use strict'; at the top.
 * Skips any directories or files specified in excludedDirectories and excludedFiles.
 * @param {string} dir - The directory to traverse.
 */
function traverseDirectory(dir) {
    fs.readdir(dir, { withFileTypes: true }, (err, entries) => {
        if (err) {
            console.error('Could not list the directory.', err);
            process.exit(1);
        }

        entries.forEach((entry) => {
            const filePath = path.join(dir, entry.name);
            // Check for excluded directories and skip them
            if (
                entry.isDirectory() &&
                !excludedDirectories.includes(entry.name)
            ) {
                traverseDirectory(filePath);
            } else if (
                entry.isFile() &&
                filePath.endsWith('.js') &&
                !excludedFiles.some((ext) => filePath.endsWith(ext))
            ) {
                addUseStrictToFile(filePath); // Add 'use strict'; to eligible .js files
            }
        });
    });
}

// Start the directory traversal from the specified directory path
traverseDirectory(directoryPath);
