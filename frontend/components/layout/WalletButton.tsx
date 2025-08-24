'use client'

import { usePrivy, useWallets } from '@privy-io/react-auth'
import { Button } from '@/components/ui/button'
import { Wallet, LogOut, User, Copy, Check, ChevronDown, Bot } from 'lucide-react'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

// Extend the user type to include wallets for TypeScript
type WalletType = {
  address: string
  type: string // 'embedded' | 'wallet' | etc.
}
type UserWithWallets = {
  wallet?: { address?: string }
  wallets?: WalletType[]
  linkedAccounts?: { address: string; type: string }[]
}

export function WalletButton() {
  const { ready, authenticated, user, login, logout } = usePrivy()
  const { wallets } = useWallets()
  const [copiedUser, setCopiedUser] = useState(false)
  const [copiedAgent, setCopiedAgent] = useState(false)

  // Type assertion for extended user
  const userWithWallets = user as UserWithWallets

  // Helper: Find external wallet (type === 'wallet') if present
  const externalWallet = wallets?.find((w) => w.walletClientType !== 'privy');
  const embeddedWallet = wallets?.find((w) => w.walletClientType === 'privy');
  const addressToShow = externalWallet?.address || embeddedWallet?.address || userWithWallets?.wallet?.address;

  // Get agent address from environment
  const agentAddress = process.env.NEXT_PUBLIC_AGENT_ADDRESS

  // Debug log for WalletButton - minimal logging for production
  if (typeof window !== 'undefined' && addressToShow) {
    console.log('[WalletButton] Connected wallet:', addressToShow, 'Type:', externalWallet ? 'External' : embeddedWallet ? 'Embedded' : 'Default');
  }

  // Copy to clipboard functions
  const copyUserAddress = async () => {
    if (!addressToShow) return
    try {
      await navigator.clipboard.writeText(addressToShow)
      setCopiedUser(true)
      setTimeout(() => setCopiedUser(false), 2000)
      console.log('User address copied to clipboard:', addressToShow)
    } catch (error) {
      console.error('Failed to copy user address:', error)
    }
  }

  const copyAgentAddress = async () => {
    if (!agentAddress) return
    try {
      await navigator.clipboard.writeText(agentAddress)
      setCopiedAgent(true)
      setTimeout(() => setCopiedAgent(false), 2000)
      console.log('Agent address copied to clipboard:', agentAddress)
    } catch (error) {
      console.error('Failed to copy agent address:', error)
    }
  }

  // Force logout function
  const handleForceLogout = async () => {
    try {
      await logout()
      // Clear any local storage that might persist Privy data
      localStorage.clear()
      sessionStorage.clear()
      console.log('[WalletButton] Force logout completed - please refresh and reconnect')
    } catch (error) {
      console.error('[WalletButton] Logout error:', error)
    }
  }

  // Handle loading state
  if (!ready) {
    return (
      <Button variant="outline" disabled>
        <Wallet className="h-4 w-4 mr-2" />
        Loading...
      </Button>
    )
  }

  // Handle authenticated state
  if (authenticated && addressToShow) {
    const truncatedUserAddress = `${addressToShow.slice(0, 6)}...${addressToShow.slice(-4)}`
    const truncatedAgentAddress = agentAddress ? `${agentAddress.slice(0, 6)}...${agentAddress.slice(-4)}` : null

    return (
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 px-3 py-2 bg-zen-purple/10 border-zen-purple/20 hover:bg-zen-purple/20 transition-colors"
            >
              <User className="h-4 w-4 text-zen-purple" />
              <span className="text-sm font-medium text-zen-purple">
                {truncatedUserAddress}
              </span>
              <ChevronDown className="h-4 w-4 text-zen-purple" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            {/* User Wallet */}
            <DropdownMenuItem onClick={copyUserAddress} className="cursor-pointer">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-zen-purple" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Your Wallet</span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {truncatedUserAddress}
                    </span>
                  </div>
                </div>
                {copiedUser ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </DropdownMenuItem>

            {/* Agent Wallet */}
            {agentAddress && truncatedAgentAddress && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={copyAgentAddress} className="cursor-pointer">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-zen-cyan" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">Agent Wallet</span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {truncatedAgentAddress}
                        </span>
                      </div>
                    </div>
                    {copiedAgent ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleForceLogout}
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  // Handle unauthenticated state
  return (
    <Button 
      onClick={login}
      className="bg-zen-purple hover:bg-zen-purple/90 text-white"
    >
      <Wallet className="h-4 w-4 mr-2" />
      Connect Wallet
    </Button>
  )
} 