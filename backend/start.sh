#!/bin/bash

# Zensei Multi-Agent System Startup Script
# This script helps you start the Zensei services with proper validation

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
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

# Function to check if .env file exists and has required variables
check_env() {
    print_status "Checking environment configuration..."
    
    if [ ! -f .env ]; then
        print_error ".env file not found!"
        print_status "Creating .env from template..."
        cp env.example .env
        print_warning "Please edit .env file with your API keys and configuration"
        print_warning "Required: OPENAI_API_KEY or ANTHROPIC_API_KEY, and SEI_PRIVATE_KEY"
        exit 1
    fi
    
    # Check for required variables
    source .env
    
    missing_vars=()
    
    if [ -z "$SEI_PRIVATE_KEY" ]; then
        missing_vars+=("SEI_PRIVATE_KEY")
    fi
    
    if [ -z "$OPENAI_API_KEY" ] && [ -z "$ANTHROPIC_API_KEY" ] && [ -z "$GOOGLE_GENERATIVE_AI_API_KEY" ]; then
        missing_vars+=("At least one AI API key (OPENAI_API_KEY, ANTHROPIC_API_KEY, or GOOGLE_GENERATIVE_AI_API_KEY)")
    fi
    
    if [ ${#missing_vars[@]} -gt 0 ]; then
        print_error "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        print_warning "Please edit .env file with the required values"
        exit 1
    fi
    
    print_success "Environment configuration looks good!"
}

# Function to check Docker
check_docker() {
    print_status "Checking Docker installation..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed or not in PATH"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed or not in PATH"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running"
        exit 1
    fi
    
    print_success "Docker is ready!"
}

# Function to pull latest images
pull_images() {
    print_status "Pulling latest Docker images..."
    docker-compose pull
    print_success "Images updated!"
}

# Function to start services
start_services() {
    local with_tunnel=$1
    
    print_status "Starting Zensei services..."
    
    if [ "$with_tunnel" = "true" ]; then
        print_status "Starting with Cloudflared tunnel..."
        if [ -z "$CLOUDFLARED_TOKEN" ]; then
            print_warning "CLOUDFLARED_TOKEN not set, starting without tunnel"
            docker-compose up -d
        else
            docker-compose --profile tunnel up -d
        fi
    else
        docker-compose up -d
    fi
    
    print_success "Services started!"
}

# Function to show service status
show_status() {
    print_status "Service status:"
    docker-compose ps
    echo
    
    print_status "Service URLs:"
    echo "  Eliza UI:      http://localhost:${ELIZA_PORT:-3010}"
    echo "  Cambrian:      http://localhost:${CAMBRIAN_AGENT_PORT:-3004}"
    echo "  SEI MCP:       http://localhost:${MCP_SERVER_PORT:-3333}"
    echo
    
    if [ -n "$CLOUDFLARED_TOKEN" ]; then
        print_status "Cloudflared tunnel URLs (if configured):"
        echo "  Eliza:         https://eliza.zensei.fun"
        echo "  Cambrian:      https://cambrian.zensei.fun"
        echo "  MCP:           https://mcp.zensei.fun"
        echo
    fi
}

# Function to show logs
show_logs() {
    print_status "Showing service logs (Ctrl+C to exit)..."
    docker-compose logs -f
}

# Function to stop services
stop_services() {
    print_status "Stopping Zensei services..."
    docker-compose down
    print_success "Services stopped!"
}

# Main script logic
case "${1:-start}" in
    "start")
        check_docker
        check_env
        start_services false
        show_status
        ;;
    "start-tunnel")
        check_docker
        check_env
        start_services true
        show_status
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        stop_services
        check_env
        start_services false
        show_status
        ;;
    "restart-tunnel")
        stop_services
        check_env
        start_services true
        show_status
        ;;
    "status")
        show_status
        ;;
    "logs")
        show_logs
        ;;
    "update")
        check_docker
        pull_images
        docker-compose up -d
        show_status
        ;;
    "clean")
        print_warning "This will remove all containers and volumes!"
        read -p "Are you sure? (y/N): " confirm
        if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
            docker-compose down -v --remove-orphans
            print_success "System cleaned!"
        else
            print_status "Clean cancelled"
        fi
        ;;
    "help"|"-h"|"--help")
        echo "Zensei Multi-Agent System Control Script"
        echo
        echo "Usage: $0 [command]"
        echo
        echo "Commands:"
        echo "  start           Start services (default)"
        echo "  start-tunnel    Start services with Cloudflared tunnel"
        echo "  stop            Stop all services"
        echo "  restart         Restart services"
        echo "  restart-tunnel  Restart services with tunnel"
        echo "  status          Show service status and URLs"
        echo "  logs            Show and follow service logs"
        echo "  update          Pull latest images and restart"
        echo "  clean           Remove all containers and volumes"
        echo "  help            Show this help message"
        echo
        echo "Examples:"
        echo "  $0                    # Start services normally"
        echo "  $0 start-tunnel       # Start with web tunnel"
        echo "  $0 logs               # View logs"
        echo "  $0 status             # Check service status"
        ;;
    *)
        print_error "Unknown command: $1"
        print_status "Use '$0 help' for available commands"
        exit 1
        ;;
esac 