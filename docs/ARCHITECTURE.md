# Architecture

## System Overview

ZenSei is built as a multi-agent system with 9 specialized AI agents coordinated by a central orchestrator. Users interact through a web interface that translates natural language into agent tasks.

## Core Components

### 1. Frontend Application
- **Technology**: Next.js, React, TypeScript
- **Purpose**: User interface for chat interactions and dashboard
- **Features**: Real-time chat, portfolio display, transaction history

### 2. Orchestrator Agent (Zen Master)
- **Technology**: n8n workflow engine
- **Purpose**: Routes user requests to appropriate specialized agents
- **Function**: Parses natural language, determines which agents to activate, coordinates responses

### 3. Specialized Agents

#### Portfolio Agent (Wallet Sage)
- **Technology**: n8n
- **Data Sources**: Wallet APIs, price feeds
- **Function**: Tracks balances and portfolio performance

#### Analytics Agent (Data Oracle)  
- **Technology**: n8n
- **Data Sources**: DeFiLlama, CoinGecko, GeckoTerminal, DexScreener APIs
- **Function**: Fetches and processes market data

#### Wallet Agent (Transfer Guardian)
- **Technology**: ElizaOS
- **Purpose**: Handles transaction signing and wallet operations
- **Security**: Multi-signature support, transaction confirmations

#### DeFi Agent (DeFi Navigator)
- **Technology**: Cambrian Agentic Framework
- **Protocols**: Yei Finance, Symphony, DragonSwap, Silo, Takara, Citrex, Carbon
- **Function**: Executes DeFi protocol interactions

#### Research Agent (Research Monk)
- **Technology**: n8n
- **Integration**: Perplexity API
- **Function**: Web research and news aggregation

#### Explorer Agent (Chain Explorer)
- **Technology**: Sei MCP Server
- **Data Source**: Sei Network RPC
- **Function**: Blockchain data queries (blocks, transactions, addresses)

#### Deployer Agent (Contract Builder)
- **Technology**: n8n
- **Tools**: Solidity compiler, deployment scripts
- **Function**: Smart contract compilation and deployment

#### Expert Agent (Knowledge Keeper)
- **Technology**: n8n + RAG pipeline
- **Database**: Qdrant vector database
- **Knowledge Base**: Sei ecosystem documentation and guides

## Data Flow

1. **User Input**: Natural language request via web interface
2. **Orchestrator**: Parses request and determines required agents
3. **Agent Execution**: Specialized agents process their part of the request
4. **Response Coordination**: Orchestrator combines agent responses
5. **User Output**: Formatted response displayed in chat interface

## Integration Layer

### Blockchain Connectivity
- **Sei Network**: Primary blockchain interaction
- **Wallet Connection**: WalletConnect, browser wallets
- **Transaction Handling**: Gas estimation, transaction broadcasting

### External APIs
- **Market Data**: Real-time price and TVL feeds
- **DeFi Protocols**: Direct protocol integration
- **AI Services**: LLM providers for natural language processing

## Security Architecture

### Transaction Security
- **Non-custodial**: User maintains private key control
- **Confirmation Steps**: Multi-step verification for transactions
- **Amount Limits**: Configurable transaction limits

### Data Security
- **API Keys**: Encrypted storage of third-party API keys
- **User Data**: Local storage for preferences, no sensitive data retention
- **Network Security**: HTTPS/WSS for all communications

## Deployment

### Development Environment
- **Local Development**: Docker Compose setup
- **Agent Testing**: Individual agent test environments
- **Integration Testing**: Full system integration tests

### Production Environment
- **Frontend**: Vercel/Netlify deployment
- **Agents**: Cloud-hosted agent containers
- **Database**: Managed Qdrant cloud instance
- **Monitoring**: Agent performance and error tracking
