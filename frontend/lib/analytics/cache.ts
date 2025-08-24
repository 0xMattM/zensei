// In-memory cache for analytics data (shared, no fs)
const CACHE_TTL = 3600 * 1000 // 1 hour in milliseconds
const memoryCache = new Map<string, { data: unknown; timestamp: number; ttl: number }>()

export class AnalyticsCache {
  static get<T>(key: string): T | null {
    const entry = memoryCache.get(key)
    if (entry && Date.now() - entry.timestamp < entry.ttl) {
      return entry.data as T
    }
    return null
  }

  static set<T>(key: string, data: T, customTtl?: number): void {
    memoryCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: customTtl || CACHE_TTL,
    })
  }

  static clear(key: string): void {
    memoryCache.delete(key)
  }

  static clearAll(): void {
    memoryCache.clear()
  }

  static getStale<T>(key: string): T | null {
    const entry = memoryCache.get(key)
    if (entry) {
      return entry.data as T
    }
    return null
  }

  static getStats(): {
    memoryKeys: string[]
    fileKeys: string[]
    totalMemorySize: number
  } {
    return {
      memoryKeys: Array.from(memoryCache.keys()),
      fileKeys: [], // Only file cache has this, in-memory doesn't
      totalMemorySize: memoryCache.size,
    }
  }
} 