#!/bin/bash

# Hybrid Wiki Architecture Setup Script
#
# This script helps set up and initialize the hybrid wiki architecture.

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print status
status() {
  echo -e "${GREEN}==>${NC} $1"
}

# Function to print warnings
warning() {
  echo -e "${YELLOW}Warning:${NC} $1"
}

# Function to print errors
error() {
  echo -e "${RED}Error:${NC} $1"
}

# Current directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Check if Docker is installed
status "Checking Docker installation..."
if ! command -v docker &> /dev/null; then
  error "Docker is not installed. Please install Docker and Docker Compose."
  exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
  error "Docker Compose is not installed. Please install Docker Compose."
  exit 1
fi

# Create necessary directories if they don't exist
status "Ensuring directory structure..."
mkdir -p "$SCRIPT_DIR/api-layer/logs"
mkdir -p "$SCRIPT_DIR/hipaa-extensions/logs"
mkdir -p "$SCRIPT_DIR/llm-pipeline/logs"
mkdir -p "$SCRIPT_DIR/llm-pipeline/content-cache"
mkdir -p "$SCRIPT_DIR/migration-scripts/sample-content"

# Check if .env file exists
status "Checking environment configuration..."
if [ ! -f "$SCRIPT_DIR/wiki-js/.env" ]; then
  if [ -f "$SCRIPT_DIR/wiki-js/.env.example" ]; then
    warning ".env file not found. Creating from example..."
    cp "$SCRIPT_DIR/wiki-js/.env.example" "$SCRIPT_DIR/wiki-js/.env"
    echo "Please update the .env file with your actual credentials before continuing."
    read -p "Press Enter to continue after updating .env..."
  else
    warning "No .env file or .env.example found. Creating basic .env file..."
    cat > "$SCRIPT_DIR/wiki-js/.env" << EOF
# Wiki.js Configuration
DB_PASS=wikijs_password
TZ=America/New_York

# API Integration Layer
WIKI_API_KEY=dev_api_key
JWT_SECRET=dev_jwt_secret

# LLM Pipeline
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
DEFAULT_AI_PROVIDER=openai

# Docker Compose Settings
COMPOSE_PROJECT_NAME=company_wiki
EOF
    echo "Created default .env file. Please update with your actual credentials."
    read -p "Press Enter to continue after updating .env..."
  fi
fi

# Install Node.js dependencies for each service
status "Installing dependencies for all services..."

# Check if we have node and npm
if ! command -v npm &> /dev/null; then
  warning "npm not found. Skipping dependency installation. You'll need to install dependencies manually."
else
  # API Layer
  if [ -f "$SCRIPT_DIR/api-layer/package.json" ]; then
    status "Installing dependencies for API Layer..."
    (cd "$SCRIPT_DIR/api-layer" && npm install)
  fi

  # HIPAA Extensions
  if [ -f "$SCRIPT_DIR/hipaa-extensions/package.json" ]; then
    status "Installing dependencies for HIPAA Extensions..."
    (cd "$SCRIPT_DIR/hipaa-extensions" && npm install)
  fi

  # LLM Pipeline
  if [ -f "$SCRIPT_DIR/llm-pipeline/package.json" ]; then
    status "Installing dependencies for LLM Pipeline..."
    (cd "$SCRIPT_DIR/llm-pipeline" && npm install)
  fi

  # Migration Scripts
  if [ -f "$SCRIPT_DIR/migration-scripts/package.json" ]; then
    status "Installing dependencies for Migration Scripts..."
    (cd "$SCRIPT_DIR/migration-scripts" && npm install)
  fi
fi

# Start the services
status "Starting services with Docker Compose..."
cd "$SCRIPT_DIR/wiki-js"
docker-compose up -d

# Wait for services to be ready
status "Waiting for services to initialize..."
sleep 20

# Check if Wiki.js is running
status "Checking Wiki.js status..."
if ! curl -s http://localhost:3200 &> /dev/null; then
  warning "Wiki.js may not be running yet. Please check docker-compose logs for details."
  docker-compose logs wiki
else
  status "Wiki.js is running at http://localhost:3200"
fi

# Check if API layer is running
status "Checking API layer status..."
if ! curl -s http://localhost:3100/health &> /dev/null; then
  warning "API layer may not be running yet. Please check docker-compose logs for details."
  docker-compose logs api-layer
else
  status "API layer is running at http://localhost:3100"
fi

# Instructions for completing setup
echo ""
echo "=========================================================="
echo "Initial Setup Complete!"
echo "=========================================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Complete Wiki.js initial setup at http://localhost:3200"
echo "2. Create an API key in Wiki.js"
echo "3. Update the .env file with the created API key"
echo "4. Run sample data script:"
echo "   cd ../migration-scripts"
echo "   node sample-data.js --apiUrl=http://localhost:3100 --apiKey=your-api-key"
echo ""
echo "5. Import content from existing wiki:"
echo "   node migrate-content.js --source=/path/to/content --wikiUrl=http://localhost:3200 --apiKey=your-wiki-api-key"
echo ""
echo "6. Access the services at:"
echo "   - Wiki.js: http://localhost:3200"
echo "   - API Layer: http://localhost:3100"
echo "   - HIPAA Extensions: http://localhost:3300"
echo "   - LLM Pipeline: http://localhost:3400"
echo ""
echo "For more information, see the documentation in each service directory."
echo "=========================================================="