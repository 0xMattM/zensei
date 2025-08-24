'use client'

import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown } from 'lucide-react'
import type { ProtocolData } from '@/types/analytics'

interface ProtocolChartProps {
  protocols: ProtocolData[]
  loading?: boolean
  error?: string | undefined
}



export function ProtocolChart({ protocols, loading = false, error }: ProtocolChartProps) {
  const [displayMode, setDisplayMode] = useState<'chart' | 'list'>('chart')

  // Sort protocols by TVL descending and take top 10
  const processedProtocols = useMemo(() => {
    return [...protocols]
      .sort((a, b) => (b.tvl || 0) - (a.tvl || 0))
      .slice(0, 10)
  }, [protocols])



  // Format currency for display
  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`
    return `$${value.toFixed(0)}`
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: any }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as any
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-lg">
          <p className="font-semibold text-white mb-2">{data.name}</p>
          <div className="space-y-1 text-sm">
            <p className="text-slate-300">
              TVL: <span className="text-white font-medium">{formatCurrency(data.tvl)}</span>
            </p>
            <p className="text-slate-300">
              24h Change: 
              <span className={`font-medium ml-1 ${data.tvlChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatPercentage(data.tvlChange24h)}
              </span>
            </p>
            {data.fees24h > 0 && (
              <p className="text-slate-300">
                24h Fees: <span className="text-white font-medium">{formatCurrency(data.fees24h)}</span>
              </p>
            )}
            <p className="text-slate-300">
              Category: <span className="text-blue-400">{data.category}</span>
            </p>
          </div>
        </div>
      )
    }
    return null
  }



  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          {/* Header skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-6 w-48 bg-slate-700 rounded animate-pulse" />
            <div className="flex space-x-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-8 w-16 bg-slate-700 rounded animate-pulse" />
              ))}
            </div>
          </div>
          
          {/* Chart skeleton */}
          <div className="h-80 bg-slate-800/50 rounded animate-pulse" />
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold text-red-400">Protocol Data Unavailable</h3>
          <p className="text-sm text-slate-400">{error}</p>
          <div className="h-80 bg-slate-800/50 rounded flex items-center justify-center">
            <p className="text-slate-500">Protocol chart could not be loaded</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 border-border/40 shadow-md hover:shadow-lg transition-all">
        <div className="space-y-6">
          {/* Header with controls */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Protocol Analysis</h3>
              <p className="text-sm text-slate-400">Top protocols by TVL</p>
            </div>

            {/* Display mode toggle */}
            <div className="flex bg-slate-800/50 rounded p-1 border border-white/10">
              <Button
                variant={displayMode === 'chart' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDisplayMode('chart')}
                className="text-xs px-3 py-1"
              >
                Chart
              </Button>
              <Button
                variant={displayMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDisplayMode('list')}
                className="text-xs px-3 py-1"
              >
                List
              </Button>
            </div>
          </div>

          {/* Chart or List Display */}
          <div className="h-80">
            {processedProtocols.length > 0 ? (
              displayMode === 'chart' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={processedProtocols} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis
                      dataKey="name"
                      stroke="#64748b"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      tickFormatter={formatCurrency}
                      stroke="#64748b"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      width={80}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.12)' }} />
                                      <Bar
                    dataKey="tvl"
                    fill="#06b6d4"
                    radius={[4, 4, 0, 0]}
                    stroke="none"
                    strokeWidth={0}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(_, __, e) => {
                      if (e && e.target) {
                        const target = e.target as SVGElement
                        target.style.fill = '#0891b2'
                        target.style.opacity = '0.9'
                      }
                    }}
                    onMouseLeave={(_, __, e) => {
                      if (e && e.target) {
                        const target = e.target as SVGElement
                        target.style.fill = '#06b6d4'
                        target.style.opacity = '1'
                      }
                    }}
                  />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                // List view
                <div className="space-y-2 overflow-y-auto h-full">
                  {processedProtocols.map((protocol, index) => (
                    <div key={protocol.slug} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/40 transition-colors">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-slate-400 w-6">#{index + 1}</span>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium">{protocol.name}</p>
                            <Badge variant="secondary" className="text-xs">
                              {protocol.category}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-slate-400 mt-1">
                            <span>TVL: {formatCurrency(protocol.tvl)}</span>
                            {protocol.fees24h > 0 && (
                              <span>Fees: {formatCurrency(protocol.fees24h)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          {protocol.tvlChange24h !== 0 && (
                            <div className={`flex items-center space-x-1 ${protocol.tvlChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {protocol.tvlChange24h >= 0 ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              <span className="text-sm font-medium">
                                {formatPercentage(protocol.tvlChange24h)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="h-full flex items-center justify-center bg-slate-800/50 rounded">
                <div className="text-center space-y-2">
                  <p className="text-slate-400">No protocol data available</p>
                  <p className="text-sm text-slate-500">
                    Protocol metrics will appear here when available
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </Card>
  )
} 