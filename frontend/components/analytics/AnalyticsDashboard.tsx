'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { AlertCircle, TrendingUp, DollarSign, Activity, BarChart3 } from 'lucide-react'
import type { AnalyticsDashboardState } from '@/types/analytics'
import { formatCurrency } from '@/lib/analytics/defillama'
import { TvlChart } from './TvlChart'
import { ProtocolChart } from './ProtocolChart'
import { NetworkActivity } from './NetworkActivity'

export function AnalyticsDashboard() {
  const [state, setState] = useState<AnalyticsDashboardState>({
    networkOverview: null,
    historicalTvl: [],
    topProtocols: [],
    loading: {
      overview: true,
      tvl: true,
      protocols: true,
    },
    errors: {},
    lastUpdated: null,
  })

  // Load data on component mount
  useEffect(() => {
    loadAnalyticsData()
  }, [])

  const loadAnalyticsData = async () => {
    try {
      console.log('Loading analytics data...')
      
      const response = await fetch('/api/analytics')
      const result = await response.json()
      
      if (result.success) {
        const { overview, protocols, historicalTvl } = result.data
        
        setState(prev => ({
          ...prev,
          networkOverview: overview,
          topProtocols: protocols,
          historicalTvl,
          loading: {
            overview: false,
            tvl: false,
            protocols: false,
          },
          lastUpdated: new Date(),
        }))
      } else {
        throw new Error(result.error?.message || 'Failed to load data')
      }
    } catch (error) {
      console.error('Failed to load analytics data:', error)
      setState(prev => ({
        ...prev,
        loading: {
          overview: false,
          tvl: false,
          protocols: false,
        },
        errors: {
          overview: {
            source: 'defillama',
            message: error instanceof Error ? error.message : 'Unknown error',
          }
        },
        lastUpdated: new Date(),
      }))
    }
  }

  if (state.loading.overview) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-zen-primary to-zen-secondary bg-clip-text text-transparent">
            Sei Network Analytics
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive DeFi ecosystem metrics and insights
          </p>
        </div>

        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-slate-700 rounded mb-4"></div>
              <div className="h-8 bg-slate-700 rounded mb-2"></div>
              <div className="h-3 bg-slate-700 rounded w-1/2"></div>
            </Card>
          ))}
        </div>

        {/* Chart loading skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 animate-pulse">
            <div className="h-4 bg-slate-700 rounded mb-4 w-1/3"></div>
            <div className="h-64 bg-slate-700 rounded"></div>
          </Card>
          <Card className="p-6 animate-pulse">
            <div className="h-4 bg-slate-700 rounded mb-4 w-1/3"></div>
            <div className="h-64 bg-slate-700 rounded"></div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="relative max-w-6xl mx-auto space-y-4 sm:space-y-6 px-4 sm:px-0">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold bg-gradient-to-r from-zen-primary to-zen-secondary bg-clip-text text-transparent">
          Sei Network Analytics
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-4 sm:px-0">
          Comprehensive DeFi ecosystem metrics and insights
        </p>
        {state.lastUpdated && (
          <p className="text-xs sm:text-sm text-muted-foreground">
            Last updated: <span className="font-mono tracking-tight">{state.lastUpdated.toLocaleTimeString()}</span>
          </p>
        )}
      </div>

      {/* Error Display */}
      {Object.keys(state.errors).length > 0 && (
        <Card className="p-4 bg-red-500/10 border-red-500/20">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="text-red-400">
              Some data could not be loaded. Showing cached information.
            </p>
          </div>
        </Card>
      )}

      {/* Network Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Total Value Locked"
          value={state.networkOverview ? formatCurrency(state.networkOverview.totalTvl) : '$0'}
          change={state.networkOverview?.tvlChange24h}
          icon={<DollarSign className="h-6 w-6" />}
          color="blue"
        />
        <MetricCard
          title="24h Fees"
          value={state.networkOverview ? formatCurrency(state.networkOverview.totalFees24h) : '$0'}
          icon={<TrendingUp className="h-6 w-6" />}
          color="green"
        />
        <MetricCard
          title="Active Protocols"
          value={state.networkOverview?.protocols.toString() || '0'}
          icon={<BarChart3 className="h-6 w-6" />}
          color="purple"
        />
        <MetricCard
          title="24h Volume"
          value={state.networkOverview ? formatCurrency(state.networkOverview.totalVolume24h) : '$0'}
          icon={<Activity className="h-6 w-6" />}
          color="blue"
        />
      </div>

      {/* TVL Chart - Full Width */}
      <TvlChart
        data={state.historicalTvl}
        loading={state.loading.tvl}
        error={state.errors.tvl?.message}
      />

      {/* Protocol Analysis - Full Width */}
      <ProtocolChart
        protocols={state.topProtocols}
        loading={state.loading.protocols}
        error={state.errors.protocols?.message}
      />

      {/* Network Activity Section */}
      <NetworkActivity
        protocols={state.topProtocols}
        networkOverview={state.networkOverview}
        loading={state.loading.protocols}
        error={state.errors.protocols?.message}
      />
    </div>
  )
}

// Metric Card Component
interface MetricCardProps {
  title: string
  value: string
  change?: number | undefined
  icon: React.ReactNode
  color: 'green' | 'red' | 'blue' | 'purple'
}

function MetricCard({ title, value, change, icon, color }: MetricCardProps) {
  const getColorClasses = (color: string) => {
    const colors = {
      green: 'text-green-400 bg-green-400/10',
      red: 'text-red-400 bg-red-400/10',
      blue: 'text-blue-400 bg-blue-400/10',
      purple: 'text-purple-400 bg-purple-400/10',
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <Card className="p-4 sm:p-6 border-border/40 shadow-md hover:shadow-lg transition-all">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
          <p className="text-lg sm:text-2xl font-bold tracking-tight truncate">{value}</p>
          {change !== undefined && (
            <p className={`text-xs sm:text-sm ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {change >= 0 ? '+' : ''}{change.toFixed(2)}%
            </p>
          )}
        </div>
        <div className={`p-2 sm:p-3 rounded-lg border border-white/10 ${getColorClasses(color)} flex-shrink-0`}>
          <div className="w-5 h-5 sm:w-6 sm:h-6">
            {icon}
          </div>
        </div>
      </div>
    </Card>
  )
} 