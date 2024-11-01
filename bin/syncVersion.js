const packageJson = require('../package.json');
const fs = require('fs');
const path = require('path');

const version = packageJson.version;
const filePath = path.resolve(__dirname, '../src/ts/version.json');

fs.writeFileSync(filePath, JSON.stringify({ version }, null, 2));
console.log(`Version synced to ${version}`);
