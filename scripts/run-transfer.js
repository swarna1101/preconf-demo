#!/usr/bin/env node

/**
 * Script to run the transfer stress test
 *
 * Usage:
 *   node scripts/run-transfer.js [options]
 *
 * Options:
 *   --network=<name>    Network to use (preconf, hekla)
 *   --amount=<eth>      ETH amount per transaction
 *   --count=<number>    Number of transactions per wallet
 *   --delay             Add delay between transactions
 *
 * Example:
 *   node scripts/run-transfer.js --network=preconf --amount=0.001 --count=5
 */

const { runTransferTest } = require('../src/transfer');

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

// Run the transfer test with parsed options
runTransferTest({
    networkName: options.network,
    amount: options.amount,
    txCount: options.count ? parseInt(options.count) : undefined,
    delayBetweenTx: options.delay
}).catch(error => {
    console.error('Failed to run transfer test:', error);
    process.exit(1);
});