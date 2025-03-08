/**
 * Transaction Game module for Taiko networks
 */
const express = require('express');
const path = require('path');
const { ethers } = require('ethers');
const config = require('../common/config');
const { logWithTime } = require('../common/utils');

/**
 * Create and run the transaction game server
 * @param {object} options - Server options
 * @param {number} [options.port] - Port to run server on
 * @param {string} [options.networkName] - Network to use
 * @returns {Promise<object>} Server instance and info
 */
async function runGameServer({
                                 port = 3000,
                                 networkName = config.defaultNetwork
                             } = {}) {
    // Get network configuration
    const network = config.getNetwork(networkName);

    // Create express app
    const app = express();

    // Serve static files from public directory
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.json());

    // API endpoint to get current config
    app.get('/api/config', (req, res) => {
        // Strip private keys for security
        const safeConfig = {
            network: network.name,
            rpc: network.rpc,
            explorer: network.explorer
        };
        res.json(safeConfig);
    });

    // API endpoint to send transactions
    app.post('/api/send-transaction', async (req, res) => {
        try {
            const { privateKey, recipient, ethValue, maxGas } = req.body;

            // Validate inputs
            if (!privateKey) {
                return res.status(400).json({ error: "Private key is required" });
            }

            // Connect to provider
            const provider = new ethers.providers.JsonRpcProvider(network.rpc);
            const wallet = new ethers.Wallet(privateKey, provider);

            // Get current nonce and gas price
            const nonce = await provider.getTransactionCount(wallet.address);
            const gasPrice = await provider.getGasPrice();
            const adjustedGasPrice = gasPrice.mul(110).div(100); // 10% higher

            // Create and send transaction
            const tx = await wallet.sendTransaction({
                to: recipient || wallet.address,
                value: ethers.utils.parseEther(ethValue || config.defaultAmount),
                gasLimit: maxGas || 21000,
                gasPrice: adjustedGasPrice,
                nonce: nonce
            });

            // Return transaction hash
            res.json({
                success: true,
                hash: tx.hash,
                nonce: nonce,
                from: wallet.address,
                to: recipient || wallet.address,
                value: ethValue || config.defaultAmount
            });
        } catch (error) {
            console.error("Transaction error:", error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // API endpoint to check transaction status
    app.get('/api/transaction/:hash', async (req, res) => {
        try {
            const hash = req.params.hash;

            // Connect to provider
            const provider = new ethers.providers.JsonRpcProvider(network.rpc);

            // Get transaction receipt
            const receipt = await provider.getTransactionReceipt(hash);

            if (receipt) {
                res.json({
                    success: true,
                    confirmed: true,
                    receipt: {
                        blockNumber: receipt.blockNumber,
                        gasUsed: receipt.gasUsed.toString(),
                        status: receipt.status,
                        transactionHash: receipt.transactionHash
                    }
                });
            } else {
                res.json({
                    success: true,
                    confirmed: false,
                    message: "Transaction pending"
                });
            }
        } catch (error) {
            console.error("Error checking transaction:", error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // Start the server
    return new Promise((resolve) => {
        const server = app.listen(port, () => {
            logWithTime(`Transaction Game server running at http://localhost:${port}`);
            logWithTime(`Using network: ${network.name} (${network.rpc})`);

            resolve({
                server,
                port,
                network: network.name,
                url: `http://localhost:${port}`
            });
        });
    });
}

module.exports = {
    runGameServer
};