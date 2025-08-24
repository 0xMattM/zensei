'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Wallet, ExternalLink, RefreshCw, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getWalletData, getSeiPrice, isValidSeiAddress } from '@/lib/viem'
import type { WalletData } from '@/types'
import Image from 'next/image'

interface WalletBalanceProps {
  address: string
  label: string
  variant?: 'connected' | 'agent'
}

export function WalletBalance({ address, label, variant = 'connected' }: WalletBalanceProps) {
  const [walletData, setWalletData] = useState<WalletData>({
    address,
    seiBalance: '0',
    tokenBalances: [],
    totalValueUSD: 0,
    isLoading: true,
  })
  const [seiPrice, setSeiPrice] = useState<number>(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!isValidSeiAddress(address)) {
      setError('Invalid wallet address')
      setWalletData(prev => ({ ...prev, isLoading: false }))
      return
    }

    setIsRefreshing(true)
    setError(null)
    
    try {
      // Fetch wallet data and SEI price in parallel
      const [walletResult, priceResult] = await Promise.all([
        getWalletData(address as `0x${string}`),
        getSeiPrice()
      ])

      setSeiPrice(priceResult)
      
      // Use the totalValueUSD already calculated in getWalletData (includes all tokens)
      setWalletData({
        ...walletResult,
        isLoading: false,
      })
      
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch wallet data:', error)
      setError('Failed to load wallet data')
      setWalletData(prev => ({ ...prev, isLoading: false }))
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [address])

  const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`
  const explorerUrl = `https://seitrace.com/address/${address}`

  const cardVariant = variant === 'agent' 
    ? 'border-zen-cyan/20 bg-zen-cyan/5' 
    : 'border-zen-purple/20 bg-zen-purple/5'
  const badgeVariant = variant === 'agent' 
    ? 'bg-transparent text-zen-cyan border-zen-cyan/30 rounded-full' 
    : 'bg-transparent text-zen-purple border-zen-purple/30 rounded-full'
  const iconColor = variant === 'agent' ? 'text-zen-cyan' : 'text-zen-purple'

  return (
    <Card className={`p-6 ${cardVariant} border transition-all hover:border-opacity-50 shadow-md hover:shadow-lg`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Wallet className={`h-5 w-5 ${iconColor}`} />
            <div>
              <h3 className="font-semibold tracking-tight text-foreground">{label}</h3>
              <p className="text-sm text-muted-foreground">{truncatedAddress}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={badgeVariant}>
              {variant === 'agent' ? 'AI Agent' : 'Connected'}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchData}
              disabled={isRefreshing}
              className="h-8 w-8 p-0 rounded-md hover:ring hover:ring-white/10 transition"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Balance Information */}
        <div className="space-y-3">
          {/* SEI Balance */}
          <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/10 transition-all duration-300 hover:bg-white/10 hover:shadow-md">
            <div className="flex items-center space-x-3">
              <Image
                src="https://raw.githubusercontent.com/Sei-Public-Goods/sei-assetlist/main/images/Sei.png"
                alt="SEI"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full border border-white/10 shadow-sm"
                onError={(e) => {
                  // Fallback to gradient background if image fails to load
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) {
                    fallback.style.display = 'flex';
                  }
                }}
                unoptimized
              />
              <div className="w-10 h-10 bg-gradient-to-r from-zen-primary to-zen-secondary rounded-full flex items-center justify-center border border-white/10" style={{ display: 'none' }}>
                <span className="text-xs font-bold text-white">SEI</span>
              </div>
              <div>
                <p className="font-medium text-foreground">Sei</p>
                <p className="text-xs text-muted-foreground">SEI</p>
                {seiPrice > 0 && (
                  <p className="text-xs text-zen-secondary">${seiPrice.toFixed(4)}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              {walletData.isLoading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
              ) : (
                <>
                  <p className="font-medium text-foreground">
                    {parseFloat(walletData.seiBalance).toFixed(4)} SEI
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ${((parseFloat(walletData.seiBalance) * seiPrice) || 0).toFixed(2)} USD
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Token Balances */}
          {!walletData.isLoading && walletData.tokenBalances && walletData.tokenBalances.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Token Balances</h4>
              {walletData.tokenBalances.map((token, index) => (
                <div key={token.address || index} className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/10 transition-all duration-300 hover:bg-white/10 hover:shadow-md">
                  <div className="flex items-center space-x-3">
                    {token.logo ? (
                      <Image
                        src={token.logo}
                        alt={token.symbol}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full border border-white/10 shadow-sm"
                        onError={(e) => {
                          // Fallback to text if image fails to load
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                          if (fallback) {
                            fallback.style.display = 'flex';
                          }
                        }}
                        unoptimized
                      />
                    ) : null}
                    <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-400 rounded-full flex items-center justify-center border border-white/10" style={{ display: token.logo ? 'none' : 'flex' }}>
                      <span className="text-xs font-bold text-white">{token.symbol.slice(0, 3)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{token.name}</p>
                      <p className="text-xs text-foreground/70">{token.symbol.toUpperCase()}</p>
                      {token.price && (
                        <p className="text-xs text-zen-secondary">${token.price.toFixed(6)}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">
                      {parseFloat(token.balance).toFixed(4)} {token.symbol.toUpperCase()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${token.valueUSD.toFixed(2)} USD
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Total Value */}
          {!walletData.isLoading && (() => {
            // Calculate correct total value by summing all displayed values
            const seiValueUSD = (parseFloat(walletData.seiBalance) * seiPrice) || 0
            const tokenValueUSD = walletData.tokenBalances?.reduce((sum, token) => sum + token.valueUSD, 0) || 0
            const correctTotalValue = seiValueUSD + tokenValueUSD
            
            return (
              <div className="flex justify-between items-center pt-2 border-t border-border/40">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Total Value</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg text-foreground">
                    ${correctTotalValue.toFixed(2)}
                  </p>
                </div>
              </div>
            )
          })()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
          <span>
            Updated: <span className="font-mono tracking-tight">{lastUpdated.toLocaleTimeString()}</span>
          </span>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-auto p-0 text-xs hover:text-foreground opacity-80 hover:opacity-100"
          >
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1"
            >
              <span>View on Explorer</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </div>
    </Card>
  )
} 