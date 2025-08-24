'use client'

import { useState } from 'react'
import { Navigation } from '@/components/layout/Navigation'
import { TransactionsList } from '@/components/transactions/TransactionsList'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, ExternalLink } from 'lucide-react'

export default function TransactionsPage() {
  const [transactionData, setTransactionData] = useState<{
    agentAddress: string | null
    transactionCount: number
    loading: boolean
  }>({
    agentAddress: null,
    transactionCount: 0,
    loading: true
  })

  const [refreshKey, setRefreshKey] = useState(0)

  const handleRetry = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleViewExplorer = () => {
    if (transactionData.agentAddress) {
      window.open(`https://seitrace.com/address/${transactionData.agentAddress}`, '_blank')
    }
  }

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <Navigation />
      
      {/* Transactions Content */}
      <main className="flex-1 overflow-auto p-3 sm:p-6 bg-transparent">
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-6 sm:mb-8 px-4 sm:px-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold bg-gradient-to-r from-zen-primary to-zen-secondary bg-clip-text text-transparent">
              Agent Transactions
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Recent transaction history for your ZenSei AI agent
            </p>
            
            {/* Agent Info and Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-6">
              {/* Agent Address */}
              {transactionData.agentAddress && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Agent:</span>
                  <Badge variant="outline" className="font-mono text-xs sm:text-sm">
                    {formatAddress(transactionData.agentAddress)}
                  </Badge>
                </div>
              )}
              
              {/* Transaction Count */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {transactionData.loading
                    ? 'Loading...'
                    : transactionData.transactionCount > 0 
                      ? `Showing ${transactionData.transactionCount} recent transactions`
                      : 'No recent transactions found'
                  }
                </span>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  disabled={transactionData.loading}
                  className="w-full sm:w-auto text-xs sm:text-sm"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${transactionData.loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewExplorer}
                  disabled={!transactionData.agentAddress}
                  className="w-full sm:w-auto text-xs sm:text-sm"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">View on Explorer</span>
                  <span className="sm:hidden">Explorer</span>
                </Button>
              </div>
            </div>
          </div>
          
          <TransactionsList 
            key={refreshKey}
            onRetry={handleRetry}
            onDataLoad={setTransactionData}
          />
        </div>
      </main>
    </div>
  )
} 