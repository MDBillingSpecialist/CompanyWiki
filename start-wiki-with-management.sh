#!/bin/bash
# Start the Company Wiki with Content Management System
# This script starts the wiki and the content management MCP server

# Change to the script directory
cd "$(dirname "$0")"

# Start the wiki content management MCP server in the background
echo "Starting Wiki Content Management System..."
cd tools/wiki-content-manager
./start.sh &
CONTENT_MANAGER_PID=$!

# Wait a moment for the MCP server to initialize
sleep 2

# Start the wiki
echo "Starting Company Wiki..."
cd ../..
npm run dev

# When the wiki is stopped, also stop the content management server
kill $CONTENT_MANAGER_PID
