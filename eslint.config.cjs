const globals = require('globals');
const prettier = require('eslint-config-prettier');
const typescript = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const jest = require('eslint-plugin-jest');
const path = require('path');

module.exports = [
  {
    // Ignore patterns
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/node_modules/**',
      '**/.next/**',
      '**/.cache/**',
      '**/.turbo/**',
      '**/.vercel/**',
      '**/*.d.ts',
    ],
  },
  // Base configuration
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.jest,
      },
    },
    rules: {
      // Common rules
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
        },
      ],

      // Error prevention
      'no-return-await': 'error',
      'no-promise-executor-return': 'error',
      'no-template-curly-in-string': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unreachable': 'error',

      // Best practices
      'array-callback-return': 'error',
      'consistent-return': 'error',
      curly: ['error', 'multi-line'],
      'default-param-last': 'error',
      eqeqeq: ['error', 'smart'],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-param-reassign': ['error', { props: false }],

      // Modern JavaScript
      'prefer-const': 'error',
      'prefer-template': 'error',
      'prefer-destructuring': [
        'error',
        {
          array: true,
          object: true,
        },
        { enforceForRenamedProperties: false },
      ],
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',

      // Error handling
      'no-throw-literal': 'error',
      'prefer-promise-reject-errors': 'error',

      // ES6+ features
      'arrow-body-style': ['error', 'as-needed'],
      'no-var': 'error',
      'object-shorthand': ['error', 'always', { avoidQuotes: true }],
      'prefer-arrow-callback': 'error',
    },
  },

  // TypeScript-specific configuration
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: path.join(process.cwd(), 'tsconfig.json'),
        tsconfigRootDir: process.cwd(),
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      // TypeScript-specific rules
      '@typescript-eslint/no-explicit-any': [
        'warn',
        {
          fixToUnknown: true,
          ignoreRestArgs: true,
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-use-before-define': [
        'error',
        {
          functions: false,
          classes: true,
          variables: true,
          typedefs: true,
        },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    },
  },

  // Test-specific configuration
  {
    files: [
      '**/*.test.ts',
      '**/*.test.js',
      '**/*.spec.ts',
      '**/*.spec.js',
      'tests/**/*',
    ],
    plugins: {
      jest,
    },
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'jest/expect-expect': 'warn',
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
    },
  },
  prettier,
];
