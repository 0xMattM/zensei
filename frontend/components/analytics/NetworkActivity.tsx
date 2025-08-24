'use client'

import { useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Activity, Zap, Users } from 'lucide-react'
import type { ProtocolData, SeiNetworkOverview } from '@/types/analytics'

interface NetworkActivityProps {
  protocols: ProtocolData[]
  networkOverview: SeiNetworkOverview | null
  loading?: boolean
  error?: string | undefined
}

export function NetworkActivity({ protocols, networkOverview, loading = false, error }: NetworkActivityProps) {
  // Calculate category distribution
  const categoryData = useMemo(() => {
    const categoryTvl = protocols.reduce((acc, protocol) => {
      const category = protocol.category || 'Other'
      acc[category] = (acc[category] || 0) + protocol.tvl
      return acc
    }, {} as Record<string, number>)

    return Object.entries(categoryTvl)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6) // Top 6 categories
  }, [protocols])

  // Generate colors for pie chart
  const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']

  // Generate sample activity data (in production, this would come from API)
  const activityData = useMemo(() => {
    const now = Date.now()
    return Array.from({ length: 7 }, (_, i) => ({
      date: new Date(now - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      transactions: Math.floor(Math.random() * 1000) + 500,
      activeUsers: Math.floor(Math.random() * 200) + 100,
      volume: Math.floor(Math.random() * 1000000) + 500000,
    }))
  }, [])

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`
    return `$${value.toFixed(0)}`
  }

  const formatNumber = (value: number) => {
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`
    return value.toString()
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="space-y-4">
              <div className="h-6 w-32 bg-slate-700 rounded animate-pulse" />
              <div className="h-48 bg-slate-800/50 rounded animate-pulse" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-red-400">Data Unavailable</h3>
              <div className="h-48 bg-slate-800/50 rounded flex items-center justify-center">
                <p className="text-slate-500">Content could not be loaded</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Protocol Categories */}
      <Card className="p-6 border-border/40 shadow-md hover:shadow-lg transition-all">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-400" />
          Protocol Categories
        </h3>
        {categoryData.length > 0 ? (
          <div className="space-y-4">
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={20}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    labelStyle={{ color: '#1e293b', fontWeight: 600 }}
                    contentStyle={{
                      backgroundColor: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: '10px',
                      color: '#1e293b',
                      fontWeight: 600,
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {categoryData.slice(0, 4).map((category, index) => (
                <div key={category.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-slate-300">{category.name}</span>
                  </div>
                  <span className="text-white font-medium">{formatCurrency(category.value)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center bg-slate-800/50 rounded">
            <p className="text-slate-400">No category data available</p>
          </div>
        )}
      </Card>

      {/* Network Activity Metrics */}
      <Card className="p-6 border-border/40 shadow-md hover:shadow-lg transition-all">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-400" />
          Network Activity
        </h3>
        <div className="space-y-4">
          {/* Key metrics */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-white/10">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-sm text-slate-300">Total Protocols</span>
              </div>
              <span className="text-white font-semibold">{networkOverview?.protocols || 0}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-white/10">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-slate-300">24h Fees</span>
              </div>
              <span className="text-white font-semibold">
                {networkOverview ? formatCurrency(networkOverview.totalFees24h) : '$0'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-white/10">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-slate-300">24h Volume</span>
              </div>
              <span className="text-white font-semibold">
                {networkOverview ? formatCurrency(networkOverview.totalVolume24h) : '$0'}
              </span>
            </div>
          </div>

          {/* Top performing protocol */}
          {protocols.length > 0 && (
            <div className="mt-4 p-3 border border-slate-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 uppercase tracking-wide">Top Protocol</span>
                <Badge variant="secondary" className="text-xs">
                  {protocols[0].category}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-white">{protocols[0].name}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">TVL: {formatCurrency(protocols[0].tvl)}</span>
                  <span className={`flex items-center gap-1 ${
                    protocols[0].tvlChange24h >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {protocols[0].tvlChange24h >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {protocols[0].tvlChange24h.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Activity Trend */}
      <Card className="p-6 border-border/40 shadow-md hover:shadow-lg transition-all">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-400" />
          7-Day Activity
        </h3>
        <div className="h-40 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={false}
              />
              <YAxis hide />
              <Tooltip
                formatter={(value: number, name: string) => {
                  const formatValue = name === 'volume' ? formatCurrency(value) : formatNumber(value)
                  return [formatValue, name.charAt(0).toUpperCase() + name.slice(1)]
                }}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="transactions"
                stackId="1"
                stroke="#06b6d4"
                fill="#06b6d4"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="activeUsers"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Activity summary */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-2 bg-slate-800/50 rounded">
            <p className="text-xs text-slate-400">Avg Daily Txns</p>
            <p className="text-sm font-semibold text-cyan-400">
              {Math.round(activityData.reduce((sum, day) => sum + day.transactions, 0) / activityData.length).toLocaleString()}
            </p>
          </div>
          <div className="p-2 bg-slate-800/50 rounded">
            <p className="text-xs text-slate-400">Avg Users</p>
            <p className="text-sm font-semibold text-blue-400">
              {Math.round(activityData.reduce((sum, day) => sum + day.activeUsers, 0) / activityData.length).toLocaleString()}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
} 