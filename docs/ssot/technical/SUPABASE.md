# Supabase Integration Guide

## Overview
Well-Charged uses Supabase as its primary cloud database and backend service provider. This document outlines the configuration, connection methods, and best practices for working with our Supabase instance.

## Project Configuration
- Project Reference: zoubqdwxemivxrjruvam
- Project URL: https://zoubqdwxemivxrjruvam.supabase.co
- REST API URL: https://zoubqdwxemivxrjruvam.supabase.co/rest/v1

## Connection Methods

### 1. Direct PostgreSQL Connection (For Schema Management)
For database schema management (CREATE TABLE, ALTER TABLE, etc.), use direct PostgreSQL connection:

```bash
# Connection Details
Host: aws-0-us-west-1.pooler.supabase.com
Port: 5432
Database: postgres
User: postgres.zoubqdwxemivxrjruvam
Password: Superstrongpasswordfor5527@@@

# Example Usage
PGPASSWORD="password" psql -h host -p port -d postgres -U user -c "SQL_COMMAND"
```

This method is reliable for:
- Creating and modifying tables
- Managing RLS policies
- Database schema changes
- Complex SQL operations

### 2. PostgREST MCP Connection
For application data access and AI operations, use the PostgREST MCP server:

```json
{
  "mcpServers": {
    "todos": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-postgrest",  // ONLY use this package
        "--apiUrl",
        "https://zoubqdwxemivxrjruvam.supabase.co",
        "--apiKey",
        "[ANON_KEY]",
        "--schema",
        "public"
      ]
    }
  }
}
```

### 3. Direct API Access
For programmatic access, use the following endpoints and headers:

```typescript
const SUPABASE_URL = 'https://zoubqdwxemivxrjruvam.supabase.co'
const SUPABASE_ANON_KEY = '[ANON_KEY]'  // Use for frontend operations
const SUPABASE_SERVICE_ROLE = '[SERVICE_ROLE_KEY]'  // Use for admin operations
```

## Authentication Keys
1. Anonymous Key (Public):
   - Used in frontend code
   - Limited by RLS policies
   - Store in frontend .env file

2. Service Role Key (Admin):
   - Used for admin operations
   - Bypasses RLS
   - Never expose in frontend code
   - Store in backend .env file

3. Access Token (Management):
   - Used for project management
   - Keep secure, never expose

## Database Operations

### Creating/Modifying Tables
Use the Direct PostgreSQL Connection for schema changes:

```bash
PGPASSWORD="password" psql -h host -p port -d postgres -U user -c "SQL_COMMAND"
```

### Edge Functions Deployment
Deploy using clean paths without special characters:

```bash
cd ~/temp_deploy  # Use clean path
mkdir -p supabase/functions/[function-name]
# Copy function files
supabase init
SUPABASE_ACCESS_TOKEN=[ACCESS_TOKEN] \
supabase functions deploy [function-name] --project-ref zoubqdwxemivxrjruvam
```

## Security Guidelines

### Row Level Security (RLS)
- Always implement RLS policies for new tables
- Test policies with both authenticated and anonymous users
- Example RLS policy:
  ```sql
  CREATE POLICY "Users can view own data" ON public.table_name
    FOR SELECT
    USING (auth.uid() = user_id);
  ```

### Authentication Flow
1. Frontend authentication uses anonymous key
2. Backend operations use service role key
3. Never expose service role key in frontend code
4. Always validate user permissions

## Testing

### Test Account
- Email: superwellcharged@gmail.com
- Use for development and testing
- Keep test data isolated

### Testing Checklist
1. Database Operations:
   - Verify CRUD operations
   - Test RLS policies
   - Check data integrity

2. Edge Functions:
   - Test with authentication
   - Verify CORS headers
   - Check error handling

## Common Issues and Solutions

### Deployment Issues
- Use clean paths without special characters
- Verify access token permissions
- Check function dependencies

### Database Issues
- Use Direct PostgreSQL Connection for schema changes
- Verify SQL query syntax
- Check RLS policies

### Authentication Issues
- Verify correct key usage
- Check token expiration
- Validate user permissions

## Related Documentation
- [API Documentation](./API.md)
- [Security Guidelines](./SECURITY.md)
- [Edge Functions Guide](./EDGE_FUNCTIONS.md)
