'use client'

import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { HistoricalTvl } from '@/types/analytics'

interface TvlChartProps {
  data: HistoricalTvl[]
  loading?: boolean
  error?: string | undefined
}



export function TvlChart({ data, loading = false, error }: TvlChartProps) {
  // Always show all data (no time range filtering)
  const filteredData = useMemo(() => {
    return data || []
  }, [data])



  // Format currency for display
  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`
    return `$${value.toFixed(2)}`
  }

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
    if (active && payload && payload.length && label) {
      const data = payload[0]
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg">
          <p className="text-sm text-slate-400">
            {format(new Date(label), 'MMM dd, yyyy')}
          </p>
          <p className="text-lg font-semibold text-white">
            {formatCurrency(data.value)}
          </p>
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
            <div className="space-y-2">
              <div className="h-6 w-32 bg-slate-700 rounded animate-pulse" />
              <div className="h-4 w-24 bg-slate-700 rounded animate-pulse" />
            </div>
            <div className="flex space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 w-12 bg-slate-700 rounded animate-pulse" />
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
          <h3 className="text-lg font-semibold text-red-400">TVL Chart Unavailable</h3>
          <p className="text-sm text-slate-400">{error}</p>
          <div className="h-80 bg-slate-800/50 rounded flex items-center justify-center">
            <p className="text-slate-500">Chart data could not be loaded</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 border-border/40 shadow-md hover:shadow-lg transition-all">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">TVL History</h3>
          </div>

          {/* Refresh button */}
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              // Force refresh TVL data
              try {
                const response = await fetch('/api/analytics?type=tvl&refresh=true')
                if (response.ok) {
                  window.location.reload() // Simple refresh for now
                }
              } catch (error) {
                console.error('Failed to refresh TVL data:', error)
              }
            }}
            className="text-xs px-2 py-1 text-slate-400 hover:text-white hover:ring hover:ring-white/10 rounded-md"
            title="Refresh TVL data"
          >
            🔄
          </Button>
        </div>

        {/* Chart */}
        <div className="h-80">
          {filteredData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#334155" 
                  opacity={0.3}
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tickFormatter={formatCurrency}
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1, fill: 'rgba(148,163,184,0.12)' }} />
                <Line
                  type="monotone"
                  dataKey="tvl"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: '#06b6d4',
                    stroke: '#0891b2',
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center bg-slate-800/50 rounded">
              <div className="text-center space-y-2">
                <p className="text-slate-400">No TVL data available</p>
                <p className="text-sm text-slate-500">
                  Historical data will appear here when available
                </p>
              </div>
            </div>
          )}
        </div>


      </div>
    </Card>
  )
} 