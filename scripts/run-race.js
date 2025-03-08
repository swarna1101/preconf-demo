#!/usr/bin/env node

/**
 * Script to run the network race comparison tool
 *
 * Usage:
 *   node scripts/run-race.js [options]
 *
 * Options:
 *   --port=<number>       Port to run the server on
 *   --networks=<list>     Comma-separated list of networks to compare (default: preconf,hekla)
 *   --open                Automatically open in browser
 *
 * Example:
 *   node scripts/run-race.js --port=3000 --networks=preconf,hekla --open
 */

const { runRaceServer } = require('../src/race');
const open = require('open');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
    networks: ['preconf', 'hekla']
};

args.forEach(arg => {
    if (arg.startsWith('--')) {
        const [key, value] = arg.slice(2).split('=');
        if (value !== undefined) {
            if (key === 'networks') {
                options[key] = value.split(',');
            } else if (key === 'port') {
                options[key] = parseInt(value);
            } else {
                options[key] = value;
            }
        } else {
            options[key] = true; // Flag without value
        }
    }
});

// Run the race server
runRaceServer({
    port: options.port,
    networks: options.networks
}).then(result => {
    console.log(`Network Race Comparison tool running at: ${result.url}`);
    console.log(`Comparing networks: ${result.networks.join(', ')}`);

    // Auto-open browser if requested
    if (options.open) {
        open(result.url);
        console.log('Opening in browser...');
    } else {
        console.log('Use --open flag to automatically open in browser');
    }
}).catch(error => {
    console.error('Failed to start Network Race Comparison tool:', error);
    process.exit(1);
});