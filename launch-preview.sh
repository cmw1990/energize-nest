#!/bin/bash

echo "Starting micro-frontends preview servers..."

# Start care-connector
cd micro-frontends/care-connector
PORT=4008 npm start &
CARE_PID=$!

# Start mission-fresh
cd ../mission-fresh
PORT=4009 npm start &
MISSION_PID=$!

echo "Care Connector preview running on http://localhost:4008"
echo "Mission Fresh preview running on http://localhost:4009"

# Wait for both processes
wait $CARE_PID $MISSION_PID 