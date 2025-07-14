#!/bin/bash

# AI Influencer Manager Portal - Run Script
# This script provides easy commands to run the application in different environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to check if Docker Compose is available
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose and try again."
        exit 1
    fi
}

# Function to check if Podman Compose is available
check_podman_compose() {
    if ! command -v podman-compose &> /dev/null; then
        print_error "Podman Compose is not installed. Please install Podman Compose and try again."
        print_error "Install with: pip install podman-compose"
        exit 1
    fi
}

# Function to show help
show_help() {
    echo "AI Influencer Manager Portal - Run Script"
    echo ""
    echo "Usage: ./run.sh [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev          Start development environment with hot reload"
    echo "  dev-win      Start development environment with Windows paths"
    echo "  dev-podman   Start development environment with Podman Compose"
    echo "  prod         Start production environment"
    echo "  default      Start default environment"
    echo "  stop         Stop all running containers"
    echo "  logs         Show logs from running containers"
    echo "  clean        Stop and remove all containers, networks, and volumes"
    echo "  init-db      Initialize the database"
    echo "  rebuild      Rebuild all containers"
    echo "  help         Show this help message"
    echo ""
    echo "Container Engines:"
    echo "  Docker       Use 'dev', 'dev-win', 'prod' commands"
    echo "  Podman       Use 'dev-podman' command"
    echo ""
    echo "Examples:"
    echo "  ./run.sh dev      # Start development environment"
    echo "  ./run.sh prod     # Start production environment"
    echo "  ./run.sh stop     # Stop all containers"
}

# Function to start development environment
start_dev() {
    print_status "Starting development environment..."
    check_docker
    check_docker_compose
    
    docker-compose -f docker-compose.dev.yml up --build -d
    print_success "Development environment started!"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend:  http://localhost:5000"
    print_status "Use 'docker-compose -f docker-compose.dev.yml logs -f' to view logs"
}

# Function to start development environment (Windows)
start_dev_windows() {
    print_status "Starting development environment (Windows paths)..."
    check_docker
    check_docker_compose
    
    docker-compose -f docker-compose.dev.windows.yml up --build -d
    print_success "Development environment started!"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend:  http://localhost:5000"
    print_status "Use 'docker-compose -f docker-compose.dev.windows.yml logs -f' to view logs"
}

# Function to start development environment (Podman)
start_dev_podman() {
    print_status "Starting development environment with Podman Compose..."
    check_podman_compose
    
    podman-compose -f docker-compose.dev.podman.yml up --build -d
    print_success "Development environment started with Podman!"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend:  http://localhost:5000"
    print_status "Use 'podman-compose -f docker-compose.dev.podman.yml logs -f' to view logs"
}

# Function to start production environment
start_prod() {
    print_status "Starting production environment..."
    check_docker
    check_docker_compose
    
    docker-compose -f docker-compose.prod.yml up --build -d
    print_success "Production environment started!"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend:  http://localhost:5000"
    print_status "Nginx:    http://localhost:80"
    print_status "Use 'docker-compose -f docker-compose.prod.yml logs -f' to view logs"
}

# Function to start default environment
start_default() {
    print_status "Starting default environment..."
    check_docker
    check_docker_compose
    
    docker-compose up --build -d
    print_success "Default environment started!"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend:  http://localhost:5000"
    print_status "Use 'docker-compose logs -f' to view logs"
}

# Function to stop all containers
stop_containers() {
    print_status "Stopping all containers..."
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    docker-compose -f docker-compose.dev.windows.yml down
    docker-compose -f docker-compose.prod.yml down
    podman-compose -f docker-compose.dev.podman.yml down
    print_success "All containers stopped!"
}

# Function to show logs
show_logs() {
    print_status "Showing logs from running containers..."
    docker-compose logs -f
}

# Function to clean everything
clean_all() {
    print_warning "This will stop and remove ALL containers, networks, and volumes!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Cleaning all container resources..."
        docker-compose down -v
        docker-compose -f docker-compose.dev.yml down -v
        docker-compose -f docker-compose.dev.windows.yml down -v
        docker-compose -f docker-compose.prod.yml down -v
        podman-compose -f docker-compose.dev.podman.yml down -v
        docker system prune -f
        podman system prune -f
        print_success "All container resources cleaned!"
    else
        print_status "Clean operation cancelled."
    fi
}

# Function to initialize database
init_database() {
    print_status "Initializing database..."
    check_docker
    check_docker_compose
    
    docker-compose run --rm init-db
    print_success "Database initialized!"
}

# Function to rebuild containers
rebuild_containers() {
    print_status "Rebuilding all containers..."
    check_docker
    check_docker_compose
    
    docker-compose build --no-cache
    docker-compose -f docker-compose.dev.yml build --no-cache
    docker-compose -f docker-compose.dev.windows.yml build --no-cache
    docker-compose -f docker-compose.prod.yml build --no-cache
    podman-compose -f docker-compose.dev.podman.yml build --no-cache
    print_success "All containers rebuilt!"
}

# Main script logic
case "${1:-help}" in
    "dev")
        start_dev
        ;;
    "dev-win")
        start_dev_windows
        ;;
    "dev-podman")
        start_dev_podman
        ;;
    "prod")
        start_prod
        ;;
    "default")
        start_default
        ;;
    "stop")
        stop_containers
        ;;
    "logs")
        show_logs
        ;;
    "clean")
        clean_all
        ;;
    "init-db")
        init_database
        ;;
    "rebuild")
        rebuild_containers
        ;;
    "help"|*)
        show_help
        ;;
esac 