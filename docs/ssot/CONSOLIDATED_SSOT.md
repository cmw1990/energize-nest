# Well-Charged: Consolidated Single Source of Truth (SSOT)

## Table of Contents
1. [Project Overview](#project-overview)
2. [Platform Strategy](#platform-strategy)
3. [Architecture](#architecture)
4. [Features](#features)
5. [Technical Implementation](#technical-implementation)
   - [Supabase Integration](#supabase-integration)
   - [Authentication](#authentication)
   - [API Structure](#api-structure)
6. [Development Guidelines](#development-guidelines)
7. [Routing & Navigation](#routing--navigation)
8. [Testing & Demo](#testing--demo)
9. [Security](#security)

---

## Project Overview

### Core Purpose
The Well-Charged is a revolutionary all-in-one wellness platform that transforms how people manage their energy and performance. Unlike traditional single-focus apps, it provides a comprehensive ecosystem for optimizing all aspects of human energy - physical, mental, emotional, and social.

### Platform Philosophy
Built on three core pillars:
1. **Holistic Integration**: Every aspect of energy is interconnected
2. **Scientific Approach**: Evidence-based methodologies and tracking
3. **Personalized Optimization**: AI-driven insights and recommendations

### Core Mission
Well-Charged is an all-in-one holistic energy and wellness platform designed to be the single, comprehensive solution for managing personal energy, health, and wellbeing. It eliminates the need for multiple apps and subscriptions by providing an integrated ecosystem of wellness tools.

### Key Differentiators
- **Holistic Integration**: All wellness aspects are interconnected, showing how each component affects overall energy levels
- **Unified Dashboard**: Single source of truth for all wellness metrics and activities
- **Cross-Category Analysis**: AI-powered insights showing relationships between different wellness aspects
- **Comprehensive Coverage**: Complete suite of tools covering all aspects of energy management and wellness

---

## Platform Strategy

### Platforms
- `web/*` - All web pages (marketing, docs, public tools)
- `webapp/*` - Web application features
- `mobileapp/*` - Mobile application features
- `pcapp/*` - Desktop application features
- `ext/*` - Chrome extension features

### Platform Features

#### Web (`web/*`)
- Marketing pages
- Documentation
- Public tools
- Blog posts
- SEO optimized

#### WebApp (`webapp/*`)
- Holistic Energy Dashboard
- Comprehensive Wellness Tools
- Integrated Analytics
- Cross-Category Insights
- Real-time Energy Monitoring
- Personalized Recommendations
- Dashboard
- Core features
- User settings
- Data management

#### MobileApp (`mobileapp/*`)
- Mobile dashboard
- Native features
- Offline support
- Touch optimized

#### PCApp (`pcapp/*`)
- Desktop interface
- System integration
- Native features
- Local storage

#### Extension (`ext/*`)
- Browser popup
- Quick actions
- Background tasks
- Content scripts

### When to Use Each Platform

#### Web
- Public-facing content
- Marketing materials
- Documentation
- Blog posts

#### WebApp
- Core application features
- User dashboard
- Data management
- Settings

#### MobileApp
- On-the-go access
- Native device features
- Offline capabilities
- Touch interactions

#### PCApp
- Desktop integration
- System features
- Local processing
- File system access

#### Extension
- Quick access
- Browser integration
- Content enhancement
- Background tasks

---

## Architecture

### Code Organization
```typescript
src/
├── pages/          // Platform-specific pages
├── layouts/        // Platform-specific layouts
└── components/     // Platform-specific components
    ├── web/
    ├── webapp/
    ├── mobileapp/
    ├── pcapp/
    └── ext/
```

### Route Configuration
```typescript
interface RouteConfig {
  path: string;
  platform: 'web' | 'webapp' | 'mobileapp' | 'pcapp' | 'ext';
  component: Component;
  layout: Layout;
}
```

### Technical Stack
- **Frontend**: React 18.3.1, TypeScript, Vite
- **UI**: ShadCN/UI, Tailwind CSS
- **Backend**: Supabase
- **State Management**: React Query
- **Authentication**: Supabase Auth
- **Analytics**: Custom analytics engine

---

## Features

### 1. Energy Management Suite
- **Focus Enhancement**
  - Pomodoro timer with analytics
  - Distraction blocking
  - Deep work tracking
  - Productivity analytics
  - Focus music integration

- **Physical Energy**
  - Exercise tracking
  - Nutrition planning
  - Sleep optimization
  - Recovery monitoring
  - Movement reminders

- **Mental Energy**
  - Mood tracking
  - Stress management
  - Meditation guides
  - Mental health monitoring
  - CBT exercises

### 2. Recovery & Optimization
- **Sleep Management**
  - Sleep quality tracking
  - Circadian rhythm optimization
  - Smart alarm recommendations
  - Recovery metrics
  - Sleep environment analysis

- **Energy Planning**
  - Daily energy forecasting
  - Peak performance windows
  - Energy-based scheduling
  - Recovery periods
  - Optimization suggestions

### 3. Professional Integration
- **Expert Access**
  - Mental health professionals
  - Nutrition experts
  - Sleep specialists
  - Performance coaches
  - Wellness consultants

### 4. Analytics & Insights
- **Comprehensive Dashboard**
  - Cross-domain analytics
  - Trend analysis
  - Performance metrics
  - AI-powered recommendations
  - Progress tracking

---

## Technical Implementation

### Supabase Integration

#### Project Configuration
- Project Reference: zoubqdwxemivxrjruvam
- Project URL: https://zoubqdwxemivxrjruvam.supabase.co
- REST API URL: https://zoubqdwxemivxrjruvam.supabase.co/rest/v1

#### Connection Methods

##### 1. Direct PostgreSQL Connection (For Schema Management)
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

##### 2. PostgREST MCP Connection (BATTLE-TESTED AUTO-UPDATING METHOD)
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

Location: `~/.codeium/windsurf/mcp_config.json`

**IMPORTANT NOTES:**
1. ONLY use `@supabase/mcp-server-postgrest` for MCP
2. OLD PostgreSQL MCP is NOT supported
3. ALL queries MUST use `/rest/v1/` prefix

##### 3. Direct API Access
For programmatic access, use the following endpoints and headers:

```typescript
const SUPABASE_URL = 'https://zoubqdwxemivxrjruvam.supabase.co'
const SUPABASE_ANON_KEY = '[ANON_KEY]'  // Use for frontend operations
const SUPABASE_SERVICE_ROLE = '[SERVICE_ROLE_KEY]'  // Use for admin operations
```

#### API Path Structure (MCP)
All MCP requests must use the `/rest/v1/` prefix:
```typescript
// Correct path format
/rest/v1/[table_name]

// Example
/rest/v1/test_connection
```

#### Basic Operations (MCP)

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

#### Best Practices
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

#### Common Issues and Solutions

##### Deployment Issues
- Use clean paths without special characters
- Verify access token permissions
- Check function dependencies

##### Database Issues
- Use Direct PostgreSQL Connection for schema changes
- Verify SQL query syntax
- Check RLS policies

##### Authentication Issues
- Verify correct key usage
- Check token expiration
- Validate user permissions

### Authentication

#### Authentication Keys
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

#### Authentication Flow
1. Frontend authentication uses anonymous key
2. Backend operations use service role key
3. Never expose service role key in frontend code
4. Always validate user permissions

### API Structure

#### Security Guidelines

##### Row Level Security (RLS)
- Always implement RLS policies for new tables
- Test policies with both authenticated and anonymous users
- Example RLS policy:
  ```sql
  CREATE POLICY "Users can view own data" ON public.table_name
    FOR SELECT
    USING (auth.uid() = user_id);
  ```

---

## Development Guidelines

### General Rules
- Always use platform prefixes
- Keep platform-specific code separate
- Follow naming conventions
- Document all platform differences

### Best Practices
- Mobile-first design for web
- Native patterns for apps
- Consistent navigation
- Cross-platform testing

### Platform Detection
```typescript
const detectPlatform = () => {
  if (window.chrome?.extension) return 'ext';
  if (window.electron) return 'pcapp';
  if (window.capacitor) return 'mobileapp';
  if (isWebApp()) return 'webapp';
  return 'web';
};
```

### Testing Requirements

#### Per Platform
- Unit tests
- Integration tests
- UI/UX tests
- Performance tests

#### Cross-Platform
- Feature parity
- Data consistency
- Navigation flow
- Error handling

### Performance Targets

#### Loading Times
- Initial load: < 2s
- Route changes: < 500ms
- API responses: < 200ms
- Animation: 60fps

#### Resource Usage
- Bundle size limits
- Memory optimization
- Battery efficiency
- Network optimization

---

## Routing & Navigation

### Routing Strategy
- Each platform has its own route prefix
- Clear separation between platforms
- No route overlapping between platforms
- Platform-specific layouts and components

### Navigation Patterns
- Use platform-specific patterns
- Maintain consistent back behavior
- Follow native navigation patterns for each platform
- Ensure cross-platform navigation consistency

---

## Testing & Demo

### Test Environments
- Parallel test environments are available for all platforms
- WebApp test environment is at `/webapp2/*` 
- Use test environments to develop and test features without affecting production
- All new features must be developed and validated in test environments first
- Refer to [Test Environment documentation](./development/TEST_ENVIRONMENT.md) for detailed guidelines

### Demo User Account
- Email: hertzofhopes@gmail.com
- Password: J4913836j
- Use for all demos and presentations
- All demo data should be real data stored in this user's real data tables
- NEVER use frontend mock data in any part of the application

### Testing Checklist
1. Database Operations:
   - Verify CRUD operations
   - Test RLS policies
   - Check data integrity

2. Edge Functions:
   - Test with authentication
   - Verify CORS headers
   - Check error handling

---

## Security

### Security Standards

#### Authentication
- Platform-specific auth flows
- Secure storage
- Token management
- Session handling

#### Data Protection
- Encryption standards
- Storage security
- API security
- Privacy compliance

### Security Guidelines
- Never expose service role keys in frontend code
- Always implement RLS policies for all tables
- Test security with both authenticated and anonymous users
- Follow secure coding practices
- Regularly audit security configurations

#### Authentication
See the detailed [Authentication documentation](./AUTHENTICATION.md) for complete information on authentication flows, user accounts, and security procedures.

1. **Authentication Flow**
   - User signs up or logs in via auth page
   - JWT-based authentication through Supabase
   - Session management and token refresh
   - Database access requires active session

2. **Account Types**
   - Regular user accounts
   - Development test accounts
   - Demo accounts ([details in Authentication docs](./AUTHENTICATION.md))

3. **Security Measures**
   - Secure password requirements
   - Email verification
   - Row Level Security (RLS)
   - Session invalidation

---

## Documentation Guidelines

### 1. Single Source of Truth
- This document is the ONLY source of truth for the project
- All documentation must be referenced from here
- No duplicate or conflicting information allowed

### 2. Documentation Updates
- Keep all documents up to date
- Update related documents together
- Maintain changelogs
- Follow consistent formatting

### 3. Cross-References
- Use relative links between documents
- Keep references up to date
- Document relationships between files

---

## Validation Checklist

Before making changes:
- [ ] Check existing documentation
- [ ] Verify no conflicts
- [ ] Understand dependencies
- [ ] Follow SSOT structure
- [ ] Update all affected sections
- [ ] Maintain cross-references
- [ ] Update changelogs 