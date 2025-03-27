#!/bin/bash

# Master Migration Runner

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
npm install axios commander dotenv gray-matter

# Set up environment variables
status "Setting up environment variables..."
read -p "Wiki.js admin email (default: admin@example.com): " WIKI_ADMIN_USER
WIKI_ADMIN_USER=${WIKI_ADMIN_USER:-admin@example.com}
export WIKI_ADMIN_USER

read -p "Wiki.js admin password (default: wikijsrocks): " WIKI_ADMIN_PASSWORD
WIKI_ADMIN_PASSWORD=${WIKI_ADMIN_PASSWORD:-wikijsrocks}
export WIKI_ADMIN_PASSWORD

# Run the migration script
status "Starting master migration..."
node master-migration.js --source=./sample-content --wikiUrl=http://localhost:3200 --apiUrl=http://localhost:3100 --email=$WIKI_ADMIN_USER --password=$WIKI_ADMIN_PASSWORD

if [ $? -eq 0 ]; then
  status "Migration completed successfully!"
  
  echo ""
  echo "=========================================================="
  echo "Next Steps:"
  echo "=========================================================="
  echo ""
  echo "1. Access your Wiki.js instance at http://localhost:3200"
  echo "2. Access the HIPAA dashboard at http://localhost:3300"
  echo "3. Use the LLM pipeline at http://localhost:3400"
  echo ""
  echo "The hybrid wiki architecture is now set up and populated with content."
  echo "=========================================================="
else
  error "Migration encountered errors. Check the logs for details."
fi