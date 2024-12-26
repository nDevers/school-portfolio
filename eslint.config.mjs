import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        files: ['**/*.{ts,js,mjs,cjs,tsx,jsx}'],
    },

    {
        languageOptions: {
            globals: {
                ...globals.browser, // Existing browser globals
                Buffer: 'readonly', // Add Buffer as a global variable
                process: 'readonly', // Add process as a global variable
                module: 'readonly', // Add module as a global variable
                require: 'readonly', // Add require as a global variable
            },
        },
    },

    pluginJs.configs.recommended,
    pluginReact.configs.flat.recommended,

    {
        settings: {
            react: {
                version: 'detect', // Automatically detect the React version
            },
        },

        rules: {
            'no-console': ['warn', { allow: ['error', 'warn', 'table'] }], // Warns about console usage except for console.error and console.table
            'func-names': 'off', // Turns off the requirement to name functions
            'no-underscore-dangle': 'off', // Allows dangling underscores in identifiers
            'consistent-return': 'off', // Does not require function return values to be consistent
            'jest/expect-expect': 'off', // Turns off a rule that expects a Jest test to have an assertion
            'security/detect-object-injection': 'off', // Disables a security rule about object injection that may not be applicable
            quotes: [
                'error', // Enforces the use of single quotes
                'single',
                { avoidEscape: true, allowTemplateLiterals: true },
            ],
            semi: ['error', 'always'], // Requires semicolons at the end of statements
            'prefer-arrow-callback': ['error', { allowNamedFunctions: false }], // Enforces the use of arrow functions for callbacks
            'prefer-const': 'error', // Requires use of const for variables that are never reassigned
            'arrow-spacing': ['error', { before: true, after: true }], // Enforces space around the arrow of arrow functions
            'no-var': 'error', // Requires let or const, not var
            'object-shorthand': ['error', 'always'], // Requires object literal shorthand syntax
            'prefer-template': 'error', // Prefers template literals over string concatenation
            eqeqeq: ['error', 'always'], // Enforces the use of strict equality (===)
            'template-curly-spacing': 'error', // Enforces spacing around embedded expressions of template strings
            'prefer-rest-params': 'error', // Suggests using rest parameters instead of arguments
            'no-new-symbol': 'error', // Disallows new operators with the Symbol object
            'symbol-description': 'error', // Requires a description when creating symbols
            'prefer-spread': 'error', // Prefer the use of the spread operator (...) to call variadic functions
            'no-duplicate-imports': 'error', // Disallows duplicate imports
            'no-unused-vars': 'warn',

            'react/react-in-jsx-scope': 'off', // Disable rule since React is not required in scope
            'react/jsx-uses-react': 'off', // Disable this rule as well
            'react/prop-types': 'off', // Disable prop-types rule
        },
    },

    {
        // Note: there should be no other properties in this object
        ignores: [
            '.next/**', // Ignores all files in the .next folder
            '.idea/**', // Ignores all files in the .idea folder
            '.yarn/**', // Ignores all files in the .yarn folder
            'node_modules/**', // Ignores all files in node_modules
            'build/**', // Ignores all files in the build output directory
            'logs/**', // Ignores log files
            'yarn.lock', // Ignores the yarn lock file
            'src/modules/api/documentation/**', // Ignores documentation files
        ],
    },
];
