#!/bin/bash

# Zensei.fun Cloudflare Tunnel Setup Script
# Automates the entire Cloudflare tunnel setup for zensei.fun domain

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
DOMAIN="zensei.fun"
TUNNEL_NAME="zensei"
SUBDOMAINS=("eliza" "cambrian" "mcp" "health")

echo "🚀 Zensei.fun Cloudflare Tunnel Setup"
echo "======================================"
echo

# Check if cloudflared is installed
if ! command -v cloudflared &> /dev/null; then
    print_error "cloudflared is not installed!"
    echo
    print_status "Please install cloudflared first:"
    echo "  macOS: brew install cloudflared"
    echo "  Linux: wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb && sudo dpkg -i cloudflared-linux-amd64.deb"
    echo "  Windows: Download from https://github.com/cloudflare/cloudflared/releases/latest"
    exit 1
fi

print_success "cloudflared is installed"

# Check if user is authenticated
print_status "Checking Cloudflare authentication..."
if [ ! -f "$HOME/.cloudflared/cert.pem" ]; then
    print_warning "Not authenticated with Cloudflare"
    print_status "Please authenticate first..."
    cloudflared tunnel login
    print_success "Authentication complete!"
else
    print_success "Already authenticated with Cloudflare"
fi

# Create tunnel
print_status "Creating tunnel '$TUNNEL_NAME'..."
if cloudflared tunnel list | grep -q "$TUNNEL_NAME"; then
    print_warning "Tunnel '$TUNNEL_NAME' already exists"
    TUNNEL_ID=$(cloudflared tunnel list | grep "$TUNNEL_NAME" | awk '{print $1}')
    print_status "Using existing tunnel ID: $TUNNEL_ID"
else
    TUNNEL_OUTPUT=$(cloudflared tunnel create "$TUNNEL_NAME")
    TUNNEL_ID=$(echo "$TUNNEL_OUTPUT" | grep -o '[0-9a-f]\{8\}-[0-9a-f]\{4\}-[0-9a-f]\{4\}-[0-9a-f]\{4\}-[0-9a-f]\{12\}')
    print_success "Created tunnel '$TUNNEL_NAME' with ID: $TUNNEL_ID"
fi

# Configure DNS routes
print_status "Configuring DNS routes for $DOMAIN..."
for subdomain in "${SUBDOMAINS[@]}"; do
    FULL_DOMAIN="$subdomain.$DOMAIN"
    print_status "Setting up DNS for $FULL_DOMAIN..."
    
    # Check if route already exists
    if cloudflared tunnel route dns list | grep -q "$FULL_DOMAIN"; then
        print_warning "DNS route for $FULL_DOMAIN already exists"
    else
        cloudflared tunnel route dns "$TUNNEL_NAME" "$FULL_DOMAIN"
        print_success "Created DNS route for $FULL_DOMAIN"
    fi
done

# Get tunnel token
print_status "Generating tunnel token..."
TUNNEL_TOKEN=$(cloudflared tunnel token "$TUNNEL_NAME")

# Update .env file
print_status "Updating .env file..."
if [ ! -f .env ]; then
    if [ -f env.example ]; then
        cp env.example .env
        print_success "Created .env from template"
    else
        print_error "No env.example found!"
        exit 1
    fi
fi

# Update or add CLOUDFLARED_TOKEN
if grep -q "CLOUDFLARED_TOKEN=" .env; then
    # Update existing token
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|CLOUDFLARED_TOKEN=.*|CLOUDFLARED_TOKEN=$TUNNEL_TOKEN|" .env
    else
        # Linux
        sed -i "s|CLOUDFLARED_TOKEN=.*|CLOUDFLARED_TOKEN=$TUNNEL_TOKEN|" .env
    fi
    print_success "Updated CLOUDFLARED_TOKEN in .env"
else
    # Add new token
    echo "" >> .env
    echo "# Cloudflared Tunnel Token (auto-generated)" >> .env
    echo "CLOUDFLARED_TOKEN=$TUNNEL_TOKEN" >> .env
    print_success "Added CLOUDFLARED_TOKEN to .env"
fi

# Create tunnel configuration file
print_status "Creating tunnel configuration..."
cat > tunnel-config.yml << EOF
tunnel: $TUNNEL_NAME
credentials-file: /etc/cloudflared/cert.pem

ingress:
  # Eliza Agent
  - hostname: eliza.$DOMAIN
    service: http://eliza:3000
  
  # Cambrian Agent  
  - hostname: cambrian.$DOMAIN
    service: http://cambrian-agent:3000
    
  # SEI MCP Server
  - hostname: mcp.$DOMAIN
    service: http://sei-mcp-server:3333
    
  # Health check endpoint
  - hostname: health.$DOMAIN
    service: http://eliza:3000/health
    
  # Catch-all rule (required)
  - service: http_status:404
EOF

print_success "Created tunnel-config.yml"

# Show summary
echo
print_success "🎉 Cloudflare Tunnel Setup Complete!"
echo "======================================"
echo
print_status "Your services will be available at:"
echo "  🤖 Eliza Agent:    https://eliza.$DOMAIN"
echo "  🧠 Cambrian Agent: https://cambrian.$DOMAIN" 
echo "  ⚡ SEI MCP Server: https://mcp.$DOMAIN"
echo "  ❤️  Health Check:   https://health.$DOMAIN"
echo
print_status "Next steps:"
echo "  1. Ensure your .env file has the required API keys:"
echo "     - OPENAI_API_KEY or ANTHROPIC_API_KEY"
echo "     - SEI_PRIVATE_KEY"
echo "  2. Start the services with tunnel:"
echo "     ./start.sh start-tunnel"
echo "  3. Check status:"
echo "     ./start.sh status"
echo
print_status "DNS propagation may take a few minutes..."
print_status "You can check propagation with: nslookup eliza.$DOMAIN"
echo

# Optional: Test tunnel connectivity
read -p "Would you like to test the tunnel connectivity now? (y/N): " test_tunnel
if [ "$test_tunnel" = "y" ] || [ "$test_tunnel" = "Y" ]; then
    print_status "Testing tunnel connectivity..."
    if cloudflared tunnel info "$TUNNEL_NAME" &> /dev/null; then
        print_success "Tunnel is properly configured!"
    else
        print_warning "Tunnel configuration needs verification"
    fi
fi

print_success "Setup complete! 🚀" 