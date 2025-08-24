'use client'

import { usePrivy } from '@privy-io/react-auth'
import { Card } from '@/components/ui/card'
import { WalletButton } from '@/components/layout/WalletButton'
import { Wallet, TrendingUp, Activity } from 'lucide-react'

// Extend the user type to include wallets for TypeScript
// (This is a local override for the Privy user object)
type WalletType = {
  address: string
  type: string // 'embedded' | 'wallet' | etc.
}
type UserWithWallets = {
  wallet?: { address?: string }
  wallets?: WalletType[]
}

export function WalletConnection() {
  const { authenticated, user, ready } = usePrivy()

  // Type assertion for extended user
  const userWithWallets = user as UserWithWallets

  // Helper: Find external wallet (type === 'wallet') if present
  const externalWallet = userWithWallets?.wallets?.find((w) => w.type === 'wallet');
  const embeddedWallet = userWithWallets?.wallets?.find((w) => w.type === 'embedded');
  const addressToShow = externalWallet?.address || embeddedWallet?.address || userWithWallets?.wallet?.address;

  // Debug log: show the full user object
  if (typeof window !== 'undefined') {
    console.log('[WalletConnection] Privy user object:', userWithWallets);
    console.log('[WalletConnection] user.wallet (primary):', userWithWallets?.wallet);
    
    if (userWithWallets?.wallets) {
      console.log('[WalletConnection] Total wallets found:', userWithWallets.wallets.length);
      userWithWallets.wallets.forEach((w, i) => {
        console.log(`[WalletConnection] Wallet #${i}:`, {
          type: w.type,
          address: w.address,
          wallet: w
        });
      });
    } else {
      console.log('[WalletConnection] No wallets array found');
    }
    
    console.log('[WalletConnection] Selected wallet logic:', {
      externalWallet: externalWallet?.address,
      embeddedWallet: embeddedWallet?.address,
      defaultWallet: userWithWallets?.wallet?.address,
      finalAddress: addressToShow
    });
  }

  if (!ready) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold mb-2 text-white">Wallet</h2>
        <WalletButton />
      </div>

      {authenticated && addressToShow ? (
        <div className="space-y-4">
          {/* Wallet Info */}
          <Card className="p-4 bg-slate-800/50 border-slate-600">
            <div className="flex items-center gap-3 mb-3">
              <Wallet className="h-5 w-5 text-zen-purple" />
              <span className="font-medium text-white">Connected Wallet</span>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-slate-300">Address:</span>
                <div className="font-mono text-xs break-all text-slate-200">
                  {addressToShow}
                </div>
                {/* Debug log: which address is being shown */}
                {typeof window !== 'undefined' && (
                  <div className="text-xs text-zen-cyan mt-1">[debug] Showing: {externalWallet ? 'External' : embeddedWallet ? 'Embedded' : 'Default'} wallet</div>
                )}
              </div>
              <div>
                <span className="text-slate-300">Network:</span>
                <span className="ml-2 text-white">Sei EVM</span>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="p-4 bg-slate-800/50 border-slate-600">
            <h3 className="font-medium mb-3 flex items-center gap-2 text-white">
              <TrendingUp className="h-4 w-4 text-zen-cyan" />
              Quick Stats
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-300">Portfolio Value</span>
                <span className="font-medium text-white">~$1,234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Active Positions</span>
                <span className="font-medium text-white">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Agent Status</span>
                <span className="text-zen-green font-medium">● Online</span>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Recent Activity
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Wallet Connected</span>
                <span className="text-xs text-muted-foreground">Just now</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Agent Initialized</span>
                <span className="text-xs text-muted-foreground">2 min ago</span>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        /* Not Connected State */
        <Card className="p-6 text-center">
          <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-medium mb-2">No Wallet Connected</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Connect your Sei wallet to start using ZenSei AI agent.
          </p>
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>✓ View portfolio</p>
            <p>✓ Execute DeFi operations</p>
            <p>✓ Get AI recommendations</p>
          </div>
        </Card>
      )}
    </div>
  )
} 