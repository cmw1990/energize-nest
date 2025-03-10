#!/bin/bash

echo "Starting micro-frontends using Vite..."

# Start care-connector
cd micro-frontends/care-connector
npx vite --port 4008 &
CARE_PID=$!

# Start mission-fresh
cd ../mission-fresh
npx vite --port 4009 &
MISSION_PID=$!

echo "Care Connector running on http://localhost:4008"
echo "Mission Fresh running on http://localhost:4009"
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait $CARE_PID $MISSION_PID 