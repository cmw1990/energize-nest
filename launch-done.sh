#!/bin/bash

echo "Starting micro-frontends on ports 4008 and 4009..."

# Kill any existing processes on ports 4008 and 4009
lsof -ti:4008 | xargs kill -9 2>/dev/null
lsof -ti:4009 | xargs kill -9 2>/dev/null

# Start care-connector
cd micro-frontends/care-connector
PORT=4008 npx vite &
CARE_PID=$!

# Start mission-fresh 
cd ../mission-fresh
PORT=4009 npx vite &
MISSION_PID=$!

echo "Servers started!"
echo "Care Connector: http://localhost:4008"
echo "Mission Fresh: http://localhost:4009"

# Wait for both processes
wait $CARE_PID $MISSION_PID 