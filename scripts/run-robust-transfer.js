#!/usr/bin/env node

/**
 * Script to run the robust transfer stress test
 *
 * Usage:
 *   node scripts/run-robust-transfer.js [options]
 *
 * Options:
 *   --network=<n>    Network to use (preconf, hekla)
 *   --single-amount=<eth>  ETH amount for single-wallet transfers
 *   --multi-amount=<eth>   ETH amount for multi-wallet transfers
 *   --single-count=<n>     Number of transactions for single-wallet test
 *   --multi-count=<n>      Number of transactions per wallet for multi-wallet test
 *
 * Example:
 *   node scripts/run-robust-transfer.js --network=preconf --single-count=3 --multi-count=2
 */

const { runRobustTest } = require('../src/robust-transfer');

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

// Run the robust transfer test with parsed options
runRobustTest({
    networkName: options.network,
    singleAmount: options['single-amount'],
    multiAmount: options['multi-amount'],
    singleTxCount: options['single-count'] ? parseInt(options['single-count']) : undefined,
    multiTxCount: options['multi-count'] ? parseInt(options['multi-count']) : undefined
}).catch(error => {
    console.error('Failed to run robust transfer test:', error);
    process.exit(1);
});