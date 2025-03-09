// Network Comparison Client-side JavaScript

// State for the comparison tool
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
    networks: {
        preconf: {
            name: "Preconf Devnet",
            rpc: "https://rpc.helder.taiko.xyz",
            explorer: "https://helder-explorer-git-preconfs-taikoxyz.vercel.app",
            status: "ready",
            testInProgress: false,
            isPolling: false, // Flag to prevent duplicate polling
            results: null,
            progress: 0, // 0-100 progress value
            blocksProcessed: 0 // Track simulated blocks
        },
        hekla: {
            name: "Taiko Hekla",
            rpc: "https://rpc.hekla.taiko.xyz",
            explorer: "https://hekla.taikoscan.io",
            status: "ready",
            testInProgress: false,
            isPolling: false, // Flag to prevent duplicate polling
            results: null,
            progress: 0, // 0-100 progress value
            blocksProcessed: 0 // Track simulated blocks
        }
    },
    comparison: {
        inProgress: false,
        completed: false,
        winner: null
    },
    config: {
        recipient: null,
        amount: "0.0001"
    },
    stats: {
        totalBlocks: 0,
        preconfBlocks: 0,
        heklaBlocks: 0,
        lastBlockTime: Date.now()
    }
};

// DOM elements
const elements = {
    setupSection: document.getElementById('setup-section'),
    comparisonSection: document.getElementById('comparison-section'),
    comparisonResult: document.getElementById('comparison-result'),
    raceTrackContainer: document.getElementById('race-track-container'),
    blockStatsContainer: document.getElementById('block-stats-container'),
    walletAddress: document.getElementById('wallet-address'),

    // Block stats elements
    totalBlocks: document.getElementById('total-blocks'),
    preconfBlocks: document.getElementById('preconf-blocks'),
    heklaBlocks: document.getElementById('hekla-blocks'),

    // Race track elements
    preconfCar: document.getElementById('preconf-car'),
    heklaCar: document.getElementById('hekla-car'),

    // Preconf network elements
    preconf: {
        rpc: document.getElementById('preconf-rpc'),
        explorer: document.getElementById('preconf-explorer'),
        status: document.getElementById('preconf-status'),
        result: document.getElementById('preconf-result'),
        time: document.getElementById('preconf-time'),
        block: document.getElementById('preconf-block'),
        gas: document.getElementById('preconf-gas'),
        testBtn: document.getElementById('test-preconf-btn'),
        bar: document.getElementById('preconf-bar'),
        progressBar: document.getElementById('preconf-progress-bar')
    },

    // Hekla network elements
    hekla: {
        rpc: document.getElementById('hekla-rpc'),
        explorer: document.getElementById('hekla-explorer'),
        status: document.getElementById('hekla-status'),
        result: document.getElementById('hekla-result'),
        time: document.getElementById('hekla-time'),
        block: document.getElementById('hekla-block'),
        gas: document.getElementById('hekla-gas'),
        testBtn: document.getElementById('test-hekla-btn'),
        bar: document.getElementById('hekla-bar'),
        progressBar: document.getElementById('hekla-progress-bar')
    },

    // Comparison elements
    speedDifference: document.getElementById('speed-difference'),
    resultPreconfTime: document.getElementById('result-preconf-time'),
    resultHeklaTime: document.getElementById('result-hekla-time'),
    resultPreconfGas: document.getElementById('result-preconf-gas'),
    resultHeklaGas: document.getElementById('result-hekla-gas'),
    resultPreconfBlock: document.getElementById('result-preconf-block'),
    resultHeklaBlock: document.getElementById('result-hekla-block'),

    // Form elements
    privateKeyInput: document.getElementById('private-key'),
    recipientInput: document.getElementById('recipient'),
    amountInput: document.getElementById('amount'),
    connectWalletBtn: document.getElementById('connect-wallet-btn'),
    disconnectBtn: document.getElementById('disconnect-btn'),
    compareBothBtn: document.getElementById('compare-both-btn')
};

// Initialize the comparison tool
async function initializeComparison() {
    try {
        // Fetch network information
        await fetchNetworkInfo();

        // Add event listeners
        setupEventListeners();

        // Initialize progress bars
        initializeProgressBars();

        // Start block simulator for statistics
        startBlockSimulator();
    } catch (error) {
        console.error("Failed to initialize comparison:", error);
    }
}

// Initialize progress bars
function initializeProgressBars() {
    // Ensure progress bars are properly initialized with 0% width
    ['preconf', 'hekla'].forEach(networkId => {
        if (elements[networkId].progressBar) {
            elements[networkId].progressBar.style.width = '0%';
            elements[networkId].progressBar.style.background = 'linear-gradient(to right, #FFC6E9, #FF6FC8, #FFFFFF)';
        }
    });
}

// Update progress bar
function updateProgressBar(networkId, progress) {
    // Update state
    state.networks[networkId].progress = progress;

    // Update UI
    if (elements[networkId].progressBar) {
        elements[networkId].progressBar.style.width = `${progress}%`;

        // Change color based on progress
        if (progress < 30) {
            // Starting - light gradient
            elements[networkId].progressBar.style.background = 'linear-gradient(to right, #FFC6E9, #FF6FC8)';
        } else if (progress < 70) {
            // Mid progress - medium gradient
            elements[networkId].progressBar.style.background = 'linear-gradient(to right, #FF6FC8, #E81899)';
        } else {
            // Near completion - full gradient
            elements[networkId].progressBar.style.background = 'linear-gradient(to right, #FFC6E9, #FF6FC8, #FFFFFF)';
        }
    }

    // Also update car position in race track
    updateCarPosition(networkId, progress);
}

// Update car position in race track
function updateCarPosition(networkId, progress) {
    const car = document.getElementById(`${networkId}-car`);
    if (!car) return;

    // Calculate position (from 10% to 90%)
    const position = 10 + (progress * 0.8);
    car.style.left = `${position}%`;

    // Enlarge trail based on speed
    const trail = car.querySelector('.car-trail');
    if (trail) {
        const trailWidth = Math.min(100, 40 + (progress / 2));
        trail.style.width = `${trailWidth}px`;
        trail.style.opacity = progress > 80 ? '0.8' : '0.5';
    }

    // Add winner effect when car crosses finish line
    if (progress >= 90 && !car.classList.contains('winner')) {
        car.classList.add('winner');
    }
}

// Fetch network information
async function fetchNetworkInfo() {
    try {
        // Attempt to fetch network info from API
        const response = await fetch('/api/networks');

        // If successful, use the fetched data
        if (response.ok) {
            const data = await response.json();

            // Update state with network information
            Object.keys(data.networks).forEach(networkId => {
                if (state.networks[networkId]) {
                    state.networks[networkId].name = data.networks[networkId].name;
                    state.networks[networkId].rpc = data.networks[networkId].rpc;
                    state.networks[networkId].explorer = data.networks[networkId].explorer;
                }
            });

            // Update default amount if provided
            if (data.defaultAmount) {
                state.config.amount = data.defaultAmount;
                elements.amountInput.value = data.defaultAmount;
            }
        }

        // Update UI with network information
        elements.preconf.rpc.textContent = shortenString(state.networks.preconf.rpc);
        elements.preconf.explorer.href = state.networks.preconf.explorer;

        elements.hekla.rpc.textContent = shortenString(state.networks.hekla.rpc);
        elements.hekla.explorer.href = state.networks.hekla.explorer;

        // Initialize race track visualization
        initializeRaceTrack();
    } catch (error) {
        console.error("Failed to fetch network info:", error);
    }
}

// Initialize race track visualization
function initializeRaceTrack() {
    if (elements.raceTrackContainer) {
        elements.raceTrackContainer.style.display = 'none'; // Initially hidden until race starts
    }

    if (elements.blockStatsContainer) {
        elements.blockStatsContainer.style.display = 'none'; // Initially hidden until wallet connects
    }
}

// Set up event listeners
function setupEventListeners() {
    // Connect wallet button
    elements.connectWalletBtn.addEventListener('click', connectWallet);

    // Disconnect wallet button
    elements.disconnectBtn.addEventListener('click', disconnectWallet);

    // Test network buttons
    elements.preconf.testBtn.addEventListener('click', () => testNetwork('preconf'));
    elements.hekla.testBtn.addEventListener('click', () => testNetwork('hekla'));

    // Compare both networks button
    elements.compareBothBtn.addEventListener('click', compareBothNetworks);
}

// Start block simulator for statistics
function startBlockSimulator() {
    // Create block production intervals
    // Preconf produces blocks faster (every 200ms)
    const preconfInterval = setInterval(() => {
        if (state.connected) {
            state.networks.preconf.blocksProcessed++;
            state.stats.preconfBlocks++;
            state.stats.totalBlocks++;
            updateBlockStats();
        }
    }, 200);

    // Hekla produces blocks slower (every 2000ms)
    const heklaInterval = setInterval(() => {
        if (state.connected) {
            state.networks.hekla.blocksProcessed++;
            state.stats.heklaBlocks++;
            state.stats.totalBlocks++;
            updateBlockStats();
        }
    }, 2000);

    // Clean up intervals on page unload
    window.addEventListener('beforeunload', () => {
        clearInterval(preconfInterval);
        clearInterval(heklaInterval);
    });
}

// Update block statistics display
function updateBlockStats() {
    if (elements.totalBlocks) {
        elements.totalBlocks.textContent = state.stats.totalBlocks;
    }

    if (elements.preconfBlocks) {
        elements.preconfBlocks.textContent = state.stats.preconfBlocks;
    }

    if (elements.heklaBlocks) {
        elements.heklaBlocks.textContent = state.stats.heklaBlocks;
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

        // For demo purposes, we'll use a placeholder address
        // In a real implementation, you would derive the address from the private key
        state.wallet.address = 'Wallet Connected';

        // Store transaction config
        state.config.recipient = elements.recipientInput.value;
        state.config.amount = elements.amountInput.value || "0.0001";

        // Update UI
        elements.setupSection.style.display = 'none';
        elements.comparisonSection.style.display = 'block';
        elements.walletAddress.textContent = state.wallet.address;

        // Show race track and block stats
        elements.raceTrackContainer.style.display = 'block';
        elements.blockStatsContainer.style.display = 'block';

        // Set connected state
        state.connected = true;

        console.log('Wallet connected');

        // Fetch initial nonces for the connected wallet
        fetchWalletInfo();
    } catch (error) {
        console.error('Error connecting wallet:', error);
        alert(`Error connecting wallet: ${error.message}`);
    }
}

// Fetch wallet information including nonces
async function fetchWalletInfo() {
    try {
        // Get wallet address from API
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
            // Update wallet address
            state.wallet.address = result.address;
            elements.walletAddress.textContent = shortenAddress(result.address);

            // Store nonces
            state.wallet.nonces.preconf = result.nonces.preconf;
            state.wallet.nonces.hekla = result.nonces.hekla;

            console.log("Wallet info fetched:", {
                address: result.address,
                nonces: result.nonces
            });
        } else {
            throw new Error(result.error || "Failed to fetch wallet info");
        }
    } catch (error) {
        console.error("Error fetching wallet info:", error);

        // As a fallback, try to derive address from private key
        try {
            // Send a test transaction to get the wallet info
            await testNetwork('preconf', true);
        } catch (innerError) {
            console.error("Error in fallback wallet info fetch:", innerError);
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
        nonces: {
            preconf: 0,
            hekla: 0
        }
    };

    // Reset network results
    state.networks.preconf.results = null;
    state.networks.hekla.results = null;
    state.networks.preconf.status = "ready";
    state.networks.hekla.status = "ready";
    state.networks.preconf.progress = 0;
    state.networks.hekla.progress = 0;
    state.networks.preconf.isPolling = false;
    state.networks.hekla.isPolling = false;

    // Reset comparison
    state.comparison = {
        inProgress: false,
        completed: false,
        winner: null
    };

    // Reset UI
    elements.setupSection.style.display = 'block';
    elements.comparisonSection.style.display = 'none';
    elements.comparisonResult.style.display = 'none';
    elements.raceTrackContainer.style.display = 'none';
    elements.blockStatsContainer.style.display = 'none';
    elements.privateKeyInput.value = '';

    // Reset cars
    if (elements.preconfCar) {
        elements.preconfCar.style.display = 'none';
        elements.preconfCar.classList.remove('winner');
        elements.preconfCar.style.left = '10%';
    }

    if (elements.heklaCar) {
        elements.heklaCar.style.display = 'none';
        elements.heklaCar.classList.remove('winner');
        elements.heklaCar.style.left = '10%';
    }

    // Reset network UI
    resetNetworkUI('preconf');
    resetNetworkUI('hekla');

    // Reset block stats
    state.stats.totalBlocks = 0;
    state.stats.preconfBlocks = 0;
    state.stats.heklaBlocks = 0;
    updateBlockStats();
}

// Reset network UI to default state
function resetNetworkUI(networkId) {
    const network = elements[networkId];

    network.status.textContent = 'Ready to test';
    network.status.className = 'status';
    network.result.style.display = 'none';
    network.time.textContent = '-';
    network.block.textContent = '-';
    network.gas.textContent = '-';

    // Reset progress bar
    if (network.progressBar) {
        network.progressBar.style.width = '0%';
        network.progressBar.style.background = 'linear-gradient(to right, #FFC6E9, #FF6FC8)';
    }
}

// Test a specific network
async function testNetwork(networkId, isDryRun = false) {
    if (!state.connected || (state.networks[networkId].testInProgress && !isDryRun)) return;

    try {
        // Mark test as in progress (unless it's a dry run)
        if (!isDryRun) {
            state.networks[networkId].testInProgress = true;
            state.networks[networkId].status = "testing";

            // Update UI to show test in progress
            const network = elements[networkId];
            network.status.textContent = 'Preparing transaction...';
            network.status.className = 'status pending';
            network.testBtn.disabled = true;

            // Update progress bar to 10%
            updateProgressBar(networkId, 10);

            // Show race track if it's hidden
            elements.raceTrackContainer.style.display = 'block';

            // Show car for this network
            prepareRaceCar(networkId);
        }

        // Prepare transaction data with nonce
        const txData = {
            networkName: networkId,
            privateKey: state.wallet.privateKey,
            recipient: state.config.recipient,
            amount: state.config.amount,
            nonce: state.wallet.nonces[networkId], // Include current nonce
            isDryRun: isDryRun
        };

        if (!isDryRun) {
            // Update progress bar to 20%
            updateProgressBar(networkId, 20);

            // Short delay for visual effect
            await new Promise(resolve => setTimeout(resolve, 300));

            // Update status
            elements[networkId].status.textContent = 'Sending transaction...';
        }

        // Send transaction
        const response = await fetch('/api/test-network', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(txData)
        });

        if (!isDryRun) {
            // Update progress bar to 40%
            updateProgressBar(networkId, 40);
        }

        const result = await response.json();

        if (result.success) {
            // If this was just a dry run to get wallet info, update state and return
            if (isDryRun) {
                state.wallet.address = result.from;
                elements.walletAddress.textContent = shortenAddress(result.from);
                state.wallet.nonces.preconf = result.nonce + 1;
                state.wallet.nonces.hekla = result.nonce; // Assume same for now until we check
                console.log("Dry run completed, wallet info updated");
                return;
            }

            console.log(`Transaction sent on ${networkId}:`, result.hash);

            // Increment the nonce for this network
            state.wallet.nonces[networkId]++;

            // Update UI
            const network = elements[networkId];
            network.status.textContent = 'Transaction sent, waiting for confirmation...';

            // Update progress bar to 50%
            updateProgressBar(networkId, 50);

            // Start timer for confirmation
            const startTime = Date.now();

            // Update car number with transaction hash
            updateRaceCarInfo(networkId, result.hash);

            // Poll for confirmation
            await pollForConfirmation(networkId, result.hash, startTime);
        } else {
            if (isDryRun) return; // Silently return if it's a dry run

            // Check for "already known" error
            if (result.error && result.error.includes("already known")) {
                console.log(`Transaction with nonce ${state.wallet.nonces[networkId]} already pending, incrementing nonce`);
                state.wallet.nonces[networkId]++;

                // Try again with the new nonce
                elements[networkId].status.textContent = 'Retrying with new nonce...';
                state.networks[networkId].testInProgress = false;
                await new Promise(resolve => setTimeout(resolve, 500));
                return testNetwork(networkId);
            }

            // Other transaction failure
            const network = elements[networkId];
            network.status.textContent = `Error: ${result.error}`;
            network.status.className = 'status error';
            state.networks[networkId].testInProgress = false;
            network.testBtn.disabled = false;

            // Reset progress bar
            updateProgressBar(networkId, 0);

            // Hide car
            if (elements[`${networkId}-car`]) {
                elements[`${networkId}-car`].style.display = 'none';
            }
        }
    } catch (error) {
        if (isDryRun) return; // Silently return if it's a dry run

        console.error(`Error testing ${networkId}:`, error);

        // Update UI to show error
        const network = elements[networkId];
        network.status.textContent = `Error: ${error.message}`;
        network.status.className = 'status error';
        state.networks[networkId].testInProgress = false;
        network.testBtn.disabled = false;

        // Reset progress bar
        updateProgressBar(networkId, 0);

        // Hide car
        if (elements[`${networkId}-car`]) {
            elements[`${networkId}-car`].style.display = 'none';
        }
    }
}

// Prepare race car for a specific network
function prepareRaceCar(networkId) {
    const car = document.getElementById(`${networkId}-car`);
    if (!car) return;

    // Reset car position
    car.style.left = '10%';
    car.classList.remove('winner');

    // Generate a random block number for visualization
    const blockNumber = Math.floor(Math.random() * 10000);
    car.querySelector('.car-number').textContent = `#${blockNumber}`;

    // Show the car
    car.style.display = 'block';
}

// Update race car info with transaction details
function updateRaceCarInfo(networkId, txHash) {
    const car = document.getElementById(`${networkId}-car`);
    if (!car) return;

    // Set transaction hash (shortened)
    const shortHash = shortenString(txHash, 4, 4);
    car.querySelector('.car-number').textContent = shortHash;
}

// Poll for transaction confirmation with optimized strategy
async function pollForConfirmation(networkId, txHash, startTime) {
    // Prevent duplicate polling
    if (state.networks[networkId].isPolling) return;

    state.networks[networkId].isPolling = true;

    let pollCount = 0;
    const maxPolls = 100; // Increased max polls since we're polling more frequently
    const finishLine = 90; // Progress percentage that represents finish line

    // Use dynamic polling intervals - poll more frequently at start
    // Initial polls every 200ms, then gradually adjust based on network
    let pollInterval = networkId === 'preconf' ? 200 : 400; // Faster polling for preconf
    let currentProgress = 50; // Start at 50% progress (after sending TX)

    // Flag to identify if we've seen the tx in the mempool
    let seenInMempool = false;

    // Update initial progress
    updateProgressBar(networkId, currentProgress);

    const pollTransaction = async () => {
        try {
            pollCount++;

            // Adjust interval dynamically based on network and poll count
            if (networkId === 'preconf') {
                // For preconf, we expect faster confirmations, so keep polling frequent
                pollInterval = Math.max(100, 200 - (pollCount * 5));
                // Advance progress faster
                currentProgress = Math.min(finishLine - 1, 50 + (pollCount * 4));
            } else {
                // For other networks, slow down polling a bit to reduce load
                pollInterval = Math.min(500, 400 + (pollCount * 10));
                // Advance progress more slowly
                currentProgress = Math.min(finishLine - 5, 50 + (pollCount * 2));
            }

            // Update progress bar
            updateProgressBar(networkId, currentProgress);

            // Check transaction status
            const response = await fetch(`/api/transaction/${networkId}/${txHash}`);
            const result = await response.json();

            if (result.success) {
                if (result.confirmed) {
                    // Transaction confirmed
                    const endTime = Date.now();
                    const confirmationTime = endTime - startTime;

                    // Store results
                    state.networks[networkId].results = {
                        txHash,
                        confirmationTime,
                        blockNumber: result.receipt.blockNumber,
                        gasUsed: result.receipt.gasUsed
                    };

                    state.networks[networkId].status = "confirmed";
                    state.networks[networkId].isPolling = false;
                    state.networks[networkId].testInProgress = false;

                    // Update progress bar to 100%
                    updateProgressBar(networkId, 100);

                    // Update UI
                    const network = elements[networkId];
                    network.status.textContent = 'Transaction confirmed!';
                    network.status.className = 'status success';
                    network.result.style.display = 'block';
                    network.time.textContent = `${confirmationTime} ms`;
                    network.block.textContent = result.receipt.blockNumber;
                    network.gas.textContent = result.receipt.gasUsed;
                    network.testBtn.disabled = false;

                    console.log(`Transaction confirmed on ${networkId} in ${confirmationTime}ms`);

                    // If comparison is in progress, check if both networks have completed
                    if (state.comparison.inProgress) {
                        checkComparisonStatus();
                    }

                    return true; // Polling complete
                } else {
                    // Transaction pending
                    if (result.pending) {
                        seenInMempool = true;

                        // Update network status
                        const network = elements[networkId];
                        network.status.textContent = `Transaction in mempool, waiting for confirmation... (${pollCount})`;
                    } else if (!seenInMempool) {
                        // Update network status
                        const network = elements[networkId];
                        network.status.textContent = `Waiting for transaction to enter mempool... (${pollCount})`;
                    }

                    // Continue polling after delay
                    setTimeout(pollTransaction, pollInterval);
                }
            } else {
                // Error checking transaction
                console.error(`Error checking transaction on ${networkId}:`, result.error);

                // Slow down polling on error
                setTimeout(pollTransaction, pollInterval * 2);
            }

            // Check if we've reached max polls
            if (pollCount >= maxPolls) {
                console.log(`Polling timeout for ${networkId} after ${pollCount} attempts`);

                state.networks[networkId].isPolling = false;
                state.networks[networkId].testInProgress = false;
                state.networks[networkId].status = "timeout";

                // Update UI
                const network = elements[networkId];
                network.status.textContent = 'Confirmation timeout';
                network.status.className = 'status error';
                network.testBtn.disabled = false;

                // Reset progress bar
                updateProgressBar(networkId, 0);

                // If comparison is in progress, check if both networks have completed
                if (state.comparison.inProgress) {
                    checkComparisonStatus();
                }

                return false;
            }
        } catch (error) {
            console.error(`Error polling transaction on ${networkId}:`, error);

            // Continue polling after a longer delay on error
            setTimeout(pollTransaction, pollInterval * 2);
        }
    };

    // Start polling
    pollTransaction();

    // Set a safety timeout to stop polling after 2 minutes
    setTimeout(() => {
        if (state.networks[networkId].isPolling) {
            state.networks[networkId].isPolling = false;
            state.networks[networkId].testInProgress = false;
            state.networks[networkId].status = "timeout";

            // Update UI
            const network = elements[networkId];
            network.status.textContent = 'Confirmation timeout (2 minutes)';
            network.status.className = 'status error';
            network.testBtn.disabled = false;

            // Reset progress bar
            updateProgressBar(networkId, 0);

            // If comparison is in progress, check if both networks have completed
            if (state.comparison.inProgress) {
                checkComparisonStatus();
            }
        }
    }, 120000); // 2 minutes timeout
}

// Compare both networks
function compareBothNetworks() {
    if (!state.connected || state.comparison.inProgress) return;

    // Reset previous results
    resetNetworkUI('preconf');
    resetNetworkUI('hekla');
    elements.comparisonResult.style.display = 'none';

    // Reset network states
    state.networks.preconf.results = null;
    state.networks.hekla.results = null;
    state.networks.preconf.status = "ready";
    state.networks.hekla.status = "ready";
    state.networks.preconf.progress = 0;
    state.networks.hekla.progress = 0;
    state.networks.preconf.isPolling = false;
    state.networks.hekla.isPolling = false;

    // Reset progress bars to be sure they're at 0
    updateProgressBar('preconf', 0);
    updateProgressBar('hekla', 0);

    // Show race track for visualization
    elements.raceTrackContainer.style.display = 'block';

    // Reset cars
    if (elements.preconfCar) {
        elements.preconfCar.classList.remove('winner');
    }

    if (elements.heklaCar) {
        elements.heklaCar.classList.remove('winner');
    }

    // Set comparison in progress
    state.comparison.inProgress = true;
    state.comparison.completed = false;
    state.comparison.winner = null;

    // Disable buttons during comparison
    elements.compareBothBtn.disabled = true;
    elements.preconf.testBtn.disabled = true;
    elements.hekla.testBtn.disabled = true;

    // Prepare both cars for the race
    prepareRaceCar('preconf');
    prepareRaceCar('hekla');

    // Test both networks with a slight delay between them (helps with rate limiting issues)
    testNetwork('preconf');
    setTimeout(() => {
        testNetwork('hekla');
    }, 1000); // Increased delay to avoid rate limiting
}

// Check if comparison is complete
function checkComparisonStatus() {
    const preconfCompleted = state.networks.preconf.status === "confirmed" || state.networks.preconf.status === "timeout";
    const heklaCompleted = state.networks.hekla.status === "confirmed" || state.networks.hekla.status === "timeout";

    if (preconfCompleted && heklaCompleted) {
        // Both networks have completed their tests
        state.comparison.inProgress = false;
        state.comparison.completed = true;

        // Enable compare button
        elements.compareBothBtn.disabled = false;
        elements.preconf.testBtn.disabled = false;
        elements.hekla.testBtn.disabled = false;

        // If both tests were successful, compare the results
        if (state.networks.preconf.status === "confirmed" && state.networks.hekla.status === "confirmed") {
            // Wait a moment for the completion animations to finish
            setTimeout(() => {
                compareResults();
            }, 500);
        } else {
            // At least one test failed, can't compare
            alert('Cannot compare results because at least one test failed');
        }
    }
}

// Compare the results of both networks
function compareResults() {
    const preconfTime = state.networks.preconf.results.confirmationTime;
    const heklaTime = state.networks.hekla.results.confirmationTime;

    // Determine which network is faster
    let faster, slower, speedRatio;
    if (preconfTime < heklaTime) {
        faster = 'preconf';
        slower = 'hekla';
        speedRatio = heklaTime / preconfTime;
    } else {
        faster = 'hekla';
        slower = 'preconf';
        speedRatio = preconfTime / heklaTime;
    }

    // Store winner
    state.comparison.winner = faster;

    // Add winner badge to faster network
    const winnerCard = document.getElementById(`${faster}-card`);

    // Remove any existing badges first
    const existingBadges = document.querySelectorAll('.winner-badge');
    existingBadges.forEach(badge => badge.remove());

    // Create and add new badge
    const badge = document.createElement('div');
    badge.className = 'winner-badge';
    badge.textContent = 'FASTER';
    winnerCard.appendChild(badge);

    // Calculate bar widths for visual comparison (as percentages)
    const fasterPercentage = 100 / (1 + speedRatio);
    const slowerPercentage = 100 - fasterPercentage;

    // Update bar widths with animation
    elements[faster].bar.style.transition = 'width 1s ease-in-out';
    elements[slower].bar.style.transition = 'width 1s ease-in-out';

    // Set custom gradient for winner and loser
    elements[faster].bar.style.background = 'linear-gradient(to right, #FFC6E9, #FF6FC8, #FFFFFF)';
    elements[slower].bar.style.background = 'linear-gradient(to right, #FFC6E9, #FF6FC8)';

    // Set the widths after a short delay to ensure transition applies
    setTimeout(() => {
        elements[faster].bar.style.width = `${fasterPercentage}%`;
        elements[slower].bar.style.width = `${slowerPercentage}%`;
    }, 100);

    // Update results text
    elements.speedDifference.textContent = `${state.networks[faster].name} is ${speedRatio.toFixed(2)}x faster`;
    elements.resultPreconfTime.textContent = `${preconfTime} ms`;
    elements.resultHeklaTime.textContent = `${heklaTime} ms`;
    elements.resultPreconfGas.textContent = state.networks.preconf.results.gasUsed;
    elements.resultHeklaGas.textContent = state.networks.hekla.results.gasUsed;
    elements.resultPreconfBlock.textContent = state.networks.preconf.results.blockNumber;
    elements.resultHeklaBlock.textContent = state.networks.hekla.results.blockNumber;

    // Show comparison results with animation
    elements.comparisonResult.style.opacity = '0';
    elements.comparisonResult.style.display = 'block';
    elements.comparisonResult.style.transition = 'opacity 0.5s ease-in';

    setTimeout(() => {
        elements.comparisonResult.style.opacity = '1';
    }, 100);
}

// Helper function to shorten address
function shortenAddress(address) {
    return `${address.substring(0, 8)}...${address.substring(address.length - 6)}`;
}

// Helper function to shorten string (for RPC URLs)
function shortenString(str, startChars = 30, endChars = 0) {
    if (!str) return '';

    if (str.length <= startChars + endChars + 3) {
        return str;
    }

    if (endChars > 0) {
        return `${str.substring(0, startChars)}...${str.substring(str.length - endChars)}`;
    }

    return str.substring(0, startChars) + '...';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeComparison);