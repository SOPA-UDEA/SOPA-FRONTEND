#!/bin/bash

# SOPA Frontend Docker Startup Script
# Usage: ./start.sh [dev|prod|nginx]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default mode
MODE=${1:-dev}

echo -e "${GREEN}🐳 SOPA Frontend Docker Setup${NC}"
echo -e "${YELLOW}Mode: $MODE${NC}"

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Docker is running${NC}"
}

# Function to clean up old containers
cleanup() {
    echo -e "${YELLOW}🧹 Cleaning up old containers...${NC}"
    docker-compose down --remove-orphans 2>/dev/null || true
}

# Function to build and start development environment
start_dev() {
    echo -e "${GREEN}🚀 Starting development environment...${NC}"
    docker-compose up --build sopa-dev
}

# Function to build and start production environment
start_prod() {
    echo -e "${GREEN}🚀 Starting production environment...${NC}"
    docker-compose -f docker-compose.prod.yml up --build sopa-frontend
}

# Function to build and start production with nginx
start_nginx() {
    echo -e "${GREEN}🚀 Starting production environment with Nginx...${NC}"
    docker-compose -f docker-compose.prod.yml --profile with-nginx up --build
}

# Function to show help
show_help() {
    echo "Usage: $0 [dev|prod|nginx|help]"
    echo ""
    echo "Options:"
    echo "  dev     Start development environment (default)"
    echo "  prod    Start production environment"
    echo "  nginx   Start production environment with Nginx reverse proxy"
    echo "  help    Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev      # Start development server"
    echo "  $0 prod     # Start production server"
    echo "  $0 nginx    # Start production with Nginx"
}

# Main execution
case $MODE in
    "dev")
        check_docker
        cleanup
        start_dev
        ;;
    "prod")
        check_docker
        cleanup
        start_prod
        ;;
    "nginx")
        check_docker
        cleanup
        start_nginx
        ;;
    "help")
        show_help
        ;;
    *)
        echo -e "${RED}❌ Invalid mode: $MODE${NC}"
        show_help
        exit 1
        ;;
esac
