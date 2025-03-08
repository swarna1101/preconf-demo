#!/usr/bin/env node

/**
 * Script to run the transaction game server
 *
 * Usage:
 *   node scripts/run-game.js [options]
 *
 * Options:
 *   --network=<name>   Network to use (preconf, hekla)
 *   --port=<number>    Port to run the server on
 *
 * Example:
 *   node scripts/run-game.js --network=preconf --port=3000
 */

const { runGameServer } = require('../src/game');
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

// Run the game server
runGameServer({
    networkName: options.network,
    port: options.port ? parseInt(options.port) : undefined
}).then(result => {
    console.log(`Transaction Game running at: ${result.url}`);

    // Auto-open browser if requested
    if (options.open) {
        open(result.url);
    }
}).catch(error => {
    console.error('Failed to start transaction game server:', error);
    process.exit(1);
});