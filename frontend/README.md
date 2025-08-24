# ZenSei Frontend

> Simple and elegant web interface for ZenSei - Your Personal AI DeFi Agent

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev
```

Visit `http://localhost:3000`

## Environment Variables

```bash
# Required
WEBHOOK_URL=https://your-n8n-webhook-url.com
PRIVY_APP_ID=your-privy-app-id
AGENT_ADDRESS=0x1234...your-agent-wallet-address

# Optional
NEXT_PUBLIC_COINGECKO_API=https://api.coingecko.com/api/v3
NEXT_PUBLIC_DEFILLAMA_API=https://api.llama.fi
```

## Project Structure

```
frontend/
├── app/                 # Next.js 14 App Router
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── chat/           # Chat interface components
│   └── portfolio/      # Portfolio & analytics components
├── lib/                # Utilities and configurations
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── public/             # Static assets
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Wallet**: Privy (Sei EVM)
- **Blockchain**: Viem
- **Language**: TypeScript
- **Deployment**: Vercel

## Development Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run type-check   # TypeScript check
```

## Key Features

### Phase 1: Chat Interface ✅
- Natural language chat with AI agents
- Message history and conversation context
- Real-time responses from n8n webhook

### Phase 2: Portfolio Dashboard
- Connected wallet balance display
- Agent wallet monitoring
- Basic analytics with free APIs

## Deployment

```bash
# Deploy to Vercel
npm run build
vercel --prod
```

## API Integration

### Chat API
```typescript
// Send message to agents
POST webhook_url
{
  "form_id": "chatbot",
  "message": "Show me my portfolio"
}
```

### Data Storage
```typescript
// Store user data via n8n
POST webhook_url  
{
  "form_id": "data",
  "action": "save",
  "data": { preferences: {...} }
}
```

## Assets

Design assets are located in `/assets/`:
- `icon/` - App icons in various formats
- `logo/` - ZenSei logos (color, black, white)
- `favicon/` - Favicon files
- `banner.png` - Hero banner image

## Contributing

This is a hackathon MVP focused on demonstrating core functionality. Keep implementations simple and avoid over-engineering. 