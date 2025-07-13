const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const today = new Date().toISOString().split("T")[0];
const backupFile = path.join(__dirname, `../backup/live-${today}/config/settings_data.json`);
const currentFile = path.join(__dirname, "../config/settings_data.json");

if (!fs.existsSync(backupFile)) {
  console.error(" Backup file not found. Run backup first.");
  process.exit(1);
}

console.log("🔍 Comparing current settings with today's backup...\n");

try {
  execSync(`diff "${currentFile}" "${backupFile}"`, { stdio: "inherit" });
} catch {

}
