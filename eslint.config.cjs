const js = require('@eslint/js');
const prettier = require('eslint-config-prettier');
const typescript = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');

module.exports = [
  js.configs.recommended,
  {
    // Base configuration for all files
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          impliedStrict: true,
        },
      },
      globals: {
        // Node.js globals
        require: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        // Test globals
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
      },
    },
    rules: {
      // Common rules for both JS and TS
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-return-await': 'error',
      'no-promise-executor-return': 'error',
      'no-template-curly-in-string': 'error',
      'no-unmodified-loop-condition': 'error',
      
      // Best practices
      'array-callback-return': 'error',
      'consistent-return': 'error',
      'curly': ['error', 'all'],
      'default-param-last': 'error',
      'eqeqeq': ['error', 'always'],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-param-reassign': 'error',
      
      // Modern JavaScript/TypeScript
      'prefer-const': 'error',
      'prefer-template': 'error',
      'prefer-destructuring': ['error', {
        array: true,
        object: true,
      }],
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      
      // Error handling
      'no-throw-literal': 'error',
      'prefer-promise-reject-errors': 'error',
      
      // Variables
      'no-shadow': 'off', // Turned off in favor of typescript's no-shadow
      'no-use-before-define': 'off', // Turned off in favor of typescript's no-use-before-define
      
      // ES6+
      'arrow-body-style': ['error', 'as-needed'],
      'no-var': 'error',
      'object-shorthand': ['error', 'always'],
      'prefer-arrow-callback': 'error',
    },
  },
  // TypeScript-specific configuration
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      // TypeScript-specific rules
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-use-before-define': ['error', {
        functions: false,
        classes: true,
        variables: true,
        typedefs: true,
      }],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
    },
  },
  // JavaScript-specific configuration
  {
    files: ['**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
    rules: {
      // JavaScript-specific rules (if any)
    },
  },
  // Test-specific configuration
  {
    files: ['**/*.test.ts', '**/*.test.js', '**/*.spec.ts', '**/*.spec.js', 'tests/**/*'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  // Apply Prettier as last to override other formatting rules
  prettier,
];