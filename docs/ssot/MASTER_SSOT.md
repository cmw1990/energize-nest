# Well-Charged: Master Single Source of Truth (SSOT)

## Table of Contents
1. [Platform Overview](#platform-overview)
2. [Platform Architecture](#platform-architecture)
3. [Routing & Navigation Strategy](#routing--navigation-strategy)
4. [Micro-Frontend Applications](#micro-frontend-applications)
   - [Care Connector](#care-connector)
   - [Mission Fresh](#mission-fresh)
   - [Easier Mood](#easier-mood)
5. [Database Infrastructure](#database-infrastructure)
   - [Supabase Integration](#supabase-integration)
   - [Database Migration](#database-migration)
   - [TypeScript Type Generation](#typescript-type-generation)
6. [Authentication System](#authentication-system)
7. [Development Guidelines](#development-guidelines)
8. [Data Management Guidelines](#data-management-guidelines)
9. [Security Best Practices](#security-best-practices)

---

## Platform Overview

### Core Purpose
Well-Charged is a revolutionary all-in-one wellness platform that transforms how people manage their energy and performance. Unlike traditional single-focus apps, it provides a comprehensive ecosystem for optimizing all aspects of human energy - physical, mental, emotional, and social.

### Platform Philosophy
Built on three core pillars:
1. **Holistic Integration**: Every aspect of energy is interconnected
2. **Scientific Approach**: Evidence-based methodologies and tracking
3. **Personalized Optimization**: AI-driven insights and recommendations

### Key Differentiators
- **Holistic Integration**: All wellness aspects are interconnected, showing how each component affects overall energy levels
- **Unified Dashboard**: Single source of truth for all wellness metrics and activities
- **Cross-Category Analysis**: AI-powered insights showing relationships between different wellness aspects
- **Comprehensive Coverage**: Complete suite of tools covering all aspects of energy management and wellness
- **Microapp Architecture**: Independent yet integrated applications providing specialized functionality

## Platform Architecture

### Platform Categories

Well-Charged is architected as a collection of platforms, each serving specific needs:

1. **Marketing Platform** (`/`)
   - Public-facing content
   - Marketing pages
   - Landing pages
   - Blog posts

2. **Web Platform** (`web/`)
   - Web-specific features
   - Documentation
   - Public tools

3. **Application Platform** (`app/`)
   - Core application features
   - User dashboard
   - Data management
   - Micro-frontend apps (Care Connector, Mission Fresh, Easier Mood)

4. **Mobile Platform** (`mobile/`)
   - Mobile-optimized views
   - Native features (via Capacitor)
   - Touch-optimized interfaces

5. **Desktop Platform** (`desktop/`)
   - Desktop app features
   - System integration
   - Local storage

6. **Extension Platform** (`ext/`)
   - Browser extension features
   - Quick actions
   - Background tracking

### Technology Stack

- **Frontend**: React, TypeScript, TailwindCSS
- **State Management**: React Context, Custom Hooks
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Cross-Platform**: Capacitor for mobile apps
- **API**: Supabase REST API, Custom Edge Functions
- **Developer Experience**: Vite, ESLint, Prettier

## Routing & Navigation Strategy

### Route Structure

The application uses a consistent routing strategy across all platforms:

```
[platform]/[feature]/[subfeature]
```

### Route Examples

- `/` - Home/marketing page
- `/landing/promo-spring-2025` - Marketing landing
- `web/tools/calculator` - Web-specific tool
- `app/dashboard/energy` - Main application dashboard
- `app/care-connector/groups` - Care Connector microapp
- `app/mission-fresh/dashboard` - Mission Fresh microapp
- `app/easier-mood/tracker` - Easier Mood microapp
- `mobile/tracking/sleep` - Mobile-only feature
- `desktop/system/notifications` - Desktop-only feature
- `ext/quick-track/timer` - Extension-only feature

### Route Access Matrix

| Route Pattern | Web | WebApp | Mobile | Desktop | Extension |
|--------------|-----|--------|---------|---------|-----------|
| `/`          | ✅   | ❌      | ❌       | ❌        | ❌         |
| `/landing/*` | ✅   | ❌      | ❌       | ❌        | ❌         |
| `web/*`      | ✅   | ❌      | ❌       | ❌        | ❌         |
| `app/*`      | ✅   | ✅      | ❌       | ✅        | ❌         |
| `mobile/*`   | ❌   | ❌      | ✅       | ❌        | ❌         |
| `desktop/*`  | ❌   | ❌      | ❌       | ✅        | ❌         |
| `ext/*`      | ❌   | ❌      | ❌       | ❌        | ✅         |
| `shared/*`   | ✅   | ✅      | ✅       | ✅        | ✅         |

## Micro-Frontend Applications

Well-Charged incorporates three specialized micro-frontend applications that share the core infrastructure while maintaining independent functionality.

### Care Connector

#### Overview
Care Connector is a comprehensive care management platform that helps users create and join care groups, manage tasks, share health records, and connect with care providers.

#### Key Features
- **Care Groups**: Create and manage care groups for collaborative care
- **Task Management**: Assign and track care-related tasks
- **Health Records**: Share and monitor health data with group members
- **Provider Marketplace**: Find and connect with care providers
- **Activity Tracking**: Monitor care activities within groups

#### Routing Structure
```
app/care-connector/
├── dashboard                # Main dashboard with statistics
├── groups                   # Care group management
│   └── [groupId]            # Specific group details
├── tasks                    # Task management
├── marketplace              # Provider marketplace
│   └── [providerId]         # Provider details
├── health                   # Health monitoring
└── settings                 # User settings
```

#### Database Schema
The app uses the following Supabase tables:
- `care_groups`: Care groups with visibility settings
- `care_group_members`: Group membership with role-based access
- `care_group_invitations`: Invitation system for groups
- `care_tasks`: Task management within groups
- `care_health_records`: Health data with privacy controls
- `care_providers`: Provider profiles and services
- `care_provider_reviews`: Rating and review system
- `care_activity_log`: Activity tracking for groups

#### Security Model
- Row Level Security (RLS) policies for data privacy
- Role-based permissions within care groups:
  1. **Owner**: Full administrative access
  2. **Admin**: Member management and most group settings
  3. **Member**: Basic participation privileges

### Mission Fresh

#### Overview
Mission Fresh is a quit-smoking application that helps users track their progress, manage cravings, and connect with a supportive community.

#### Key Features
- **Dashboard**: Track smoke-free days, cigarettes avoided, and money saved
- **Progress Tracking**: Monitor daily cravings and achievements
- **Community Support**: Share experiences and support other quitters
- **Settings**: Customize quit-smoking preferences and notifications

#### Routing Structure
```
app/mission-fresh/
├── dashboard               # Main dashboard with statistics
├── progress                # Progress tracking
├── community               # Community support
└── settings                # User preferences
```

#### Database Schema
The app uses the following Supabase tables:
- `quit_smoking_stats`: User's overall quit-smoking statistics
- `quit_smoking_progress`: Daily progress tracking
- `quit_smoking_settings`: User preferences and settings
- `community_posts`: Community interaction and support

### Easier Mood

#### Overview
Easier Mood is a mood tracking and emotional wellbeing application that helps users track their emotional states, journal their thoughts, and access resources for mental wellness.

#### Key Features
- **Dashboard**: Monitor mood trends and emotional patterns
- **Mood Tracker**: Log and track daily moods with insights
- **Journal**: Express thoughts through guided journaling
- **Community**: Connect with others in a supportive environment
- **Resources**: Access articles and tools for emotional wellbeing

#### Routing Structure
```
app/easier-mood/
├── dashboard               # Main mood analytics dashboard
├── tracker                 # Mood and emotion tracking
├── journal                 # Journaling and reflection
├── community               # Community support
├── resources               # Educational resources
└── settings                # User preferences
```

#### Database Schema
The app uses the following Supabase tables:
- `mood_entries`: User's mood and emotion tracking records
- `journal_entries`: Personal journal entries and reflections
- `community_posts`: Community interaction and support posts
- `community_comments`: Comments on community posts
- `resource_bookmarks`: Saved educational resources
- `mood_settings`: User preferences for mood tracking

#### Mobile App
Easier Mood is also available as a standalone mobile application built with Capacitor, featuring:
- Offline mood tracking
- Push notifications
- Biometric authentication
- Native sharing capabilities

## Database Infrastructure

### Supabase Integration

Well-Charged uses Supabase as its primary cloud database and backend service provider. 

#### Project Configuration
- **Project Reference**: zoubqdwxemivxrjruvam
- **Project URL**: https://zoubqdwxemivxrjruvam.supabase.co
- **REST API URL**: https://zoubqdwxemivxrjruvam.supabase.co/rest/v1

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
PGPASSWORD="Superstrongpasswordfor5527@@@" psql -h aws-0-us-west-1.pooler.supabase.com -p 5432 -d postgres -U postgres.zoubqdwxemivxrjruvam -f path/to/sql_script.sql
```

##### 2. Application API Access
For application data access, use the Supabase client:

```typescript
const supabaseUrl = 'https://zoubqdwxemivxrjruvam.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvdWJxZHd4ZW1pdnhyanJ1dmFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MjAxOTcsImV4cCI6MjA1Mzk5NjE5N30.tq2ssOiA8CbFUZc6HXWXMEev1dODzKZxzNrpvyzbbXs';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvdWJxZHd4ZW1pdnhyanJ1dmFtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODQyMDE5NywiZXhwIjoyMDUzOTk2MTk3fQ.VMGEmVXub9PA-lQiE4b1XJu-dqjdUq1UpqVnppynYFw';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

#### Authentication Keys
1. **Anonymous Key** (Public):
   - Used in frontend code
   - Limited by RLS policies
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvdWJxZHd4ZW1pdnhyanJ1dmFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MjAxOTcsImV4cCI6MjA1Mzk5NjE5N30.tq2ssOiA8CbFUZc6HXWXMEev1dODzKZxzNrpvyzbbXs`

2. **Service Role Key** (Admin):
   - Used for admin operations
   - Bypasses RLS
   - Never expose in frontend code
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvdWJxZHd4ZW1pdnhyanJ1dmFtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODQyMDE5NywiZXhwIjoyMDUzOTk2MTk3fQ.VMGEmVXub9PA-lQiE4b1XJu-dqjdUq1UpqVnppynYFw`

### Database Migration

To migrate a database schema to Supabase, follow these steps:

#### 1. Create SQL Schema File
Create a SQL file with your schema definition, including tables, RLS policies, and functions.

Example (`care-connector-tables.sql`):
```sql
-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create main table
CREATE TABLE IF NOT EXISTS your_table_name (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE your_table_name ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own data" ON your_table_name
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data" ON your_table_name
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

#### 2. Execute SQL Using Direct PostgreSQL Connection
This is the bulletproof method for schema migration:

```javascript
// Execute using Node.js script
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// PostgreSQL connection
const pool = new Pool({
  connectionString: 'postgresql://postgres.zoubqdwxemivxrjruvam:Superstrongpasswordfor5527@@@aws-0-us-west-1.pooler.supabase.com:5432/postgres'
});

// Read SQL file
const sqlFilePath = path.resolve(__dirname, './schema.sql');
const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

// Split into statements
const statements = sqlContent
  .replace(/--.*$/gm, '') // Remove comments
  .split(';')
  .filter(stmt => stmt.trim().length > 0);

// Execute each statement
async function migrateDatabase() {
  const client = await pool.connect();
  try {
    for (const statement of statements) {
      await client.query(statement);
    }
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    client.release();
  }
}

migrateDatabase();
```

#### 3. Alternative: Using PSQL Command
```bash
PGPASSWORD="Superstrongpasswordfor5527@@@" psql -h aws-0-us-west-1.pooler.supabase.com -p 5432 -d postgres -U postgres.zoubqdwxemivxrjruvam -f schema.sql
```

### TypeScript Type Generation

To generate TypeScript types from your Supabase schema:

#### 1. Create Type Generation Script

```javascript
// generate-types.js
const https = require('https');
const fs = require('fs');
const path = require('path');

// Supabase credentials
const supabaseUrl = 'https://zoubqdwxemivxrjruvam.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvdWJxZHd4ZW1pdnhyanJ1dmFtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODQyMDE5NywiZXhwIjoyMDUzOTk2MTk3fQ.VMGEmVXub9PA-lQiE4b1XJu-dqjdUq1UpqVnppynYFw';

// Function to fetch schema from Supabase
function fetchSchema() {
  return new Promise((resolve, reject) => {
    const url = `${supabaseUrl}/rest/v1/?apikey=${supabaseServiceKey}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    }).on('error', reject);
  });
}

// Function to convert schema to TypeScript
async function generateTypes() {
  const schema = await fetchSchema();
  
  // Generate Database interface
  let typesContent = `export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]
  
export interface Database {
  public: {
    Tables: {
`;

  // Generate table types
  // ... (type generation code)
  
  // Write to file
  fs.writeFileSync('types.ts', typesContent);
  console.log('Types generated successfully');
}

generateTypes();
```

#### 2. Create NPM Scripts

Add to package.json:
```json
"scripts": {
  "supabase:setup": "node scripts/execute-tables.js",
  "supabase:generate-types": "node scripts/generate-types.js",
  "supabase:update": "npm run supabase:setup && npm run supabase:generate-types"
}
```

## Authentication System

Well-Charged uses Supabase Auth for authentication and session management.

### Authentication Flow

1. **Sign Up/Sign In**: User enters email/password or uses OAuth provider
2. **Session Management**: JWT token stored securely
3. **Authorization**: Row Level Security (RLS) policies control data access
4. **Token Refresh**: Automatic token refresh when needed

### Test Accounts

#### Development Test Account
- **Email**: superwellcharged@gmail.com
- **Password**: J4913836j

#### Demo User Account
- **Email**: hertzofhopes@gmail.com
- **Password**: J4913836j

## Development Guidelines

### Environment Setup

1. Clone the repository
2. Create `.env` file with the following values:
```
VITE_SUPABASE_URL=https://zoubqdwxemivxrjruvam.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvdWJxZHd4ZW1pdnhyanJ1dmFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MjAxOTcsImV4cCI6MjA1Mzk5NjE5N30.tq2ssOiA8CbFUZc6HXWXMEev1dODzKZxzNrpvyzbbXs
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvdWJxZHd4ZW1pdnhyanJ1dmFtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODQyMDE5NywiZXhwIjoyMDUzOTk2MTk3fQ.VMGEmVXub9PA-lQiE4b1XJu-dqjdUq1UpqVnppynYFw
POSTGRES_CONNECTION_STRING=postgresql://postgres.zoubqdwxemivxrjruvam:Superstrongpasswordfor5527@@@aws-0-us-west-1.pooler.supabase.com:5432/postgres
```

3. Install dependencies: `npm install`
4. Start development server: `npm run dev`

### Preview Servers

- Main application: http://localhost:8000
- Care Connector: http://localhost:8001
- Mission Fresh: http://localhost:8002
- Easier Mood: http://localhost:8003

## Data Management Guidelines

### Core Data Principles

1. **No Frontend Mock Data**: All data displayed in the application must come from Supabase tables. Hardcoded mock data in frontend components is strictly prohibited.
   - ❌ DO NOT create static arrays of mock data objects in components
   - ❌ DO NOT fallback to mock data when API calls fail
   - ✅ DO implement proper database tables and seed them with initial data
   - ✅ DO handle loading states and errors appropriately

2. **Data Initialization**: All required tables must be created through proper migration scripts:
   - Use `supabase:setup` script to create required tables
   - Seed initial data through SQL scripts, not frontend code
   - Document any reference data requirements in the appropriate microapp's README

3. **Error Handling**: When database operations fail:
   - Display appropriate error messages to the user
   - Log detailed errors to the console for debugging
   - Implement graceful UI fallbacks (empty states), not mock data
   - Provide clear guidance on how to resolve common errors

4. **Empty States**: When no data exists:
   - Design empty state UI components that guide users to create data
   - Provide clear CTAs for initial data creation
   - Never pre-populate with fake data to make the UI look fuller

5. **Testing**: For testing purposes:
   - Use a dedicated test database environment
   - Create test data through proper seed scripts
   - Never hardcode test data in components or tests

### Data Access Patterns

1. **Database Client**: Always use the singleton dbClient instance:
   - Import from `@/integrations/supabase/db-client`
   - Never create new Supabase client instances in components
   - Ensure client is initialized before data access

2. **Error Response Handling**:
   - Check for specific error types (42P01 for missing tables)
   - Provide actionable messages to users
   - Include instructions for developers in console logs

## Security Best Practices

### Database Security

1. **Row Level Security (RLS)**: Always implement RLS policies for each table
2. **Service Role Protection**: Never expose the service role key in frontend code
3. **Input Validation**: Validate all user inputs before database operations
4. **Prepared Statements**: Use parameterized queries to prevent SQL injection

### Authentication Security

1. **Token Management**: Store tokens securely in memory or secure storage
2. **Session Expiry**: Implement proper session expiration and renewal
3. **Rate Limiting**: Implement rate limiting for authentication endpoints
4. **Password Policies**: Enforce strong password requirements

### API Security

1. **CORS Policy**: Restrict API access to trusted domains
2. **API Keys**: Rotate API keys regularly and use environment variables
3. **Request Validation**: Validate all API request parameters
4. **Error Handling**: Use generic error messages that don't expose system details 