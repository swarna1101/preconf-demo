/**
 * Network Comparison module for comparing Taiko networks
 */
const express = require('express');
const path = require('path');
const { ethers } = require('ethers');
const config = require('../common/config');
const { logWithTime } = require('../common/utils');

/**
 * Create and run a network comparison server
 * @param {object} options - Server options
 * @param {number} [options.port] - Port to run server on
 * @param {Array<string>} [options.networks] - Networks to compare
 * @returns {Promise<object>} Server instance and info
 */
async function runComparisonServer({
                                       port = 3000,
                                       networks = ['preconf', 'hekla']
                                   } = {}) {
    // Create express app
    const app = express();

    // Serve static files from public directory
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.json());

    // API endpoint to get available networks
    app.get('/api/networks', (req, res) => {
        // Create an array of network configs
        const networkConfigs = {};
        networks.forEach(networkName => {
            const network = config.getNetwork(networkName);
            networkConfigs[networkName] = {
                name: network.name,
                rpc: network.rpc,
                explorer: network.explorer
            };
        });

        res.json({
            networks: networkConfigs,
            defaultAmount: config.defaultAmount
        });
    });

    // API endpoint to test a network (send a test transaction)
    app.post('/api/test-network', async (req, res) => {
        try {
            const { networkName, privateKey, recipient, amount } = req.body;

            // Validate inputs
            if (!networkName || !privateKey) {
                return res.status(400).json({ error: "Network name and private key are required" });
            }

            // Get network config
            const network = config.getNetwork(networkName);

            // Connect to provider
            const provider = new ethers.providers.JsonRpcProvider(network.rpc);
            const wallet = new ethers.Wallet(privateKey, provider);

            // Record start time
            const startTime = Date.now();

            // Get gas price with premium
            const gasPrice = await provider.getGasPrice();
            const adjustedGasPrice = gasPrice.mul(110).div(100); // 10% higher

            // Create transaction
            const txValue = ethers.utils.parseEther(amount || config.defaultAmount);
            const tx = await wallet.sendTransaction({
                to: recipient || wallet.address,
                value: txValue,
                gasLimit: 21000,
                gasPrice: adjustedGasPrice
            });

            const sendTime = Date.now();

            // Return initial response with tx hash
            res.json({
                success: true,
                networkName,
                hash: tx.hash,
                from: wallet.address,
                to: recipient || wallet.address,
                value: amount || config.defaultAmount,
                sendTimeMs: sendTime - startTime
            });
        } catch (error) {
            console.error(`Error testing network ${req.body.networkName}:`, error);
            res.status(500).json({
                success: false,
                networkName: req.body.networkName,
                error: error.message
            });
        }
    });

    // API endpoint to check transaction status
    app.get('/api/transaction/:network/:hash', async (req, res) => {
        try {
            const { network: networkName, hash } = req.params;

            // Get network config
            const network = config.getNetwork(networkName);

            // Connect to provider
            const provider = new ethers.providers.JsonRpcProvider(network.rpc);

            // Get transaction receipt
            const receipt = await provider.getTransactionReceipt(hash);

            if (receipt) {
                res.json({
                    success: true,
                    networkName,
                    confirmed: true,
                    receipt: {
                        blockNumber: receipt.blockNumber,
                        gasUsed: receipt.gasUsed.toString(),
                        status: receipt.status,
                        transactionHash: receipt.transactionHash
                    }
                });
            } else {
                // Get transaction to check if it's in mempool
                const tx = await provider.getTransaction(hash);

                res.json({
                    success: true,
                    networkName,
                    confirmed: false,
                    pending: tx !== null,
                    message: tx ? "Transaction pending" : "Transaction not found"
                });
            }
        } catch (error) {
            console.error(`Error checking transaction ${req.params.hash} on ${req.params.network}:`, error);
            res.status(500).json({
                success: false,
                networkName: req.params.network,
                error: error.message
            });
        }
    });

    // API endpoint to get current statistics for a network
    app.get('/api/network-stats/:network', async (req, res) => {
        try {
            const { network: networkName } = req.params;

            // Get network config
            const network = config.getNetwork(networkName);

            // Connect to provider
            const provider = new ethers.providers.JsonRpcProvider(network.rpc);

            // Get current block number and gas price
            const blockNumber = await provider.getBlockNumber();
            const gasPrice = await provider.getGasPrice();
            const block = await provider.getBlock(blockNumber);

            res.json({
                success: true,
                networkName,
                stats: {
                    blockNumber,
                    gasPrice: ethers.utils.formatUnits(gasPrice, 'gwei'),
                    timestamp: block.timestamp,
                    transactions: block.transactions.length
                }
            });
        } catch (error) {
            console.error(`Error getting stats for ${req.params.network}:`, error);
            res.status(500).json({
                success: false,
                networkName: req.params.network,
                error: error.message
            });
        }
    });

    // API endpoint to get wallet info (address and nonces)
    app.post('/api/wallet-info', async (req, res) => {
        try {
            const { privateKey } = req.body;

            // Validate input
            if (!privateKey) {
                return res.status(400).json({ error: "Private key is required" });
            }

            // Create wallet instance
            const wallet = new ethers.Wallet(privateKey);
            const address = wallet.address;

            // Get nonces from each network
            const nonces = {};
            for (const networkName of networks) {
                try {
                    const network = config.getNetwork(networkName);
                    const provider = new ethers.providers.JsonRpcProvider(network.rpc);
                    const connectedWallet = wallet.connect(provider);
                    nonces[networkName] = await connectedWallet.getTransactionCount();
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
            console.error(`Error getting wallet info:`, error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // Start the server
    return new Promise((resolve) => {
        const server = app.listen(port, () => {
            logWithTime(`Network Comparison server running at http://localhost:${port}`);
            logWithTime(`Comparing networks: ${networks.join(', ')}`);

            resolve({
                server,
                port,
                networks,
                url: `http://localhost:${port}`
            });
        });
    });
}

module.exports = {
    runComparisonServer
};