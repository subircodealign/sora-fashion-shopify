// scripts/merge-settings.js
const fs = require('fs');
const path = require('path');

const devPath = path.join(__dirname, '../backup/dev/config/settings_data.json');
const livePath = path.join(__dirname, '../backup/live/config/settings_data.json');

const devSettings = JSON.parse(fs.readFileSync(devPath, 'utf-8'));
const liveSettings = JSON.parse(fs.readFileSync(livePath, 'utf-8'));


const mergedSettings = { ...devSettings, ...liveSettings };


fs.writeFileSync(livePath, JSON.stringify(mergedSettings, null, 2));

console.log('merged all');
