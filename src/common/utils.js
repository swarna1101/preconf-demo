/**
 * Shared utility functions for Taiko network demos
 */
const { ethers } = require("ethers");

/**
 * Creates a promise that resolves after the specified time
 * @param {number} ms - Time to wait in milliseconds
 * @returns {Promise<void>}
 */
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Formats a timestamp as a human-readable string
 * @param {Date} date - Date object to format
 * @returns {string} Formatted time string
 */
const formatTimestamp = (date = new Date()) => {
    return date.toLocaleTimeString();
};

/**
 * Creates wallet instances for all keys in the config
 * @param {object} keys - Object containing private keys
 * @param {ethers.providers.Provider} provider - Ethers provider instance
 * @returns {Array<ethers.Wallet>} Array of wallet instances
 */
const createWallets = (keys, provider) => {
    const keyArray = Object.entries(keys).map(([key, value]) => value);
    return keyArray.map(privateKey => new ethers.Wallet(privateKey, provider));
};

/**
 * Calculates time difference and formats it as minutes and seconds
 * @param {Date|number} startTime - Start time as Date object or timestamp
 * @param {Date|number} endTime - End time as Date object or timestamp (defaults to now)
 * @returns {object} Object containing minutes, seconds, and total seconds
 */
const calculateTimeDifference = (startTime, endTime = Date.now()) => {
    const start = startTime instanceof Date ? startTime.getTime() : startTime;
    const end = endTime instanceof Date ? endTime.getTime() : endTime;

    const diffMs = end - start;
    const totalSeconds = diffMs / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = (totalSeconds % 60).toFixed(2);

    return {
        minutes,
        seconds,
        totalSeconds
    };
};

/**
 * Log a message with timestamp
 * @param {string} message - Message to log
 */
const logWithTime = (message) => {
    console.log(`[${formatTimestamp()}] ${message}`);
};

/**
 * Format a number with commas as thousands separators
 * @param {number} number - Number to format
 * @returns {string} Formatted number
 */
const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Shorten an address or hash for display
 * @param {string} str - String to shorten
 * @param {number} startChars - Number of characters to keep at start
 * @param {number} endChars - Number of characters to keep at end
 * @returns {string} Shortened string
 */
const shortenString = (str, startChars = 6, endChars = 4) => {
    if (!str) return '';

    if (str.length <= startChars + endChars + 3) {
        return str;
    }

    if (endChars > 0) {
        return `${str.substring(0, startChars)}...${str.substring(str.length - endChars)}`;
    }

    return str.substring(0, startChars) + '...';
};

/**
 * Formats gas price in a human-readable way
 * @param {ethers.BigNumber} gasPrice - Gas price in wei
 * @returns {string} Formatted gas price (e.g. "5.2 Gwei")
 */
const formatGasPrice = (gasPrice) => {
    return `${ethers.utils.formatUnits(gasPrice, 'gwei')} Gwei`;
};

/**
 * Calculate optimal polling interval based on network characteristics and current state
 * @param {string} networkId - Network identifier
 * @param {number} pollCount - Current poll count
 * @param {number} baseInterval - Base polling interval in ms
 * @returns {number} Optimized polling interval in ms
 */
const calculatePollingInterval = (networkId, pollCount, baseInterval = 200) => {
    // For faster networks (e.g., preconf), we want more frequent polling
    if (networkId === 'preconf' || networkId === 'flashblock') {
        return Math.max(100, baseInterval - (pollCount * 5));
    }

    // For standard networks, gradually increase the polling interval
    return Math.min(500, baseInterval + (pollCount * 10));
};

module.exports = {
    delay,
    formatTimestamp,
    createWallets,
    calculateTimeDifference,
    logWithTime,
    formatNumber,
    shortenString,
    formatGasPrice,
    calculatePollingInterval
};