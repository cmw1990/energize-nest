#!/bin/bash

# Start care-connector
cd micro-frontends/care-connector
PORT=4004 npm start &
CARE_PID=$!

# Start mission-fresh
cd ../mission-fresh
PORT=4005 npm start &
MISSION_PID=$!

# Wait for both processes
wait $CARE_PID $MISSION_PID 