#!/bin/bash

# Automated UI Migration Runner

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

# Install required dependencies
status "Installing required dependencies..."
npm install playwright gray-matter commander dotenv

# Install Playwright browsers
status "Installing Playwright browsers..."
npx playwright install chromium

# Set credentials if not already set
if [ -z "$WIKI_ADMIN_USER" ]; then
  warning "WIKI_ADMIN_USER not set. Using default: admin@example.com"
  export WIKI_ADMIN_USER="admin@example.com"
fi

if [ -z "$WIKI_ADMIN_PASSWORD" ]; then
  warning "WIKI_ADMIN_PASSWORD not set. Using default: wikijsrocks"
  export WIKI_ADMIN_PASSWORD="wikijsrocks"
fi

# Run the migration script
status "Starting automated UI-based migration..."
node automated-ui-migration.js --source=./sample-content --wikiUrl=http://localhost:3200 --username=$WIKI_ADMIN_USER --password=$WIKI_ADMIN_PASSWORD --headless=false

# Run the HIPAA sample data creation
status "Creating sample HIPAA data..."
node sample-data.js --apiUrl=http://localhost:3100 --apiKey=demo_api_key