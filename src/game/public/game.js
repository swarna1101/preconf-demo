// Transaction Game Client-side JavaScript

// Game state
const state = {
    network: null,
    connected: false,
    wallet: {
        address: null,
        privateKey: null,
        currentNonce: 0 // Track current nonce
    },
    transactions: [],
    stats: {
        total: 0,
        success: 0,
        pending: 0,
        failed: 0
    },
    config: {
        recipient: null,
        amount: "0.0001"
    },
    colors: [
        'color-1', 'color-2', 'color-3', 'color-4',
        'color-5', 'color-6', 'color-7', 'color-8'
    ],
    confirmTimes: [],
    isProcessingTransaction: false // Prevent multiple clicks
};

// DOM elements
const elements = {
    networkBadge: document.getElementById('network-badge'),
    explorerLink: document.getElementById('explorer-link'),
    setupSection: document.getElementById('setup-section'),
    gameSection: document.getElementById('game-section'),
    walletAddress: document.getElementById('wallet-address'),
    txCount: document.getElementById('tx-count'),
    successRate: document.getElementById('success-rate'),
    avgConfirmTime: document.getElementById('avg-confirm-time'),
    historyContainer: document.getElementById('history-container'),
    transactionButton: document.getElementById('transaction-button'),

    // Form elements
    privateKeyInput: document.getElementById('private-key'),
    recipientInput: document.getElementById('recipient'),
    amountInput: document.getElementById('amount'),
    connectWalletBtn: document.getElementById('connect-wallet-btn'),
    disconnectBtn: document.getElementById('disconnect-btn')
};

// Fetch network configuration
async function fetchNetworkConfig() {
    try {
        const response = await fetch('/api/config');
        const config = await response.json();

        state.network = config;
        elements.networkBadge.textContent = config.network;
        elements.explorerLink.innerHTML = `<a href="${config.explorer}" target="_blank">Block Explorer</a>`;

        console.log(`Connected to network: ${config.network}`);
    } catch (error) {
        console.error('Error fetching network config:', error);
        elements.networkBadge.textContent = 'Network Error';
        elements.networkBadge.style.backgroundColor = '#dc3545';
    }
}

// Fetch current nonce for the wallet
async function fetchCurrentNonce() {
    try {
        const response = await fetch('/api/nonce', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                address: state.wallet.address
            })
        });

        const result = await response.json();

        if (result.success) {
            state.wallet.currentNonce = result.nonce;
            console.log(`Fetched current nonce: ${state.wallet.currentNonce}`);
        } else {
            console.error('Failed to fetch nonce:', result.error);
        }
    } catch (error) {
        console.error('Error fetching nonce:', error);
    }
}

// Connect wallet function
function connectWallet() {
    const privateKey = elements.privateKeyInput.value;

    if (!privateKey) {
        alert('Please enter your private key');
        return;
    }

    try {
        // Store wallet info (never send the private key to the server except when signing transactions)
        state.wallet.privateKey = privateKey;

        // For demo purposes, extract the address from the key
        // In production, this should be done via proper wallet connection
        // This is a simple placeholder - normally you'd use ethers.js directly in the browser
        state.wallet.address = 'Wallet Address'; // Placeholder

        // Store transaction config
        state.config.recipient = elements.recipientInput.value;
        state.config.amount = elements.amountInput.value || "0.0001";

        // Update UI
        elements.setupSection.style.display = 'none';
        elements.gameSection.style.display = 'block';
        elements.walletAddress.textContent = state.wallet.address;

        // Set connected state
        state.connected = true;

        console.log('Wallet connected');

        // Send a test transaction to get the actual wallet address
        sendTransaction(true);
    } catch (error) {
        console.error('Error connecting wallet:', error);
        alert(`Error connecting wallet: ${error.message}`);
    }
}

// Send transaction function
async function sendTransaction(isTest = false) {
    if (!state.connected || (state.isProcessingTransaction && !isTest)) return;

    try {
        // Prevent multiple clicks
        if (!isTest) {
            state.isProcessingTransaction = true;
            changeButtonColor();
            elements.transactionButton.textContent = 'Sending...';
        }

        // Prepare transaction data with nonce
        const txData = {
            privateKey: state.wallet.privateKey,
            recipient: state.config.recipient,
            ethValue: state.config.amount,
            nonce: state.wallet.currentNonce
        };

        // Send transaction via API
        const response = await fetch('/api/send-transaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(txData)
        });

        const result = await response.json();

        if (result.success) {
            // If this is the first transaction, update the wallet address
            if (isTest || !state.wallet.address || state.wallet.address === 'Wallet Address') {
                state.wallet.address = result.from;
                elements.walletAddress.textContent = shortenAddress(result.from);

                // Fetch initial nonce if this is the first time
                await fetchCurrentNonce();

                // If it's just a test, don't continue
                if (isTest) {
                    state.isProcessingTransaction = false;
                    return;
                }
            }

            // Increment nonce for next transaction
            state.wallet.currentNonce = result.nonce + 1;
            console.log(`Transaction sent with nonce ${result.nonce}, next nonce: ${state.wallet.currentNonce}`);

            // Add transaction to state
            const txInfo = {
                hash: result.hash,
                from: result.from,
                to: result.to,
                value: result.value,
                timestamp: Date.now(),
                status: 'pending',
                confirmTime: null,
                nonce: result.nonce
            };

            state.transactions.unshift(txInfo);
            state.stats.total++;
            state.stats.pending++;

            // Update UI
            updateStats();
            addTransactionToHistory(txInfo);

            // Reset button text
            elements.transactionButton.textContent = 'TRANSACTION';
            state.isProcessingTransaction = false;

            // Start polling for confirmation
            pollTransactionStatus(txInfo.hash);
        } else {
            // Handle specific errors
            if (result.error && result.error.includes('already known')) {
                console.log(`Transaction with nonce ${state.wallet.currentNonce} already pending, incrementing nonce`);
                state.wallet.currentNonce++;

                // Retry with new nonce if not a test
                if (!isTest) {
                    elements.transactionButton.textContent = 'Retrying...';
                    state.isProcessingTransaction = false;
                    return sendTransaction(false);
                }
            } else if (result.error && result.error.includes('nonce too low')) {
                console.log(`Nonce too low, fetching current nonce`);
                await fetchCurrentNonce();
                state.wallet.currentNonce++; // Increment for next transaction

                // Retry with new nonce if not a test
                if (!isTest) {
                    elements.transactionButton.textContent = 'Retrying...';
                    state.isProcessingTransaction = false;
                    return sendTransaction(false);
                }
            } else {
                console.error('Transaction failed:', result.error);
                alert(`Transaction failed: ${result.error}`);
            }

            elements.transactionButton.textContent = 'TRANSACTION';
            state.isProcessingTransaction = false;
        }
    } catch (error) {
        console.error('Error sending transaction:', error);
        alert(`Error sending transaction: ${error.message}`);
        elements.transactionButton.textContent = 'TRANSACTION';
        state.isProcessingTransaction = false;
    }
}

// Poll for transaction status
async function pollTransactionStatus(txHash) {
    const pollInterval = setInterval(async () => {
        try {
            const response = await fetch(`/api/transaction/${txHash}`);
            const result = await response.json();

            if (result.success && result.confirmed) {
                // Find transaction in state
                const txIndex = state.transactions.findIndex(tx => tx.hash === txHash);

                if (txIndex >= 0) {
                    const tx = state.transactions[txIndex];

                    // Update transaction status
                    tx.status = 'confirmed';
                    tx.confirmTime = Date.now() - tx.timestamp;
                    state.confirmTimes.push(tx.confirmTime);

                    // Update stats
                    state.stats.pending--;
                    state.stats.success++;

                    // Update UI
                    updateStats();
                    updateTransactionInHistory(tx);

                    // Stop polling
                    clearInterval(pollInterval);
                }
            }
        } catch (error) {
            console.error(`Error polling transaction ${txHash}:`, error);
            clearInterval(pollInterval);

            // Find transaction in state
            const txIndex = state.transactions.findIndex(tx => tx.hash === txHash);

            if (txIndex >= 0) {
                const tx = state.transactions[txIndex];

                // Update transaction status
                tx.status = 'failed';

                // Update stats
                state.stats.pending--;
                state.stats.failed++;

                // Update UI
                updateStats();
                updateTransactionInHistory(tx);
            }
        }
    }, 2000); // Check every 2 seconds

    // Set timeout for polling (5 minutes)
    setTimeout(() => {
        clearInterval(pollInterval);

        // Check if transaction is still pending
        const txIndex = state.transactions.findIndex(tx => tx.hash === txHash && tx.status === 'pending');

        if (txIndex >= 0) {
            const tx = state.transactions[txIndex];

            // Update transaction status
            tx.status = 'failed';

            // Update stats
            state.stats.pending--;
            state.stats.failed++;

            // Update UI
            updateStats();
            updateTransactionInHistory(tx);
        }
    }, 300000); // 5 minutes timeout
}

// Update statistics display
function updateStats() {
    elements.txCount.textContent = state.stats.total;

    const successRate = state.stats.total > 0
        ? Math.round((state.stats.success / state.stats.total) * 100)
        : 0;
    elements.successRate.textContent = `${successRate}%`;

    // Calculate average confirmation time
    if (state.confirmTimes.length > 0) {
        const avgTime = state.confirmTimes.reduce((sum, time) => sum + time, 0) / state.confirmTimes.length;
        elements.avgConfirmTime.textContent = formatTime(avgTime);
    }
}

// Add transaction to history UI
function addTransactionToHistory(tx) {
    const txElement = document.createElement('div');
    txElement.className = 'transaction-item';
    txElement.id = `tx-${tx.hash}`;

    txElement.innerHTML = `
        <div class="tx-info">
            <div class="tx-hash">${shortenHash(tx.hash)}</div>
            <div class="tx-amount">${tx.value} ETH</div>
            <div class="tx-nonce">Nonce: ${tx.nonce}</div>
        </div>
        <div class="tx-status status-pending">
            <span class="spinner"></span> Pending
        </div>
    `;

    // Add to history container at the top
    if (elements.historyContainer.firstChild) {
        elements.historyContainer.insertBefore(txElement, elements.historyContainer.firstChild);
    } else {
        elements.historyContainer.appendChild(txElement);
    }
}

// Update transaction in history UI
function updateTransactionInHistory(tx) {
    const txElement = document.getElementById(`tx-${tx.hash}`);

    if (txElement) {
        const statusElement = txElement.querySelector('.tx-status');

        if (tx.status === 'confirmed') {
            statusElement.className = 'tx-status status-confirmed';
            statusElement.innerHTML = `✓ Confirmed (${formatTime(tx.confirmTime)})`;
        } else if (tx.status === 'failed') {
            statusElement.className = 'tx-status status-failed';
            statusElement.innerHTML = '✗ Failed';
        }
    }
}

// Disconnect wallet function
function disconnectWallet() {
    // Reset state
    state.connected = false;
    state.wallet = {
        address: null,
        privateKey: null,
        currentNonce: 0
    };
    state.transactions = [];
    state.stats = {
        total: 0,
        success: 0,
        pending: 0,
        failed: 0
    };
    state.confirmTimes = [];
    state.isProcessingTransaction = false;

    // Reset UI
    elements.setupSection.style.display = 'block';
    elements.gameSection.style.display = 'none';
    elements.privateKeyInput.value = '';
    elements.historyContainer.innerHTML = '';
    elements.txCount.textContent = '0';
    elements.successRate.textContent = '0%';
    elements.avgConfirmTime.textContent = '0 sec';
}

// Change button color randomly
function changeButtonColor() {
    const currentColor = elements.transactionButton.className.split(' ').find(cls => cls.startsWith('color-'));
    let newColor;

    do {
        const randomIndex = Math.floor(Math.random() * state.colors.length);
        newColor = state.colors[randomIndex];
    } while (newColor === currentColor);

    elements.transactionButton.className = `transaction-button ${newColor}`;
}

// Helper functions
function shortenAddress(address) {
    return `${address.substring(0, 8)}...${address.substring(address.length - 6)}`;
}

function shortenHash(hash) {
    return `${hash.substring(0, 10)}...`;
}

function formatTime(ms) {
    if (ms < 1000) {
        return `${ms}ms`;
    } else {
        const seconds = Math.round(ms / 100) / 10;
        return `${seconds}s`;
    }
}

// Throttle function to prevent button mashing
function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return func(...args);
    };
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Fetch network config
    fetchNetworkConfig();

    // Add event listeners to buttons
    elements.connectWalletBtn.addEventListener('click', connectWallet);
    elements.disconnectBtn.addEventListener('click', disconnectWallet);

    // Throttle transaction button to prevent multiple rapid clicks
    const throttledSendTransaction = throttle(() => sendTransaction(false), 500);
    elements.transactionButton.addEventListener('click', throttledSendTransaction);

    // Set initial button color
    changeButtonColor();
});