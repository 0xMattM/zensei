# ZenSei Frontend - Product Requirements Document

## Overview

**Product**: ZenSei Web Interface  
**Target**: Hackathon MVP Demo  
**Goal**: Showcase AI-powered DeFi agent interaction through intuitive chat interface

## Core User Journey

1. **Connect Wallet** → User connects Sei EVM wallet via Privy
2. **Chat with AI** → User types natural language DeFi requests  
3. **Get AI Response** → Zen Master orchestrator provides intelligent responses
4. **View Portfolio** → User sees connected wallet + agent wallet balances

## User Stories

### Phase 1: Chat Interface (MVP Core)

**As a user, I want to:**
- Connect my Sei wallet quickly and securely
- Chat with AI agents using natural language
- See chat history and conversation context
- Get instant responses about DeFi operations
- Navigate a clean, zen-inspired interface

### Phase 2: Portfolio & Analytics (Post-Chat)

**As a user, I want to:**
- View my connected wallet balance and tokens
- Monitor the demo agent wallet activity
- See basic price data and portfolio value
- Access simple DeFi analytics

## Functional Requirements

### Chat System
- **Input**: Text message field with send button
- **Output**: AI agent responses in chat bubbles
- **Storage**: Local conversation history
- **API**: Single webhook endpoint integration

### Wallet Integration  
- **Connection**: Privy wallet connection for Sei EVM
- **Display**: Wallet address and connection status
- **Demo Mode**: Hardcoded agent wallet accessible to all users

### Portfolio Display
- **Connected Wallet**: User's actual wallet balances
- **Agent Wallet**: Demo agent wallet (shared)
- **Pricing**: CoinGecko API for token prices
- **Analytics**: DeFiLlama API for basic protocol data

## Design Requirements

### Visual Design
- **Theme**: Zen-inspired with peaceful colors
- **Layout**: Clean, minimal interface
- **Branding**: Use provided assets (/assets folder)
- **Responsive**: Mobile-friendly design

### User Experience
- **Onboarding**: Simple wallet connection flow
- **Navigation**: Intuitive tab structure
- **Performance**: Fast loading and interactions
- **Accessibility**: Basic accessibility standards

## Technical Constraints

### MVP Limitations
- **No Real-time**: Polling-based updates only
- **No User Accounts**: Wallet-based sessions only
- **Demo Agent**: Single shared agent wallet
- **Local Storage**: No persistent backend storage
- **Free APIs**: Rate-limited external data sources

### Browser Support
- **Primary**: Chrome, Firefox, Safari (latest)
- **Mobile**: iOS Safari, Android Chrome
- **Wallet**: EVM-compatible wallet support

## Success Metrics

### Demo Success
- **Connection Rate**: >90% successful wallet connections
- **Chat Engagement**: Users send multiple messages
- **Response Time**: <3 seconds for AI responses
- **Portfolio Views**: Users check both wallet tabs

### Technical Performance
- **Load Time**: <2 seconds initial page load
- **Uptime**: 99% during demo period
- **Error Rate**: <5% for core functions

## Out of Scope (v1)

- Multi-chain support
- Advanced trading features
- User authentication system
- Real-time WebSocket updates
- Complex DeFi integrations
- Advanced analytics/charting
- Mobile app
- Multi-language support

## Launch Criteria

### Must Have
- ✅ Wallet connection working
- ✅ Chat interface functional
- ✅ AI responses displaying
- ✅ Basic portfolio view
- ✅ Responsive design

### Nice to Have
- 📊 Price charts
- 📈 Advanced analytics
- 🔔 Notifications
- 💾 Data persistence
- 🎨 Animations

## Risk Mitigation

### Technical Risks
- **API Limits**: Implement caching and error handling
- **Wallet Issues**: Fallback connection methods
- **Performance**: Optimize bundle size and loading

### Demo Risks  
- **Network Issues**: Local development backup
- **Agent Responses**: Error handling for failed webhooks
- **User Confusion**: Clear UI labels and help text 