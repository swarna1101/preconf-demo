#!/usr/bin/env node

/**
 * Script to run the Flash Numbers game
 *
 * Usage:
 *   node scripts/run-flashnumbers.js [options]
 *
 * Options:
 *   --port=<number>     Port to run the server on
 *   --network=<string>  Network to use (default: preconf)
 *   --open              Automatically open in browser
 *
 * Example:
 *   node scripts/run-flashnumbers.js --port=3000 --network=preconf --open
 */

const { runFlashNumbersServer } = require('../src/flashnumbers');
const open = require('open');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
    network: 'preconf'
};

args.forEach(arg => {
    if (arg.startsWith('--')) {
        const [key, value] = arg.slice(2).split('=');
        if (value !== undefined) {
            if (key === 'port') {
                options[key] = parseInt(value);
            } else {
                options[key] = value;
            }
        } else {
            options[key] = true; // Flag without value
        }
    }
});

// Run the Flash Numbers server
runFlashNumbersServer({
    port: options.port,
    network: options.network
}).then(result => {
    console.log(`Flash Numbers game running at: ${result.url}`);
    console.log(`Using network: ${result.network}`);

    // Auto-open browser if requested
    if (options.open) {
        open(result.url);
        console.log('Opening in browser...');
    } else {
        console.log('Use --open flag to automatically open in browser');
    }
}).catch(error => {
    console.error('Failed to start Flash Numbers game:', error);
    process.exit(1);
});