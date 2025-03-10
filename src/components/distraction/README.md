# Distraction Blocker

The Distraction Blocker is a powerful tool to help users stay focused by blocking distracting websites and applications. It includes features like scheduling, smart rules, and productivity metrics tracking.

## Database Setup

To use the Distraction Blocker, you need to set up the required tables in your Supabase database:

1. Navigate to the Supabase SQL Editor
2. Copy the contents of `src/integrations/supabase/setup-rpc.sql`
3. Execute the SQL script in your Supabase project
4. This will create the necessary tables with the version8 field as required in the SSOT

## Database Tables

The feature requires three main tables:

1. **distraction_blocking**: Stores website and app blocking settings
   - Each record includes user_id, block_type, target URL/app, active status, and scheduling
   - Includes version8 field as required by SSOT

2. **productivity_metrics**: Tracks daily productivity statistics
   - Stores focus duration, number of distractions blocked, productivity score
   - Daily records per user with version8 field

3. **distraction_block_logs**: Logs each blocking event
   - Records when a website or app was blocked
   - Useful for analytics and reporting
   - Includes version8 field as per SSOT requirements

## RPC Functions

The system uses the following custom RPC functions:

- `execute_sql`: Allows secure execution of SQL from the frontend (table creation only)
- `create_blocking_tables_if_not_exist`: Handles creating all required tables 
- `check_distraction_tables`: Checks if the required tables exist

## Frontend Components

- `WebsiteBlocker`: UI for blocking distracting websites
- `AppBlocker`: UI for blocking mobile applications
- `SmartBlockingRules`: Pattern-based blocking rules
- `BlockingSchedule`: Time-based scheduling for blocking
- `BlockingStats`: Dashboard for viewing productivity statistics

## Troubleshooting

If you encounter database connection issues:

1. Use the `DatabaseTest` component to test your connection
2. Check if the tables have been created properly
3. Ensure your Supabase credentials are correctly set in the environment variables
4. Verify that the user has an active session

## SSOT Compliance

This implementation follows the SSOT guidelines by:

1. Using the required version8 field in all tables
2. Following the `/rest/v1/` prefix for all API calls
3. Using `@supabase/mcp-server-postgrest` for MCP
4. Storing user-specific data with proper row-level security policies 