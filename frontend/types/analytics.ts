// Analytics data types for ZenSei Analytics Dashboard

// Network overview metrics
export interface SeiNetworkOverview {
  totalTvl: number;
  tvlChange24h: number;
  protocols: number;
  totalFees24h: number;
  totalVolume24h: number;
}

// Protocol data from DeFiLlama
export interface ProtocolData {
  name: string;
  slug: string;
  tvl: number;
  tvlChange24h: number;
  fees24h: number;
  volume24h?: number;
  category: string;
  logo?: string;
  chainTvls?: {
    [chain: string]: number;
  };
}

// Historical TVL data point
export interface HistoricalTvl {
  date: string;
  timestamp: number;
  tvl: number;
}

// DeFiLlama API responses
export interface DeFiLlamaChainTvl {
  date: string;
  totalLiquidityUSD: number;
}

export interface DeFiLlamaProtocolResponse {
  id: string;
  name: string;
  address?: string;
  symbol?: string;
  url?: string;
  description?: string;
  chain: string;
  logo?: string;
  audits?: string;
  audit_note?: string;
  gecko_id?: string;
  cmcId?: string;
  category: string;
  parent_protocol?: string;
  oracles?: string[];
  forkedFrom?: string[];
  module?: string;
  twitter?: string;
  language?: string;
  audit_links?: string[];
  listedAt?: number;
  chainTvls: {
    [chain: string]: {
      tvl: Array<{ date: number; totalLiquidityUSD: number }>;
      tokensInUsd?: Array<{ date: number; tokens: { [token: string]: number } }>;
    };
  };
  tvl: Array<{ date: number; totalLiquidityUSD: number }>;
  tokensInUsd?: Array<{ date: number; tokens: { [token: string]: number } }>;
  tokens?: string[];
  misrepresentedTokens?: boolean;
  methodology?: string;
  slug: string;
}

// Fees data
export interface DeFiLlamaFeesResponse {
  totalDataChart: Array<[number, number]>; // [timestamp, fees]
  total24h?: number;
  total48hto24h?: number;
  total7d?: number;
  protocols: Array<{
    total24h: number;
    total48hto24h: number;
    total7d: number;
    total30d?: number;
    totalAllTime?: number;
    change_1d?: number;
    change_7d?: number;
    change_1m?: number;
    defillamaId: string;
    name: string;
    displayName: string;
    module: string;
    category: string;
    logo?: string;
    chains: string[];
    protocolType: string;
    slug: string;
  }>;
}

// DEX data
export interface DeFiLlamaDexResponse {
  totalDataChart: Array<[number, number]>; // [timestamp, volume]
  protocols: Array<{
    total24h: number;
    total48hto24h: number;
    total7d: number;
    total30d?: number;
    totalAllTime?: number;
    change_1d?: number;
    change_7d?: number;
    defillamaId: string;
    name: string;
    displayName: string;
    module: string;
    category: string;
    logo?: string;
    chains: string[];
    slug: string;
  }>;
}

// Historical chain TVL response
export interface DeFiLlamaHistoricalTvlResponse {
  data: Array<{
    date: string;
    tvl: number;
  }>;
}

// Chart data interfaces for Recharts
export interface ChartDataPoint {
  date: string;
  timestamp?: number;
  value: number;
  label?: string;
}

export interface TvlChartData extends ChartDataPoint {
  tvl: number;
}

export interface ProtocolChartData {
  name: string;
  tvl: number;
  fees24h: number;
  volume24h: number;
  change24h: number;
  category: string;
}

export interface MetricsCardData {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  trend?: ChartDataPoint[];
  icon?: string;
  color?: 'green' | 'red' | 'blue' | 'purple';
}

// API error handling
export interface ApiError {
  source: 'defillama' | 'geckoterminal' | 'coingecko';
  message: string;
  status?: number;
  fallbackData?: any;
  retryAfter?: number;
}

// Cache configuration
export interface CacheConfig {
  ttl: number; // Time to live in seconds
  refreshInterval: number; // Background refresh interval in ms
  key: string;
}

// Analytics dashboard state
export interface AnalyticsDashboardState {
  networkOverview: SeiNetworkOverview | null;
  historicalTvl: HistoricalTvl[];
  topProtocols: ProtocolData[];
  loading: {
    overview: boolean;
    tvl: boolean;
    protocols: boolean;
  };
  errors: {
    overview?: ApiError;
    tvl?: ApiError;
    protocols?: ApiError;
  };
  lastUpdated: Date | null;
} 