// https://docs.expo.dev/guides/using-eslint/
const path = require('node:path');
const globals = require('globals');
const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...expoConfig,
  {
    // eslint.config.js itself runs in a CommonJS/Node context (uses __dirname
    // and require), so give it the Node globals.
    files: ['eslint.config.js'],
    languageOptions: { globals: globals.node },
  },
  {
    // The base Expo flat config only registers the `node` import resolver, which
    // can't follow the `@/*` TypeScript path aliases that map into
    // packages/source. Point the TypeScript resolver at the app tsconfigs (which
    // declare those paths and include packages/source) so import/no-unresolved
    // resolves them everywhere, including in the editor's ESLint integration.
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: [
            path.join(__dirname, 'apps/*/tsconfig.json'),
            path.join(__dirname, 'packages/*/tsconfig.json'),
          ],
        },
        node: { extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'] },
      },
    },
  },
  {
    ignores: [
      '**/.expo/**',
      '**/dist/**',
      '**/build/**',
      '**/ios/**',
      '**/android/**',
    ],
  },
];
