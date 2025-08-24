import { createPublicClient, createWalletClient, http, custom } from 'viem'
import { sei } from 'viem/chains'
import tokensData from './tokens.json'

// ERC20 ABI for balance checking
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
] as const

// Sei EVM Public Client for read operations
export const seiPublicClient = createPublicClient({
  chain: sei,
  transport: http('https://evm-rpc.sei-apis.com')
})

// Create wallet client from Privy provider
export function createWalletFromPrivy(provider: any) {
  return createWalletClient({
    chain: sei,
    transport: custom(provider),
  })
}

// Enhanced balance fetching with error handling
export async function getTokenBalance(address: `0x${string}`, tokenAddress?: `0x${string}`) {
  try {
    if (!tokenAddress || tokenAddress === '0x0') {
      // Native SEI balance
      const balance = await seiPublicClient.getBalance({ address })
      return balance
    }
    
    // ERC20 token balance
    const balance = await seiPublicClient.readContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [address],
    })
    
    return balance as bigint
  } catch (error) {
    console.error('Error fetching balance:', error)
    return BigInt(0)
  }
}

// Fallback prices in case CoinGecko API fails
const FALLBACK_PRICES: Record<string, number> = {
  'sei-network': 0.35,
  'wrapped-sei': 0.35,
  'usd-coin': 1.0,
  'tether': 1.0,
  'ethereum': 3500,
}

// Get token prices from CoinGecko
export async function getTokenPrices(coingeckoIds: string[]): Promise<Record<string, number>> {
  try {
    if (coingeckoIds.length === 0) return {}
    
    const idsString = coingeckoIds.join(',')
    console.log('[getTokenPrices] Fetching prices for:', idsString)
    
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${idsString}&vs_currencies=usd`)
    
    if (!response.ok) {
      console.error('[getTokenPrices] API response not ok:', response.status, response.statusText)
      // Use fallback prices
      const fallbackPrices: Record<string, number> = {}
      for (const id of coingeckoIds) {
        fallbackPrices[id] = FALLBACK_PRICES[id] || 0
      }
      console.log('[getTokenPrices] Using fallback prices:', fallbackPrices)
      return fallbackPrices
    }
    
    const data = await response.json()
    console.log('[getTokenPrices] API response:', data)
    
    // Convert to our format with fallback for missing prices
    const prices: Record<string, number> = {}
    for (const id of coingeckoIds) {
      prices[id] = data[id]?.usd || FALLBACK_PRICES[id] || 0
    }
    
    console.log('[getTokenPrices] Processed prices:', prices)
    return prices
  } catch (error) {
    console.error('Error fetching token prices, using fallbacks:', error)
    // Use fallback prices on any error
    const fallbackPrices: Record<string, number> = {}
    for (const id of coingeckoIds) {
      fallbackPrices[id] = FALLBACK_PRICES[id] || 0
    }
    return fallbackPrices
  }
}

// Get multiple wallet data with token balances
export async function getWalletData(address: `0x${string}`) {
  try {
    // Get native SEI balance
    const seiBalance = await getTokenBalance(address)
    
    // Get top tokens to check balances for (limit to avoid too many requests)
    // Filter out native SEI (0x0) since we display it separately
    const topTokens = Object.entries(tokensData)
      .filter(([address]) => address !== '0x0')
      .slice(0, 20) // Check top 20 tokens
    
    // Fetch all token balances in parallel
    const tokenBalancePromises = topTokens.map(async ([tokenAddress, tokenInfo]) => {
      try {
        const balance = await getTokenBalance(address, tokenAddress as `0x${string}`)
        const decimals = tokenInfo.attributes.decimals
        const formattedBalance = formatBalance(balance, decimals)
        
        // Only include tokens with non-zero balance
        if (parseFloat(formattedBalance) > 0) {
          // Improve token names
          let displayName = tokenInfo.attributes.name
          if (displayName.toLowerCase().includes('wrapped sei')) {
            displayName = 'Wrapped Sei'
          } else if (displayName.toLowerCase().includes('usd coin')) {
            displayName = 'USDC Coin'
          } else if (displayName.toLowerCase().includes('tether')) {
            displayName = 'Tether USD'
          } else if (displayName.toLowerCase().includes('bridged wrapped ether')) {
            displayName = 'Wrapped Ethereum'
          } else {
            // Capitalize first letter of each word
            displayName = displayName.replace(/\b\w/g, l => l.toUpperCase())
          }
          
          return {
            address: tokenAddress,
            symbol: tokenInfo.attributes.symbol.toUpperCase(),
            name: displayName,
            balance: formattedBalance,
            decimals: decimals,
            price: 0, // Will be filled in later
            valueUSD: 0, // Will be calculated later
            logo: tokenInfo.attributes.logoUrl,
            coingeckoId: tokenInfo.coingeckoId,
          }
        }
        return null
      } catch (error) {
        console.error(`Error fetching balance for ${tokenInfo.attributes.symbol}:`, error)
        return null
      }
    })
    
    const tokenBalancesResults = await Promise.all(tokenBalancePromises)
    const tokenBalances = tokenBalancesResults.filter(Boolean)
    
    // Get prices for tokens with balances
    const coingeckoIds = tokenBalances
      .map(token => token?.coingeckoId)
      .filter(Boolean) as string[]
    
    let tokenPrices: Record<string, number> = {}
    if (coingeckoIds.length > 0) {
      tokenPrices = await getTokenPrices(coingeckoIds)
    }
    
    // Update token balances with prices and USD values
    const enrichedTokenBalances = tokenBalances.map(token => {
      if (!token) return null
      const price = tokenPrices[token.coingeckoId] || 0
      const valueUSD = parseFloat(token.balance) * price
      
      return {
        ...token,
        price,
        valueUSD,
      }
    }).filter((token): token is NonNullable<typeof token> => token !== null)
    
    // Calculate total USD value
    const seiPrice = tokenPrices['sei-network'] || 0
    const seiValueUSD = parseFloat(formatBalance(seiBalance)) * seiPrice
    const tokenValueUSD = enrichedTokenBalances.reduce((sum, token) => sum + token.valueUSD, 0)
    const totalValueUSD = seiValueUSD + tokenValueUSD
    
    return {
      address,
      seiBalance: formatBalance(seiBalance),
      tokenBalances: enrichedTokenBalances,
      totalValueUSD,
      isLoading: false,
    }
  } catch (error) {
    console.error('Error fetching wallet data:', error)
    return {
      address,
      seiBalance: '0',
      tokenBalances: [],
      totalValueUSD: 0,
      isLoading: false,
    }
  }
}

// Format balance for display with better precision
export function formatBalance(balance: bigint, decimals: number = 18, precision: number = 4): string {
  const divisor = BigInt(10 ** decimals)
  const wholePart = balance / divisor
  const fractionalPart = balance % divisor
  
  if (fractionalPart === BigInt(0)) {
    return wholePart.toString()
  }
  
    // Convert to number for precision formatting
  const fullNumber = Number(wholePart) + Number(fractionalPart) / (10 ** decimals)
  
  // Format with specified precision
  return fullNumber.toFixed(precision).replace(/\.?0+$/, '')
}

// Helper to validate Sei addresses
export function isValidSeiAddress(address: string): address is `0x${string}` {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

// Get SEI price using the token prices function
export async function getSeiPrice(): Promise<number> {
  try {
    const prices = await getTokenPrices(['sei-network'])
    return prices['sei-network'] || 0
  } catch (error) {
    console.error('Error fetching SEI price:', error)
    return 0
  }
}

// Calculate portfolio value in USD
export async function calculatePortfolioValue(seiBalance: string): Promise<number> {
  try {
    const seiPrice = await getSeiPrice()
    const seiAmount = parseFloat(seiBalance)
    return seiAmount * seiPrice
  } catch (error) {
    console.error('Error calculating portfolio value:', error)
    return 0
  }
}

// Get current network info
export const SEI_NETWORK = {
  name: 'Sei',
  chainId: 1329,
  rpcUrl: 'https://evm-rpc.sei-apis.com',
  blockExplorer: 'https://seitrace.com',
  nativeCurrency: {
    name: 'Sei',
    symbol: 'SEI',
    decimals: 18
  }
} as const 