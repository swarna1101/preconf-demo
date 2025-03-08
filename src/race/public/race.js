// Taiko Network Race Comparison - Client-side JavaScript

// State for the race comparison tool
const state = {
    connected: false,
    wallet: {
        address: null,
        privateKey: null,
        nonces: {
            preconf: 0,
            hekla: 0
        }
    },
    race: {
        isActive: false,
        preconfTransactions: [],
        heklaTransactions: [],
        preconfConfirmTimes: [],
        heklaConfirmTimes: []
    },
    config: {
        txCount: 5,
        amount: "0.0001"
    }
};

// DOM Elements
const elements = {
    networkBadge: document.getElementById('network-badge'),
    explorerLink: document.getElementById('explorer-link'),
    setupSection: document.getElementById('setup-section'),
    raceSection: document.getElementById('race-section'),
    walletAddress: document.getElementById('wallet-address'),

    // Form elements
    privateKeyInput: document.getElementById('private-key'),
    txCountInput: document.getElementById('tx-count'),
    amountInput: document.getElementById('amount'),
    connectWalletBtn: document.getElementById('connect-wallet-btn'),
    disconnectBtn: document.getElementById('disconnect-btn'),

    // Race controls
    startRaceBtn: document.getElementById('start-race-btn'),
    resetRaceBtn: document.getElementById('reset-race-btn'),

    // Stats elements
    preconfTxCount: document.getElementById('preconf-tx-count'),
    heklaTxCount: document.getElementById('hekla-tx-count'),
    preconfAvgTime: document.getElementById('preconf-avg-time'),
    heklaAvgTime: document.getElementById('hekla-avg-time'),

    // History elements
    preconfHistory: document.getElementById('preconf-history'),
    heklaHistory: document.getElementById('hekla-history'),

    // Racetrack container
    racetrackContainer: document.getElementById('racetrack-container')
};

// Initialize app
async function initialize() {
    try {
        // Fetch network info
        await fetchNetworkInfo();

        // Setup event listeners
        elements.connectWalletBtn.addEventListener('click', connectWallet);
        elements.disconnectBtn.addEventListener('click', disconnectWallet);
        elements.startRaceBtn.addEventListener('click', startRace);
        elements.resetRaceBtn.addEventListener('click', resetRace);

        // Initialize racetrack
        initializeRacetrack();

        console.log('Taiko Network Race Comparison tool initialized');
    } catch (error) {
        console.error('Initialization error:', error);
    }
}

// Fetch network configuration
async function fetchNetworkInfo() {
    try {
        const response = await fetch('/api/networks');
        const networkInfo = await response.json();

        // Update UI
        elements.networkBadge.textContent = 'Taiko Networks';
        elements.explorerLink.innerHTML = `
            <a href="${networkInfo.preconf?.explorer || '#'}" target="_blank">Preconf Explorer</a> | 
            <a href="${networkInfo.hekla?.explorer || '#'}" target="_blank">Hekla Explorer</a>
        `;

        console.log('Network information loaded:', networkInfo);
    } catch (error) {
        console.error('Error fetching network info:', error);
        elements.networkBadge.textContent = 'Network Error';
        elements.networkBadge.style.background = '#dc3545';
    }
}

// Initialize racetrack
function initializeRacetrack() {
    elements.racetrackContainer.innerHTML = `
        <div class="racetrack">
            <div class="bg-grid-pattern absolute inset-0 opacity-20"></div>
            
            <!-- Preconf Lane -->
            <div class="lane preconf-lane">
                <!-- Lane labels are now handled with CSS ::before and ::after pseudo-elements -->
            </div>
            
            <!-- Hekla Lane -->
            <div class="lane hekla-lane">
                <!-- Lane labels are now handled with CSS ::before and ::after pseudo-elements -->
            </div>
            
            <!-- Start Line -->
            <div class="absolute left-[10%] inset-y-0 w-[2px] bg-gradient-to-b from-pink-400 via-pink-600 to-pink-400">
                <!-- Pulsing dots -->
                <div class="absolute inset-x-0 top-1/4 h-2 w-2 rounded-full bg-pink-300 animate-pulse"></div>
                <div class="absolute inset-x-0 top-1/2 h-2 w-2 rounded-full bg-pink-300 animate-pulse" style="animation-delay: 0.3s"></div>
                <div class="absolute inset-x-0 top-3/4 h-2 w-2 rounded-full bg-pink-300 animate-pulse" style="animation-delay: 0.6s"></div>
            </div>
            
            <!-- Finish Line -->
            <div class="absolute right-[10%] inset-y-0 w-[3px] bg-gradient-to-b from-pink-300 via-white to-pink-300 z-20">
                <!-- Pulsing dots -->
                <div class="absolute inset-x-0 top-1/5 h-2 w-2 rounded-full bg-white animate-pulse"></div>
                <div class="absolute inset-x-0 top-2/5 h-2 w-2 rounded-full bg-white animate-pulse" style="animation-delay: 0.2s"></div>
                <div class="absolute inset-x-0 top-3/5 h-2 w-2 rounded-full bg-white animate-pulse" style="animation-delay: 0.4s"></div>
                <div class="absolute inset-x-0 top-3/5 h-2 w-2 rounded-full bg-white animate-pulse" style="animation-delay: 0.4s"></div>
                <div class="absolute inset-x-0 top-4/5 h-2 w-2 rounded-full bg-white animate-pulse" style="animation-delay: 0.6s"></div>
            </div>
            
            <!-- Lane divider -->
            <div class="absolute inset-x-0 top-1/2 h-[3px] bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
        </div>
    `;
}

// Connect wallet function
function connectWallet() {
    const privateKey = elements.privateKeyInput.value;
    const txCount = parseInt(elements.txCountInput.value) || 5;
    const amount = elements.amountInput.value || "0.0001";

    if (!privateKey) {
        alert('Please enter your private key');
        return;
    }

    try {
        // Store wallet info and configuration
        state.wallet.privateKey = privateKey;
        state.wallet.address = 'Connecting...'; // Placeholder
        state.config.txCount = txCount;
        state.config.amount = amount;

        // Update UI
        elements.setupSection.style.display = 'none';
        elements.raceSection.style.display = 'block';
        elements.walletAddress.textContent = 'Connecting...';

        // Set connected state
        state.connected = true;

        // Fetch wallet info
        fetchWalletInfo();

        console.log('Wallet connected');
    } catch (error) {
        console.error('Error connecting wallet:', error);
        alert(`Error connecting wallet: ${error.message}`);
    }
}

// Fetch wallet information
async function fetchWalletInfo() {
    try {
        // Call the API to get wallet address and nonces
        const response = await fetch('/api/wallet-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                privateKey: state.wallet.privateKey
            })
        });

        const result = await response.json();

        if (result.success) {
            // Update wallet info
            state.wallet.address = result.address;
            state.wallet.nonces.preconf = result.nonces.preconf;
            state.wallet.nonces.hekla = result.nonces.hekla;

            // Update UI
            elements.walletAddress.textContent = shortenAddress(result.address);

            console.log('Wallet info retrieved:', {
                address: shortenAddress(result.address),
                nonces: result.nonces
            });
        } else {
            throw new Error(result.error || 'Failed to fetch wallet info');
        }
    } catch (error) {
        console.error('Error fetching wallet info:', error);
        elements.walletAddress.textContent = 'Error loading wallet info';
    }
}

// Disconnect wallet function
function disconnectWallet() {
    // Reset state
    state.connected = false;
    state.wallet = {
        address: null,
        privateKey: null,
        nonces: {
            preconf: 0,
            hekla: 0
        }
    };
    state.race = {
        isActive: false,
        preconfTransactions: [],
        heklaTransactions: [],
        preconfConfirmTimes: [],
        heklaConfirmTimes: []
    };

    // Reset UI
    elements.setupSection.style.display = 'block';
    elements.raceSection.style.display = 'none';
    elements.privateKeyInput.value = '';
    elements.preconfHistory.innerHTML = '';
    elements.heklaHistory.innerHTML = '';
    elements.preconfTxCount.textContent = '0';
    elements.heklaTxCount.textContent = '0';
    elements.preconfAvgTime.textContent = '0 sec';
    elements.heklaAvgTime.textContent = '0 sec';

    // Reset racetrack
    initializeRacetrack();

    console.log('Wallet disconnected');
}

// Start race function
async function startRace() {
    if (!state.connected || state.race.isActive) return;

    try {
        // Set race active state
        state.race.isActive = true;
        elements.startRaceBtn.disabled = true;
        elements.startRaceBtn.textContent = 'Race in progress...';

        // Reset race data
        state.race.preconfTransactions = [];
        state.race.heklaTransactions = [];
        state.race.preconfConfirmTimes = [];
        state.race.heklaConfirmTimes = [];

        // Reset UI
        elements.preconfHistory.innerHTML = '';
        elements.heklaHistory.innerHTML = '';
        elements.preconfTxCount.textContent = '0';
        elements.heklaTxCount.textContent = '0';
        elements.preconfAvgTime.textContent = '0 sec';
        elements.heklaAvgTime.textContent = '0 sec';

        // Create empty race cars
        for (let i = 0; i < state.config.txCount; i++) {
            // Create preconf car
            const preconfCar = document.createElement('div');
            preconfCar.className = 'race-car preconf-car';
            preconfCar.id = `preconf-car-${i}`;
            preconfCar.style.top = `${30 - (i * 5)}%`;
            preconfCar.style.left = '10%';
            preconfCar.innerHTML = `<div class="absolute inset-0 flex items-center justify-center text-white text-xs font-mono">TX ${i+1}</div>`;
            document.querySelector('.preconf-lane').appendChild(preconfCar);

            // Create hekla car
            const heklaCar = document.createElement('div');
            heklaCar.className = 'race-car hekla-car';
            heklaCar.id = `hekla-car-${i}`;
            heklaCar.style.top = `${30 - (i * 5)}%`;
            heklaCar.style.left = '10%';
            heklaCar.innerHTML = `<div class="absolute inset-0 flex items-center justify-center text-white text-xs font-mono">TX ${i+1}</div>`;
            document.querySelector('.hekla-lane').appendChild(heklaCar);
        }

        console.log(`Starting race with ${state.config.txCount} transactions`);

        // Send transactions to both networks simultaneously
        const transactionPromises = [];

        for (let i = 0; i < state.config.txCount; i++) {
            // Add a slight delay between transactions to avoid nonce issues
            await new Promise(resolve => setTimeout(resolve, 500));

            // Send to preconf
            transactionPromises.push(sendTransaction('preconf', i));

            // Send to hekla
            transactionPromises.push(sendTransaction('hekla', i));
        }

        // Wait for all transactions to complete or timeout
        const raceTimeout = setTimeout(() => {
            if (state.race.isActive) {
                finishRace();
            }
        }, 60000); // 1 minute timeout

        // Check progress periodically
        const progressCheck = setInterval(() => {
            const preconfDone = state.race.preconfTransactions.filter(tx =>
                tx.status === 'confirmed' || tx.status === 'failed'
            ).length;

            const heklaDone = state.race.heklaTransactions.filter(tx =>
                tx.status === 'confirmed' || tx.status === 'failed'
            ).length;

            // If all transactions are done, finish the race
            if (preconfDone >= state.config.txCount && heklaDone >= state.config.txCount) {
                clearInterval(progressCheck);
                clearTimeout(raceTimeout);
                finishRace();
            }
        }, 1000);

    } catch (error) {
        console.error('Error starting race:', error);
        elements.startRaceBtn.disabled = false;
        elements.startRaceBtn.textContent = 'Start Race';
        state.race.isActive = false;
    }
}

// Send a single transaction to a network
async function sendTransaction(network, index) {
    try {
        // Get current nonce
        const nonce = state.wallet.nonces[network]++;

        // Create transaction object
        const tx = {
            id: `${network}-${index}`,
            network,
            index,
            nonce,
            amount: state.config.amount,
            startTime: Date.now(),
            status: 'pending',
            hash: null,
            confirmTime: null
        };

        // Add to transactions array
        if (network === 'preconf') {
            state.race.preconfTransactions.push(tx);
        } else {
            state.race.heklaTransactions.push(tx);
        }

        // Update UI to show pending transaction
        addTransactionToHistory(tx);
        updateStats();

        // Send transaction via API
        const response = await fetch('/api/send-transaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                network,
                privateKey: state.wallet.privateKey,
                amount: state.config.amount,
                nonce
            })
        });

        const result = await response.json();

        if (result.success) {
            // Update transaction with hash
            tx.hash = result.hash;

            // Move car to indicate transaction sent
            const car = document.getElementById(`${network}-car-${index}`);
            if (car) {
                car.style.left = '40%';
            }

            // Update UI
            updateTransactionInHistory(tx);

            // Start polling for confirmation
            pollTransactionStatus(tx);
        } else {
            // Transaction failed to send
            tx.status = 'failed';
            tx.error = result.error;

            // Update UI
            updateTransactionInHistory(tx);
            updateStats();
        }

        return tx;
    } catch (error) {
        console.error(`Error sending ${network} transaction ${index}:`, error);

        // Update transaction as failed
        const tx = network === 'preconf'
            ? state.race.preconfTransactions.find(t => t.index === index)
            : state.race.heklaTransactions.find(t => t.index === index);

        if (tx) {
            tx.status = 'failed';
            tx.error = error.message;
            updateTransactionInHistory(tx);
            updateStats();
        }
    }
}

// Poll for transaction status
async function pollTransactionStatus(tx) {
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds max polling time (1s intervals)

    const poll = async () => {
        if (attempts >= maxAttempts || !state.race.isActive) {
            // Timeout or race ended
            if (tx.status === 'pending') {
                tx.status = 'timeout';
                updateTransactionInHistory(tx);
                updateStats();
            }
            return;
        }

        attempts++;

        try {
            const response = await fetch(`/api/tx-status/${tx.network}/${tx.hash}`);
            const result = await response.json();

            if (result.success && result.confirmed) {
                // Transaction confirmed
                const confirmTime = Date.now() - tx.startTime;
                tx.confirmTime = confirmTime;
                tx.status = 'confirmed';
                tx.blockNumber = result.receipt.blockNumber;
                tx.gasUsed = result.receipt.gasUsed;

                // Add to confirm times
                if (tx.network === 'preconf') {
                    state.race.preconfConfirmTimes.push(confirmTime);
                } else {
                    state.race.heklaConfirmTimes.push(confirmTime);
                }

                // Move car to finish line
                const car = document.getElementById(`${tx.network}-car-${tx.index}`);
                if (car) {
                    car.style.left = '90%';

                    // Add animation class
                    car.classList.add('confirmed-car');
                }

                // Update UI
                updateTransactionInHistory(tx);
                updateStats();

                return;
            }

            // Transaction still pending, poll again
            setTimeout(poll, 1000);
        } catch (error) {
            console.error(`Error polling ${tx.network} transaction ${tx.hash}:`, error);
            setTimeout(poll, 1000);
        }
    };

    // Start polling
    poll();
}

// Add transaction to history
function addTransactionToHistory(tx) {
    const historyElement = tx.network === 'preconf' ? elements.preconfHistory : elements.heklaHistory;

    const txElement = document.createElement('div');
    txElement.className = 'transaction-item';
    txElement.id = `tx-${tx.id}`;

    txElement.innerHTML = `
        <div class="tx-info">
            <div class="tx-hash">Transaction ${tx.index + 1}</div>
            <div class="tx-nonce">Nonce: ${tx.nonce}</div>
            <div class="tx-time">Started: ${new Date(tx.startTime).toLocaleTimeString()}</div>
            <div class="tx-status status-pending">Pending</div>
        </div>
    `;

    historyElement.appendChild(txElement);
}

// Update transaction in history
function updateTransactionInHistory(tx) {
    const txElement = document.getElementById(`tx-${tx.id}`);
    if (!txElement) return;

    const statusElement = txElement.querySelector('.tx-status');
    const hashElement = txElement.querySelector('.tx-hash');

    // Update hash display if available
    if (tx.hash && hashElement) {
        hashElement.textContent = shortenHash(tx.hash);
    }

    // Update status display
    if (statusElement) {
        statusElement.className = `tx-status status-${tx.status}`;

        if (tx.status === 'confirmed') {
            statusElement.textContent = `Confirmed in ${formatTime(tx.confirmTime)}`;
        } else if (tx.status === 'failed') {
            statusElement.textContent = `Failed: ${tx.error || 'Transaction error'}`;
        } else if (tx.status === 'timeout') {
            statusElement.textContent = 'Timeout: Transaction took too long';
        } else {
            statusElement.textContent = 'Pending';
        }
    }
}

// Update statistics
function updateStats() {
    // Count confirmed transactions
    const preconfConfirmed = state.race.preconfTransactions.filter(tx => tx.status === 'confirmed').length;
    const heklaConfirmed = state.race.heklaTransactions.filter(tx => tx.status === 'confirmed').length;

    // Update transaction counts
    elements.preconfTxCount.textContent = preconfConfirmed;
    elements.heklaTxCount.textContent = heklaConfirmed;

    // Calculate average confirmation times
    if (state.race.preconfConfirmTimes.length > 0) {
        const avgTime = state.race.preconfConfirmTimes.reduce((sum, time) => sum + time, 0) / state.race.preconfConfirmTimes.length;
        elements.preconfAvgTime.textContent = formatTime(avgTime);
    }

    if (state.race.heklaConfirmTimes.length > 0) {
        const avgTime = state.race.heklaConfirmTimes.reduce((sum, time) => sum + time, 0) / state.race.heklaConfirmTimes.length;
        elements.heklaAvgTime.textContent = formatTime(avgTime);
    }
}

// Finish race
function finishRace() {
    if (!state.race.isActive) return;

    // Set race as inactive
    state.race.isActive = false;

    // Re-enable start button
    elements.startRaceBtn.disabled = false;
    elements.startRaceBtn.textContent = 'Start New Race';

    // Calculate final stats
    const preconfConfirmed = state.race.preconfTransactions.filter(tx => tx.status === 'confirmed').length;
    const heklaConfirmed = state.race.heklaTransactions.filter(tx => tx.status === 'confirmed').length;

    // Calculate average confirmation times
    let preconfAvgTime = 0;
    let heklaAvgTime = 0;

    if (state.race.preconfConfirmTimes.length > 0) {
        preconfAvgTime = state.race.preconfConfirmTimes.reduce((sum, time) => sum + time, 0) / state.race.preconfConfirmTimes.length;
    }

    if (state.race.heklaConfirmTimes.length > 0) {
        heklaAvgTime = state.race.heklaConfirmTimes.reduce((sum, time) => sum + time, 0) / state.race.heklaConfirmTimes.length;
    }

    // Determine winner (if both have confirmed transactions)
    if (preconfConfirmed > 0 && heklaConfirmed > 0) {
        // Calculate the ratio (how much faster)
        const speedRatio = heklaAvgTime / preconfAvgTime;

        // Show result alert
        alert(`Race completed!\n\nPreconf Average: ${formatTime(preconfAvgTime)}\nHekla Average: ${formatTime(heklaAvgTime)}\n\nPreconf is ${speedRatio.toFixed(2)}x faster than Hekla!`);
    } else {
        alert('Race completed, but not enough successful transactions to determine a winner.');
    }

    console.log('Race finished', {
        preconf: {
            confirmed: preconfConfirmed,
            avgTime: preconfAvgTime
        },
        hekla: {
            confirmed: heklaConfirmed,
            avgTime: heklaAvgTime
        }
    });
}

// Reset race
function resetRace() {
    if (state.race.isActive) {
        // End current race
        finishRace();
    }

    // Clear race data
    state.race = {
        isActive: false,
        preconfTransactions: [],
        heklaTransactions: [],
        preconfConfirmTimes: [],
        heklaConfirmTimes: []
    };

    // Reset UI
    elements.preconfHistory.innerHTML = '';
    elements.heklaHistory.innerHTML = '';
    elements.preconfTxCount.textContent = '0';
    elements.heklaTxCount.textContent = '0';
    elements.preconfAvgTime.textContent = '0 sec';
    elements.heklaAvgTime.textContent = '0 sec';

    // Reset racetrack
    initializeRacetrack();

    // Reset button text
    elements.startRaceBtn.textContent = 'Start Race';
    elements.startRaceBtn.disabled = false;

    console.log('Race reset');
}

// Helper: Format time in ms to a readable string
function formatTime(ms) {
    if (ms === 0) return '0 sec';

    if (ms < 1000) {
        return `${ms.toFixed(0)} ms`;
    } else {
        const seconds = ms / 1000;
        if (seconds < 60) {
            return `${seconds.toFixed(1)} sec`;
        } else {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = (seconds % 60).toFixed(1);
            return `${minutes}m ${remainingSeconds}s`;
        }
    }
}

// Helper: Shorten address for display
function shortenAddress(address) {
    if (!address) return '';
    return `${address.substring(0, 8)}...${address.substring(address.length - 6)}`;
}

// Helper: Shorten hash for display
function shortenHash(hash) {
    if (!hash) return '';
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 6)}`;
}

// Initialize app when DOM content is loaded
document.addEventListener('DOMContentLoaded', initialize);

// Add css class to enable tailwind classes
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('tailwind');
});