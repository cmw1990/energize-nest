# Care Connector Micro-Frontend

A healthcare coordination platform that helps users manage care groups, connect with caregivers, and organize healthcare-related tasks. This micro-frontend shares the same authentication and database infrastructure as the main application while maintaining its own routing and component structure.

## Features

- **Care Group Management**: Create and manage care groups for coordinated care of loved ones
- **Authentication & User Management**: Login/Register functionality with role-based permissions within care groups
- **Marketplace**: Find caregivers, companions, and care facilities with ratings and reviews
- **Task Management**: Create and assign tasks within care groups with tracking and scheduling
- **Health Monitoring**: Track medications, activities, and health information

## Directory Structure

```
care-connector/
├── components/
│   ├── Dashboard.tsx          # Main dashboard with care group statistics
│   ├── CareGroups.tsx         # Care group management and listings
│   ├── CareConnectorLayout.tsx # Shared layout component
│   ├── GroupDetail.tsx        # Individual care group detail view
│   ├── LandingPage.tsx        # Public landing page for Care Connector
│   ├── Marketplace.tsx        # Marketplace for caregivers and facilities
│   ├── TaskManager.tsx        # Task creation and management
│   ├── ProviderDetail.tsx     # Caregiver/facility profile details
│   ├── HealthMonitoring.tsx   # Health monitoring and tracking
│   └── Settings.tsx           # User and application settings
├── page.tsx                   # Entry point component
└── CareConnectorApp.tsx       # Main app component with routing
```

## Database Schema

The application uses the following Supabase tables:

- `care_groups`: Care group information and settings
- `care_group_members`: User memberships and roles within care groups
- `care_tasks`: Tasks assigned within care groups
- `care_providers`: Caregivers, companions, and facilities in the marketplace
- `care_provider_reviews`: Ratings and reviews for care providers
- `health_records`: Health monitoring data

## Integration with Main App

The micro-frontend is integrated into the main application through:

1. Shared authentication using the singleton Supabase client
2. Dedicated routing at `/care-connector/*`
3. Shared UI components from the main application
4. Common database infrastructure

## Development

To run the application:

```bash
npm run dev
```

Access the micro-frontend at: `http://localhost:8002/care-connector`

## Security

- Row Level Security (RLS) policies ensure data privacy
- Authentication handled through the main app's AuthProvider
- All database operations use the singleton Supabase client

## Role-Based Permissions

Role-based permissions within care groups:

1. **Owner**: Automatically assigned to the user who creates a group. Can delete the group, modify settings, and manage all aspects of the group.
2. **Admin**: Can manage members, create and assign tasks, and configure most group settings.
3. **Member**: Can view group information, perform assigned tasks, and participate in group activities.

# Care Connector App

Care Connector is a comprehensive care management platform integrated into the Well-Charged ecosystem. It enables users to create and join care groups, manage tasks, share health records, and connect with care providers.

## Features

- **Care Groups**: Create and manage care groups for collaborative care
- **Task Management**: Assign and track care-related tasks
- **Health Records**: Share and monitor health data with group members
- **Provider Marketplace**: Find and connect with care providers
- **Activity Tracking**: Monitor care activities within groups

## Database Schema

The app uses Supabase for data storage with the following tables:

- `care_groups`: Care groups with visibility settings
- `care_group_members`: Group membership with role-based access
- `care_group_invitations`: Invitation system for groups
- `care_tasks`: Task management within groups
- `care_health_records`: Health data with privacy controls
- `care_providers`: Provider profiles and services
- `care_provider_reviews`: Rating and review system
- `care_activity_log`: Activity tracking for groups

## Auto-Updating Database Schema

To ensure the database schema stays in sync with the application, we've implemented an auto-update system:

1. **Database Setup Script**: `npm run supabase:setup`
   - Executes the SQL script to create or update tables
   - Sets up Row Level Security (RLS) policies
   - Creates necessary triggers and functions

2. **Type Generation**: `npm run supabase:generate-types`
   - Generates TypeScript types from the database schema
   - Creates specific type definitions for Care Connector tables

3. **Combined Update**: `npm run supabase:update`
   - Runs both setup and type generation in sequence

### How to Use

1. Set up your environment variables in `.env`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   POSTGRES_CONNECTION_STRING=your-postgres-connection-string
   ```

2. Run the update command:
   ```
   npm run supabase:update
   ```

3. After updating the schema, use the `careConnector` client in your components:
   ```typescript
   import { careConnector } from '@/integrations/supabase/db-client';

   // Example: Get all care groups
   const { data, error } = await careConnector.groups.select('*');
   ```

## Troubleshooting

If you encounter TypeScript errors related to missing tables:

1. Make sure you've run the auto-update scripts
2. Use type assertions if necessary:
   ```typescript
   // Type assertion example
   const result = await dbClient.from('care_groups' as any).select('*');
   ```

3. Check the console for any database connection errors
4. Verify that your Supabase service role key has the necessary permissions

## Development

When making changes to the database schema:

1. Update the `care-connector-tables.sql` file
2. Run `npm run supabase:update` to apply changes
3. Update any affected components to use the new schema

For more detailed information, see the [Supabase Integration README](../../integrations/supabase/README.md). 