#!/bin/bash

# Hybrid Wiki Architecture Restart Script
#
# This script restarts the entire hybrid wiki architecture with the updated configuration.

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

# Install dependencies
status "Installing dependencies for migration scripts..."
cd "$SCRIPT_DIR/migration-scripts"
npm install

# Stop any running containers
status "Stopping existing containers..."
cd "$SCRIPT_DIR/wiki-js"
docker-compose down

# Start the services
status "Starting services with Docker Compose..."
docker-compose up -d

# Wait for services to be ready
status "Waiting for services to initialize (this may take a minute)..."
sleep 30

# Check if Wiki.js is running
status "Checking Wiki.js status..."
if ! curl -s http://localhost:3200/healthz &> /dev/null; then
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

# Check if HIPAA extensions are running
status "Checking HIPAA extensions status..."
if ! curl -s http://localhost:3300/health &> /dev/null; then
  warning "HIPAA extensions may not be running yet. Please check docker-compose logs for details."
  docker-compose logs hipaa-extensions
else
  status "HIPAA extensions are running at http://localhost:3300"
fi

# Populate sample content
status "Migrating sample content to Wiki.js..."
cd "$SCRIPT_DIR/migration-scripts"
node direct-content-migration.js --source=./sample-content --dbHost=localhost --dbPort=5432 --dbUser=wikijs --dbPass=wikijs_password --dbName=wiki

# Populate HIPAA sample data
status "Populating HIPAA sample data..."
node populate-hipaa-data.js --dbHost=localhost --dbPort=5432 --dbUser=wikijs --dbPass=wikijs_password --dbName=wiki

# Refresh Wiki.js cache
status "Refreshing Wiki.js cache..."
cd "$SCRIPT_DIR/wiki-js"
docker-compose exec wiki node wiki reset-cache

# Instructions for completing setup
echo ""
echo "=========================================================="
echo "Restart Complete!"
echo "=========================================================="
echo ""
echo "Access points:"
echo ""
echo "1. Wiki.js: http://localhost:3200"
echo "   - Login with default credentials: admin@example.com / wikijsrocks"
echo ""
echo "2. API Layer: http://localhost:3100"
echo "   - API documentation available at $SCRIPT_DIR/api-docs.md"
echo ""
echo "3. HIPAA Dashboard: http://localhost:3300"
echo "   - HIPAA sample data has been populated"
echo ""
# LLM Pipeline commented out
# echo "4. LLM Pipeline: http://localhost:3400"
# echo "   - To use this feature, update the .env file with valid API keys"
echo ""
echo "For more information, see the documentation in each service directory."
echo "=========================================================="