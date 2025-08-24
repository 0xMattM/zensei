'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, ArrowUpDown, Clock, AlertCircle, Loader2, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Transaction {
  hash: string
  blockNumber: string
  timestamp: string
  from: string
  to: string
  value: string
  gasUsed: string
  status: string
  type: string
}

interface TransactionsListProps {
  onRetry?: () => void
  onDataLoad?: (data: { agentAddress: string | null, transactionCount: number, loading: boolean }) => void
}

// Remove the useTransactionData hook - we'll use props instead

export function TransactionsList({ onRetry: externalOnRetry, onDataLoad }: TransactionsListProps = {}) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [agentAddress, setAgentAddress] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    // Get agent address from environment variable
    const envAgentAddress = process.env.NEXT_PUBLIC_AGENT_ADDRESS || '0xf133FF0166A89aD9ab691a58385CDBd3590C7f28'
    setAgentAddress(envAgentAddress)

    const loadTransactions = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('Loading transactions for agent address:', envAgentAddress)
        
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
        
        const response = await fetch(`/api/transactions?address=${encodeURIComponent(envAgentAddress)}`, {
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }))
          throw new Error(errorData.details || errorData.error || 'Failed to fetch transactions')
        }
        
        const data = await response.json()
        console.log('API response:', data)
        
        if (data.transactions && data.transactions.length > 0) {
          setTransactions(data.transactions)
          setError(null)
          console.log(`Loaded ${data.transactions.length} transactions`)
        } else {
          setTransactions([])
          if (data.message) {
            setError(data.message)
          } else {
            setError('No recent transactions found for this address')
          }
        }
        
        // Notify parent component about the data
        onDataLoad?.({
          agentAddress: envAgentAddress,
          transactionCount: data.transactions ? data.transactions.length : 0,
          loading: false
        })
        
      } catch (err) {
        console.error('Error loading transactions:', err)
        setTransactions([])
        
        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            setError('Request timed out. The network may be slow. Please try again.')
          } else if (err.message.includes('rate limit')) {
            setError('Too many requests. Please wait a moment and try again.')
          } else {
            setError(err.message)
          }
        } else {
          setError('Unknown error occurred')
        }

        // Notify parent component about error state
        onDataLoad?.({
          agentAddress: envAgentAddress,
          transactionCount: 0,
          loading: false
        })
      } finally {
        setLoading(false)
      }
    }

    loadTransactions()
  }, [retryCount, onDataLoad])

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    externalOnRetry?.() // Call external retry handler if provided
  }

  const formatTimestamp = (timestamp: string): string => {
    const txDate = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - txDate.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return `${days}d ago`
    } else if (hours > 0) {
      return `${hours}h ago`
    } else if (minutes > 0) {
      return `${minutes}m ago`
    } else {
      return 'Just now'
    }
  }

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getExplorerUrl = (hash: string): string => {
    return `https://seitrace.com/tx/${hash}`
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'transfer':
        return <ArrowUpDown className="h-4 w-4" />
      case 'approve':
        return <ArrowUpDown className="h-4 w-4 rotate-90" />
      case 'swap':
        return <ArrowUpDown className="h-4 w-4 rotate-45" />
      case 'contract call':
        return <ArrowUpDown className="h-4 w-4 rotate-45" />
      case 'contract creation':
        return <ArrowUpDown className="h-4 w-4" />
      default:
        return <ArrowUpDown className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'transfer':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'approve':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20'
      case 'swap':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
      case 'contract call':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
      case 'contract creation':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'failed':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  if (loading) {
    return (
      <Card className="glass-card border-border/50">
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 className="h-6 w-6 animate-spin text-zen-cyan" />
            <span className="text-muted-foreground">
              {retryCount > 0 ? 'Retrying...' : 'Loading transactions...'}
            </span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="glass-card border-border/50">
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-display font-normal mb-2 text-foreground">Error Loading Transactions</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={handleRetry}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.open(`https://seitrace.com/address/${agentAddress}`, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View on Explorer
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!agentAddress) {
    return (
      <Card className="glass-card border-border/50">
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-amber-400" />
          <h2 className="text-xl font-display font-normal mb-2 text-foreground">Agent Not Configured</h2>
          <p className="text-muted-foreground">
            Set NEXT_PUBLIC_AGENT_ADDRESS environment variable to view agent transactions.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Transactions List - Removed Agent Info Card */}
      <div className="space-y-4">
        {transactions.map((tx) => (
          <Card key={tx.hash} className="glass-card border-border/50 hover:border-zen-purple/30 transition-all duration-300">
            <CardContent className="p-3 sm:p-4">
              {/* Mobile Layout */}
              <div className="block sm:hidden space-y-3">
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={cn(
                      'p-1.5 rounded-lg border',
                      getTypeColor(tx.type)
                    )}>
                      {getTypeIcon(tx.type)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-xs text-foreground truncate max-w-[120px]">
                        {formatAddress(tx.hash)}
                      </span>
                      <div className="flex items-center space-x-1 mt-1">
                        <Badge className={cn('text-xs', getStatusColor(tx.status))}>
                          {tx.status}
                        </Badge>
                        <Badge className={cn('text-xs', getTypeColor(tx.type))}>
                          {tx.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(getExplorerUrl(tx.hash), '_blank')}
                    className="flex-shrink-0"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>

                {/* Value Row */}
                <div className="flex justify-between items-center">
                  <div className="font-medium text-foreground">{tx.value}</div>
                  <div className="text-xs text-muted-foreground flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatTimestamp(tx.timestamp)}</span>
                  </div>
                </div>

                {/* Details Row */}
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">
                    <span className="font-mono break-all">{formatAddress(tx.from)} → {formatAddress(tx.to)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Block: {parseInt(tx.blockNumber).toLocaleString()}</span>
                    <span>Gas: {tx.gasUsed}</span>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden sm:flex items-center justify-between">
                <div className="flex items-center space-x-4 min-w-0 flex-1">
                  {/* Type Icon */}
                  <div className={cn(
                    'p-2 rounded-lg border flex-shrink-0',
                    getTypeColor(tx.type)
                  )}>
                    {getTypeIcon(tx.type)}
                  </div>
                  
                  {/* Transaction Info */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="font-mono text-sm text-foreground truncate">
                        {formatAddress(tx.hash)}
                      </span>
                      <Badge className={cn('text-xs flex-shrink-0', getStatusColor(tx.status))}>
                        {tx.status}
                      </Badge>
                      <Badge className={cn('text-xs flex-shrink-0', getTypeColor(tx.type))}>
                        {tx.type}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimestamp(tx.timestamp)}</span>
                      </span>
                      <span>Block: {parseInt(tx.blockNumber).toLocaleString()}</span>
                      <span>Gas: {tx.gasUsed}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 flex-shrink-0">
                  {/* Value */}
                  <div className="text-right">
                    <div className="font-medium text-foreground">{tx.value}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatAddress(tx.from)} → {formatAddress(tx.to)}
                    </div>
                  </div>

                  {/* Explorer Link */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(getExplorerUrl(tx.hash), '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {transactions.length === 0 && !loading && !error && (
        <Card className="glass-card border-border/50">
          <CardContent className="p-8 text-center">
            <ArrowUpDown className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-display font-normal mb-2 text-foreground">No Recent Transactions</h2>
            <p className="text-muted-foreground mb-4">
              No transactions found in recent blocks for this address.
            </p>
            <Button 
              variant="outline"
              onClick={() => window.open(`https://seitrace.com/address/${agentAddress}`, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Full History on Explorer
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 