#!/usr/bin/env node

/**
 * This script is used to reset the project to a blank state.
 * It moves the /app directory to /app-example and creates a new /app directory with an index.tsx and _layout.tsx file.
 * You can remove the `reset-project` script from package.json and safely delete this file after running it.
 */

const fs = require('fs');
const path = require('path');

const root = process.cwd();

const isTV = process.env.EXPO_TV === '1';

const isProduction = process.env.PRODUCTION === '1';

const credentialsJsonSourcePath = path.join(
  root,
  isProduction ? 'credentials_app_store_phone.json' : isTV ? 'credentials_tv.json' : 'credentials_phone.json',
);
const credentialsJsonDestPath = path.join(root, 'credentials.json');

fs.copyFileSync(credentialsJsonSourcePath, credentialsJsonDestPath);

console.log(
  `${path.basename(credentialsJsonSourcePath)} copied to ${path.basename(
    credentialsJsonDestPath,
  )}`,
);
