# Supabase Integration

⚠️ **IMPORTANT ARCHITECTURAL DECISION** ⚠️

This project exclusively uses direct REST API calls to interact with Supabase. The Supabase Client Methods are **NOT** to be used under any circumstances due to reliability issues, including:
- Initialization problems
- Complex state management issues
- Race conditions
- Caching inconsistencies
- Global singleton complications

All database interactions MUST use direct REST API calls to ensure:
- Reliable request/response cycles
- Clear error handling
- No state management complexity
- No initialization issues
- Predictable behavior

This directory contains files related to Supabase integration and database management for the Care Connector app.

## Files

- `care-connector-tables.sql`: SQL script that creates the database schema for the Care Connector app
- `care-connector-types.ts`: TypeScript types specific to the Care Connector app
- `client.ts`: Supabase client configuration
- `db-client.ts`: Database client for Care Connector
- `types.ts`: Generated TypeScript types for the entire database

## Auto-Updating Database Schema and Types

To set up or update the database schema and regenerate TypeScript types, follow these steps:

1. Make sure your environment variables are properly set in the `.env` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   POSTGRES_CONNECTION_STRING=your-postgres-connection-string
   ```

2. Get your PostgreSQL connection string from your Supabase dashboard:
   - Go to your Supabase project
   - Go to Project Settings > Database
   - Find the Connection string (URI) in the Connection pooling section
   - Replace `[YOUR-PASSWORD]` with your database password

3. Run the following command to update the database schema and regenerate types:
   ```
   npm run supabase:update
   ```

   This will:
   - Execute the SQL script to set up or update the database schema
   - Generate TypeScript types based on the updated schema
   - Extract Care Connector specific types

4. Alternatively, you can run these steps separately:
   ```
   npm run supabase:setup        # Update database schema
   npm run supabase:generate-types   # Regenerate TypeScript types
   ```

## Important Notes

- The `SUPABASE_SERVICE_ROLE_KEY` has admin privileges, so be careful with it.
- Ensure that you don't commit the `.env` file with your secrets to version control.
- Before making changes to the database schema, consult with the team to ensure compatibility.
- After updating the schema, make sure to update the TypeScript types.

## Troubleshooting

If you encounter issues:

1. Check that your environment variables are correctly set
2. Ensure you have the necessary permissions in Supabase
3. For PostgreSQL connection issues, make sure your IP is allowed in Supabase's database settings
4. Consult the Supabase documentation for more details on connection issues 