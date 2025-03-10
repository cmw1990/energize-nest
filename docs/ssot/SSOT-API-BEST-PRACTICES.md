# API Access Best Practices

## Overview

This document establishes the best practices for accessing data from Supabase in the Well-Charged application. Following these guidelines will ensure consistent, performant, and secure data access across all components.

## Key Guidelines

### 1. Choose One Consistent Approach

When building components that access Supabase data, choose ONE of these approaches and be consistent throughout the component:

- **Direct REST API calls** - Best for simple CRUD operations
- **RPC Functions** - Best for complex operations with security considerations
- **Never mix the two within the same component**

### 2. When to Use Direct REST API

Use direct REST API calls when:

- You're performing simple CRUD operations on a single table
- No complex joins or filters are needed
- Row Level Security (RLS) policies are straightforward
- Performance is not a critical concern

Example of good REST API usage:

```typescript
// Good REST API usage
const { data, error } = await fetch(
  `${SUPABASE_URL}/rest/v1/simple_table?id=eq.${id}`,
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
      'apikey': SUPABASE_KEY
    }
  }
);
```

### 3. When to Use RPC Functions

Use RPC functions (with SECURITY DEFINER) when:

- Operations involve multiple tables or complex joins
- Security logic is complex
- You need to perform multiple database operations in one transaction
- You need to bypass RLS for specific operations
- Potential for infinite recursion with RLS policies exists

Example of good RPC usage:

```typescript
// Good RPC function usage
const { data, error } = await fetch(
  `${SUPABASE_URL}/rest/v1/rpc/get_complex_data`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
      'apikey': SUPABASE_KEY
    },
    body: JSON.stringify({ param1: value1, param2: value2 })
  }
);
```

### 4. Performance Optimization

For better performance:

- Create proper indexes on frequently queried columns
- Use `LIMIT` in SQL EXISTS clauses
- Add table aliases in SQL to avoid ambiguous column references
- Use parallel data fetching with Promise.all() for multiple RPC calls
- Implement proper error handling and timeouts

### 5. Common Pitfalls to Avoid

- **Mixing approaches**: Don't mix direct REST API and RPC calls in the same component
- **Ambiguous columns**: Always qualify column names in SQL with table aliases
- **Missing indexes**: Ensure frequently filtered columns have indexes
- **Inefficient security checks**: Use EXISTS with LIMIT 1 for security checks
- **Exceptions vs. silent fails**: For RPC functions, consider returning empty results instead of exceptions for better UX
- **No timeout handling**: Always implement timeouts to prevent infinite loading states

### 6. SQL Function Templates

When creating SQL functions, use these templates:

#### Simple RPC Function Template:

```sql
CREATE OR REPLACE FUNCTION function_name(param_name PARAM_TYPE)
RETURNS TABLE (
  column1 TYPE1,
  column2 TYPE2
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Security check
  IF NOT EXISTS (
    SELECT 1 FROM some_table
    WHERE condition = true
    LIMIT 1
  ) THEN
    RETURN; -- Silent fail, return empty result
  END IF;
  
  RETURN QUERY
  SELECT 
    t.column1,
    t.column2
  FROM some_table t
  WHERE t.condition = param_name;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION function_name(PARAM_TYPE) TO authenticated;
```

## Implementation Standards

1. All new components must document which approach they use in the component header comments
2. Use consistent API calling patterns across each component
3. For complex data dependencies (like care groups), always prefer RPC functions 
4. Create indexes for all columns used in WHERE clauses
5. Always implement timeouts for API calls in React components
6. Use the useCallback pattern for API calling functions in React

By following these guidelines, we ensure that all components in the Well-Charged application access data in a consistent, secure, and performant manner. 