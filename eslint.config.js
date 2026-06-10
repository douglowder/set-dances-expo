// https://docs.expo.dev/guides/using-eslint/
const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...expoConfig,
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
          project: ['apps/*/tsconfig.json'],
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
