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

module.exports = {
    delay,
    formatTimestamp,
    createWallets,
    calculateTimeDifference,
    logWithTime
};