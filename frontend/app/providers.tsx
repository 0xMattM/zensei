'use client'

import { PrivyProvider } from '@privy-io/react-auth'

// Define Sei chain configuration compatible with Privy
const seiChain = {
  id: 1329,
  name: 'Sei Network',
  network: 'sei',
  iconUrl: 'https://sei.io/favicon.ico',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'Sei',
    symbol: 'SEI',
  },
  rpcUrls: {
    default: {
      http: ['https://evm-rpc.sei-apis.com'],
    },
    public: {
      http: ['https://evm-rpc.sei-apis.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Seitrace',
      url: 'https://seitrace.com',
    },
  },
  testnet: false,
} as const

export function Providers({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-red-400">Configuration Error</h2>
          <p className="text-muted-foreground">
            NEXT_PUBLIC_PRIVY_APP_ID is not configured. Please set your environment variables.
          </p>
        </div>
      </div>
    )
  }

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
      config={{
        // Enhanced Sei EVM support
        supportedChains: [seiChain],
        appearance: {
          theme: 'dark',
          accentColor: '#8b5cf6', // zen-purple
          logo: '/logo-white.png', // Use actual ZenSei logo
          landingHeader: 'Connect to ZenSei',
          showWalletLoginFirst: false,
        },
        // Modified: Only create embedded wallets for users without external wallets
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        loginMethods: ['email', 'wallet'],
        defaultChain: seiChain,
      }}
    >
      {children}
    </PrivyProvider>
  )
} 