#!/bin/bash

# Define colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Care Connector Database Fix Script ===${NC}"
echo "This script will fix the missing care_group_comments table and other potential issues."

# Load environment variables
if [ -f .env ]; then
  source .env
  echo -e "${GREEN}Loaded environment variables from .env${NC}"
else
  echo -e "${RED}Error: .env file not found${NC}"
  exit 1
fi

# Check if required environment variables are set
if [ -z "$POSTGRES_CONNECTION_STRING" ]; then
  echo -e "${RED}Error: POSTGRES_CONNECTION_STRING is not set in .env file${NC}"
  exit 1
fi

# Create a temporary SQL file with DATABASE_URL replaced
SQL_FILE="supabase/migrations/20250501_care_connector_fix.sql"
if [ ! -f "$SQL_FILE" ]; then
  echo -e "${RED}Error: SQL file not found at ${SQL_FILE}${NC}"
  exit 1
fi

echo -e "${YELLOW}Running SQL migration against Supabase database...${NC}"
# Run the SQL file using psql
psql "$POSTGRES_CONNECTION_STRING" -f "$SQL_FILE"

if [ $? -eq 0 ]; then
  echo -e "${GREEN}Database migration completed successfully!${NC}"
  echo -e "${GREEN}The care_group_comments table has been created (if it didn't exist) and all necessary database changes have been applied.${NC}"
else
  echo -e "${RED}Error: Database migration failed${NC}"
  exit 1
fi

echo -e "${YELLOW}=== Next Steps ===${NC}"
echo "1. Start your application and test the care group functionality"
echo "2. Check the GroupDetail page to make sure it loads properly"
echo "3. Verify that you can create posts and comments"

echo -e "\n${GREEN}Done!${NC}" 