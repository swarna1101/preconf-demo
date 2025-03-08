/**
 * Race module for comparing transaction speeds between Taiko networks
 */
const express = require('express');
const path = require('path');
const { ethers } = require('ethers');
const config = require('../common/config');
const { logWithTime } = require('../common/utils');

/**
 * Create and run the race comparison server
 * @param {object} options - Server options
 * @param {number} [options.port] - Port to run server on
 * @param {Array<string>} [options.networks] - Networks to compare (defaults to preconf and hekla)
 * @returns {Promise<object>} Server instance and info
 */
async function runRaceServer({
                                 port = 3000,
                                 networks = ['preconf', 'hekla']
                             } = {}) {
    // Create express app
    const app = express();

    // Serve static files from public directory
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.json());

    // Add middleware to ensure content-type is JSON for API routes
    app.use('/api', (req, res, next) => {
        res.setHeader('Content-Type', 'application/json');
        next();
    });

    // API endpoint to get networks config
    app.get('/api/networks', (req, res) => {
        try {
            const networkConfigs = {};

            networks.forEach(networkName => {
                const network = config.networks[networkName];
                networkConfigs[networkName] = {
                    name: network.name || networkName,
                    rpc: network.rpc,
                    explorer: network.explorer
                };
            });

            res.json(networkConfigs);
        } catch (error) {
            console.error('Error fetching network configs:', error);
            res.status(500).json({ error: 'Error fetching network configurations' });
        }
    });

    // API endpoint to get wallet info
    app.post('/api/wallet-info', async (req, res) => {
        try {
            const { privateKey } = req.body;

            if (!privateKey) {
                return res.status(400).json({
                    success: false,
                    error: 'Private key is required'
                });
            }

            // Create providers for each network
            const providers = {};
            const nonces = {};

            for (const networkName of networks) {
                const network = config.networks[networkName];
                providers[networkName] = new ethers.providers.JsonRpcProvider(network.rpc);
            }

            // Create wallet
            const wallet = new ethers.Wallet(privateKey);
            const address = wallet.address;

            // Get nonces for each network
            for (const networkName of networks) {
                try {
                    const provider = providers[networkName];
                    nonces[networkName] = await provider.getTransactionCount(address, 'pending');
                } catch (error) {
                    console.error(`Error getting nonce for ${networkName}:`, error);
                    nonces[networkName] = 0;
                }
            }

            res.json({
                success: true,
                address,
                nonces
            });
        } catch (error) {
            console.error('Error getting wallet info:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // API endpoint to send a transaction
    app.post('/api/send-transaction', async (req, res) => {
        try {
            const { network, privateKey, amount = '0.0001', nonce } = req.body;

            if (!network || !privateKey) {
                return res.status(400).json({
                    success: false,
                    error: 'Network and private key are required'
                });
            }

            // Check if network is valid
            if (!networks.includes(network)) {
                return res.status(400).json({
                    success: false,
                    error: `Invalid network: ${network}`
                });
            }

            // Get network configuration
            const networkConfig = config.networks[network];

            // Connect to provider
            const provider = new ethers.providers.JsonRpcProvider(networkConfig.rpc);
            const wallet = new ethers.Wallet(privateKey, provider);

            // Get current gas price and adjust for network
            const gasPrice = await provider.getGasPrice();
            const adjustedGasPrice = gasPrice.mul(110).div(100); // 10% higher

            // Prepare transaction parameters
            const txParams = {
                to: wallet.address, // Send to self
                value: ethers.utils.parseEther(amount),
                gasLimit: 21000,
                gasPrice: adjustedGasPrice
            };

            // Add nonce if provided
            if (nonce !== undefined) {
                txParams.nonce = nonce;
            }

            // Send transaction
            const tx = await wallet.sendTransaction(txParams);

            // Return transaction info
            res.json({
                success: true,
                network,
                hash: tx.hash,
                from: wallet.address,
                to: tx.to,
                value: amount,
                nonce: tx.nonce
            });
        } catch (error) {
            console.error('Error sending transaction:', error);

            // Check for specific error types
            if (error.message.includes('already known')) {
                return res.status(400).json({
                    success: false,
                    error: 'Transaction nonce already used'
                });
            } else if (error.message.includes('nonce too low')) {
                return res.status(400).json({
                    success: false,
                    error: 'Nonce too low'
                });
            }

            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // API endpoint to check transaction status
    app.get('/api/tx-status/:network/:hash', async (req, res) => {
        try {
            const { network, hash } = req.params;

            // Check if network is valid
            if (!networks.includes(network)) {
                return res.status(400).json({
                    success: false,
                    error: `Invalid network: ${network}`
                });
            }

            // Get network configuration
            const networkConfig = config.networks[network];

            // Connect to provider
            const provider = new ethers.providers.JsonRpcProvider(networkConfig.rpc);

            // Get transaction receipt
            const receipt = await provider.getTransactionReceipt(hash);

            if (receipt && receipt.blockNumber) {
                // Transaction confirmed
                res.json({
                    success: true,
                    network,
                    hash,
                    confirmed: true,
                    receipt: {
                        blockNumber: receipt.blockNumber,
                        gasUsed: receipt.gasUsed.toString(),
                        status: receipt.status
                    }
                });
            } else {
                // Transaction not yet confirmed
                res.json({
                    success: true,
                    network,
                    hash,
                    confirmed: false
                });
            }
        } catch (error) {
            console.error('Error checking transaction status:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // Start the server
    return new Promise((resolve) => {
        const server = app.listen(port, () => {
            logWithTime(`Race Comparison server running at http://localhost:${port}`);
            logWithTime(`Comparing networks: ${networks.join(', ')}`);

            resolve({
                server,
                port,
                url: `http://localhost:${port}`,
                networks
            });
        });
    });
}

module.exports = {
    runRaceServer
};