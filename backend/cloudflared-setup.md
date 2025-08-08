# Cloudflared Tunnel Setup Guide

This guide provides detailed instructions for setting up Cloudflare Tunnel to access your Zensei services from anywhere on the web securely.

## Overview

Cloudflare Tunnel creates secure connections between your local services and Cloudflare's edge network without opening inbound ports on your firewall. This is perfect for:

- Secure remote access to your Zensei agents
- No need for port forwarding or VPN
- Automatic SSL/TLS encryption
- DDoS protection through Cloudflare

## Prerequisites

- Cloudflare account (free tier is sufficient)
- Domain name managed by Cloudflare
- Docker and Docker Compose running your Zensei services

## Step 1: Install Cloudflared

### macOS
```bash
brew install cloudflared
```

### Linux (Ubuntu/Debian)
```bash
wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

### Windows
Download from: https://github.com/cloudflare/cloudflared/releases/latest

### Verify Installation
```bash
cloudflared --version
```

## Step 2: Authenticate with Cloudflare

```bash
# This opens a browser window for authentication
cloudflared tunnel login
```

This creates a certificate file in your home directory that authenticates cloudflared with your Cloudflare account.

## Step 3: Create a Tunnel

```bash
# Create a tunnel named "zensei"
cloudflared tunnel create zensei
```

This will output a tunnel UUID - save this for reference.

## Step 4: Configure DNS Records

You have two options for DNS configuration:

### Option A: Automatic DNS (Recommended)
```bash
# Route traffic to your tunnel automatically
cloudflared tunnel route dns zensei eliza.zensei.fun
cloudflared tunnel route dns zensei cambrian.zensei.fun  
cloudflared tunnel route dns zensei mcp.zensei.fun
```

### Option B: Manual DNS
In your Cloudflare dashboard:
1. Go to DNS settings
2. Add CNAME records:
   - `eliza` → `<tunnel-uuid>.cfargotunnel.com`
   - `cambrian` → `<tunnel-uuid>.cfargotunnel.com`
   - `mcp` → `<tunnel-uuid>.cfargotunnel.com`

## Step 5: Get Tunnel Token

```bash
# Get the tunnel token for Docker
cloudflared tunnel token zensei
```

Copy the entire token output - this goes in your `.env` file.

## Step 6: Update Your .env File

Add the tunnel token to your `.env` file:

```bash
# Cloudflared Tunnel Configuration
CLOUDFLARED_TOKEN=eyJhIjoiYWJjZGVmZ2hpamsaMTIzNDU2Nzg5MGFiY2RlZiIsInQiOiJhYmNkZWZnaGlqayIsInMiOiJhYmNkZWZnaGlqayJ9
```

## Step 7: Create Tunnel Configuration

Create a `tunnel-config.yml` file for more advanced routing:

```yaml
tunnel: zensei
credentials-file: /etc/cloudflared/cert.pem

ingress:
  # Eliza Agent
  - hostname: eliza.zensei.fun
    service: http://eliza:3000
  
  # Cambrian Agent  
  - hostname: cambrian.zensei.fun
    service: http://cambrian-agent:3000
    
  # SEI MCP Server
  - hostname: mcp.zensei.fun
    service: http://sei-mcp-server:3333
    
  # Health check endpoint
  - hostname: health.zensei.fun
    service: http://eliza:3000/health
    
  # Catch-all rule (required)
  - service: http_status:404
```

## Step 8: Start Services with Tunnel

```bash
# Start all services including cloudflared tunnel
docker-compose --profile tunnel up -d

# Or start tunnel separately after services are running
docker-compose up -d
docker-compose run cloudflared
```

## Step 9: Verify Setup

### Check Tunnel Status
```bash
# List tunnels
cloudflared tunnel list

# Check tunnel info
cloudflared tunnel info zensei

# Test connectivity
curl https://eliza.zensei.fun/health
```

### Check Service Access
Your services should now be accessible at:
- `https://eliza.zensei.fun` - Eliza UI
- `https://cambrian.zensei.fun` - Cambrian Agent
- `https://mcp.zensei.fun` - SEI MCP Server

## Advanced Configuration

### Custom Headers
```yaml
ingress:
  - hostname: eliza.zensei.fun
    service: http://eliza:3000
    originRequest:
      httpHostHeader: eliza.zensei.fun
      originServerName: eliza.zensei.fun
```

### Access Control
Set up Cloudflare Access for additional security:

1. Go to Cloudflare Zero Trust dashboard
2. Create Access policies for your services
3. Add authentication requirements (email, GitHub, etc.)

### Load Balancing
For multiple instances:

```yaml
ingress:
  - hostname: eliza.zensei.fun
    service: http://eliza:3000
    originRequest:
      connectTimeout: 30s
      tlsTimeout: 10s
      keepAliveTimeout: 90s
```

## Troubleshooting

### Common Issues

1. **Tunnel not connecting:**
   ```bash
   # Check cloudflared logs
   docker-compose logs cloudflared
   
   # Verify token
   echo $CLOUDFLARED_TOKEN | base64 -d
   ```

2. **DNS not resolving:**
   ```bash
   # Check DNS propagation
   nslookup eliza.zensei.fun
   
   # Test direct tunnel access
   curl -H "Host: eliza.zensei.fun" https://<tunnel-uuid>.cfargotunnel.com
   ```

3. **Services not reachable:**
   ```bash
   # Test internal connectivity
   docker-compose exec cloudflared curl http://eliza:3000/health
   
   # Check service logs
   docker-compose logs eliza
   ```

4. **SSL issues:**
   ```bash
   # Force SSL renewal
   cloudflared tunnel cleanup zensei
   cloudflared tunnel create zensei
   ```

### Debug Mode

Enable debug logging:

```bash
# Add to docker-compose.yml cloudflared service
environment:
  - TUNNEL_LOGLEVEL=debug
  - TUNNEL_TOKEN=${CLOUDFLARED_TOKEN}
```

### Tunnel Metrics

Access tunnel metrics at:
- `http://localhost:2000/metrics` (if metrics port is exposed)

## Security Best Practices

1. **Principle of Least Privilege**: Only expose necessary services
2. **Access Control**: Use Cloudflare Access for sensitive endpoints
3. **Rate Limiting**: Configure rate limiting in Cloudflare dashboard
4. **WAF Rules**: Enable Web Application Firewall protection
5. **Certificate Validation**: Ensure proper SSL/TLS configuration

## Monitoring and Maintenance

### Health Monitoring
```bash
# Check tunnel health
cloudflared tunnel info zensei

# Monitor logs
docker-compose logs -f cloudflared
```

### Updates
```bash
# Update cloudflared image
docker-compose pull cloudflared
docker-compose up -d cloudflared
```

### Backup Configuration
```bash
# Backup tunnel configuration
cp ~/.cloudflared/cert.pem ~/cloudflared-backup/
cp tunnel-config.yml ~/cloudflared-backup/
```

## Alternative: Quick Setup Script

Create a `setup-tunnel.sh` script for automation:

```bash
#!/bin/bash

# Quick tunnel setup script
DOMAIN=${1:-zensei.fun}
TUNNEL_NAME="zensei"

echo "Setting up Cloudflare tunnel for $DOMAIN..."

# Create tunnel
cloudflared tunnel create $TUNNEL_NAME

# Configure DNS
cloudflared tunnel route dns $TUNNEL_NAME eliza.$DOMAIN
cloudflared tunnel route dns $TUNNEL_NAME cambrian.$DOMAIN
cloudflared tunnel route dns $TUNNEL_NAME mcp.$DOMAIN

# Get token
echo "Add this token to your .env file:"
cloudflared tunnel token $TUNNEL_NAME

echo "Setup complete! Start services with:"
echo "docker-compose --profile tunnel up -d"
```

## Support

For additional help:
- [Cloudflare Tunnel Documentation](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- [Cloudflare Community](https://community.cloudflare.com/)
- Check the main Zensei README for service-specific issues 