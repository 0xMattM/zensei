# Agents Directory

Meet ZenSei's team of 8 specialized AI agents, each with unique expertise designed to make your DeFi journey effortless and enjoyable.

## 🧘 Zen Master (Orchestrator Agent)
*The heart and soul of ZenSei*

**Personality**: Wise, calm, and coordinating. Acts as the central conductor of the agent orchestra.

**Specialization**: 
- Routes user requests to appropriate agents
- Coordinates multi-agent responses
- Manages conversation flow and context
- Ensures seamless user experience

**Example Conversation**:
> **You**: "I want to check my portfolio and then swap some tokens"
> 
> **Zen Master**: "I'll have the Portfolio Agent show you your current portfolio, then the DeFi Agent can help with your swap. Let me coordinate this for you..."

## 📦 Portfolio Agent
*Portfolio tracking and analysis*

**Personality**: Analytical, insightful, and always watching over your assets.

**Specialization**:
- Tracks wallet balances, portfolio value, asset composition, and historical performance on Sei Network
- Supports multiple addresses and shows price changes over time

**Example Conversation**:
> **You**: "How's my portfolio doing today?"
> 
> **Portfolio Agent**: "Your portfolio is up 3.2% today! Your SEI holdings gained $240, while your DeFi tokens are showing mixed performance. Would you like a detailed breakdown?"

## 📈 Analytics Agent
*Market intelligence and protocol analytics*

**Personality**: Data-driven, precise, and always up-to-date with market trends.

**Specialization**:
- Fetches real-time token prices, TVL, volume, and rankings of top protocols on Sei using APIs like CoinGecko, DexScreener, and DeFiLlama
- TVL tracking across protocols
- Price analysis and trend identification
- Market opportunity discovery

**Example Conversation**:
> **You**: "What's the market looking like for Sei DeFi?"
> 
> **Analytics Agent**: "Sei DeFi TVL is up 15% this week at $45M. DragonSwap is leading with $18M TVL and 24h volume of $2.3M. I'm seeing increased activity in the SEI/USDC pair."

## 🔐 Wallet Agent
*Secure SEI transfers*

**Personality**: Security-focused, careful, and always verifying before acting.

**Specialization**:
- Executes SEI transfers only (does not support token transfers)
- Handles transaction simulations, confirms destination addresses, estimates gas costs
- Always validates addresses and estimates gas before executing
- Never sends unless instructed to confirm

**Example Conversation**:
> **You**: "Send 100 SEI to 0x123..."
> 
> **Wallet Agent**: "I'll send 100 SEI to 0x123...abc. This will cost approximately 0.02 SEI in gas. The recipient address looks valid. Shall I proceed with the transfer?"

## 💧 DeFi Agent
*Protocol interaction and DeFi operations*

**Personality**: Adventurous, knowledgeable, and always finding the best DeFi opportunities.

**Specialization**:
- Interacts with Sei-based DeFi protocols like Yei, DragonSwap, and Silo to perform supply, borrow, stake, swap, and liquidity operations
- Handles protocol interactions (supply, borrow, LP, stake, wrap, etc.) and token transfers
- Yield farming optimization and liquidity provision strategies
- Protocol health monitoring

**Example Conversation**:
> **You**: "Find me the best yield opportunities on Sei"
> 
> **DeFi Agent**: "I found great opportunities! Yei Finance has 18% APY on SEI staking, DragonSwap offers 24% APY for SEI/USDC LP, and Takara has 15% APY for lending USDC. Which interests you?"

## 🔎 Explorer Agent
*Blockchain data and transaction lookup*

**Personality**: Detail-oriented, investigative, and excellent at finding blockchain information.

**Specialization**:
- Queries the Sei blockchain to return data about transactions, blocks, and wallet activity
- Returns clean summaries with links to SeiScan explorer
- Transaction lookup and analysis
- Block exploration and chain statistics
- Address activity monitoring

**Example Conversation**:
> **You**: "Check the details of transaction 0xabc..."
> 
> **Explorer Agent**: "Transaction 0xabc... was a successful SEI transfer of 500 tokens from 0x456... to 0x789... Block height 2,847,392, gas used: 21,000, timestamp: 2 minutes ago. [View Transaction](https://seitrace.com/tx/0xabc...)"

## 🛠️ Deployer Agent
*Smart contract and token deployment*

**Personality**: Creative, technical, and loves building new things on the blockchain.

**Specialization**:
- Deploys ERC20 and ERC721 smart contracts on Sei V2 using user-defined parameters
- Can transfer Tokens, NFTs and SEI, and can also deploy custom smart contracts by providing the solidity code
- Can also fetch balances for tokens and NFTs
- Contract parameter configuration

**Example Conversation**:
> **You**: "I want to create a token called 'ZenCoin'"
> 
> **Deployer Agent**: "Great idea! For ZenCoin, I'll need: total supply, token symbol (ZEN?), decimals (18 is standard), and any special features. Should it be mintable or have a fixed supply? Let's build something amazing!"

## 🧠 Research Agent
*Web research and news aggregation*

**Personality**: Curious, thorough, and always learning about new developments.

**Specialization**:
- Searches the web for up-to-date Sei ecosystem news, trends, and investment opportunities using the Perplexity API or other research tools
- News aggregation and analysis
- Market opportunity identification
- Investment research and due diligence

**Example Conversation**:
> **You**: "What's the latest news about Sei ecosystem?"
> 
> **Research Agent**: "I found some exciting updates! Sei just announced a new partnership with a major DeFi protocol, TVL has grown 25% this month, and there are 3 new projects launching next week. Want details on any of these?"

## 📚 Knowledge Agent
*Sei ecosystem Q&A and education*

**Personality**: Wise, educational, and patient teacher with deep ecosystem knowledge.

**Specialization**:
- Answers user questions about ZenSei, Sei staking, security practices, and protocol usage
- Powered by a RAG pipeline using Sei ecosystem documentation
- Provides best practices and security recommendations
- Educational content and tutorials

**Example Conversation**:
> **You**: "How does staking work on Sei?"
> 
> **Knowledge Agent**: "Sei uses delegated proof-of-stake! You can delegate your SEI to validators who help secure the network. In return, you earn staking rewards (typically 8-12% APY). You keep full custody of your tokens and can undelegate anytime with a 21-day unbonding period. Want me to show you the best validators?"

## How Agents Work Together

### Coordination Flow
1. **Zen Master** receives your request and analyzes what you need
2. **Zen Master** activates the appropriate specialized agents
3. Agents work in parallel or sequence as needed
4. **Zen Master** combines all responses into a coherent answer
5. You receive a complete, helpful response

### Example Multi-Agent Response
> **You**: "Show me my portfolio, find yield opportunities, and check latest Sei news"
> 
> **Response**: *Zen Master coordinates Portfolio Agent, DeFi Agent, and Research Agent*
> 
> "Your portfolio is worth $12,450 (up 2.1% today). I found 3 great yield opportunities with 15-24% APY on your assets. Also, Sei just announced a major partnership that could boost ecosystem growth. Here are the details..."

### Agent Personalities in Action
Each agent has distinct communication styles that make interactions feel natural and personal, while their specialized knowledge ensures you always get expert-level assistance for every aspect of your DeFi journey.
