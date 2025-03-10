# SOOT4001: Care Connector Documentation

> **DOCUMENT CLASSIFICATION**: INTERNAL REFERENCE  
> **VERSION**: 1.0.0  
> **LAST UPDATED**: 2023-12-01  
> **MAINTAINER**: Care Connector Development Team

## 1. Introduction

### 1.1 Purpose of Care Connector

Care Connector (code name: SOOT4001) is a comprehensive care coordination platform designed to facilitate communication and task management between caregivers, family members, and care recipients. The application enables users to:

- Create and manage care groups for coordinating care for individuals
- Assign and track tasks among group members
- Schedule and manage events and appointments
- Facilitate communication between caregivers
- Monitor health records and care activities
- Send and manage group invitations
- Track availability and manage bookings

The platform aims to reduce the burden of care coordination, improve communication among caregivers, and enhance the overall quality of care provided to individuals needing assistance.

### 1.2 Key Features

- **Group Management**: Create, join, and manage care groups
- **Task Management**: Assign, track, and complete care-related tasks
- **Event Scheduling**: Schedule and manage care events and appointments
- **Availability Management**: Track availability and manage bookings
- **Activity Tracking**: Monitor care activities and health records
- **Role-Based Access Control**: Different permissions for owners, admins, and members
- **Dashboard Views**: Role-specific dashboards with relevant information and analytics

## 2. Technical Overview

### 2.1 Framework & Technology Stack

| Component             | Technology                   | Version                | Notes                                   |
|-----------------------|-----------------------------|------------------------|----------------------------------------|
| Frontend Framework    | Next.js                     | 13.4.3 (**locked**)    | Used for server-side rendering          |
| UI Framework          | Shadcn/UI                   | 0.2.0 (**locked**)     | Component library built on Radix UI     |
| State Management      | React Hooks                 | React 18.2.0           | No additional state management library  |
| API Client            | Custom Wrapper + Fetch API  | N/A                    | Custom wrapper around native Fetch API  |
| Database              | PostgreSQL (via Supabase)   | PostgreSQL 14          | Hosted on Supabase                      |
| Authentication        | Supabase Auth               | Latest                 | Email/password & social authentication  |
| Hosting               | Vercel                      | Latest                 | For frontend hosting                    |
| Backend               | Supabase                    | Latest                 | For database and serverless functions   |
| Styling               | Tailwind CSS                | 3.3.2 (**locked**)     | Used for UI styling                     |
| TypeScript            | TypeScript                  | 5.0.4 (**locked**)     | For type safety                         |

> **IMPORTANT**: This application uses version-locked dependencies. Do not upgrade major versions without thorough testing as it may break functionality.

### 2.2 Directory Structure

```
src/
├── api/
│   └── apiClient.ts         # API client wrapper with care group functions
├── app/
│   └── care-connector/      # Main application directory
│       ├── components/      # Application-specific components
│       ├── layout.tsx       # Layout component for Care Connector
│       └── page.tsx         # Entry point for Care Connector
├── components/
│   ├── ui/                  # Reusable UI components
│   └── shared/              # Shared components across the app
├── integrations/
│   └── supabase/            # Supabase integration
│       ├── care8-types.ts   # Types for care8 tables
│       ├── rest-api.ts      # REST API utilities
│       └── types.ts         # Supabase database types
├── lib/
│   ├── db.ts                # Database helper functions
│   └── utils.ts             # Utility functions
└── scripts/                 # Utility scripts
```

### 2.3 Backend Authentication

The application uses Supabase for authentication and database access. Authentication is handled through JWT tokens obtained from Supabase Auth.

**Development Environment Variables**:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Production Environment Secrets**:
> **SECURITY NOTE**: Never commit these values to GitHub or expose them in client-side code.
```
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Only for secure server-side operations
```

**API Authentication Flow**:
1. User signs in through Supabase Auth
2. JWT token is stored in local storage
3. Token is included in all API requests via the `apiRequest` function
4. Token validity is checked server-side through RLS policies

### 2.4 API Client Structure

The `apiClient.ts` file serves as a central place for all API calls to the backend. It's organized by domain and provides comprehensive error handling:

```javascript
// Structure of the API client
export const careConnector = {
  // Group functions
  groups: { ... },
  
  // Member functions
  members: { ... },
  
  // Task functions
  tasks: { ... },
  
  // Event functions
  events: { ... },
  
  // Advanced search functions
  search: { ... },
  
  // Booking and availability
  booking: { ... },
  
  // Invitations
  invitations: { ... }
};
```

## 3. Database Schema

### 3.1 Tables Overview

The application uses a consistent naming convention with the `care8_` prefix for all tables:

| Table Name                | Description                               | Primary Key | Foreign Keys                          |
|---------------------------|-------------------------------------------|-------------|---------------------------------------|
| care8_groups              | Care groups for coordinating care         | id          | created_by -> users.id                |
| care8_group_members       | Memberships for care groups               | id          | group_id, user_id, invited_by         |
| care8_group_invitations   | Invitations to join care groups           | id          | group_id, invited_by                  |
| care8_group_tasks         | Tasks assigned within care groups         | id          | group_id, created_by, assigned_to     |
| care8_group_events        | Events scheduled within care groups       | id          | group_id, created_by                  |
| care8_group_posts         | Posts shared within care groups           | id          | group_id, created_by                  |
| care8_group_comments      | Comments on group posts                   | id          | post_id, created_by                   |
| care8_health_records      | Health records for care recipients        | id          | user_id                               |
| care8_providers           | Healthcare providers                      | id          | created_by                            |
| care8_provider_reviews    | Reviews for healthcare providers          | id          | provider_id, user_id                  |
| care8_activity_log        | Activity logs for audit purposes          | id          | user_id, entity_id                    |
| care8_volunteers          | Volunteers available for care tasks       | id          | user_id                               |
| care8_volunteer_skills    | Skills possessed by volunteers            | id          | volunteer_id                          |
| care8_volunteer_schedules | Availability schedules for volunteers     | id          | volunteer_id                          |
| care8_document_library    | Shared documents and resources            | id          | group_id, created_by                  |
| care8_notifications       | User notifications                        | id          | user_id, entity_id                    |

### 3.2 Table Schemas

#### 3.2.1 care8_groups

Stores information about care groups.

```sql
CREATE TABLE care8_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_public BOOLEAN DEFAULT false,
  image_url TEXT
);
```

#### 3.2.2 care8_group_members

Maps users to care groups with specific roles.

```sql
CREATE TABLE care8_group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES care8_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  invited_by UUID REFERENCES auth.users(id)
);
```

#### 3.2.3 care8_group_invitations

Stores invitations to join care groups.

```sql
CREATE TABLE care8_group_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES care8_groups(id) ON DELETE CASCADE,
  invited_email TEXT NOT NULL,
  invited_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired'))
);
```

#### 3.2.4 care8_group_tasks

Stores tasks for care groups.

```sql
CREATE TABLE care8_group_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES care8_groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled')),
  assigned_to UUID REFERENCES auth.users(id),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high'))
);
```

#### 3.2.5 care8_group_events

Stores events for care groups.

```sql
CREATE TABLE care8_group_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES care8_groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) NOT NULL
);
```

#### 3.2.6 care8_group_posts

Stores posts within care groups.

```sql
CREATE TABLE care8_group_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES care8_groups(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

#### 3.2.7 care8_group_comments

Stores comments on group posts.

```sql
CREATE TABLE care8_group_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES care8_group_posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

#### 3.2.8 care8_health_records

Stores health records for care recipients.

```sql
CREATE TABLE care8_health_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  record_type TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  notes TEXT,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### 3.2.9 care8_providers

Stores information about healthcare providers.

```sql
CREATE TABLE care8_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  specialty TEXT,
  contact_info JSONB,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  verified BOOLEAN DEFAULT false
);
```

#### 3.2.10 care8_provider_reviews

Stores reviews for healthcare providers.

```sql
CREATE TABLE care8_provider_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES care8_providers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### 3.2.11 care8_activity_log

Stores activity logs for audit purposes.

```sql
CREATE TABLE care8_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB
);
```

#### 3.2.12 care8_volunteers

Stores information about volunteers available for care tasks.

```sql
CREATE TABLE care8_volunteers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  bio TEXT,
  availability_notes TEXT,
  is_active BOOLEAN DEFAULT true,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### 3.2.13 care8_volunteer_skills

Stores skills possessed by volunteers.

```sql
CREATE TABLE care8_volunteer_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  volunteer_id UUID REFERENCES care8_volunteers(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  proficiency_level TEXT CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  verified BOOLEAN DEFAULT false,
  notes TEXT
);
```

#### 3.2.14 care8_volunteer_schedules

Stores availability schedules for volunteers.

```sql
CREATE TABLE care8_volunteer_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  volunteer_id UUID REFERENCES care8_volunteers(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_recurring BOOLEAN DEFAULT true,
  effective_date DATE,
  end_date DATE
);
```

#### 3.2.15 care8_document_library

Stores shared documents and resources for care groups.

```sql
CREATE TABLE care8_document_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES care8_groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  file_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

#### 3.2.16 care8_notifications

Stores user notifications.

```sql
CREATE TABLE care8_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  is_read BOOLEAN DEFAULT false,
  entity_type TEXT,
  entity_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## 4. Row-Level Security (RLS)

### 4.1 RLS Overview

Care Connector uses Row-Level Security (RLS) to control access to data at the database level. The current implementation uses simplified RLS policies to avoid recursion issues while still providing basic security.

> **IMPORTANT**: The current RLS implementation prioritizes functionality over strict security. Frontend validation is crucial for proper access control.

### 4.2 RLS Policies 

#### 4.2.1 care8_groups Table

```sql
-- Allow users to view public groups
CREATE POLICY "Anyone can view public groups" 
ON care8_groups FOR SELECT 
USING (is_public = true);

-- Allow users to view groups they are members of
CREATE POLICY "Members can view their groups" 
ON care8_groups FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM care8_group_members 
    WHERE care8_group_members.group_id = id 
    AND care8_group_members.user_id = auth.uid()
  )
);

-- Allow users to create groups
CREATE POLICY "Users can create groups" 
ON care8_groups FOR INSERT 
WITH CHECK (auth.uid() = created_by);

-- Allow owners and admins to update their groups
CREATE POLICY "Owners and admins can update groups" 
ON care8_groups FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM care8_group_members 
    WHERE care8_group_members.group_id = id 
    AND care8_group_members.user_id = auth.uid()
    AND care8_group_members.role IN ('owner', 'admin')
  )
);

-- Allow owners to delete their groups
CREATE POLICY "Owners can delete groups" 
ON care8_groups FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM care8_group_members 
    WHERE care8_group_members.group_id = id 
    AND care8_group_members.user_id = auth.uid()
    AND care8_group_members.role = 'owner'
  )
);
```

#### 4.2.2 care8_group_members Table

```sql
-- Allow users to view members of groups they're in
CREATE POLICY "Users can view members of their groups" 
ON care8_group_members FOR SELECT 
USING (
  user_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM care8_group_members AS m 
    WHERE m.group_id = group_id 
    AND m.user_id = auth.uid()
  )
);

-- Allow users to join public groups
CREATE POLICY "Users can join public groups" 
ON care8_group_members FOR INSERT 
WITH CHECK (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM care8_groups 
    WHERE care8_groups.id = group_id 
    AND care8_groups.is_public = true
  ) OR
  EXISTS (
    SELECT 1 FROM care8_group_invitations 
    WHERE care8_group_invitations.group_id = group_id 
    AND care8_group_invitations.invited_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
    AND care8_group_invitations.status = 'pending'
  )
);

-- Allow users to leave groups they're in
CREATE POLICY "Users can leave groups" 
ON care8_group_members FOR DELETE 
USING (user_id = auth.uid());

-- Allow owners/admins to manage members
CREATE POLICY "Owners and admins can manage members" 
ON care8_group_members FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM care8_group_members 
    WHERE care8_group_members.group_id = group_id 
    AND care8_group_members.user_id = auth.uid()
    AND care8_group_members.role IN ('owner', 'admin')
  )
);
```

#### 4.2.3 care8_group_invitations Table

```sql
-- Allow group members to view invitations for their groups
CREATE POLICY "Group members can view invitations" 
ON care8_group_invitations FOR SELECT 
USING (
  invited_email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
  EXISTS (
    SELECT 1 FROM care8_group_members 
    WHERE care8_group_members.group_id = group_id 
    AND care8_group_members.user_id = auth.uid()
  )
);

-- Allow users to see invitations sent to their email
CREATE POLICY "Users can see invitations sent to them" 
ON care8_group_invitations FOR SELECT 
USING (
  invited_email = (
    SELECT email FROM auth.users WHERE id = auth.uid()
  )
);

-- Allow admins and owners to create invitations for their groups
CREATE POLICY "Admins and owners can create invitations" 
ON care8_group_invitations FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM care8_group_members 
    WHERE care8_group_members.group_id = group_id 
    AND care8_group_members.user_id = auth.uid()
    AND care8_group_members.role IN ('admin', 'owner')
  )
);

-- Allow users to accept or decline their own invitations
CREATE POLICY "Users can update invitations sent to them" 
ON care8_group_invitations FOR UPDATE 
USING (
  invited_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  AND status = 'pending'
);

-- Allow admins and owners to cancel invitations for their groups
CREATE POLICY "Admins and owners can delete invitations" 
ON care8_group_invitations FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM care8_group_members 
    WHERE care8_group_members.group_id = group_id 
    AND care8_group_members.user_id = auth.uid()
    AND care8_group_members.role IN ('admin', 'owner')
  )
);
```

#### 4.2.4 care8_group_tasks Table

```sql
-- Allow group members to view tasks in their groups
CREATE POLICY "Group members can view tasks" 
ON care8_group_tasks FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM care8_group_members 
    WHERE care8_group_members.group_id = group_id 
    AND care8_group_members.user_id = auth.uid()
  )
);

-- Allow group members to create tasks
CREATE POLICY "Group members can create tasks" 
ON care8_group_tasks FOR INSERT 
WITH CHECK (
  auth.uid() = created_by AND
  EXISTS (
    SELECT 1 FROM care8_group_members 
    WHERE care8_group_members.group_id = group_id 
    AND care8_group_members.user_id = auth.uid()
  )
);

-- Allow task creators and assignees to update tasks
CREATE POLICY "Task creators and assignees can update tasks" 
ON care8_group_tasks FOR UPDATE 
USING (
  created_by = auth.uid() OR 
  assigned_to = auth.uid() OR
  EXISTS (
    SELECT 1 FROM care8_group_members 
    WHERE care8_group_members.group_id = group_id 
    AND care8_group_members.user_id = auth.uid()
    AND care8_group_members.role IN ('admin', 'owner')
  )
);

-- Allow task creators and admins to delete tasks
CREATE POLICY "Task creators and admins can delete tasks" 
ON care8_group_tasks FOR DELETE 
USING (
  created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM care8_group_members 
    WHERE care8_group_members.group_id = group_id 
    AND care8_group_members.user_id = auth.uid()
    AND care8_group_members.role IN ('admin', 'owner')
  )
);
```

#### 4.2.5 care8_group_events Table

```sql
-- Allow group members to view events in their groups
CREATE POLICY "Group members can view events" 
ON care8_group_events FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM care8_group_members 
    WHERE care8_group_members.group_id = group_id 
    AND care8_group_members.user_id = auth.uid()
  )
);

-- Allow group members to create events
CREATE POLICY "Group members can create events" 
ON care8_group_events FOR INSERT 
WITH CHECK (
  auth.uid() = created_by AND
  EXISTS (
    SELECT 1 FROM care8_group_members 
    WHERE care8_group_members.group_id = group_id 
    AND care8_group_members.user_id = auth.uid()
  )
);

-- Allow event creators and admins to update events
CREATE POLICY "Event creators and admins can update events" 
ON care8_group_events FOR UPDATE 
USING (
  created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM care8_group_members 
    WHERE care8_group_members.group_id = group_id 
    AND care8_group_members.user_id = auth.uid()
    AND care8_group_members.role IN ('admin', 'owner')
  )
);

-- Allow event creators and admins to delete events
CREATE POLICY "Event creators and admins can delete events" 
ON care8_group_events FOR DELETE 
USING (
  created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM care8_group_members 
    WHERE care8_group_members.group_id = group_id 
    AND care8_group_members.user_id = auth.uid()
    AND care8_group_members.role IN ('admin', 'owner')
  )
);
```

#### 4.2.6 care8_group_posts Table

```sql
-- Allow group members to view posts in their groups
CREATE POLICY "Group members can view posts" 
ON care8_group_posts FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM care8_group_members 
    WHERE care8_group_members.group_id = group_id 
    AND care8_group_members.user_id = auth.uid()
  )
);

-- Allow group members to create posts
CREATE POLICY "Group members can create posts" 
ON care8_group_posts FOR INSERT 
WITH CHECK (
  auth.uid() = created_by AND
  EXISTS (
    SELECT 1 FROM care8_group_members 
    WHERE care8_group_members.group_id = group_id 
    AND care8_group_members.user_id = auth.uid()
  )
);

-- Allow post creators to update their own posts
CREATE POLICY "Post creators can update their posts" 
ON care8_group_posts FOR UPDATE 
USING (created_by = auth.uid());

-- Allow post creators and admins to delete posts
CREATE POLICY "Post creators and admins can delete posts" 
ON care8_group_posts FOR DELETE 
USING (
  created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM care8_group_members 
    WHERE care8_group_members.group_id = group_id 
    AND care8_group_members.user_id = auth.uid()
    AND care8_group_members.role IN ('admin', 'owner')
  )
);
```

#### 4.2.7 care8_group_comments Table

```sql
-- Allow group members to view comments on posts in their groups
CREATE POLICY "Group members can view comments" 
ON care8_group_comments FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM care8_group_posts p
    JOIN care8_group_members m ON p.group_id = m.group_id
    WHERE p.id = post_id
    AND m.user_id = auth.uid()
  )
);

-- Allow group members to create comments on posts
CREATE POLICY "Group members can create comments" 
ON care8_group_comments FOR INSERT 
WITH CHECK (
  auth.uid() = created_by AND
  EXISTS (
    SELECT 1 FROM care8_group_posts p
    JOIN care8_group_members m ON p.group_id = m.group_id
    WHERE p.id = post_id
    AND m.user_id = auth.uid()
  )
);

-- Allow comment creators to update their own comments
CREATE POLICY "Comment creators can update their comments" 
ON care8_group_comments FOR UPDATE 
USING (created_by = auth.uid());

-- Allow comment creators and admins to delete comments
CREATE POLICY "Comment creators and admins can delete comments" 
ON care8_group_comments FOR DELETE 
USING (
  created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM care8_group_posts p
    JOIN care8_group_members m ON p.group_id = m.group_id
    WHERE p.id = post_id
    AND m.user_id = auth.uid()
    AND m.role IN ('admin', 'owner')
  )
);
```

#### 4.2.8 care8_health_records Table

```sql
-- Allow users to view their own health records
CREATE POLICY "Users can view their own health records" 
ON care8_health_records FOR SELECT 
USING (user_id = auth.uid());

-- Allow users to create health records for themselves
CREATE POLICY "Users can create their own health records" 
ON care8_health_records FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Allow users to update their own health records
CREATE POLICY "Users can update their own health records" 
ON care8_health_records FOR UPDATE 
USING (user_id = auth.uid());

-- Allow users to delete their own health records
CREATE POLICY "Users can delete their own health records" 
ON care8_health_records FOR DELETE 
USING (user_id = auth.uid());

-- Allow care group members to view health records of care recipients
CREATE POLICY "Care group members can view recipient health records" 
ON care8_health_records FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM care8_group_members
    WHERE care8_group_members.user_id = auth.uid()
    AND care8_group_members.group_id IN (
      SELECT group_id FROM care8_group_members
      WHERE user_id = care8_health_records.user_id
    )
  )
);
```

#### 4.2.9 care8_providers Table

```sql
-- Allow anyone to view verified healthcare providers
CREATE POLICY "Anyone can view verified providers" 
ON care8_providers FOR SELECT 
USING (verified = true);

-- Allow users to view providers they created
CREATE POLICY "Users can view providers they created" 
ON care8_providers FOR SELECT 
USING (created_by = auth.uid());

-- Allow users to create provider entries
CREATE POLICY "Users can create provider entries" 
ON care8_providers FOR INSERT 
WITH CHECK (created_by = auth.uid());

-- Allow creators to update provider entries
CREATE POLICY "Creators can update provider entries" 
ON care8_providers FOR UPDATE 
USING (created_by = auth.uid());

-- Allow creators to delete provider entries
CREATE POLICY "Creators can delete provider entries" 
ON care8_providers FOR DELETE 
USING (created_by = auth.uid());
```

#### 4.2.10 care8_provider_reviews Table

```sql
-- Allow anyone to view provider reviews
CREATE POLICY "Anyone can view provider reviews" 
ON care8_provider_reviews FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM care8_providers
    WHERE care8_providers.id = provider_id
    AND care8_providers.verified = true
  )
);

-- Allow users to create reviews
CREATE POLICY "Users can create reviews" 
ON care8_provider_reviews FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Allow users to update their own reviews
CREATE POLICY "Users can update their own reviews" 
ON care8_provider_reviews FOR UPDATE 
USING (user_id = auth.uid());

-- Allow users to delete their own reviews
CREATE POLICY "Users can delete their own reviews" 
ON care8_provider_reviews FOR DELETE 
USING (user_id = auth.uid());
```

#### 4.2.11 care8_activity_log Table

```sql
-- Allow users to view their own activity logs
CREATE POLICY "Users can view their own activity logs" 
ON care8_activity_log FOR SELECT 
USING (user_id = auth.uid());

-- Allow system to insert activity logs
CREATE POLICY "System can insert activity logs" 
ON care8_activity_log FOR INSERT 
WITH CHECK (true);

-- Prevent updates to activity logs
CREATE POLICY "No updates to activity logs" 
ON care8_activity_log FOR UPDATE 
USING (false);

-- Prevent deletion of activity logs
CREATE POLICY "No deletion of activity logs" 
ON care8_activity_log FOR DELETE 
USING (false);
```

#### 4.2.12 care8_volunteers Table

```sql
-- Allow anyone to view active volunteers
CREATE POLICY "Anyone can view active volunteers" 
ON care8_volunteers FOR SELECT 
USING (is_active = true);

-- Allow users to register as volunteers
CREATE POLICY "Users can register as volunteers" 
ON care8_volunteers FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Allow volunteers to update their own profiles
CREATE POLICY "Volunteers can update their own profiles" 
ON care8_volunteers FOR UPDATE 
USING (user_id = auth.uid());

-- Allow volunteers to deactivate their profiles
CREATE POLICY "Volunteers can deactivate their profiles" 
ON care8_volunteers FOR DELETE 
USING (user_id = auth.uid());
```

#### 4.2.13 care8_volunteer_skills Table

```sql
-- Allow anyone to view volunteer skills
CREATE POLICY "Anyone can view volunteer skills" 
ON care8_volunteer_skills FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM care8_volunteers
    WHERE care8_volunteers.id = volunteer_id
    AND care8_volunteers.is_active = true
  )
);

-- Allow volunteers to add their skills
CREATE POLICY "Volunteers can add their skills" 
ON care8_volunteer_skills FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM care8_volunteers
    WHERE care8_volunteers.id = volunteer_id
    AND care8_volunteers.user_id = auth.uid()
  )
);

-- Allow volunteers to update their skills
CREATE POLICY "Volunteers can update their skills" 
ON care8_volunteer_skills FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM care8_volunteers
    WHERE care8_volunteers.id = volunteer_id
    AND care8_volunteers.user_id = auth.uid()
  )
);

-- Allow volunteers to delete their skills
CREATE POLICY "Volunteers can delete their skills" 
ON care8_volunteer_skills FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM care8_volunteers
    WHERE care8_volunteers.id = volunteer_id
    AND care8_volunteers.user_id = auth.uid()
  )
);
```

#### 4.2.14 care8_volunteer_schedules Table

```sql
-- Allow anyone to view volunteer schedules
CREATE POLICY "Anyone can view volunteer schedules" 
ON care8_volunteer_schedules FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM care8_volunteers
    WHERE care8_volunteers.id = volunteer_id
    AND care8_volunteers.is_active = true
  )
);

-- Allow volunteers to add their schedules
CREATE POLICY "Volunteers can add their schedules" 
ON care8_volunteer_schedules FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM care8_volunteers
    WHERE care8_volunteers.id = volunteer_id
    AND care8_volunteers.user_id = auth.uid()
  )
);

-- Allow volunteers to update their schedules
CREATE POLICY "Volunteers can update their schedules" 
ON care8_volunteer_schedules FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM care8_volunteers
    WHERE care8_volunteers.id = volunteer_id
    AND care8_volunteers.user_id = auth.uid()
  )
);

-- Allow volunteers to delete their schedules
CREATE POLICY "Volunteers can delete their schedules" 
ON care8_volunteer_schedules FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM care8_volunteers
    WHERE care8_volunteers.id = volunteer_id
    AND care8_volunteers.user_id = auth.uid()
  )
);
```

#### 4.2.15 care8_document_library Table

```sql
-- Allow group members to view documents in their groups
CREATE POLICY "Group members can view documents" 
ON care8_document_library FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM care8_group_members 
    WHERE care8_group_members.group_id = group_id 
    AND care8_group_members.user_id = auth.uid()
  )
);

-- Allow group members to upload documents
CREATE POLICY "Group members can upload documents" 
ON care8_document_library FOR INSERT 
WITH CHECK (
  auth.uid() = created_by AND
  EXISTS (
    SELECT 1 FROM care8_group_members 
    WHERE care8_group_members.group_id = group_id 
    AND care8_group_members.user_id = auth.uid()
  )
);

-- Allow document creators and admins to update documents
CREATE POLICY "Document creators and admins can update documents" 
ON care8_document_library FOR UPDATE 
USING (
  created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM care8_group_members 
    WHERE care8_group_members.group_id = group_id 
    AND care8_group_members.user_id = auth.uid()
    AND care8_group_members.role IN ('admin', 'owner')
  )
);

-- Allow document creators and admins to delete documents
CREATE POLICY "Document creators and admins can delete documents" 
ON care8_document_library FOR DELETE 
USING (
  created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM care8_group_members 
    WHERE care8_group_members.group_id = group_id 
    AND care8_group_members.user_id = auth.uid()
    AND care8_group_members.role IN ('admin', 'owner')
  )
);
```

#### 4.2.16 care8_notifications Table

```sql
-- Allow users to view their own notifications
CREATE POLICY "Users can view their own notifications" 
ON care8_notifications FOR SELECT 
USING (user_id = auth.uid());

-- Allow system to create notifications
CREATE POLICY "System can create notifications" 
ON care8_notifications FOR INSERT 
WITH CHECK (true);

-- Allow users to mark their notifications as read
CREATE POLICY "Users can update their own notifications" 
ON care8_notifications FOR UPDATE 
USING (
  user_id = auth.uid() AND
  (NEW.is_read IS DISTINCT FROM is_read OR NEW.is_read = true)
);

-- Allow users to delete their own notifications
CREATE POLICY "Users can delete their own notifications" 
ON care8_notifications FOR DELETE 
USING (user_id = auth.uid());
```

## 5. Frontend Application

### 5.1 Routing Structure

The application uses Next.js App Router with the following route structure:

```
/care-connector/                        # Main landing page
/care-connector/dashboard               # User dashboard
/care-connector/groups                  # Group listing
/care-connector/groups/[groupId]        # Group details
/care-connector/groups/new              # Create new group
/care-connector/tasks                   # Task management
/care-connector/calendar                # Calendar view
/care-connector/invitations             # Manage invitations
/care-connector/settings                # User settings
/care-connector/admin                   # Admin panel (role-restricted)
```

### 5.2 Component Structure

#### Key Components:

- **Dashboard.tsx**: Role-based dashboard with different views based on user role
- **CareGroups.tsx**: Main component for displaying and managing care groups
- **GroupDetail.tsx**: Displays detailed information about a specific group
- **TaskManager.tsx**: Component for managing tasks within a group
- **CalendarView.tsx**: Calendar view for events and appointments
- **InvitationManager.tsx**: Component for handling group invitations

### 5.3 API Integration

The application uses a custom API client that wraps around the Fetch API to communicate with the Supabase backend. The client is defined in `src/api/apiClient.ts` and includes comprehensive error handling and retry logic.

Example of API usage:

```typescript
// Get user's care groups
const { data: userGroups, error } = await careConnector.groups.getUserGroups();

if (error) {
  // Handle error
  console.error('Failed to load user groups:', error);
  toast.error('Failed to load your care groups');
  return;
}

// Process the data
setGroups(userGroups);
```

## 6. Development Guidelines

### 6.1 Code Style and Standards

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use functional components with React Hooks
- Implement comprehensive error handling
- Write meaningful comments and documentation
- Use the shadcn/ui component library for UI elements
- Follow the Tailwind CSS class naming conventions

### 6.2 Best Practices

#### General:

- Keep components small and focused on a single responsibility
- Use custom hooks to encapsulate reusable logic
- Implement proper loading and error states for all async operations
- Use TypeScript interfaces for data structures
- Follow the containerized pattern: separate logic from presentation

#### API:

- Use the provided API client for all backend communication
- Implement proper error handling for all API calls
- Use loading states to give feedback during API calls
- Validate data before sending to the API
- Use optimistic updates where appropriate for better UX

#### Security:

- Never store sensitive information in local storage or cookies
- Always validate user input on both frontend and backend
- Use proper authentication for all API calls
- Implement role-based access control for sensitive operations
- Test security measures thoroughly

### 6.3 Environment Setup

#### Development Environment:

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. Start development server: `npm run dev`

#### Production Environment:

1. Build the application: `npm run build`
2. Test the production build: `npm run start`
3. Deploy to Vercel or another hosting provider

### 6.4 Testing

The application uses the following testing approach:

- **Unit Tests**: Jest and React Testing Library for component and hook testing
- **API Tests**: Using the verification script (`verify_app_functionality.js`)
- **Manual Tests**: Following the test plan for critical user flows

#### Key Test Scenarios:

1. User authentication and registration
2. Creating, editing, and deleting care groups
3. Inviting members and managing membership
4. Creating, assigning, and completing tasks
5. Scheduling events and managing availability
6. Posting messages and comments
7. Role-based access control testing
8. Performance testing for large data sets

## 7. Deployment

### 7.1 Deployment Process

The application is deployed using a CI/CD pipeline:

1. Push changes to the main branch
2. GitHub Actions triggers the build process
3. Test suite is run on the build
4. If tests pass, the build is deployed to staging
5. After manual verification, the build is promoted to production

### 7.2 Environment Configuration

| Environment | URL                         | Purpose                         |
|-------------|-----------------------------|---------------------------------|
| Development | http://localhost:3000       | Local development               |
| Staging     | https://staging.example.com | Testing before production       |
| Production  | https://app.example.com     | Live application                |

### 7.3 Monitoring and Alerting

- Application performance monitoring using Vercel Analytics
- Error tracking using Sentry
- Database performance monitoring through Supabase Dashboard
- Alerting set up for critical errors and performance issues

## 8. Troubleshooting

### 8.1 Common Issues and Solutions

#### RLS Recursion Errors:

**Issue**: Database queries fail with recursion or planner errors.
**Solution**: Simplify RLS policies and avoid self-referential queries.

#### Authentication Issues:

**Issue**: Users cannot log in or access their data.
**Solution**: Check token validity, Supabase configuration, and RLS policies.

#### Performance Issues:

**Issue**: Slow loading times for pages with large data sets.
**Solution**: Implement pagination, optimize database queries, and add indexes.

### 8.2 Support Channels

- GitHub Issues for bug reports and feature requests
- Internal JIRA board for task tracking
- Slack channel #care-connector-support for urgent issues

## 9. Future Roadmap

### 9.1 Planned Features

- Mobile application for iOS and Android
- Integration with health monitoring devices
- Advanced analytics for care patterns
- AI-powered care recommendations
- Calendar sync with Google Calendar and Outlook
- Video call integration for virtual check-ins

### 9.2 Technical Improvements

- Transition to more secure RLS policies
- Implementation of real-time notifications using Supabase Realtime
- Enhanced performance optimizations
- Comprehensive automated testing
- Accessibility improvements

## 10. Appendix

### 10.1 Reference Links

- [Supabase Documentation](https://supabase.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Shadcn/UI Documentation](https://ui.shadcn.com)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### 10.2 Glossary

- **RLS**: Row-Level Security, a feature of PostgreSQL that limits row access based on the user executing a query
- **JWT**: JSON Web Token, used for authentication
- **Care Group**: A virtual group of caregivers coordinating care for an individual
- **SOOT4001**: Internal code name for the Care Connector application

### 10.3 Contributors

- Core Development Team
- Product Management Team
- Design Team
- QA Team

---

© 2023 Care Connector. All Rights Reserved. 