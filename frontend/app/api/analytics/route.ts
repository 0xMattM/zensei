import { NextRequest, NextResponse } from 'next/server'
import { getSeiNetworkOverview, createApiError, refreshTvlData } from '@/lib/analytics/defillama'
import { AnalyticsCache } from '@/lib/analytics/cache'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') // 'overview', 'tvl', 'protocols', etc.
  const refresh = searchParams.get('refresh') === 'true' // Force refresh cache

  try {
    console.log('[Analytics API] Fetching data for type:', type || 'overview', refresh ? '(forcing refresh)' : '')

    let data
    const cacheKey = 'sei-network-overview'
    
    if (type === 'tvl' && refresh) {
      // Special handling for TVL refresh
      const tvlData = await refreshTvlData()
      data = { historicalTvl: tvlData }
      await AnalyticsCache.set('sei-historical-tvl', tvlData)
    } else {
      // Try in-memory cache first
      if (!refresh) {
        const cached = await AnalyticsCache.get(cacheKey)
        if (cached) {
          data = cached
        }
      }
      if (!data) {
        // Get full overview data and cache it
        data = await getSeiNetworkOverview()
        await AnalyticsCache.set(cacheKey, data)
      }
    }

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[Analytics API] Error:', error)
    
    const apiError = createApiError(
      'defillama',
      error instanceof Error ? error.message : 'Failed to fetch analytics data'
    )

    return NextResponse.json(
      {
        success: false,
        error: apiError,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
} 