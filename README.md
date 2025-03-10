# Well-Charged Documentation

## Single Source of Truth (SSOT)

All project documentation is maintained in the `/docs/ssot` directory. This is our ONLY source of documentation.

For all documentation needs, please refer to:
- [Consolidated SSOT Documentation](/docs/ssot/CONSOLIDATED_SSOT.md)

## Important Notes

1. Documentation Location:
   - ALL documentation is in `/docs/ssot`
   - NO documentation exists elsewhere
   - NO exceptions to this rule

2. Database Integration:
   - ONLY use `@supabase/mcp-server-postgrest` for MCP
   - OLD PostgreSQL MCP is NOT supported
   - ALL queries MUST use `/rest/v1/` prefix

3. Getting Started:
   - Start with [Consolidated SSOT Documentation](/docs/ssot/CONSOLIDATED_SSOT.md)
   - Follow the documentation structure
   - Maintain documentation standards

4. Account Information:
   - For demo accounts and credentials, refer to the SSOT documentation
   - Never store sensitive information outside of the SSOT
