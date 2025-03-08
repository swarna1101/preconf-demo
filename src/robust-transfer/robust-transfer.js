/**
 * Robust Transfer module with advanced nonce handling and confirmed transactions
 */
const { ethers } = require("ethers");
const fs = require("fs");
const config = require("../common/config");
const { delay, logWithTime } = require("../common/utils");

/**
 * Cancel pending transactions by sending 0 ETH to self with higher gas price
 * @param {ethers.Wallet} wallet - The wallet to cancel transactions from
 * @param {number} startNonce - Starting nonce to cancel
 * @param {number} endNonce - Ending nonce to cancel
 * @returns {Promise<number>} The new nonce after cancellations
 */
async function cancelPendingTransactions(wallet, startNonce, endNonce) {
    const provider = wallet.provider;

    logWithTime(`Attempting to cancel any pending transactions with nonces ${startNonce} to ${endNonce}`);

    const baseGasPrice = await provider.getGasPrice();
    const highGasPrice = baseGasPrice.mul(5); // 5x normal gas price

    logWithTime(`Using gas price of ${ethers.utils.formatUnits(highGasPrice, 'gwei')} gwei for cancellations`);

    const cancellationPromises = [];

    for (let nonce = startNonce; nonce <= endNonce; nonce++) {
        try {
            logWithTime(`Sending cancellation transaction for nonce ${nonce}`);

            // Send 0 ETH to self with high gas price
            const tx = await wallet.sendTransaction({
                to: wallet.address,
                value: 0,
                nonce: nonce,
                gasPrice: highGasPrice,
                gasLimit: 21000
            });

            cancellationPromises.push(tx.wait());
            logWithTime(`Cancellation transaction sent for nonce ${nonce}: ${tx.hash}`);

            // Short delay to avoid overwhelming the node
            await delay(500);

        } catch (error) {
            logWithTime(`Error sending cancellation for nonce ${nonce}: ${error.message}`);
        }
    }

    // Wait for all cancellations to complete
    try {
        await Promise.all(cancellationPromises);
        logWithTime("All cancellation transactions completed");
    } catch (error) {
        logWithTime(`Error waiting for cancellations: ${error.message}`);
    }

    // Get the new nonce after cancellations
    const newNonce = await provider.getTransactionCount(wallet.address);
    logWithTime(`New nonce after cancellations: ${newNonce}`);

    return newNonce;
}

/**
 * Send transactions with confirmation before proceeding to next transaction
 * @param {ethers.Wallet} fromWallet - The sending wallet
 * @param {Array<ethers.Wallet>} toWallets - Array of recipient wallets
 * @param {string} amountEth - ETH amount per transaction
 * @param {number} txCount - Number of transactions to send
 * @returns {Promise<Array>} Array of transaction results
 */
async function sendConfirmedTransactions(fromWallet, toWallets, amountEth, txCount) {
    const provider = fromWallet.provider;
    const txResults = [];

    logWithTime(`Starting sequential confirmed transfers: ${txCount} transactions`);
    logWithTime(`Amount per transaction: ${amountEth} ETH`);

    // Get initial nonce
    let nonce = await provider.getTransactionCount(fromWallet.address, "latest");
    const pendingNonce = await provider.getTransactionCount(fromWallet.address, "pending");

    logWithTime(`Current nonce (latest): ${nonce}`);
    logWithTime(`Current nonce (pending): ${pendingNonce}`);

    // If there are pending transactions, try to cancel them
    if (pendingNonce > nonce) {
        logWithTime(`Found ${pendingNonce - nonce} pending transactions`);
        nonce = await cancelPendingTransactions(fromWallet, nonce, pendingNonce - 1);
    }

    // Convert amount to wei
    const txValue = ethers.utils.parseEther(amountEth);

    // Get current gas price
    const baseGasPrice = await provider.getGasPrice();
    logWithTime(`Base gas price: ${ethers.utils.formatUnits(baseGasPrice, 'gwei')} gwei`);

    // Use a high gas price multiplier to ensure transactions go through
    const gasPrice = baseGasPrice.mul(2); // 2x gas price
    logWithTime(`Using gas price: ${ethers.utils.formatUnits(gasPrice, 'gwei')} gwei`);

    // Send transactions one at a time, waiting for confirmation
    for (let i = 0; i < txCount; i++) {
        const toWallet = toWallets[i % toWallets.length];

        try {
            logWithTime(`Sending transaction ${i+1}/${txCount} to ${toWallet.address.slice(0, 8)}... with nonce ${nonce}`);

            // Create and send transaction
            const tx = await fromWallet.sendTransaction({
                to: toWallet.address,
                value: txValue,
                nonce: nonce,
                gasPrice: gasPrice,
                gasLimit: 21000
            });

            logWithTime(`Transaction sent: ${tx.hash}`);

            // Wait for confirmation
            logWithTime(`Waiting for confirmation of transaction ${i+1}...`);
            const receipt = await tx.wait();

            const result = {
                index: i,
                hash: receipt.transactionHash,
                blockNumber: receipt.blockNumber,
                gasUsed: receipt.gasUsed.toString(),
                status: receipt.status,
                to: toWallet.address
            };

            logWithTime(`Transaction ${i+1} confirmed in block ${receipt.blockNumber}: ${receipt.transactionHash}`);
            txResults.push(result);

            // Increment nonce only after confirmation
            nonce++;

        } catch (error) {
            logWithTime(`Transaction ${i+1} failed: ${error.message}`);
            txResults.push({
                index: i,
                error: error.message,
                to: toWallet.address
            });

            // If needed, get the current nonce again
            const newNonce = await provider.getTransactionCount(fromWallet.address);
            logWithTime(`Resetting nonce to: ${newNonce}`);
            nonce = newNonce;
        }
    }

    return txResults;
}

/**
 * Run a multi-wallet test sending transactions from all wallets
 * @param {Array<ethers.Wallet>} wallets - Array of wallet instances
 * @param {string} amountEth - ETH amount per transaction
 * @param {number} txPerWallet - Number of transactions per wallet
 * @returns {Promise<Array>} Array of transaction results
 */
async function runMultiWalletTest(wallets, amountEth, txPerWallet) {
    const provider = wallets[0].provider;
    const allResults = [];

    // First, fund all wallets from main wallet if needed
    for (let i = 1; i < wallets.length; i++) {
        const wallet = wallets[i];
        const balance = await provider.getBalance(wallet.address);

        // If balance is low, send some ETH
        if (balance.lt(ethers.utils.parseEther("0.1"))) {
            logWithTime(`Funding wallet ${i} (${wallet.address.slice(0, 8)}...)`);

            try {
                const fundTx = await wallets[0].sendTransaction({
                    to: wallet.address,
                    value: ethers.utils.parseEther("0.1"),
                    gasLimit: 21000
                });

                await fundTx.wait();
                logWithTime(`Funded wallet ${i}: ${fundTx.hash}`);
            } catch (error) {
                logWithTime(`Failed to fund wallet ${i}: ${error.message}`);
            }
        }
    }

    // Now run test from each wallet
    for (let i = 0; i < wallets.length; i++) {
        const fromWallet = wallets[i];
        logWithTime(`=== Running test from wallet ${i+1}/${wallets.length} (${fromWallet.address.slice(0, 8)}...) ===`);

        // Create a list of target wallets (all wallets except this one)
        const toWallets = wallets.filter(w => w.address !== fromWallet.address);

        // Run the test
        const results = await sendConfirmedTransactions(
            fromWallet,
            toWallets,
            amountEth,
            txPerWallet
        );

        allResults.push(...results);
    }

    return allResults;
}

/**
 * Run a robust network test with advanced features
 * @param {object} options - Test options
 * @param {string} [options.networkName] - Name of the network to use
 * @param {string} [options.singleAmount] - ETH amount for single-wallet transfers
 * @param {string} [options.multiAmount] - ETH amount for multi-wallet transfers
 * @param {number} [options.singleTxCount] - Number of transactions for single-wallet test
 * @param {number} [options.multiTxCount] - Number of transactions per wallet for multi-wallet test
 * @returns {Promise<object>} Test results
 */
async function runRobustTest({
                                 networkName = config.defaultNetwork,
                                 singleAmount = "0.001",
                                 multiAmount = "0.0005",
                                 singleTxCount = 5,
                                 multiTxCount = 3
                             } = {}) {
    const globalStartTime = new Date();
    logWithTime("=== STARTING ROBUST NETWORK STRESS TEST ===");

    // Get network configuration
    const network = config.getNetwork(networkName);

    // Connect to blockchain
    const provider = new ethers.providers.JsonRpcProvider(network.rpc);

    // Create wallet instances
    const wallets = [];
    Object.entries(config.keys).forEach(([key, value]) => {
        wallets.push(new ethers.Wallet(value, provider));
    });

    // All transaction results
    const allResults = [];

    try {
        // Part 1: Single-wallet sequential transfers
        logWithTime("PART 1: Single-Wallet Sequential Transfers");

        const transferResults = await sendConfirmedTransactions(
            wallets[0],                // From wallet (main)
            wallets.slice(1),          // To wallets (all except main)
            singleAmount,              // Amount per tx
            singleTxCount              // Total txs
        );

        allResults.push(...transferResults);

        // Part 2: Multi-wallet test (transactions from all wallets)
        logWithTime("PART 2: Multi-Wallet Test");
        const multiWalletResults = await runMultiWalletTest(
            wallets,
            multiAmount,   // Smaller amount per tx
            multiTxCount   // Transactions per wallet
        );

        allResults.push(...multiWalletResults);

        // Calculate and display stats
        const globalEndTime = new Date();
        const executionTimeMs = globalEndTime - globalStartTime;
        const executionTimeSeconds = executionTimeMs / 1000;

        const successfulTxs = allResults.filter(tx => !tx.error).length;
        const failedTxs = allResults.filter(tx => tx.error).length;

        const totalGasUsed = allResults
            .filter(tx => tx.gasUsed)
            .reduce((sum, tx) => {
                return sum.add(ethers.BigNumber.from(tx.gasUsed || "0"));
            }, ethers.BigNumber.from(0));

        // Summary
        console.log("\n=== NETWORK TEST RESULTS ===");
        console.log(`Total execution time: ${(executionTimeSeconds / 60).toFixed(2)} minutes (${executionTimeSeconds.toFixed(2)} seconds)`);
        console.log(`Total transactions attempted: ${allResults.length}`);
        console.log(`Successful transactions: ${successfulTxs}`);
        console.log(`Failed transactions: ${failedTxs}`);
        console.log(`Success rate: ${((successfulTxs / allResults.length) * 100).toFixed(2)}%`);
        console.log(`Total gas used: ${totalGasUsed.toString()}`);
        console.log(`Explorer URL: ${network.explorer}${wallets[0].address}`);

        // Save results to file
        const resultsLog = {
            timestamp: new Date().toISOString(),
            network: network.name,
            rpc: network.rpc,
            totalExecutionTimeSeconds: executionTimeSeconds,
            transactionCount: allResults.length,
            successfulTxs,
            failedTxs,
            successRate: (successfulTxs / allResults.length),
            totalGasUsed: totalGasUsed.toString(),
            transactions: allResults
        };

        fs.writeFileSync(
            `robust-test-${networkName}-${new Date().toISOString().replace(/:/g, '-')}.json`,
            JSON.stringify(resultsLog, null, 2)
        );

        return resultsLog;
    } catch (error) {
        console.error("Error in network test:", error);
        console.log("Stack trace:", error.stack);
        return {
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = {
    cancelPendingTransactions,
    sendConfirmedTransactions,
    runMultiWalletTest,
    runRobustTest
};