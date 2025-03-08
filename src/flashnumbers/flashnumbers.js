/**
 * Flash Numbers game server implementation
 * Demonstrates Preconf devnet's transaction speed compared to Hekla
 */
const express = require('express');
const path = require('path');
const { ethers } = require('ethers');
const config = require('../common/config');
const { logWithTime } = require('../common/utils');

/**
 * Create and run the Flash Numbers game server
 * @param {object} options - Server options
 * @param {number} [options.port] - Port to run server on
 * @returns {Promise<object>} Server instance and info
 */
async function runFlashNumbersServer({
                                         port = 3000
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

    // API endpoint to get network config
    app.get('/api/network-config', (req, res) => {
        try {
            const networkConfig = {
                preconf: {
                    name: config.networks.preconf.name,
                    rpc: config.networks.preconf.rpc,
                    explorer: config.networks.preconf.explorer
                },
                hekla: {
                    name: config.networks.hekla.name,
                    rpc: config.networks.hekla.rpc,
                    explorer: config.networks.hekla.explorer
                }
            };

            res.json({
                success: true,
                networks: networkConfig
            });
        } catch (error) {
            console.error('Error fetching network config:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
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

            // Create providers for both networks
            const preconfProvider = new ethers.providers.JsonRpcProvider(config.networks.preconf.rpc);
            const heklaProvider = new ethers.providers.JsonRpcProvider(config.networks.hekla.rpc);

            // Create wallet
            const wallet = new ethers.Wallet(privateKey);
            const address = wallet.address;

            // Get nonces for both networks
            let preconfNonce = 0;
            let heklaNonce = 0;

            try {
                preconfNonce = await preconfProvider.getTransactionCount(address, 'pending');
            } catch (error) {
                console.error('Error getting Preconf nonce:', error);
            }

            try {
                heklaNonce = await heklaProvider.getTransactionCount(address, 'pending');
            } catch (error) {
                console.error('Error getting Hekla nonce:', error);
            }

            res.json({
                success: true,
                address,
                nonces: {
                    preconf: preconfNonce,
                    hekla: heklaNonce
                }
            });
        } catch (error) {
            console.error('Error getting wallet info:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // API endpoint to initiate game (start with normal transaction on Hekla)
    app.post('/api/start-game', async (req, res) => {
        try {
            const { privateKey } = req.body;

            if (!privateKey) {
                return res.status(400).json({
                    success: false,
                    error: 'Private key is required'
                });
            }

            // Connect to Hekla provider (normal speed network)
            const heklaProvider = new ethers.providers.JsonRpcProvider(config.networks.hekla.rpc);
            const wallet = new ethers.Wallet(privateKey, heklaProvider);

            // Get gas price
            const gasPrice = await heklaProvider.getGasPrice();
            const adjustedGasPrice = gasPrice.mul(110).div(100); // 10% higher

            // Prepare transaction parameters
            const txParams = {
                to: wallet.address, // Send to self
                value: ethers.utils.parseEther("0.0001"),
                gasLimit: 21000,
                gasPrice: adjustedGasPrice
            };

            // Send transaction
            const tx = await wallet.sendTransaction(txParams);

            // Return transaction info
            res.json({
                success: true,
                network: 'hekla',
                hash: tx.hash,
                from: wallet.address,
                to: tx.to,
                nonce: tx.nonce,
                startTime: Date.now()
            });
        } catch (error) {
            console.error('Error sending initial transaction:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // API endpoint to finish game (send fast transaction on Preconf)
    app.post('/api/finish-game', async (req, res) => {
        try {
            const { privateKey } = req.body;

            if (!privateKey) {
                return res.status(400).json({
                    success: false,
                    error: 'Private key is required'
                });
            }

            // Connect to Preconf provider (fast network)
            const preconfProvider = new ethers.providers.JsonRpcProvider(config.networks.preconf.rpc);
            const wallet = new ethers.Wallet(privateKey, preconfProvider);

            // Get gas price
            const gasPrice = await preconfProvider.getGasPrice();
            const adjustedGasPrice = gasPrice.mul(110).div(100); // 10% higher

            // Prepare transaction parameters
            const txParams = {
                to: wallet.address, // Send to self
                value: ethers.utils.parseEther("0"),
                gasLimit: 21000,
                gasPrice: adjustedGasPrice
            };

            // Send transaction
            const tx = await wallet.sendTransaction(txParams);

            // Return transaction info
            res.json({
                success: true,
                network: 'preconf',
                hash: tx.hash,
                from: wallet.address,
                to: tx.to,
                nonce: tx.nonce,
                startTime: Date.now()
            });
        } catch (error) {
            console.error('Error sending finish transaction:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // API endpoint to check transaction status on a specific network
    app.get('/api/tx-status/:network/:hash', async (req, res) => {
        try {
            const { network, hash } = req.params;

            if (!['preconf', 'hekla'].includes(network)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid network. Must be "preconf" or "hekla"'
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
            console.error(`Error checking transaction status on ${req.params.network}:`, error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // Start the server
    return new Promise((resolve) => {
        const server = app.listen(port, () => {
            logWithTime(`Flash Numbers game server running at http://localhost:${port}`);
            logWithTime(`Using networks: preconf (fast) and hekla (normal)`);

            resolve({
                server,
                port,
                url: `http://localhost:${port}`
            });
        });
    });
}

module.exports = {
    runFlashNumbersServer
};