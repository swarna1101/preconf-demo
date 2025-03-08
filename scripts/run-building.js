/**
 * This script runs the Taiko Network Speed Comparison Building Demo
 * Compares block speeds between Preconf Devnet (~800ms) and Hekla (~2000ms)
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const open = require('open');
const { logWithTime } = require('../src/common/utils');
const config = require('../src/common/config');

// ANSI colors for terminal output
const PINK = '\x1b[38;2;255;111;200m';
const GREEN = '\x1b[32m';
const RESET = '\x1b[0m';

// Display header
console.log(`${PINK}┌───────────────────────────────────────────────────┐${RESET}`);
console.log(`${PINK}│  Taiko Network Speed Comparison - Building Demo    │${RESET}`);
console.log(`${PINK}└───────────────────────────────────────────────────┘${RESET}`);
console.log();

// Get network configs
const preconfNetwork = config.getNetwork('preconf');
const heklaNetwork = config.getNetwork('hekla');

// Log network information
logWithTime(`${PINK}Preconf Devnet:${RESET} Block time ~800ms (${preconfNetwork.rpc})`);
logWithTime(`${PINK}Hekla:${RESET} Block time ~2000ms (${heklaNetwork.rpc})`);
console.log();

// Make sure the HTML file exists
const buildingHtmlPath = path.resolve(__dirname, '../src/building/index.html');

// Check if index.html exists, if not create it
if (!fs.existsSync(buildingHtmlPath)) {
    logWithTime(`${GREEN}Creating building demo HTML file...${RESET}`);

    // Create the directory if it doesn't exist
    const buildingDir = path.dirname(buildingHtmlPath);
    if (!fs.existsSync(buildingDir)) {
        fs.mkdirSync(buildingDir, { recursive: true });
    }

    // Copy the HTML content here - the one we provided earlier
    fs.writeFileSync(buildingHtmlPath, `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Taiko Network Speed Comparison</title>
    <!-- HTML content from the one we provided earlier -->
    <!-- ... -->
</head>
<body>
    <!-- Body content from the one we provided earlier -->
    <!-- ... -->
</body>
</html>`);

    logWithTime(`${GREEN}HTML file created at: ${buildingHtmlPath}${RESET}`);
}

// Open the building demo in the browser
logWithTime(`${GREEN}Opening building demo in your browser...${RESET}`);
open(buildingHtmlPath);