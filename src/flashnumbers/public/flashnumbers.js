// Flash Numbers Game
// Client-side JavaScript implementation

// Game state
const state = {
    connected: false,
    wallet: {
        address: null,
        privateKey: null
    },
    game: {
        started: false,
        numbers: [],
        selectedNumbers: [],
        timer: 0,
        timerInterval: null,
        initialTxHash: null,
        finalTxHash: null
    },
    stats: {
        gamePlayTime: 0,
        initialTxTime: 0,
        finalTxTime: 0,
        speedRatio: 0
    }
};

// DOM Elements
const elements = {
    // Sections
    setupSection: document.getElementById('setup-section'),
    gameSection: document.getElementById('game-section'),

    // Wallet elements
    walletAddress: document.getElementById('wallet-address'),
    connectWalletBtn: document.getElementById('connect-wallet-btn'),
    disconnectBtn: document.getElementById('disconnect-btn'),
    privateKeyInput: document.getElementById('private-key'),

    // Game elements
    gameMessage: document.getElementById('game-message'),
    gameTimer: document.getElementById('game-timer'),
    startGameBtn: document.getElementById('start-game-btn'),
    numbersGrid: document.getElementById('numbers-grid'),

    // Results elements
    gameResults: document.getElementById('game-results'),
    gameTime: document.getElementById('game-time'),
    speedRatio: document.getElementById('speed-ratio'),
    initialTxTime: document.getElementById('initial-tx-time'),
    finalTxTime: document.getElementById('final-tx-time'),
    initialTxHash: document.getElementById('initial-tx-hash'),
    finalTxHash: document.getElementById('final-tx-hash'),

    // Modal elements
    timeoutModal: document.getElementById('timeout-modal'),
    tryAgainBtn: document.getElementById('try-again-btn')
};

// Game settings
const TIME_LIMIT = 15; // seconds

// Initialize application
function initialize() {
    // Set up event listeners
    elements.connectWalletBtn.addEventListener('click', connectWallet);
    elements.disconnectBtn.addEventListener('click', disconnectWallet);
    elements.startGameBtn.addEventListener('click', startGame);
    elements.tryAgainBtn.addEventListener('click', startGame);

    console.log('Flash Numbers game initialized');
}

// Connect wallet function
function connectWallet() {
    const privateKey = elements.privateKeyInput.value;

    if (!privateKey) {
        alert('Please enter your private key');
        return;
    }

    try {
        // Store wallet info
        state.wallet.privateKey = privateKey;

        // Update UI
        elements.setupSection.style.display = 'none';
        elements.gameSection.style.display = 'block';
        elements.walletAddress.textContent = 'Connecting...';
        elements.disconnectBtn.style.display = 'block';

        // Set connected state
        state.connected = true;

        // Fetch wallet address
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
            state.wallet.address = result.address;
            elements.walletAddress.textContent = shortenAddress(result.address);
        } else {
            throw new Error(result.error || 'Failed to fetch wallet info');
        }
    } catch (error) {
        console.error('Error fetching wallet info:', error);
        elements.walletAddress.textContent = 'Error connecting';
    }
}

// Disconnect wallet function
function disconnectWallet() {
    // Reset state
    state.connected = false;
    state.wallet = {
        address: null,
        privateKey: null
    };

    // Reset game state
    resetGame();

    // Update UI
    elements.setupSection.style.display = 'block';
    elements.gameSection.style.display = 'none';
    elements.privateKeyInput.value = '';
    elements.disconnectBtn.style.display = 'none';

    console.log('Wallet disconnected');
}

// Start game function
async function startGame() {
    if (!state.connected || state.game.started) return;

    try {
        // Reset any previous game
        resetGame();

        // Hide timeout modal if visible
        elements.timeoutModal.style.display = 'none';

        // Update UI
        elements.gameMessage.textContent = 'Sending initial transaction...';
        elements.startGameBtn.disabled = true;
        elements.gameResults.style.display = 'none';

        // Get starting timestamp for initial transaction
        const initialStartTime = Date.now();

        // Send initial transaction on Hekla (normal speed network)
        try {
            const response = await fetch('/api/start-game', {
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
                state.game.initialTxHash = result.hash;

                // Update UI
                elements.gameMessage.textContent = 'Waiting for transaction confirmation...';

                // Poll for transaction confirmation on Hekla
                await pollForTransaction('hekla', state.game.initialTxHash);

                // Record confirmation time
                state.stats.initialTxTime = Date.now() - initialStartTime;

                // Start game
                initializeGameBoard();
            } else {
                throw new Error(result.error || 'Failed to send initial transaction');
            }
        } catch (error) {
            console.error('Error starting game:', error);
            elements.gameMessage.textContent = 'Error starting game. Please try again.';
            elements.startGameBtn.disabled = false;
            return;
        }
    } catch (error) {
        console.error('Error in game flow:', error);
        elements.gameMessage.textContent = 'Error starting game. Please try again.';
        elements.startGameBtn.disabled = false;
    }
}

// Initialize game board
function initializeGameBoard() {
    // Generate shuffled numbers
    const numbers = Array.from({ length: 9 }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
    state.game.numbers = numbers;
    state.game.selectedNumbers = [];

    // Create number tiles
    elements.numbersGrid.innerHTML = '';

    numbers.forEach(number => {
        const tile = document.createElement('button');
        tile.className = 'number-tile';
        tile.textContent = number;
        tile.id = `number-${number}`;
        tile.addEventListener('click', () => handleNumberClick(number));

        elements.numbersGrid.appendChild(tile);
    });

    // Update UI
    elements.gameMessage.textContent = 'Select numbers in order from 1 to 9!';
    elements.gameTimer.textContent = '0.0s';
    elements.gameTimer.style.display = 'block';
    elements.startGameBtn.style.display = 'none';

    // Start timer
    state.game.timer = 0;
    state.game.started = true;

    // Clear any existing interval
    if (state.game.timerInterval) {
        clearInterval(state.game.timerInterval);
    }

    // Start new timer
    state.game.timerInterval = setInterval(() => {
        state.game.timer += 0.1;
        elements.gameTimer.textContent = state.game.timer.toFixed(1) + 's';

        // Check for timeout
        if (state.game.timer >= TIME_LIMIT) {
            handleTimeout();
        }
    }, 100);
}

// Handle number click
function handleNumberClick(number) {
    if (!state.game.started) return;

    const expectedNumber = state.game.selectedNumbers.length + 1;

    if (number === expectedNumber) {
        // Correct selection
        state.game.selectedNumbers.push(number);

        // Update UI
        const tile = document.getElementById(`number-${number}`);
        if (tile) {
            tile.classList.add('selected');
            tile.disabled = true;
        }

        // Check if game completed
        if (state.game.selectedNumbers.length === 9) {
            // Game won!
            gameWon();
        }
    } else {
        // Wrong selection - visual feedback
        const tile = document.getElementById(`number-${number}`);
        if (tile) {
            tile.classList.add('shake');
            setTimeout(() => tile.classList.remove('shake'), 500);
        }
    }
}

// Game won function
async function gameWon() {
    // Stop timer
    if (state.game.timerInterval) {
        clearInterval(state.game.timerInterval);
        state.game.timerInterval = null;
    }

    // Set game as not started
    state.game.started = false;

    // Store final time
    const finalTime = state.game.timer;
    state.stats.gamePlayTime = finalTime * 1000; // Convert to ms

    // Update UI
    elements.gameMessage.textContent = 'Game completed! Sending final transaction...';

    // Send final transaction on Preconf (fast network)
    const finalStartTime = Date.now();

    try {
        const response = await fetch('/api/finish-game', {
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
            state.game.finalTxHash = result.hash;

            // Poll for transaction confirmation on Preconf
            await pollForTransaction('preconf', state.game.finalTxHash);

            // Record confirmation time
            state.stats.finalTxTime = Date.now() - finalStartTime;

            // Calculate speed ratio
            if (state.stats.initialTxTime > 0 && state.stats.finalTxTime > 0) {
                state.stats.speedRatio = (state.stats.initialTxTime / state.stats.finalTxTime).toFixed(1);
            }

            // Update UI
            elements.gameMessage.textContent = 'Game completed! See your results below.';

            // Show results
            displayResults();
        } else {
            throw new Error(result.error || 'Failed to send final transaction');
        }
    } catch (error) {
        console.error('Error sending final transaction:', error);
        elements.gameMessage.textContent = 'Error sending final transaction, but game completed!';

        // Still show results if we have any
        if (state.stats.gamePlayTime > 0) {
            displayResults();
        }
    }

    // Re-enable start button
    elements.startGameBtn.textContent = 'Play Again';
    elements.startGameBtn.disabled = false;
    elements.startGameBtn.style.display = 'block';
}

// Display results
function displayResults() {
    // Update result values
    elements.gameTime.textContent = (state.stats.gamePlayTime / 1000).toFixed(1) + 's';
    elements.speedRatio.textContent = state.stats.speedRatio + 'x faster';
    elements.initialTxTime.textContent = state.stats.initialTxTime + 'ms';
    elements.finalTxTime.textContent = state.stats.finalTxTime + 'ms';

    // Show transaction hashes
    if (state.game.initialTxHash) {
        elements.initialTxHash.textContent = shortenHash(state.game.initialTxHash);
        elements.initialTxHash.title = state.game.initialTxHash;
    }

    if (state.game.finalTxHash) {
        elements.finalTxHash.textContent = shortenHash(state.game.finalTxHash);
        elements.finalTxHash.title = state.game.finalTxHash;
    }

    // Show results section
    elements.gameResults.style.display = 'block';

    console.log('Game results:', {
        gameTime: state.stats.gamePlayTime,
        initialTxTime: state.stats.initialTxTime,
        finalTxTime: state.stats.finalTxTime,
        speedRatio: state.stats.speedRatio
    });
}

// Handle timeout
function handleTimeout() {
    // Stop timer
    if (state.game.timerInterval) {
        clearInterval(state.game.timerInterval);
        state.game.timerInterval = null;
    }

    // Set game as not started
    state.game.started = false;

    // Show timeout modal
    elements.timeoutModal.style.display = 'flex';

    // Re-enable start button
    elements.startGameBtn.disabled = false;
    elements.startGameBtn.style.display = 'block';
}

// Poll for transaction confirmation
async function pollForTransaction(network, txHash) {
    let attempts = 0;
    const maxAttempts = 150; // 30 seconds (200ms intervals)

    while (attempts < maxAttempts) {
        try {
            const response = await fetch(`/api/tx-status/${network}/${txHash}`);
            const result = await response.json();

            if (result.success && result.confirmed) {
                return result.receipt;
            }

            // Wait before next poll
            await new Promise(resolve => setTimeout(resolve, 200));
            attempts++;
        } catch (error) {
            console.error(`Error polling for ${network} transaction ${txHash}:`, error);
            attempts++;
        }
    }

    throw new Error(`Transaction confirmation timeout for ${network} transaction ${txHash}`);
}

// Reset game state
function resetGame() {
    // Stop timer if running
    if (state.game.timerInterval) {
        clearInterval(state.game.timerInterval);
        state.game.timerInterval = null;
    }

    // Reset game state
    state.game = {
        started: false,
        numbers: [],
        selectedNumbers: [],
        timer: 0,
        timerInterval: null,
        initialTxHash: null,
        finalTxHash: null
    };

    // Reset statistics
    state.stats = {
        gamePlayTime: 0,
        initialTxTime: 0,
        finalTxTime: 0,
        speedRatio: 0
    };

    // Reset UI
    elements.gameMessage.textContent = 'Click Start Game to begin!';
    elements.gameTimer.style.display = 'none';
    elements.startGameBtn.disabled = false;
    elements.startGameBtn.style.display = 'block';
    elements.startGameBtn.textContent = 'Start Game';
    elements.numbersGrid.innerHTML = '';
    elements.timeoutModal.style.display = 'none';
}

// Helper: Shorten address for display
function shortenAddress(address) {
    if (!address) return 'Not connected';
    return `${address.substring(0, 8)}...${address.substring(address.length - 6)}`;
}

// Helper: Shorten transaction hash for display
function shortenHash(hash) {
    if (!hash) return '';
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 6)}`;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initialize);