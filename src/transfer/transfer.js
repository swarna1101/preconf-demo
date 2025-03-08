/**
 * Transfer module for sending batch transactions on Taiko networks
 */
const { ethers } = require("ethers");
const config = require("../common/config");
const {
    delay,
    formatTimestamp,
    createWallets,
    calculateTimeDifference,
    logWithTime
} = require("../common/utils");

/**
 * Runs a transfer stress test, sending multiple transactions to multiple wallets
 * @param {object} options - Options for the transfer test
 * @param {string} [options.networkName] - Name of the network to use
 * @param {string} [options.amount] - Amount of ETH to send per transaction
 * @param {number} [options.txCount] - Number of transactions to send per wallet
 * @param {boolean} [options.delayBetweenTx] - Whether to add a delay between transactions
 * @returns {Promise<object>} Test results
 */
async function runTransferTest({
                                   networkName = config.defaultNetwork,
                                   amount = config.defaultAmount,
                                   txCount = config.transactionCount,
                                   delayBetweenTx = false
                               } = {}) {
    // Get network configuration
    const network = config.getNetwork(networkName);

    // Connect to blockchain
    const provider = new ethers.providers.JsonRpcProvider(network.rpc);

    // Create wallet instances
    const wallets = createWallets(config.keys, provider);

    // Track test statistics
    const results = {
        startTime: new Date(),
        endTime: null,
        txCount: 0,
        successCount: 0,
        errorCount: 0,
        totalGasUsed: ethers.BigNumber.from(0),
        transactions: []
    };

    // Amount to transfer
    const transferAmount = ethers.utils.parseEther(amount);

    try {
        // Log start of test
        logWithTime(`== Starting Transaction Stress Test on ${network.name} ==`);
        logWithTime(`Sending ${txCount} transactions to each wallet`);
        logWithTime(`Amount per transaction: ${amount} ETH`);

        // Get initial balance of sender
        const initialBalance = await wallets[0].getBalance();
        logWithTime(`Sender initial balance: ${ethers.utils.formatEther(initialBalance)} ETH`);

        // For each wallet (except sender)
        for (let i = 1; i < wallets.length; i++) {
            logWithTime(`\n== Processing wallet ${i} (${wallets[i].address}) ==`);

            // Send multiple transactions to each wallet
            for (let j = 1; j <= txCount; j++) {
                try {
                    // Create transaction with a gas price increase to ensure it doesn't get stuck
                    const gasPrice = await provider.getGasPrice();
                    const adjustedGasPrice = gasPrice.mul(Math.floor(network.gasMultiplier * 100)).div(100);

                    const transaction = await wallets[0].sendTransaction({
                        to: wallets[i].address,
                        value: transferAmount,
                        gasPrice: adjustedGasPrice
                    });

                    // Track statistics
                    results.txCount++;
                    results.successCount++;
                    results.transactions.push({
                        hash: transaction.hash,
                        from: wallets[0].address,
                        to: wallets[i].address,
                        value: amount,
                        status: 'sent'
                    });

                    logWithTime(`Transfer ${i}-${j} Successful. Tx => [${transaction.hash}]`);

                    // Wait for transaction receipt to get gas used
                    const receipt = await transaction.wait();
                    results.totalGasUsed = results.totalGasUsed.add(receipt.gasUsed);

                    // Update transaction status
                    results.transactions[results.transactions.length - 1].status = 'confirmed';
                    results.transactions[results.transactions.length - 1].gasUsed = receipt.gasUsed.toString();
                    results.transactions[results.transactions.length - 1].blockNumber = receipt.blockNumber;

                    // Optional delay between transactions
                    if (delayBetweenTx) {
                        await delay(500);
                    }
                } catch (txError) {
                    results.txCount++;
                    results.errorCount++;
                    logWithTime(`Transaction ${i}-${j} failed: ${txError.message}`);

                    results.transactions.push({
                        from: wallets[0].address,
                        to: wallets[i].address,
                        value: amount,
                        status: 'failed',
                        error: txError.message
                    });
                }
            }
        }

        // Record end time
        results.endTime = new Date();

        // Calculate execution time and transaction rate
        const timeDiff = calculateTimeDifference(results.startTime, results.endTime);
        const txPerSecond = results.successCount / timeDiff.totalSeconds;

        // Get final balance of sender
        const finalBalance = await wallets[0].getBalance();
        const totalSpent = ethers.utils.formatEther(initialBalance.sub(finalBalance));

        // Log results
        logWithTime(`\n== Network Stress Test Complete ==`);
        logWithTime(`Total successful transactions: ${results.successCount}`);
        logWithTime(`Total failed transactions: ${results.errorCount}`);
        logWithTime(`Total execution time: ${timeDiff.minutes} minutes and ${timeDiff.seconds} seconds`);
        logWithTime(`Transaction rate: ${txPerSecond.toFixed(2)} tx/second`);
        logWithTime(`Total ETH spent: ${totalSpent} ETH`);
        logWithTime(`Total gas used: ${results.totalGasUsed.toString()}`);
        logWithTime(`See all transactions at: ${network.explorer}${wallets[0].address}`);

        return results;
    } catch (err) {
        console.error("Main process error:", err);
        results.endTime = new Date();
        return results;
    }
}

module.exports = {
    runTransferTest
};