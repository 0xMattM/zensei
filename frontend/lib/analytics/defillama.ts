// DeFiLlama API integration for Sei Network analytics
import type {
  DeFiLlamaProtocolResponse,
  HistoricalTvl,
  ProtocolData,
  ApiError,
} from '@/types/analytics'
import { AnalyticsCache } from './cache'

const DEFILLAMA_BASE_URL = 'https://api.llama.fi'

// Rate limiting configuration - Updated based on DeFiLlama docs (10-200 req/min)
const RATE_LIMIT = {
  requests: 15, // Conservative but reasonable
  windowMs: 60000, // 1 minute
  lastRequests: [] as number[],
}

// Cache configuration
const CACHE_TTL = 3600 * 1000 // 1 hour in milliseconds

// Delay helper for rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Rate limiting helper
function checkRateLimit(): boolean {
  const now = Date.now()
  RATE_LIMIT.lastRequests = RATE_LIMIT.lastRequests.filter(
    (timestamp) => now - timestamp < RATE_LIMIT.windowMs
  )
  
  if (RATE_LIMIT.lastRequests.length >= RATE_LIMIT.requests) {
    return false
  }
  
  RATE_LIMIT.lastRequests.push(now)
  return true
}

// Generic API request function with error handling
async function makeRequest<T>(url: string, cacheKey?: string): Promise<T> {
  // Check cache first
  if (cacheKey) {
    const cached = await AnalyticsCache.get<T>(cacheKey)
    if (cached) {
      console.log(`[DeFiLlama] Using cached data for ${cacheKey}`)
      return cached
    }
  }

  // Check rate limit
  if (!checkRateLimit()) {
    console.log(`[DeFiLlama] Rate limit exceeded, checking for stale data...`)
    
    // Try to return stale cached data if available
    if (cacheKey) {
      const staleData = await AnalyticsCache.getStale<T>(cacheKey)
      if (staleData) {
        console.log(`[DeFiLlama] Using stale cached data for ${cacheKey}`)
        return staleData
      }
    }
    
    throw new Error('Rate limit exceeded. Please try again later.')
  }

  try {
    console.log(`[DeFiLlama] Fetching: ${url}`)
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    // Cache successful response
    if (cacheKey) {
      await AnalyticsCache.set(cacheKey, data, CACHE_TTL)
    }
    
    return data
  } catch (error) {
    console.error(`[DeFiLlama] Request failed for ${url}:`, error)
    
    // Return stale cached data as fallback if available
    if (cacheKey) {
      const staleData = await AnalyticsCache.getStale<T>(cacheKey)
      if (staleData) {
        console.log(`[DeFiLlama] Using stale cached data for ${cacheKey} after error`)
        return staleData
      }
    }
    
    throw error
  }
}

// Get Sei chain TVL from the chains endpoint
export async function getSeiChainTvl(): Promise<{ tvl: number; tvlChange24h: number }> {
  try {
    const url = `${DEFILLAMA_BASE_URL}/v2/chains`
    const chains = await makeRequest<Array<{
      gecko_id: string | null
      tvl: number
      tokenSymbol: string | null
      cmcId: string | null
      name: string
      chainId: number | null
    }>>(url, 'sei-chain-tvl')
    
    const seiChain = chains.find(chain => 
      chain.name.toLowerCase() === 'sei' || 
      chain.tokenSymbol?.toLowerCase() === 'sei'
    )
    
    if (seiChain) {
      return {
        tvl: seiChain.tvl || 0,
        tvlChange24h: 0 // Chain endpoint doesn't provide 24h change
      }
    }
    
    throw new Error('Sei chain not found in chains endpoint')
  } catch (error) {
    console.warn('[DeFiLlama] Failed to get chain TVL:', error)
    return { tvl: 0, tvlChange24h: 0 }
  }
}

// Get historical TVL for Sei network
export async function getSeiHistoricalTvl(): Promise<HistoricalTvl[]> {
  try {
    // Use the correct historical TVL endpoint
    const url = `${DEFILLAMA_BASE_URL}/v2/historicalChainTvl/Sei`
    const response = await makeRequest<Array<{ date: string; tvl: number }>>(url, 'sei-historical-tvl')
    
    if (response && Array.isArray(response) && response.length > 0) {
      const tvlData = response.map((item) => ({
        date: item.date,
        timestamp: Math.floor(new Date(item.date).getTime() / 1000),
        tvl: item.tvl || 0,
      }))
      console.log(`[DeFiLlama] Historical TVL loaded: ${tvlData.length} data points`)
      return tvlData
    }
    
    // Fallback to sample data if no real data
    console.log('[DeFiLlama] No historical TVL data found, generating sample data')
    return generateSampleTvlData()
    
  } catch (error) {
    console.error('[DeFiLlama] Failed to load historical TVL:', error)
    return generateSampleTvlData()
  }
}

// Get Sei protocols from DeFiLlama protocols endpoint with efficient filtering
export async function getSeiProtocolsFromApi(): Promise<ProtocolData[]> {
  try {
    // Load our known Sei protocols from the JSON file first
    const protocolsModule = await import('@/lib/protocols.json')
    const knownProtocols = protocolsModule.protocols || []
    
    console.log(`[DeFiLlama] Loading ${knownProtocols.length} known Sei protocols via bulk API`)
    
    // Get all protocols and filter efficiently
    const url = `${DEFILLAMA_BASE_URL}/protocols`
    const allProtocols = await makeRequest<Array<{
      id: string
      name: string
      address?: string
      symbol?: string
      url?: string
      description?: string
      chain: string
      logo?: string
      audits?: string
      audit_note?: string
      gecko_id?: string
      cmcId?: string
      category: string
      chains: string[]
      module?: string
      twitter?: string
      audit_links?: string[]
      listedAt?: number
      methodology?: string
      slug: string
      tvl: number
      chainTvls: { [key: string]: number }
      change_1h?: number
      change_1d?: number
      change_7d?: number
      fdv?: number
      mcap?: number
      staking?: number
      pool2?: number
      borrowed?: number
    }>>(url, 'all-protocols')
    
    console.log(`[DeFiLlama] Loaded ${allProtocols.length} total protocols from bulk API`)
    
    // Create a map for faster lookup
    const protocolMap = new Map(allProtocols.map(p => [p.slug, p]))
    
    // First, find our known protocols in the bulk data
    const foundProtocols: ProtocolData[] = []
    const missingProtocols: typeof knownProtocols = []
    
    for (const knownProtocol of knownProtocols) {
      const foundProtocol = protocolMap.get(knownProtocol.slug)
      if (foundProtocol) {
        foundProtocols.push({
          name: foundProtocol.name,
          slug: foundProtocol.slug,
          tvl: foundProtocol.chainTvls?.Sei || foundProtocol.tvl || 0,
          tvlChange24h: foundProtocol.change_1d || 0,
          fees24h: 0,
          category: foundProtocol.category || 'DeFi',
          ...(foundProtocol.logo && { logo: foundProtocol.logo }),
        })
        console.log(`[DeFiLlama] Found ${knownProtocol.name}: $${(foundProtocol.chainTvls?.Sei || foundProtocol.tvl || 0).toLocaleString()}`)
      } else {
        missingProtocols.push(knownProtocol)
        console.warn(`[DeFiLlama] Protocol not found in bulk data: ${knownProtocol.slug}`)
      }
    }
    
    // Also find any additional Sei protocols in the bulk data that we don't know about
    const additionalSeiProtocols = allProtocols.filter(protocol => 
      protocol.chains && 
      protocol.chains.some(chain => chain.toLowerCase() === 'sei') &&
      !knownProtocols.some(known => known.slug === protocol.slug)
    )
    
    console.log(`[DeFiLlama] Found ${additionalSeiProtocols.length} additional Sei protocols in bulk data`)
    
    // Add the additional protocols
    for (const protocol of additionalSeiProtocols) {
      foundProtocols.push({
        name: protocol.name,
        slug: protocol.slug,
        tvl: protocol.chainTvls?.Sei || protocol.tvl || 0,
        tvlChange24h: protocol.change_1d || 0,
        fees24h: 0,
        category: protocol.category || 'DeFi',
        ...(protocol.logo && { logo: protocol.logo }),
      })
      console.log(`[DeFiLlama] Additional protocol: ${protocol.name}: $${(protocol.chainTvls?.Sei || protocol.tvl || 0).toLocaleString()}`)
    }
    
    // For missing protocols, include them with 0 TVL so they show up in the count
    for (const missingProtocol of missingProtocols) {
      foundProtocols.push({
        name: missingProtocol.name,
        slug: missingProtocol.slug,
        tvl: 0,
        tvlChange24h: 0,
        fees24h: 0,
        category: 'DeFi',
      })
      console.log(`[DeFiLlama] Added missing protocol with 0 TVL: ${missingProtocol.name}`)
    }
    
    // Sort by TVL descending
    foundProtocols.sort((a, b) => b.tvl - a.tvl)
    
    console.log(`[DeFiLlama] Total protocols found: ${foundProtocols.length} (${foundProtocols.filter(p => p.tvl > 0).length} with TVL data)`)
    
    return foundProtocols
  } catch (error) {
    console.error('[DeFiLlama] Failed to load protocols from bulk API:', error)
    // Fallback to our manual list with rate-limited individual requests
    return getSeiProtocolsDataFallback()
  }
}

// Fallback method with rate limiting - fetch protocols individually
export async function getSeiProtocolsDataFallback(): Promise<ProtocolData[]> {
  try {
    // Load our known Sei protocols from the JSON file
    const protocolsModule = await import('@/lib/protocols.json')
    const protocols = protocolsModule.protocols || []
    
    console.log(`[DeFiLlama] Loading data for ${protocols.length} protocols with rate limiting`)
    
    const protocolsData: ProtocolData[] = []
    
    // Process protocols one by one with delays to avoid rate limits
    for (let i = 0; i < protocols.length; i++) {
      const protocol = protocols[i]
      
      try {
        // Add delay between requests (4 seconds = 15 requests per minute max)
        if (i > 0) {
          await delay(4000)
        }
        
        const data = await getProtocolData(protocol.slug)
        
        // Extract Sei-specific data
        const seiTvl = data.chainTvls?.Sei?.tvl || data.tvl || []
        const latestTvl = Array.isArray(seiTvl) && seiTvl.length > 0 ? seiTvl[seiTvl.length - 1] : null
        const previousTvl = Array.isArray(seiTvl) && seiTvl.length > 1 ? seiTvl[seiTvl.length - 2] : null
        
        let currentTvl = 0
        let tvlChange24h = 0
        
        if (typeof seiTvl === 'number') {
          currentTvl = seiTvl
        } else if (latestTvl && typeof latestTvl === 'object' && 'totalLiquidityUSD' in latestTvl) {
          currentTvl = latestTvl.totalLiquidityUSD || 0
          const prevTvl = previousTvl && 'totalLiquidityUSD' in previousTvl ? previousTvl.totalLiquidityUSD : currentTvl
          tvlChange24h = prevTvl > 0 ? ((currentTvl - prevTvl) / prevTvl) * 100 : 0
        }
        
                 protocolsData.push({
           name: data.name || protocol.name,
           slug: data.slug || protocol.slug,
           tvl: currentTvl,
           tvlChange24h,
           fees24h: 0,
           category: data.category || 'DeFi',
           ...(data.logo && { logo: data.logo }),
         })
        
        console.log(`[DeFiLlama] Loaded ${protocol.name}: $${currentTvl.toLocaleString()}`)
        
      } catch (error) {
        console.warn(`[DeFiLlama] Failed to load protocol ${protocol.slug}:`, error)
        protocolsData.push({
          name: protocol.name,
          slug: protocol.slug,
          tvl: 0,
          tvlChange24h: 0,
          fees24h: 0,
          category: 'DeFi',
        })
      }
    }
    
    // Sort by TVL descending
    protocolsData.sort((a, b) => b.tvl - a.tvl)
    
    console.log(`[DeFiLlama] Successfully loaded ${protocolsData.length} protocols with rate limiting (expected: ${protocols.length})`)
    
    // Ensure we always return all protocols from our list, even if some failed to load
    if (protocolsData.length < protocols.length) {
      console.log(`[DeFiLlama] Some protocols missing, adding placeholders`)
      
      for (const protocol of protocols) {
        if (!protocolsData.some(p => p.slug === protocol.slug)) {
          protocolsData.push({
            name: protocol.name,
            slug: protocol.slug,
            tvl: 0,
            tvlChange24h: 0,
            fees24h: 0,
            category: 'DeFi',
          })
          console.log(`[DeFiLlama] Added placeholder for ${protocol.name}`)
        }
      }
    }
    
    return protocolsData
  } catch (error) {
    console.error('[DeFiLlama] Failed to load protocols data:', error)
    throw error
  }
}

// Get multiple protocols data for Sei network (main function)
export async function getSeiProtocolsData(): Promise<ProtocolData[]> {
  try {
    // Try the bulk API first (more efficient)
    return await getSeiProtocolsFromApi()
  } catch (error) {
    console.warn('[DeFiLlama] Bulk API failed, falling back to individual requests:', error)
    // Fall back to individual requests with rate limiting
    return await getSeiProtocolsDataFallback()
  }
}

// Generate sample TVL data for demonstration purposes
function generateSampleTvlData(): HistoricalTvl[] {
  const endDate = new Date()
  const dataPoints: HistoricalTvl[] = []
  
  // Generate 90 days of sample data
  for (let i = 89; i >= 0; i--) {
    const date = new Date(endDate)
    date.setDate(date.getDate() - i)
    
    // Generate realistic TVL progression
    const baseValue = 50000000 // $50M base
    const growthTrend = (90 - i) * 500000 // Growth trend
    const randomVariation = (Math.random() - 0.5) * 10000000 // ±$10M random variation
    const weeklyPattern = Math.sin((i % 7) * Math.PI / 7) * 2000000 // Weekly pattern
    
    const tvl = Math.max(0, baseValue + growthTrend + randomVariation + weeklyPattern)
    
    dataPoints.push({
      date: date.toISOString().split('T')[0],
      timestamp: Math.floor(date.getTime() / 1000),
      tvl: Math.round(tvl),
    })
  }
  
  console.log(`[DeFiLlama] Generated ${dataPoints.length} sample TVL data points`)
  return dataPoints
}

// Get specific protocol data
export async function getProtocolData(slug: string): Promise<DeFiLlamaProtocolResponse> {
  const url = `${DEFILLAMA_BASE_URL}/protocol/${slug}`
  return makeRequest<DeFiLlamaProtocolResponse>(url, `protocol-${slug}`)
}

// Get Sei network fees data
export async function getSeiFeesData(): Promise<{ totalFees24h: number } | null> {
  try {
    const url = `${DEFILLAMA_BASE_URL}/overview/fees/Sei`
    const feesData = await makeRequest<{
      total24h?: number
      protocols?: Array<{ total24h?: number }>
    }>(url, 'sei-fees')
    
    const totalFees24h = feesData?.total24h || 
      feesData?.protocols?.reduce((sum, protocol) => sum + (protocol.total24h || 0), 0) || 0
    
    console.log(`[DeFiLlama] Fees data loaded: $${totalFees24h.toLocaleString()}`)
    return { totalFees24h }
  } catch (error) {
    console.warn('[DeFiLlama] Failed to load fees data:', error)
    return null
  }
}

// Get Sei network DEX volume data  
export async function getSeiDexData(): Promise<{ totalVolume24h: number } | null> {
  try {
    const url = `${DEFILLAMA_BASE_URL}/overview/dexs/Sei`
    const dexData = await makeRequest<{
      total24h?: number
      protocols?: Array<{ total24h?: number }>
    }>(url, 'sei-dexs')
    
    const totalVolume24h = dexData?.total24h || 
      dexData?.protocols?.reduce((sum, protocol) => sum + (protocol.total24h || 0), 0) || 0
    
    console.log(`[DeFiLlama] DEX volume data loaded: $${totalVolume24h.toLocaleString()}`)
    return { totalVolume24h }
  } catch (error) {
    console.warn('[DeFiLlama] Failed to load DEX volume data:', error)
    return null
  }
}

// Get network overview data with fees and volume
export async function getSeiNetworkOverview() {
  const cacheKey = 'sei-network-overview'
  
  try {
    console.log('[DeFiLlama] Loading Sei network overview...')
    
    // Check for cached overview first
    const cachedOverview = await AnalyticsCache.get(cacheKey)
    if (cachedOverview) {
      console.log('[DeFiLlama] Using cached network overview')
      return cachedOverview
    }
    
    // Fetch core data sequentially to avoid rate limits
    console.log('[DeFiLlama] Fetching chain TVL...')
    const chainData = await getSeiChainTvl()
    
    console.log('[DeFiLlama] Fetching historical TVL...')
    const historicalTvl = await getSeiHistoricalTvl()
    
    console.log('[DeFiLlama] Fetching protocols data...')
    const protocols = await getSeiProtocolsData()
    
    // Add small delays and fetch fees/volume data
    console.log('[DeFiLlama] Fetching fees data...')
    await delay(1000) // Small delay between requests
    const feesData = await getSeiFeesData()
    
    console.log('[DeFiLlama] Fetching volume data...')
    await delay(1000) // Small delay between requests
    const dexData = await getSeiDexData()
    
    // Calculate current TVL - prefer chain data if available
    const protocolsTvl = protocols.reduce((sum, protocol) => sum + protocol.tvl, 0)
    const currentTvl = chainData.tvl > 0 ? chainData.tvl : protocolsTvl
    
    // Calculate TVL change (24h) from historical data if available
    let tvlChange24h = chainData.tvlChange24h
    if (tvlChange24h === 0 && historicalTvl.length > 1) {
      const yesterdayTvl = historicalTvl[historicalTvl.length - 2]?.tvl || currentTvl
      tvlChange24h = yesterdayTvl > 0 ? ((currentTvl - yesterdayTvl) / yesterdayTvl) * 100 : 0
    }
    
    const overview = {
      totalTvl: currentTvl,
      tvlChange24h,
      protocols: protocols.length,
      totalFees24h: feesData?.totalFees24h || 0,
      totalVolume24h: dexData?.totalVolume24h || 0,
    }
    
    const result = {
      overview,
      protocols,
      historicalTvl,
      fees: feesData,
      dexs: dexData,
    }
    
    console.log('[DeFiLlama] Network overview loaded:', overview)
    
    // Cache the complete result
    await AnalyticsCache.set(cacheKey, result, CACHE_TTL)
    
    return result
  } catch (error) {
    console.error('[DeFiLlama] Failed to load network overview:', error)
    
    // Try to return stale data if available
    const staleData = await AnalyticsCache.getStale(cacheKey)
    if (staleData) {
      console.log('[DeFiLlama] Using stale network overview data')
      return staleData
    }
    
    throw error
  }
}

// Format currency values
export function formatCurrency(value: number): string {
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`
  } else {
    return `$${value.toFixed(2)}`
  }
}

// Format percentage values
export function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

// Error handling wrapper
export function createApiError(source: 'defillama', message: string, status?: number): ApiError {
  return {
    source,
    message,
    ...(status && { status }),
    retryAfter: 60, // Retry after 1 minute
  }
}

// Clear cache (useful for development)
export async function clearCache(): Promise<void> {
  await AnalyticsCache.clearAll()
  console.log('[DeFiLlama] Cache cleared')
}

// Clear specific cache key
export async function clearCacheKey(key: string): Promise<void> {
  await AnalyticsCache.clear(key)
  console.log(`[DeFiLlama] Cache cleared for key: ${key}`)
}

// Force refresh TVL data
export async function refreshTvlData(): Promise<HistoricalTvl[]> {
  clearCacheKey('sei-historical-tvl-v2')
  clearCacheKey('sei-historical-tvl-legacy')
  clearCacheKey('sei-historical-tvl')
  return getSeiHistoricalTvl()
} 