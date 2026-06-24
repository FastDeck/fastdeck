#!/bin/bash
set -e

# Define standard colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;36m'
RESET='\033[0m'

echo -e "${BLUE}=== Starting FastDeck gRPC Server Integration Test ===${RESET}"

# Build the server and test client first
echo -e "${BLUE}Building server and test client...${RESET}"
cargo build --manifest-path apps/server/Cargo.toml --bin fastdeck-server --bin test_client

# Remove any existing cache data to start fresh
if [ -f "profiles_cache.json" ]; then
    echo "Cleaning up existing profile cache..."
    rm -f profiles_cache.json
fi

# Run the server in the background
echo -e "${BLUE}Starting gRPC server in background...${RESET}"
cargo run --manifest-path apps/server/Cargo.toml --bin fastdeck-server &
SERVER_PID=$!

# Ensure server is stopped when script exits
cleanup() {
    echo -e "${BLUE}Shutting down gRPC server (PID: $SERVER_PID)...${RESET}"
    kill $SERVER_PID 2>/dev/null || true
    wait $SERVER_PID 2>/dev/null || true
}
trap cleanup EXIT

# Wait a brief moment for the server to bind to port 50065
sleep 2

# Run the test client
echo -e "${BLUE}Running gRPC test client...${RESET}"
if cargo run --manifest-path apps/server/Cargo.toml --bin test_client; then
    echo -e "${GREEN}SUCCESS: All server integration tests passed!${RESET}"
else
    echo -e "${RED}FAILURE: Server integration tests failed.${RESET}"
    exit 1
fi
