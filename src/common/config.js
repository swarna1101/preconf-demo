/**
 * Shared configuration for Taiko network demos
 * Loads sensitive data from environment variables
 */
require('dotenv').config();

// Network configs
const networks = {
    preconf: {
        name: "Taiko Preconf",
        rpc: process.env.PRECONF_RPC || "https://rpc.helder.taiko.xyz/",
        explorer: process.env.PRECONF_EXPLORER || "https://helder-explorer-git-preconfs-taikoxyz.vercel.app/address/",
        gasMultiplier: parseFloat(process.env.GAS_MULTIPLIER || 1.1),
        expectedConfirmationTime: 200 // Average confirmation time in ms
    },
    hekla: {
        name: "Taiko Hekla",
        rpc: process.env.HEKLA_RPC || "https://rpc.hekla.taiko.xyz",
        explorer: process.env.HEKLA_EXPLORER || "https://hekla.taikoscan.io/address/",
        gasMultiplier: parseFloat(process.env.GAS_MULTIPLIER || 1.1),
        expectedConfirmationTime: 2000 // Average confirmation time in ms
    },

};

// Default network is preconf (or from env var)
const defaultNetwork = process.env.DEFAULT_NETWORK || "preconf";

// ETH amount to send (smaller amount per transaction)
const defaultAmount = process.env.DEFAULT_AMOUNT || "0.0001";

// Number of transactions to send in batch operations
const transactionCount = parseInt(process.env.TRANSACTION_COUNT || 5);

// Polling configuration
const polling = {
    maxPolls: parseInt(process.env.MAX_POLLS || 100),
    initialInterval: parseInt(process.env.INITIAL_POLL_INTERVAL || 200), // ms
    timeout: parseInt(process.env.POLL_TIMEOUT || 60000) // 1 minute
};

// Wallet private keys - loaded from environment variables
const keys = {
    main: process.env.WALLET_MAIN || "",
    W_2: process.env.WALLET_2 || "",
    W_3: process.env.WALLET_3 || "",
    W_4: process.env.WALLET_4 || "",
};

// Check if private keys are present
if (!keys.main) {
    console.warn("WARNING: Main wallet private key not set in environment variables. Please set WALLET_MAIN in .env file.");
}

// For backward compatibility with the old config format
exports.RPC = networks[defaultNetwork].rpc;
exports.ETH = defaultAmount;
exports.TRANSACTION_COUNT = transactionCount;
exports.EXPLORER = networks[defaultNetwork].explorer;
exports.keys = keys;

// Export enhanced config
module.exports = {
    networks,
    defaultNetwork,
    defaultAmount,
    transactionCount,
    polling,
    keys,

    // Helper function to get network config
    getNetwork: (networkName = defaultNetwork) => {
        return networks[networkName] || networks[defaultNetwork];
    }
};