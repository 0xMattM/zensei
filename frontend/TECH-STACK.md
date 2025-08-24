# ZenSei Frontend - Technical Stack

## Core Framework

### Next.js 15
- **Version**: 15.4.1 (Latest stable with App Router)
- **Rendering**: Static generation with client-side features
- **Routing**: File-based routing in `/app` directory
- **API**: No backend API routes needed (webhook only)
- **Features**: React 19 support, improved performance, enhanced caching

```typescript
// Example app structure
app/
├── layout.tsx           // Root layout with providers
├── page.tsx            // Home/chat page
├── portfolio/
│   └── page.tsx        // Portfolio dashboard
└── globals.css         // Global styles with Tailwind imports
```

## Styling & UI

### Tailwind CSS v4
- **Version**: 4.x (Latest with Vite integration)
- **Purpose**: Utility-first CSS framework with native CSS variables
- **Installation**: Via `@tailwindcss/vite` plugin
- **Custom**: Zen-inspired color palette and spacing

```bash
# Install Tailwind CSS v4 with Vite
npm install tailwindcss @tailwindcss/vite
```

### shadcn/ui
- **Version**: Latest with React 19 compatibility
- **Components**: Pre-built, customizable UI components  
- **Installation**: CLI-based component installation
- **Theme**: Custom zen color scheme with dark mode support

```bash
# Initialize shadcn/ui
npx shadcn@latest init

# Key components to install
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add tabs
npx shadcn@latest add avatar
npx shadcn@latest add badge
npx shadcn@latest add textarea
npx shadcn@latest add dialog
```

## Blockchain Integration

### Privy
- **Version**: Latest with React Auth SDK
- **Purpose**: Wallet connection and authentication
- **Network**: Sei EVM (chain ID: 1329)
- **Features**: connectOrCreateWallet, useWallets, embedded wallets

```typescript
// Privy configuration for Sei EVM
<PrivyProvider
  appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
  config={{
    embeddedWallets: {
      createOnLogin: 'users-without-wallets'
    },
    defaultChain: seiMainnet,
    supportedChains: [seiMainnet]
  }}
>
  {children}
</PrivyProvider>
```

### Viem v2.x
- **Version**: Latest stable v2.x
- **Purpose**: TypeScript interface for Ethereum
- **Features**: createWalletClient, balance queries, transaction building
- **Sei Config**: Custom chain configuration for Sei EVM

```typescript
// Sei network configuration for Viem v2.x
import { createWalletClient, custom } from 'viem'

const seiMainnet = {
  id: 1329,
  name: 'Sei Network', 
  network: 'sei',
  nativeCurrency: { name: 'Sei', symbol: 'SEI', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://evm-rpc.sei-apis.com'] },
    public: { http: ['https://evm-rpc.sei-apis.com'] }
  }
};

// Wallet client setup with Privy provider
const walletClient = createWalletClient({
  chain: seiMainnet,
  transport: custom(provider)
});
```

## Development Tools

### TypeScript
- **Version**: 5.6+ (Latest stable)
- **Configuration**: Strict mode enabled with Next.js 15 support
- **Types**: Custom type definitions for API responses
- **Features**: Enhanced type inference, improved performance

### ESLint + Prettier
- **ESLint**: Next.js 15 recommended rules with React 19 support
- **Prettier**: Code formatting with Tailwind CSS class sorting
- **Integration**: VSCode extensions and pre-commit hooks

## State Management

### React 19 + Hooks + Context
- **React Version**: 19.x with concurrent features
- **Chat State**: useState with optimistic updates
- **Wallet State**: Privy useWallets and usePrivy hooks
- **Portfolio State**: useEffect with Suspense boundaries

```typescript
// Example state structure with React 19 patterns
interface ChatState {
  messages: Message[];
  isLoading: boolean;
  conversationId: string;
  optimisticMessage?: string;
}

interface PortfolioState {
  connectedWallet: WalletData;
  agentWallet: WalletData;
  prices: TokenPrices;
  isLoading: boolean;
  lastUpdated: Date;
}

// Privy wallet hooks
const { connectOrCreateWallet } = usePrivy();
const { wallets } = useWallets();
```

## API Integration

### External APIs

```typescript
// API endpoints configuration
const APIs = {
  webhook: process.env.WEBHOOK_URL,
  coingecko: 'https://api.coingecko.com/api/v3',
  defillama: 'https://api.llama.fi'
};

// Rate limiting strategy
const apiLimits = {
  coingecko: { requests: 100, window: '1h' },
  defillama: { requests: 300, window: '5m' }
};
```

### Data Fetching
- **Chat**: Direct webhook POST requests
- **Prices**: CoinGecko API with caching
- **DeFi Data**: DeFiLlama API for protocol stats
- **Balances**: Viem for on-chain balance queries

## Performance Optimization

### Bundle Optimization
- **Dynamic Imports**: Lazy load portfolio components with Suspense
- **Image Optimization**: Next.js 15 Image component with enhanced loading
- **Tree Shaking**: Automatic with Next.js 15 and Tailwind CSS v4
- **Code Splitting**: Route-based splitting with enhanced prefetching

### Caching Strategy
```typescript
// Local storage for chat history with React 19 transitions
const chatCache = {
  save: (messages: Message[]) => localStorage.setItem('chat', JSON.stringify(messages)),
  load: () => JSON.parse(localStorage.getItem('chat') || '[]'),
  clear: () => localStorage.removeItem('chat')
};

// API response caching with TTL
const priceCache = new Map<string, {
  data: any, 
  timestamp: number, 
  ttl: number
}>();

// Optimistic updates for better UX
const addOptimisticMessage = (message: string) => {
  setMessages(prev => [...prev, { 
    id: `temp-${Date.now()}`, 
    content: message, 
    isOptimistic: true 
  }]);
};
```

## Security

### Environment Variables
```bash
# Client-side (NEXT_PUBLIC_)
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id

# Server-side
WEBHOOK_URL=https://your-n8n-webhook.com
AGENT_ADDRESS=0x1234...agent-wallet-address
```

### Best Practices
- **No Private Keys**: All wallet operations through Privy
- **Input Sanitization**: Sanitize chat messages
- **HTTPS Only**: Force HTTPS in production
- **CSP Headers**: Content Security Policy for XSS protection

## Deployment

### Vercel Configuration
```json
// vercel.json (Next.js 15 optimized)
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "functions": {
    "app/**": {
      "runtime": "nodejs20.x"
    }
  }
}
```

### Environment Setup
- **Development**: `.env.local` file with type-safe env validation
- **Production**: Vercel environment variables with Edge Runtime support
- **CI/CD**: Automatic deployment with preview environments and zero-downtime deployments

## File Structure

```bash
frontend/
├── app/                    # Next.js 15 App Router
│   ├── layout.tsx         # Root layout with Privy + Tailwind providers
│   ├── page.tsx           # Chat interface (home) 
│   ├── portfolio/
│   │   └── page.tsx       # Portfolio dashboard
│   ├── globals.css        # Tailwind v4 imports and custom styles
│   └── loading.tsx        # Global loading UI
├── components/            # React 19 components
│   ├── ui/               # shadcn/ui components
│   ├── chat/             # Chat interface components
│   │   ├── message-list.tsx
│   │   ├── message-input.tsx
│   │   └── typing-indicator.tsx
│   ├── portfolio/        # Portfolio components
│   │   ├── wallet-balance.tsx
│   │   ├── token-list.tsx
│   │   └── portfolio-metrics.tsx
│   ├── layout/           # Layout components
│   │   ├── nav.tsx
│   │   └── sidebar.tsx
│   └── providers.tsx     # Combined providers
├── lib/                  # Utilities and configurations
│   ├── utils.ts          # Helper functions + cn()
│   ├── viem.ts           # Viem v2 + Sei configuration
│   ├── privy.ts          # Privy configuration
│   ├── api.ts            # API helpers with error handling
│   └── constants.ts      # App constants and types
├── hooks/                # Custom React 19 hooks
│   ├── use-chat.ts       # Chat with optimistic updates
│   ├── use-portfolio.ts  # Portfolio data with Suspense
│   ├── use-wallet.ts     # Wallet operations with Privy
│   └── use-debounce.ts   # Utility hooks
├── types/                # TypeScript definitions
│   ├── chat.ts           # Chat message types
│   ├── portfolio.ts      # Portfolio and wallet types
│   ├── api.ts            # API response types
│   └── env.ts            # Environment variable types
├── public/               # Static assets (from /assets)
│   ├── icons/
│   ├── logos/
│   └── favicon/
├── tailwind.config.ts    # Tailwind v4 configuration
├── next.config.js        # Next.js 15 configuration
├── components.json       # shadcn/ui configuration
└── package.json          # Dependencies and scripts
```

## Key Dependencies

```json
{
  "dependencies": {
    "next": "^15.4.1",
    "react": "^19.0.0", 
    "react-dom": "^19.0.0",
    "typescript": "^5.6.0",
    "@privy-io/react-auth": "^1.0.0",
    "viem": "^2.21.0",
    "tailwindcss": "^4.1.0",
    "@tailwindcss/vite": "^4.1.0",
    "@radix-ui/react-*": "^1.1.0",
    "lucide-react": "^0.460.0",
    "clsx": "^2.1.0",
    "class-variance-authority": "^0.7.0",
    "tailwind-merge": "^2.5.0"
  },
  "devDependencies": {
    "eslint": "^9.0.0",
    "eslint-config-next": "^15.4.1",
    "prettier": "^3.3.0",
    "prettier-plugin-tailwindcss": "^0.6.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0"
  }
}
```

## Browser Support

### Desktop
- **Chrome**: 90+
- **Firefox**: 88+  
- **Safari**: 14+
- **Edge**: 90+

### Mobile
- **iOS Safari**: 14+
- **Chrome Mobile**: 90+
- **Samsung Internet**: 15+

### Wallet Compatibility
- **MetaMask**: Full support
- **Keplr**: Sei EVM mode
- **Compass**: Native Sei support
- **WalletConnect**: Any compatible wallet 