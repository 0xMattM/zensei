'use client'

import { useState } from 'react'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { Card } from '@/components/ui/card'
import { WalletBalance } from './WalletBalance'
import { Wallet, AlertCircle } from 'lucide-react'

export function PortfolioDashboard() {
  const { user, authenticated } = usePrivy()
  const { wallets } = useWallets()
  const [error] = useState<string | null>(null)

  // Get the correct wallet address using same logic as WalletButton
  const externalWallet = wallets?.find((w) => w.walletClientType !== 'privy');
  const embeddedWallet = wallets?.find((w) => w.walletClientType === 'privy');
  const userWalletAddress = externalWallet?.address || embeddedWallet?.address || user?.wallet?.address;

  // Get agent wallet address from environment
  const agentAddress = process.env.NEXT_PUBLIC_AGENT_ADDRESS

  if (!authenticated || !userWalletAddress) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 text-center">
          <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-display font-normal mb-2">Connect Your Wallet</h2>
          <p className="text-muted-foreground mb-4">
            Connect your Sei wallet to view your portfolio and interact with the AI agent.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="relative max-w-6xl mx-auto space-y-6">
      {/* Header - Centered and Improved */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-zen-primary to-zen-secondary bg-clip-text text-transparent">
          Portfolio Dashboard
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Monitor your wallets and AI agent activity
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="p-4 bg-red-500/10 border-red-500/20">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="text-red-400">{error}</p>
          </div>
        </Card>
      )}

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connected Wallet */}
        <WalletBalance
          address={userWalletAddress}
          label="Your Connected Wallet"
          variant="connected"
        />
        
        {/* Agent Wallet */}
        {agentAddress ? (
          <WalletBalance
            address={agentAddress}
            label="ZenSei AI Agent"
            variant="agent"
          />
        ) : (
          <Card className="p-6 border-dashed border-slate-600">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 mx-auto text-amber-400" />
              <div>
                <h3 className="font-display font-normal text-foreground">Agent Wallet Not Configured</h3>
                <p className="text-sm text-muted-foreground">
                  Set NEXT_PUBLIC_AGENT_ADDRESS environment variable to view agent wallet
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
} 