import globals from 'globals';
import pluginJs from '@eslint/js';
import prettier from 'eslint-plugin-prettier';

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.jest,
    },
  },
  {
    languageOptions: {
      globals: globals.node,
    },
  },
  pluginJs.configs.recommended,
  {
    plugins: {
      prettier, // Define the prettier plugin correctly
    },
    rules: {
      quotes: ['error', 'single'], // Enforce single quotes
      'prettier/prettier': 'error', // Treat Prettier issues as errors
    },
  },
];
