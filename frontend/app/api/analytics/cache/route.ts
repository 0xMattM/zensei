import { NextRequest, NextResponse } from 'next/server'
import { AnalyticsCache } from '@/lib/analytics/cache'
import { clearCache, clearCacheKey } from '@/lib/analytics/defillama'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action') // 'stats', 'warm', 'clear'
  const key = searchParams.get('key') // specific cache key

  try {
    switch (action) {
      case 'stats':
        const stats = await AnalyticsCache.getStats()
        return NextResponse.json({
          success: true,
          data: stats,
          timestamp: new Date().toISOString(),
        })

      case 'warm':
        // For in-memory cache, we just clear and let it reload naturally
        AnalyticsCache.clearAll()
        return NextResponse.json({
          success: true,
          message: 'Cache cleared - will reload on next request',
          timestamp: new Date().toISOString(),
        })

      case 'clear':
        if (key) {
          await clearCacheKey(key)
          return NextResponse.json({
            success: true,
            message: `Cache cleared for key: ${key}`,
            timestamp: new Date().toISOString(),
          })
        } else {
          await clearCache()
          return NextResponse.json({
            success: true,
            message: 'All cache cleared',
            timestamp: new Date().toISOString(),
          })
        }

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action. Use: stats, warm, or clear',
            timestamp: new Date().toISOString(),
          },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('[Cache API] Error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Cache operation failed',
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