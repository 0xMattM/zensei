# ZenSei Frontend - Development Guidelines

> Essential guidelines for working with our updated tech stack: Next.js 15, React 19, Tailwind v4, and Viem 2.21

## 🚀 Quick Start with Updated Stack

### Initial Setup
```bash
# Create Next.js 15 project with updated template
npx create-next-app@15.4.1 zensei-frontend --typescript --tailwind --eslint --app --src-dir --import-alias="@/*"

# Install specific versions
npm install @privy-io/react-auth@^1.0.0 viem@^2.21.0 @tailwindcss/vite@^4.1.0

# shadcn/ui with new CLI
npx shadcn@latest init
```

## 📋 Key Version Differences & Migration Notes

### Next.js 14 → Next.js 15.4.1

**🔥 Breaking Changes:**
- **App Router is now stable** - No more experimental flags needed
- **Enhanced caching** - More granular cache controls
- **React 19 support** - Concurrent features enabled by default

```typescript
// OLD (Next.js 14)
import { experimental_useFormStatus } from 'react-dom'

// NEW (Next.js 15 + React 19)
import { useFormStatus } from 'react-dom'
import { useOptimistic } from 'react'
```

**Migration Steps:**
```bash
# Update next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Remove these - now stable in v15
    // appDir: true,
    // serverComponentsExternalPackages: []
  },
  // New optimizations
  turbo: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
}
```

### React 18 → React 19

**🔥 New Features:**
- **Actions** - Direct form handling without useState
- **useOptimistic** - Optimistic UI updates
- **Enhanced Suspense** - Better loading states

```typescript
// NEW: React 19 Actions for chat submission
export default function ChatForm() {
  const [optimisticMessage, addOptimistic] = useOptimistic(
    messages,
    (state, newMessage) => [...state, newMessage]
  );

  async function submitMessage(formData: FormData) {
    const message = formData.get('message') as string;
    
    // Optimistic update
    addOptimistic({ content: message, role: 'user', id: Date.now() });
    
    // Send to webhook
    await fetch(process.env.WEBHOOK_URL!, {
      method: 'POST',
      body: JSON.stringify({ form_id: 'chatbot', message }),
    });
  }

  return (
    <form action={submitMessage}>
      <input name="message" required />
      <button type="submit">Send</button>
    </form>
  );
}
```

### Tailwind CSS v3 → v4

**🔥 Major Changes:**
- **Native CSS Variables** - No more CSS-in-JS compilation
- **Better IntelliSense** - Enhanced autocomplete
- **Vite Plugin** - Faster builds

```css
/* OLD: globals.css (v3) */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* NEW: globals.css (v4) */
@import "tailwindcss";

/* Custom properties now use native CSS variables */
@theme {
  --color-primary: #8b5cf6;
  --color-secondary: #06b6d4;
  --font-family-sans: Inter, system-ui, sans-serif;
}
```

```typescript
// NEW: tailwind.config.ts (v4)
import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'zen-purple': 'var(--color-primary)',
        'zen-cyan': 'var(--color-secondary)',
      }
    }
  }
} satisfies Config
```

### Viem 2.0 → 2.21.0

**🔥 Key Updates:**
- **Enhanced type safety** - Better TypeScript inference
- **Improved wallet connectors** - Better Privy integration
- **Sei EVM support** - Native Sei network configuration

```typescript
// NEW: lib/viem.ts (v2.21.0)
import { createPublicClient, createWalletClient, http } from 'viem'
import { sei } from 'viem/chains'

// Sei EVM configuration
export const seiClient = createPublicClient({
  chain: sei,
  transport: http('https://evm-rpc.sei-apis.com')
})

// Enhanced wallet client with better Privy integration
export function createWalletFromPrivy(wallet: any) {
  return createWalletClient({
    chain: sei,
    transport: http('https://evm-rpc.sei-apis.com'),
    account: wallet.address,
  })
}

// Type-safe balance fetching
export async function getTokenBalance(address: `0x${string}`, tokenAddress?: `0x${string}`) {
  if (!tokenAddress) {
    // Native SEI balance
    return await seiClient.getBalance({ address })
  }
  
  // ERC20 token balance with enhanced type safety
  return await seiClient.readContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address],
  })
}
```

## 🔧 Development Workflow

### 1. Environment Setup

```bash
# .env.local (type-safe with Next.js 15)
WEBHOOK_URL=https://your-n8n-webhook.com
PRIVY_APP_ID=clxxxxxx
AGENT_ADDRESS=0x1234567890123456789012345678901234567890

# Optional for portfolio features
NEXT_PUBLIC_COINGECKO_API=https://api.coingecko.com/api/v3
NEXT_PUBLIC_DEFILLAMA_API=https://api.llama.fi
```

### 2. Privy Setup (Updated Integration)

```typescript
// app/providers.tsx
'use client';
import { PrivyProvider } from '@privy-io/react-auth';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        // Enhanced Sei EVM support
        supportedChains: [sei],
        appearance: {
          theme: 'dark',
          accentColor: '#8b5cf6',
        },
        // New in Privy v1.0+
        embeddedWallets: {
          createOnLogin: 'all-users',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
```

### 3. Chat Component (React 19 Patterns)

```typescript
// components/chat/ChatInterface.tsx
'use client';
import { useOptimistic, Suspense } from 'react';
import { usePrivy } from '@privy-io/react-auth';

export default function ChatInterface() {
  const { user, ready } = usePrivy();
  const [messages, setMessages] = useState<Message[]>([]);
  const [optimisticMessages, addOptimistic] = useOptimistic(
    messages,
    (state, newMessage: Message) => [...state, newMessage]
  );

  async function sendMessage(formData: FormData) {
    const content = formData.get('message') as string;
    
    // Optimistic update
    const userMessage = { id: Date.now(), content, role: 'user' as const };
    addOptimistic(userMessage);

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_WEBHOOK_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_id: 'chatbot',
          message: content,
          user_address: user?.wallet?.address,
        }),
      });

      const data = await response.json();
      const assistantMessage = { 
        id: Date.now() + 1, 
        content: data.response, 
        role: 'assistant' as const 
      };
      
      setMessages(prev => [...prev, userMessage, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
    }
  }

  return (
    <Suspense fallback={<ChatSkeleton />}>
      <div className="flex flex-col h-full">
        <ChatMessages messages={optimisticMessages} />
        <form action={sendMessage} className="p-4 border-t">
          <input
            name="message"
            placeholder="Ask about DeFi operations..."
            className="w-full p-2 border rounded-lg"
            required
          />
          <button type="submit" className="mt-2 px-4 py-2 bg-zen-purple text-white rounded">
            Send
          </button>
        </form>
      </div>
    </Suspense>
  );
}
```

### 4. shadcn/ui Setup (Updated CLI)

```bash
# New shadcn installation process
npx shadcn@latest init

# Install components for ZenSei
npx shadcn@latest add button card input textarea badge scroll-area separator
npx shadcn@latest add dialog dropdown-menu tabs avatar skeleton
```

## 🎨 Styling Guidelines

### Zen-Inspired Theme (Tailwind v4)
```css
/* globals.css */
@import "tailwindcss";

@theme {
  /* Zen color palette */
  --color-zen-50: #f8fafc;
  --color-zen-900: #0f172a;
  --color-zen-purple: #8b5cf6;
  --color-zen-cyan: #06b6d4;
  --color-zen-green: #10b981;
  
  /* Custom font stack */
  --font-family-sans: "Inter", system-ui, sans-serif;
  --font-family-mono: "JetBrains Mono", monospace;
  
  /* Zen spacing scale */
  --spacing-zen: 1.618rem; /* Golden ratio */
}
```

## 🚨 Common Migration Issues & Solutions

### Issue 1: Hydration Errors (Next.js 15 + React 19)
```typescript
// ❌ Wrong: Client-only state without proper hydration
const [mounted, setMounted] = useState(false);

// ✅ Correct: Use dynamic imports for client-only components
import dynamic from 'next/dynamic';

const WalletButton = dynamic(() => import('./WalletButton'), {
  ssr: false,
  loading: () => <WalletButtonSkeleton />
});
```

### Issue 2: Tailwind v4 Class Conflicts
```typescript
// ❌ Wrong: Old v3 arbitrary values
className="bg-[#8b5cf6]"

// ✅ Correct: Use theme variables
className="bg-zen-purple"
```

### Issue 3: Viem Type Safety
```typescript
// ❌ Wrong: Loose typing
const balance = await client.getBalance({ address: walletAddress });

// ✅ Correct: Strict typing
const balance = await client.getBalance({ 
  address: walletAddress as `0x${string}` 
});
```

## 📱 Mobile-First Development

```css
/* Mobile-first responsive design with Tailwind v4 */
.chat-container {
  @apply w-full h-screen flex flex-col;
  @apply md:max-w-4xl md:mx-auto md:h-[80vh] md:rounded-lg md:shadow-xl;
  @apply lg:max-w-6xl;
}

.chat-messages {
  @apply flex-1 overflow-y-auto p-4 space-y-4;
  @apply md:p-6 md:space-y-6;
}
```

## 🔍 Debugging & Development Tools

### Next.js 15 DevTools
```bash
# Enhanced debugging with React 19
npm run dev -- --turbo  # Use Turbopack for faster builds
```

### Viem Debugging
```typescript
// Enhanced logging for blockchain interactions
import { createPublicClient, http } from 'viem';

export const seiClient = createPublicClient({
  chain: sei,
  transport: http('https://evm-rpc.sei-apis.com', {
    // Enhanced debugging
    onFetchRequest: (request) => console.log('🔄 Request:', request),
    onFetchResponse: (response) => console.log('✅ Response:', response),
  })
});
```

## 🚀 Deployment Considerations

### Vercel Deployment (Next.js 15)
```json
// vercel.json
{
  "framework": "nextjs",
  "functions": {
    "app/**": {
      "runtime": "nodejs20.x"
    }
  },
  "env": {
    "WEBHOOK_URL": "@webhook-url",
    "PRIVY_APP_ID": "@privy-app-id",
    "AGENT_ADDRESS": "@agent-address"
  }
}
```

## 📚 Additional Resources

- [Next.js 15 Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/version-15)
- [React 19 RC Documentation](https://react.dev/blog/2024/04/25/react-19)
- [Tailwind CSS v4 Alpha](https://tailwindcss.com/blog/tailwindcss-v4-alpha)
- [Viem 2.x Documentation](https://viem.sh)
- [Privy React Auth Guide](https://docs.privy.io)

## 🔧 Development Learnings & Notes

### Scaffolding Experience (Updated from Implementation)

#### ✅ What Worked Well
1. **Next.js 15.4.1**: App Router is stable and works great
2. **TypeScript 5.6**: Enhanced type inference is excellent
3. **Tailwind CSS v4**: Native CSS variables approach is clean
4. **Project Structure**: Clear separation of concerns with `/app`, `/components`, `/lib`

#### ⚠️ Common Issues Encountered

##### 1. TypeScript Import Errors During Scaffolding
```typescript
// ❌ Issue: Cannot find module 'react' errors
// 🔧 Solution: Install dependencies first, then create components

// Proper order:
// 1. Create package.json
// 2. Run npm install 
// 3. Create TypeScript files
```

##### 2. Tailwind CSS v4 Import Warnings
```css
/* ❌ Issue: @import "tailwindcss" shows module not found during scaffolding */
/* 🔧 Solution: This is normal during scaffolding - resolves after npm install */

/* The warning appears because Tailwind v4 isn't installed yet */
/* Keep the @import statement - it will work once dependencies are installed */
```

##### 3. React 19 + Next.js 15 JSX Issues
```typescript
// ❌ Issue: JSX element implicitly has type 'any' during scaffolding
// 🔧 Solution: Install @types/react@19 to resolve

// Also ensure tsconfig.json includes:
{
  "compilerOptions": {
    "jsx": "preserve",
    "lib": ["dom", "dom.iterable", "es6"],
    "types": ["node"]
  }
}
```

#### 📋 Scaffolding Best Practices Learned

##### 1. **Scaffolding Order Matters**
```bash
# Correct order for Next.js 15 + React 19:
1. package.json (with all dependencies)
2. tsconfig.json (with proper React 19 types)
3. next.config.js (with Turbopack config)
4. tailwind.config.ts (with CSS variables)
5. app/globals.css (with @theme definitions)
6. Run npm install
7. Create components (after dependencies are installed)
```

##### 2. **Component Creation Strategy**
```typescript
// When scaffolding, create components in this order:
1. Types first (types/index.ts)
2. Utilities (lib/utils.ts) 
3. Basic UI components (Button, Card)
4. Layout components (Navigation)
5. Feature components (ChatInterface)
6. Page components (page.tsx files)
```

##### 3. **Mockup-First Approach Works**
```typescript
// ✅ Strategy that worked well:
1. Create components with mockup data
2. Focus on UI/UX first
3. Add real API integration later
4. Test visual design before backend integration

// This approach allows rapid prototyping and early feedback
```

#### 🚨 Critical Dependencies for Next.js 15 + React 19

```json
{
  "dependencies": {
    "next": "^15.4.1",          // ⚠️ Must be 15.4.1+
    "react": "^19.0.0",         // ⚠️ React 19 for concurrent features
    "react-dom": "^19.0.0",     // ⚠️ Match React version
    "@types/react": "^19.0.0",  // ⚠️ Critical for JSX support
    "typescript": "^5.6.0"      // ⚠️ Required for React 19 types
  }
}
```

#### 💡 Zen Theme Implementation Notes

```css
/* This color scheme works well for DeFi applications */
@theme {
  --color-zen-purple: #8b5cf6;  /* Primary CTA color */
  --color-zen-cyan: #06b6d4;    /* Secondary accent */  
  --color-zen-green: #10b981;   /* Success/positive */
  
  /* The gradient combination creates good visual hierarchy */
  .zen-gradient {
    background: linear-gradient(135deg, var(--color-zen-purple) 0%, var(--color-zen-cyan) 100%);
  }
}
```

#### 🔧 shadcn/ui Integration Notes

```bash
# For Next.js 15, use latest shadcn CLI:
npx shadcn@latest init

# Key components for DeFi apps:
npx shadcn@latest add button card input dialog tabs
npx shadcn@latest add scroll-area separator avatar skeleton

# The cva (class-variance-authority) approach works great for theming
```

---

## 🚨 CRITICAL ISSUES & LESSONS LEARNED

### 🔥 Issue #1: Environment Variable Security
**Problem Discovered**: Using `NEXT_PUBLIC_WEBHOOK_URL` exposes webhook URL to client-side code
**Impact**: Security vulnerability - webhook URLs should never be public
**Root Cause**: Misunderstanding of Next.js environment variable conventions

```typescript
// ❌ WRONG: Client-side environment variable (public)
const response = await fetch(process.env.NEXT_PUBLIC_WEBHOOK_URL, { ... });

// ✅ CORRECT: Use API route to proxy webhook calls
const response = await fetch('/api/chat', { ... });

// api/chat/route.ts (server-side)
export async function POST(request: Request) {
  const body = await request.json();
  
  // Webhook URL stays secure on server-side
  const response = await fetch(process.env.WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  
  return response;
}
```

**Lesson**: Always keep sensitive URLs/keys server-side in Next.js

### ✅ Integration Success Stories

#### 1. **Real-time Balance Fetching with Viem 2.21**
```typescript
// Successfully implemented type-safe balance fetching
export async function getWalletData(address: `0x${string}`) {
  const seiBalance = await seiPublicClient.getBalance({ address });
  const seiPrice = await getSeiPrice();
  
  return {
    seiBalance: formatBalance(seiBalance),
    totalValueUSD: parseFloat(formatBalance(seiBalance)) * seiPrice,
  };
}
```

#### 2. **Chat History with localStorage**
```typescript
// localStorage integration that works reliably
useEffect(() => {
  const savedMessages = localStorage.getItem('zensei-chat-history');
  if (savedMessages) {
    setMessages(JSON.parse(savedMessages));
  }
}, []);

useEffect(() => {
  if (messages.length > 0) {
    localStorage.setItem('zensei-chat-history', JSON.stringify(messages));
  }
}, [messages]);
```

#### 3. **Error Boundary Pattern**
```typescript
// Comprehensive error handling that provides good UX
try {
  const data = await apiCall();
  setData(data);
} catch (error) {
  setError(error.message);
  // Show user-friendly error in UI
  const errorMessage = {
    content: 'Sorry, something went wrong. Please try again.',
    role: 'assistant',
    isError: true,
  };
  setMessages(prev => [...prev, errorMessage]);
}
```

### 📈 Performance Optimizations That Worked

#### 1. **Parallel API Calls**
```typescript
// Fetch multiple data sources simultaneously
const [walletData, seiPrice] = await Promise.all([
  getWalletData(address),
  getSeiPrice()
]);
```

#### 2. **Next.js Image Optimization**
```typescript
// Proper Next.js Image usage for logos
<Image
  src="/logo-color.png"
  alt="ZenSei Logo"
  width={32}
  height={32}
  priority // For above-the-fold logos
/>
```

#### 3. **Conditional Environment Checks**
```typescript
// Graceful handling of missing environment variables
if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID) {
  return <ConfigurationError />;
}
```

---

## 📊 Analytics Dashboard Development Patterns

### DeFiLlama API Integration Best Practices

#### 1. **Rate Limiting & Caching Pattern**
```typescript
// Successful pattern for external API integration
const RATE_LIMIT = {
  requests: 10,
  windowMs: 60000, // 1 minute
  lastRequests: [] as number[],
}

const CACHE_TTL = 3600 * 1000 // 1 hour
const cache = new Map<string, { data: any; timestamp: number }>()

// Always check rate limits before making requests
function checkRateLimit(): boolean {
  const now = Date.now()
  RATE_LIMIT.lastRequests = RATE_LIMIT.lastRequests.filter(
    (timestamp) => now - timestamp < RATE_LIMIT.windowMs
  )
  return RATE_LIMIT.lastRequests.length < RATE_LIMIT.requests
}
```

#### 2. **Comprehensive Error Handling Pattern**
```typescript
// Pattern that works well for external APIs
export async function fetchWithErrorHandling<T>(
  url: string,
  transform?: (data: any) => T
): Promise<T> {
  try {
    if (!checkRateLimit()) {
      throw new Error('Rate limit exceeded')
    }

    const cachedData = getCachedData<T>(url)
    if (cachedData) return cachedData

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    const transformed = transform ? transform(data) : data
    setCachedData(url, transformed)
    
    return transformed
  } catch (error) {
    console.error(`API Error for ${url}:`, error)
    throw createApiError('defillama', error.message)
  }
}
```

#### 3. **TypeScript Interface Strategy**
```typescript
// Creating comprehensive types upfront saves debugging time
export interface DeFiLlamaProtocolResponse {
  id: string
  name: string
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
  module: string
  twitter?: string
  audit_links?: string[]
  listedAt?: number
  chainTvls: {
    [chain: string]: {
      tvl: Array<{ date: number; totalLiquidityUSD: number }>
      tokensInUsd?: Array<{ date: number; tokens: { [token: string]: number } }>
    }
  }
  tvl: Array<{ date: number; totalLiquidityUSD: number }>
  currentChainTvls: { [chain: string]: number }
  tokensInUsd?: Array<{ date: number; tokens: { [token: string]: number } }>
}

// Transform external API data to internal interfaces
export function transformProtocolData(apiData: DeFiLlamaProtocolResponse): ProtocolData {
  // Comprehensive data transformation with fallbacks
  const currentTvl = apiData.chainTvls?.['Sei']?.tvl?.slice(-1)[0]?.totalLiquidityUSD || 0
  const previousTvl = apiData.chainTvls?.['Sei']?.tvl?.slice(-2)[0]?.totalLiquidityUSD || currentTvl
  const tvlChange24h = currentTvl > 0 ? ((currentTvl - previousTvl) / previousTvl) * 100 : 0

  return {
    name: apiData.name,
    slug: apiData.id,
    tvl: currentTvl,
    tvlChange24h,
    fees24h: 0, // Will be filled from fees endpoint
    category: apiData.category || 'DeFi',
    logo: apiData.logo,
  }
}
```

#### 4. **Component Architecture Pattern**
```typescript
// Successful pattern for data-heavy dashboard components
export function AnalyticsDashboard() {
  // Centralized state management
  const [state, setState] = useState<AnalyticsDashboardState>({
    networkOverview: null,
    historicalTvl: [],
    topProtocols: [],
    loading: { overview: true, tvl: true, protocols: true },
    errors: {},
    lastUpdated: null,
  })

  // Single data loading function
  const loadAnalyticsData = async () => {
    try {
      const response = await fetch('/api/analytics')
      const result = await response.json()
      
      if (result.success) {
        // Update all state at once to minimize re-renders
        setState(prev => ({
          ...prev,
          networkOverview: result.data.overview,
          topProtocols: result.data.protocols,
          historicalTvl: result.data.historicalTvl,
          loading: { overview: false, tvl: false, protocols: false },
          lastUpdated: new Date(),
        }))
      }
    } catch (error) {
      // Centralized error handling
      setState(prev => ({
        ...prev,
        errors: { ...prev.errors, general: error.message },
        loading: { overview: false, tvl: false, protocols: false },
      }))
    }
  }

  // Effect for initial load
  useEffect(() => {
    loadAnalyticsData()
  }, [])

  // Render with proper loading and error states
  return (
    <div className="space-y-6">
      {state.loading.overview ? (
        <LoadingSkeleton />
      ) : state.errors.general ? (
        <ErrorDisplay error={state.errors.general} onRetry={loadAnalyticsData} />
      ) : (
        <MetricsOverview data={state.networkOverview} />
      )}
    </div>
  )
}
```

### 🚨 Critical Analytics Implementation Lessons

#### ✅ **What Worked Exceptionally Well**
1. **Server-side API routes** - Protected sensitive endpoints and improved security
2. **Comprehensive TypeScript interfaces** - Caught API structure changes early
3. **Rate limiting implementation** - Prevented 429 errors from DeFiLlama
4. **Caching strategy** - Dramatically improved user experience
5. **Consistent component structure** - Easy to extend from portfolio page patterns

#### ⚠️ **Critical Issues to Avoid**
1. **Don't rely on client-side API calls** - Use Next.js API routes for external APIs
2. **Don't skip rate limiting** - External APIs will block requests
3. **Don't ignore error states** - Always provide fallback UI
4. **Don't hardcode API responses** - Create flexible TypeScript interfaces
5. **Don't fetch data on every render** - Implement proper caching

#### 🎯 **Performance Optimizations That Work**
```typescript
// Parallel data fetching
const [overview, protocols, historicalData] = await Promise.all([
  getSeiNetworkOverview(),
  getTopProtocols(),
  getHistoricalTvl()
])

// Proper loading state management
if (state.loading.overview) {
  return <MetricCardSkeleton />
}

// Conditional rendering to avoid unnecessary re-renders
{state.networkOverview && (
  <MetricCard
    title="Total Value Locked"
    value={formatCurrency(state.networkOverview.totalTvl)}
    change={state.networkOverview.tvlChange24h}
  />
)}
```

---

**💡 Pro Tip**: Keep this document updated as you encounter specific issues during development. The tech stack is evolving rapidly, especially with React 19 and Next.js 15 being relatively new.

### 📝 Development Notes Log
- **2024-01-15**: Initial scaffolding completed with Next.js 15.4.1 + React 19
- **Issue Found**: TypeScript import errors are normal during scaffolding before npm install
- **Lesson**: Always create package.json first, then install deps before creating components
- **Success**: Mockup-first approach allows rapid UI development and early testing
- **CRITICAL**: Environment variable security - never use NEXT_PUBLIC_ for sensitive URLs
- **SUCCESS**: Real wallet integration with Viem 2.21 + Privy works excellently
- **SUCCESS**: Portfolio dashboard with real-time pricing from CoinGecko API
- **SUCCESS**: Chat history persistence with localStorage - simple but effective
- **LESSON**: Comprehensive error handling improves UX significantly
- **SUCCESS**: Asset integration (logos/favicons) - copy assets early in development
- **PERFORMANCE**: Parallel API calls and Next.js Image optimization provide good UX
- **2024-01-16**: Analytics page foundation completed - DeFiLlama integration
- **SUCCESS**: DeFiLlama API integration with comprehensive error handling and caching
- **LESSON**: API rate limiting is crucial - implement early to avoid 429 errors
- **SUCCESS**: TypeScript interfaces created upfront saved significant debugging time
- **ISSUE SOLVED**: Build errors due to unused imports - strict TypeScript helps catch issues early
- **PERFORMANCE**: Server-side API routes protect sensitive endpoints and improve security
- **ARCHITECTURE**: Component structure consistency between portfolio and analytics pages enables code reuse 

