/**
 * ESLint Configuration File
 * @fileoverview This configuration file sets up linting rules and environments for a Next.js project.
 * It includes settings for React, ECMAScript 2020 features, and configures plugins
 * for additional linting capabilities specific to Next.js and React.
 */

import react from 'eslint-plugin-react';
import jest from 'eslint-plugin-jest';
import security from 'eslint-plugin-security';
import prettier from 'eslint-plugin-prettier';

export default {
    languageOptions: {
        ecmaVersion: 2024,
        sourceType: 'module',
        globals: {},
    },

    // Plugins are now included as objects
    plugins: {
        react,
        jest,
        security,
        prettier,
    },

    rules: {
        // Basic JavaScript and React rules
        'no-unused-vars': 'error',
        'no-undef': 'error',
        'react/react-in-jsx-scope': 'off',
        'react/jsx-uses-react': 'off',

        // Your custom rules
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        semi: ['error', 'always'],
        quotes: ['error', 'single', { avoidEscape: true }],
        'jsx-quotes': ['error', 'prefer-double'],
    },

    settings: {
        react: {
            version: 'detect',
        },
    },

    // Paths to ignore during linting
    ignores: [
        '.idea/**', // Ignores all files in the .idea folder
        '.yarn/**', // Ignores all files in the .yarn folder
        'node_modules/**', // Ignores all files in node_modules
        'build/**', // Ignores all files in the build output directory
        'logs/**', // Ignores log files
        'yarn.lock', // Ignores the yarn lock file
        'src/modules/api/documentation/**', // Ignores documentation files
    ],
};
