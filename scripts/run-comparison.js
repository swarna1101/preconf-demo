#!/usr/bin/env node

/**
 * Script to run the network comparison server
 *
 * Usage:
 *   node scripts/run-comparison.js [options]
 *
 * Options:
 *   --port=<number>     Port to run the server on
 *   --networks=<n1,n2>  Networks to compare (comma-separated, default: preconf,hekla)
 *   --open              Automatically open in browser
 *
 * Example:
 *   node scripts/run-comparison.js --port=3000 --networks=preconf,hekla --open
 */

const { runComparisonServer } = require('../src/comparison');
const open = require('open');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {};

args.forEach(arg => {
    if (arg.startsWith('--')) {
        const [key, value] = arg.slice(2).split('=');
        if (value !== undefined) {
            options[key] = value;
        } else {
            options[key] = true; // Flag without value
        }
    }
});

// Parse networks option if provided
let networks = ['preconf', 'hekla'];
if (options.networks) {
    networks = options.networks.split(',');
}

// Run the comparison server
runComparisonServer({
    port: options.port ? parseInt(options.port) : undefined,
    networks: networks
}).then(result => {
    console.log(`Network Comparison running at: ${result.url}`);

    // Auto-open browser if requested
    if (options.open) {
        open(result.url);
    }
}).catch(error => {
    console.error('Failed to start comparison server:', error);
    process.exit(1);
});