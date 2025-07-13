const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const today = new Date().toISOString().split("T")[0];
const backupPath = `./backup/live-${today}`;
const store = "sora-fashion-dev.myshopify.com";
const themeId = "134982959152";


if (!fs.existsSync(backupPath)) {
  fs.mkdirSync(backupPath, { recursive: true });
}

const command = `shopify theme pull --store=${store} --theme=${themeId} --path=${backupPath}`;

console.log(" Pulling live theme to:", backupPath);
execSync(command, { stdio: "inherit" });
