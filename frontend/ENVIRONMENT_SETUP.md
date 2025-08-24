# Environment Setup Guide

## Quick Setup for Transactions

To see real transactions instead of demo data, you need to set up your environment variables.

### Option 1: Create .env.local file (Recommended)

Create a file called `.env.local` in the `frontend/` directory with this content:

```bash
# Your agent wallet address (replace with your actual address)
NEXT_PUBLIC_AGENT_ADDRESS=0x0cDb1777D7e5B76Df1D9c2C3aEDF3efE67C8C0cAf

# Sei EVM RPC URL
NEXT_PUBLIC_SEI_RPC_URL=https://evm-rpc.sei-apis.com

# Chain ID for Sei
NEXT_PUBLIC_CHAIN_ID=1329
```

### Option 2: Use System Environment Variables

Set these in your system:

```bash
export NEXT_PUBLIC_AGENT_ADDRESS=0x0cDb1777D7e5B76Df1D9c2C3aEDF3efE67C8C0cAf
export NEXT_PUBLIC_SEI_RPC_URL=https://evm-rpc.sei-apis.com
export NEXT_PUBLIC_CHAIN_ID=1329
```

### Option 3: Use Default (Current Setup)

The app currently defaults to: `0x0cDb1777D7e5B76Df1D9c2C3aEDF3efE67C8C0cAf`

You can change this directly in the code at `components/transactions/TransactionsList.tsx` line 30.

## What the Transaction Scanner Does

The updated transaction scanner:

1. **Connects to Sei EVM RPC** - Verifies connection and gets account balance
2. **Scans Recent Blocks** - Looks through the last 50,000 blocks for transactions
3. **Finds ERC20 Transfers** - Detects token transfers to/from your agent wallet
4. **Gets Transaction Details** - Fetches full transaction data including timestamps
5. **Displays Real Data** - Shows actual transactions with correct hashes, blocks, and values

## Troubleshooting

If you don't see transactions:

1. **Check the Browser Console** - Open Developer Tools and look for logs
2. **Verify Address** - Make sure the agent address is correct
3. **Check RPC Connection** - The Sei EVM RPC should be accessible
4. **Transaction Type** - Currently detects ERC20 transfers, not native SEI transfers
5. **Transaction Age** - Only scans recent 50,000 blocks (~few days of activity)

## For Full Transaction History

For complete transaction history including native SEI transfers, visit:
https://seitrace.com/address/[YOUR_AGENT_ADDRESS]

Replace `[YOUR_AGENT_ADDRESS]` with your actual wallet address. 