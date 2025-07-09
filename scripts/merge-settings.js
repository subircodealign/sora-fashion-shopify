const fs = require('fs');
const path = require('path');

function removeComments(jsonString) {
  return jsonString.replace(/\/\*[\s\S]*?\*\//g, ''); // Remove /* */ comments
}

const devPath = path.join(__dirname, '../backup/dev/config/settings_data.json');
const livePath = path.join(__dirname, '../backup/live/config/settings_data.json');

try {
  const devRaw = removeComments(fs.readFileSync(devPath, 'utf-8'));
  const liveRaw = removeComments(fs.readFileSync(livePath, 'utf-8'));

  const devSettings = JSON.parse(devRaw);
  const liveSettings = JSON.parse(liveRaw);

  const mergedSettings = { ...devSettings, ...liveSettings };

  fs.writeFileSync(livePath, JSON.stringify(mergedSettings, null, 2));
  console.log('Successfully merged settings_data.json');
} catch (err) {
  console.error('Error:', err.message);
}
