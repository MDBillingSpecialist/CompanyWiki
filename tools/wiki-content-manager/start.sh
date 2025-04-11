#!/bin/bash
# Start the Wiki Content Management System
# This script installs dependencies if needed and starts the MCP server

# Change to the script directory
cd "$(dirname "$0")"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Make the index.js file executable
chmod +x index.js

# Start the MCP server
echo "Starting Wiki Content Management System..."
node index.js
