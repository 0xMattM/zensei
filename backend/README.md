# Zensei Multi-Agent System

A streamlined multi-agent system for SEI blockchain built with Docker, featuring three core services:
- **Eliza**: AI agent with advanced conversation capabilities
- **Cambrian Agent**: Multi-agent orchestration platform
- **SEI MCP Server**: Model Context Protocol server for SEI blockchain interactions

🌐 **Configured for zensei.fun domain** with automatic Cloudflare tunnel setup!

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- At least one AI API key (OpenAI, Anthropic, or Google AI)
- SEI private key for blockchain interactions
- **For web access**: Cloudflare account (free) and domain setup - see [DOMAIN_SETUP.md](DOMAIN_SETUP.md)

### 1. Clone and Setup

```bash
# Navigate to the zensei directory
cd zensei

# Copy and configure environment variables
cp env.example .env
# Edit .env with your API keys and configuration
```

### 2. Configure Environment

Edit the `.env` file with your settings. **Required variables:**

```bash
# AI API Key (choose at least one)
OPENAI_API_KEY=sk-your-openai-api-key-here
# OR
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key-here

# SEI Blockchain
SEI_PRIVATE_KEY=your-sei-private-key-here
```

### 3. Start Services

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps
```

### 4. Access Services

Once running, your services will be available at:

**Local Access:**
- **Eliza UI**: http://localhost:3010
- **Cambrian Agent**: http://localhost:3004  
- **SEI MCP Server**: http://localhost:3333

**Web Access (with tunnel):**
- **Eliza UI**: https://eliza.zensei.fun
- **Cambrian Agent**: https://cambrian.zensei.fun
- **SEI MCP Server**: https://mcp.zensei.fun
- **Health Check**: https://health.zensei.fun

## 🌐 Web Access Setup

For external web access, we recommend using Cloudflared Tunnel for simplicity and security.

### 🚀 Automated Setup (Recommended)

**⚠️ First**: Complete domain setup following [DOMAIN_SETUP.md](DOMAIN_SETUP.md) to transfer DNS from Hostinger to Cloudflare.

Then use our automated setup script for zensei.fun:

```bash
# Run the automated tunnel setup
./setup-tunnel.sh

# Then start services with tunnel
./start.sh start-tunnel
```

This script will automatically:
- Create Cloudflare tunnel named "zensei"
- Configure DNS for all subdomains (eliza.zensei.fun, cambrian.zensei.fun, mcp.zensei.fun)
- Generate and save tunnel token to .env
- Create tunnel configuration file

### Option 1: Cloudflared Tunnel (Recommended)

1. **Setup Cloudflare Tunnel:**
   ```bash
   # Install cloudflared (one-time setup)
   # On macOS:
   brew install cloudflared
   # On Linux:
   wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
   sudo dpkg -i cloudflared-linux-amd64.deb
   ```

2. **Create tunnel and get token:**
   ```bash
   # Login to Cloudflare
   cloudflared tunnel login
   
   # Create a tunnel
   cloudflared tunnel create zensei
   
   # Get the tunnel token
   cloudflared tunnel token zensei
   ```

3. **Add token to .env:**
   ```bash
   CLOUDFLARED_TOKEN=your-tunnel-token-here
   ```

4. **Start with tunnel:**
   ```bash
   # Start services with cloudflared tunnel
   docker-compose --profile tunnel up -d
   ```

5. **Configure tunnel routes** in Cloudflare Zero Trust dashboard:
   - `eliza.zensei.fun` → `http://eliza:3000`
   - `cambrian.zensei.fun` → `http://cambrian-agent:3000`
   - `mcp.zensei.fun` → `http://sei-mcp-server:3333`

### Option 2: Direct Port Forwarding

If you prefer direct access, simply forward the ports:

```bash
# Forward ports through your router/firewall
# Eliza: 3010
# Cambrian: 3004
# MCP: 3333
```

## 📊 Service Details

### Eliza Agent
- **Port**: 3010 (configurable via `ELIZA_PORT`)
- **Purpose**: Advanced AI conversation agent
- **Features**: UI interface, Discord integration, blockchain interactions
- **Health Check**: `http://localhost:3010/health`

### Cambrian Agent  
- **Port**: 3004 (configurable via `CAMBRIAN_AGENT_PORT`)
- **Purpose**: Multi-agent orchestration and coordination
- **Features**: Agent management, task distribution
- **Health Check**: Responds to HTTP GET on root path

### SEI MCP Server
- **Port**: 3333 (configurable via `MCP_SERVER_PORT`)
- **Purpose**: Model Context Protocol server for SEI blockchain
- **Features**: Blockchain queries, transaction handling, wallet management
- **Health Check**: `http://localhost:3333/health`

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `OPENAI_API_KEY` | Yes* | OpenAI API key | - |
| `ANTHROPIC_API_KEY` | Yes* | Anthropic API key | - |
| `SEI_PRIVATE_KEY` | Yes | SEI wallet private key | - |
| `ELIZA_PORT` | No | Eliza service port | 3010 |
| `CAMBRIAN_AGENT_PORT` | No | Cambrian service port | 3004 |
| `MCP_SERVER_PORT` | No | MCP server port | 3333 |
| `RPC_URL` | No | SEI RPC endpoint | https://evm-rpc.sei-apis.com |
| `NODE_ENV` | No | Environment mode | production |

*At least one AI API key is required

### Custom Configuration

You can modify service behavior by:

1. **Environment variables**: Edit `.env` file
2. **Port mapping**: Change port mappings in `docker-compose.yml`
3. **Resource limits**: Add resource constraints to services
4. **Networking**: Modify the `zensei_network` configuration

## 🛠️ Management Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart a specific service
docker-compose restart eliza

# View logs
docker-compose logs -f [service-name]

# Update images
docker-compose pull
docker-compose up -d

# Remove everything (including volumes)
docker-compose down -v
```

## 🔍 Troubleshooting

### Common Issues

1. **Services not starting:**
   ```bash
   # Check logs
   docker-compose logs [service-name]
   
   # Verify environment variables
   docker-compose config
   ```

2. **Port conflicts:**
   ```bash
   # Check what's using ports
   netstat -tulpn | grep :3010
   
   # Change ports in .env file
   ELIZA_PORT=3011
   ```

3. **API key issues:**
   ```bash
   # Verify API keys are set correctly
   docker-compose exec eliza env | grep API_KEY
   ```

4. **Network connectivity:**
   ```bash
   # Test internal connectivity
   docker-compose exec eliza curl http://sei-mcp-server:3333/health
   ```

### Health Checks

All services include health checks. Monitor them with:

```bash
# Check overall health
docker-compose ps

# Detailed health status
docker inspect zensei-eliza | grep -A 5 Health
```

## 🔐 Security Considerations

1. **API Keys**: Store securely in `.env` file, never commit to version control
2. **Private Keys**: Use environment variables, consider using secrets management
3. **Network**: Services communicate on internal Docker network
4. **Firewall**: Only expose necessary ports to external networks
5. **Updates**: Regularly update Docker images for security patches

## 📈 Scaling

To scale specific services:

```bash
# Scale cambrian agents
docker-compose up -d --scale zensei-agent=3

# Note: You'll need to configure load balancing for multiple instances
```

## 🆘 Support

For issues and questions:

1. Check the logs: `docker-compose logs -f`
2. Verify configuration: `docker-compose config`
3. Review health checks: `docker-compose ps`

## 📋 Next Steps

1. **Monitor**: Set up monitoring and alerting for production use
2. **Backup**: Implement backup strategy for persistent volumes
3. **CI/CD**: Automate deployment with GitHub Actions or similar
4. **Load Balancing**: Add load balancer for high availability
5. **SSL**: Configure SSL certificates for secure HTTPS access 