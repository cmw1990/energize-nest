# Supabase MCP Integration

## Overview
Well-Charged uses two primary methods for database interactions:
1. Direct PostgreSQL connection for schema management
2. Supabase's PostgREST MCP server for application data access

## Configuration

### 1. Direct PostgreSQL Connection
For schema management (tables, policies, etc.):
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

### 2. MCP Server Setup
For application data access:
```json
{
  "mcpServers": {
    "todos": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-postgrest",
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

Location: `~/.codeium/windsurf/mcp_config.json`

### Important Notes
1. Use Direct PostgreSQL for schema management
2. Use PostgREST MCP for application data access
3. All MCP queries MUST use the `/rest/v1/` prefix
4. Follow PostgREST query patterns for MCP

## Usage Patterns

### Schema Management (Direct PostgreSQL)
```sql
-- Create table
CREATE TABLE example8 (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  data TEXT
);

-- Add RLS
ALTER TABLE example8 ENABLE ROW LEVEL SECURITY;
CREATE POLICY example8_policy ON example8 USING (true);
```

### API Path Structure (MCP)
All MCP requests must use the `/rest/v1/` prefix:
```typescript
// Correct path format
/rest/v1/[table_name]

// Example
/rest/v1/test_connection
```

### Basic Operations (MCP)

1. Select Data:
```typescript
GET /rest/v1/table_name
```

2. Insert Data:
```typescript
POST /rest/v1/table_name
```

3. Update Data:
```typescript
PATCH /rest/v1/table_name
```

4. Delete Data:
```typescript
DELETE /rest/v1/table_name
```

## Best Practices
1. Use Direct PostgreSQL for:
   - Creating/modifying tables
   - Managing RLS policies
   - Complex schema changes

2. Use MCP for:
   - Data queries
   - Data mutations
   - AI operations

3. Always follow:
   - Table naming convention (append "8")
   - RLS policy setup
   - Proper authentication

## Query Capabilities and Limitations

### Supported Operations
1. Basic CRUD operations:
   - SELECT with filters
   - INSERT with single or multiple rows
   - UPDATE with conditions
   - DELETE with conditions

2. Query Filters:
   - Equality (eq)
   - Like patterns
   - Greater/Less than
   - Limit and offset

### Limitations
1. Complex Joins:
   - Direct SQL JOINs are not supported
   - Must use foreign key relationships defined in the schema
   - Use separate queries and combine results in application code if needed

2. Aggregations:
   - Complex aggregations require custom RPC functions
   - Basic aggregations should be implemented as database functions
   - Example error: "Could not find the function public.test_connection_count_by_date"

3. Best Practices:
   - Keep queries simple and focused
   - Use RPC functions for complex operations
   - Implement common aggregations as database functions
   - Handle data transformations in application code when needed

## Testing

### Test Queries
1. Basic Select:
```sql
SELECT * FROM test_connection;
```

2. Filtered Select:
```sql
SELECT * FROM test_connection WHERE message LIKE '%test%';
```

3. Insert:
```sql
INSERT INTO test_connection (message) VALUES ('test message');
```

4. Update:
```sql
UPDATE test_connection SET message = 'updated message' WHERE id = 'uuid';
```

### Available Tables
- `test_connection`: Test table for verifying connectivity
- `energy_metrics`: Main table for energy data
- Additional tables will be documented as they are created

## Error Handling

1. Invalid Path:
```json
{"error": "requested path is invalid"}
```
Solution: Ensure path includes `/rest/v1/` prefix

2. Table Not Found:
```json
{"code": "42P01", "message": "relation \"public.table\" does not exist"}
```
Solution: Verify table name and schema

3. Permission Error:
```json
{"code": "42501", "message": "permission denied"}
```
Solution: Check RLS policies and user permissions

## Related Documentation
- [SUPABASE.md](./SUPABASE.md) - Main Supabase configuration
- [API.md](./API.md) - General API documentation
- [SECURITY.md](./SECURITY.md) - Security guidelines
