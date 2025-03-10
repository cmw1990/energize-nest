#!/bin/bash

echo "Starting micro-frontends on ports 6001 and 6002..."

# Kill any existing processes on ports 6001 and 6002
lsof -ti:6001 | xargs kill -9 2>/dev/null
lsof -ti:6002 | xargs kill -9 2>/dev/null

# Start care-connector
cd micro-frontends/care-connector
PORT=6001 npx vite &
CARE_PID=$!

# Start mission-fresh
cd ../mission-fresh
PORT=6002 npx vite &
MISSION_PID=$!

echo "Servers started!"
echo "Care Connector: http://localhost:6001"
echo "Mission Fresh: http://localhost:6002"

# Wait for both processes
wait $CARE_PID $MISSION_PID 