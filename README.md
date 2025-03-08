# Taiko Network Testing Toolkit

A comprehensive toolkit for testing and demonstrating Taiko network capabilities.

## Quick Setup

```bash
# Clone the repository
git clone https://github.com/swarna1101/preconf-demo.git
cd preconf-demo

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env # Edit .env with your private keys

# Run a demo (e.g., the transaction game)
npm run game
```

## Environment Setup

1. Copy `.env.example` to `.env`
2. Add your wallet private keys:
   ```
   WALLET_MAIN=your_main_wallet_private_key
   WALLET_2=your_second_wallet_private_key
   ...
   ```
3. Customize network URLs if needed (default values should work)

## Project Structure

```
preconf-demo/
├── scripts/                  # CLI entry points
│   ├── run-transfer.js       # Basic transfer demo
│   ├── run-robust-transfer.js # Advanced transfer demo
│   ├── run-game.js           # Transaction game
│   └── run-comparison.js     # Network comparison
│
├── src/
│   ├── common/               # Shared utilities
│   │   ├── config.js         # Configuration (uses .env)
│   │   └── utils.js          # Helper functions
│   │
│   ├── transfer/             # Basic transfer demo
│   ├── robust-transfer/      # Advanced transfer with nonce handling & token operations
│   ├── game/                 # Interactive transaction game
│   │   └── public/           # Web assets for the game
│   └── comparison/           # Network comparison tool
│       └── public/           # Web assets for comparison
│
├── .env                      # Environment variables (not in git)
├── .env.example              # Template for environment variables
└── package.json              # Project dependencies and scripts
```

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run transfer` | Run basic transfer test with default settings |
| `npm run transfer:preconf` | Run transfer test on Preconf network |
| `npm run transfer:hekla` | Run transfer test on Hekla network |
| `npm run robust` | Run advanced transfer with nonce management and token operations |
| `npm run game` | Start transaction game server |
| `npm run game:open` | Start game server and open in browser |
| `npm run comparison` | Start network comparison tool |
| `npm run race`      | Start a race of tx between preconf devnet and hekla |
| `npm run flashnumbers` | Test your reflexes against Preconf devnet |

## Command Line Options

Most scripts accept additional options:

```bash
# Examples
npm run transfer -- --network=preconf --amount=0.001 --count=5
npm run game -- --port=3001 --network=hekla
npm run comparison -- --networks=preconf,hekla
```