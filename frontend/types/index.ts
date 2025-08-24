// Chat types
export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp?: Date
  isLoading?: boolean
  isError?: boolean
  audioBlob?: Blob
  messageType?: 'text' | 'audio'
}

export interface ChatState {
  messages: ChatMessage[]
  isLoading: boolean
  conversationId?: string
}

// Wallet types
export interface WalletInfo {
  address: string
  isConnected: boolean
  balance?: string
  chainId?: number
}

export interface TokenBalance {
  address: string
  symbol: string
  name: string
  balance: string
  decimals: number
  price: number
  valueUSD: number
  logo: string
  coingeckoId: string
}

export interface WalletData {
  address: string
  seiBalance: string
  tokenBalances: TokenBalance[]
  totalValueUSD: number
  isLoading: boolean
}

// API types
export interface WebhookRequest {
  form_id: 'chatbot' | 'data'
  message?: string
  user_address?: string
  data?: any
}

export interface WebhookResponse {
  response?: string
  success: boolean
  error?: string
}

// Portfolio types
export interface PortfolioData {
  connectedWallet: WalletData
  agentWallet: WalletData
  totalValueUSD: number
  lastUpdated: Date
}

// DeFi Analytics types
export interface TokenPrice {
  id: string
  symbol: string
  current_price: number
  price_change_24h: number
  market_cap: number
}

export interface DeFiProtocol {
  name: string
  tvl: number
  category: string
  change_1d: number
  chains: string[]
}

// UI Component types
export interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  className?: string
}

export interface CardProps {
  children: React.ReactNode
  className?: string
}

// Environment types
export interface AppConfig {
  webhookUrl: string
  privyAppId: string
  agentAddress: string
  coinGeckoApi?: string
  defiLlamaApi?: string
  seiRpcUrl?: string
  chainId?: number
} 