# Sleep Feature Documentation

## Overview
The Sleep Wellness Center provides comprehensive sleep tracking functionality, helping users optimize their sleep quality and habits through real-time monitoring, goal setting, and environmental optimization.

## Database Structure
All sleep-related data is stored in Supabase tables with the "8" suffix naming convention:

### Tables
1. **sleep_entries8**
   - Primary storage for sleep logs
   - Contains fields for bed_time, wake_time, sleep_quality, sleep_duration, etc.
   - User-specific with user_id foreign key to auth.users

2. **sleep_goals8**
   - Stores user's sleep targets and goals
   - Tracks target_duration, target_quality, bedtime_target, wake_time_target
   - Allows progress tracking with completed flag

3. **sleep_environment_settings8**
   - Stores user's preferred sleep environment configuration
   - Contains settings for temperature, humidity, noise_level, light_level
   - Supports features like aromatherapy_enabled, white_noise_enabled, etc.

### Schema Details
All tables include:
- UUID primary keys
- Foreign key relationships to auth.users
- Row Level Security (RLS) policies for data protection
- Created_at and updated_at timestamp fields
- Appropriate constraints for data integrity

## Implementation
The Sleep feature has two implementations:

### 1. Legacy Implementation
- **Location**: `/webapp/sleep`
- **Component**: `src/pages/webapp/WebappSleepOld.tsx`
- **Description**: Contains mockup data (not connected to real database)
- **URL**: http://localhost:3000/webapp/sleep
- **Note**: This implementation will be phased out

### 2. New Implementation
- **Location**: `/webapp/sleep-new`
- **Component**: `src/app/webapp/sleep/page.tsx`
- **Description**: Full-featured with real database connectivity
- **URL**: http://localhost:3000/webapp/sleep-new
- **Components**:
  - `SleepTracker` - For logging sleep entries
  - `SleepGoals` - For setting and tracking sleep goals
  - `SleepAnalytics` - For visualizing sleep trends
  - `SleepEnvironment` - For configuring optimal sleep environment

## Routing Information
```typescript
// In src/App.tsx
<Route path="/webapp" element={<WebAppLayout />}>
  {/* ... other routes ... */}
  <Route path="sleep" element={<WebappSleep />} />
  <Route path="sleep-new" element={<SleepPage />} />
  {/* ... other routes ... */}
</Route>
```

## Installation & Setup
To set up the Sleep feature in a local development environment:

1. **Create Database Tables**
   ```sql
   -- Create sleep_entries8 table
   CREATE TABLE IF NOT EXISTS public.sleep_entries8 (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
     bed_time TIME NOT NULL,
     wake_time TIME NOT NULL,
     sleep_quality INTEGER NOT NULL CHECK (sleep_quality BETWEEN 1 AND 10),
     sleep_duration DECIMAL NOT NULL,
     factors JSONB,
     notes TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create sleep_goals8 table
   CREATE TABLE IF NOT EXISTS public.sleep_goals8 (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
     target_duration DECIMAL NOT NULL,
     target_quality INTEGER NOT NULL CHECK (target_quality BETWEEN 1 AND 10),
     bedtime_target TIME NOT NULL,
     wake_time_target TIME NOT NULL,
     description TEXT,
     completed BOOLEAN NOT NULL DEFAULT FALSE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create sleep_environment_settings8 table
   CREATE TABLE IF NOT EXISTS public.sleep_environment_settings8 (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
     temperature INTEGER NOT NULL DEFAULT 68,
     humidity INTEGER NOT NULL DEFAULT 40,
     noise_level INTEGER NOT NULL DEFAULT 20,
     light_level INTEGER NOT NULL DEFAULT 10,
     aromatherapy_enabled BOOLEAN NOT NULL DEFAULT FALSE,
     white_noise_enabled BOOLEAN NOT NULL DEFAULT FALSE,
     white_noise_type TEXT NOT NULL DEFAULT 'rain',
     light_color TEXT NOT NULL DEFAULT '#FFA07A',
     bedtime_reminder_enabled BOOLEAN NOT NULL DEFAULT TRUE,
     bedtime_reminder_time TIME NOT NULL DEFAULT '22:00',
     caffeine_cutoff_enabled BOOLEAN NOT NULL DEFAULT TRUE,
     caffeine_cutoff_time TIME NOT NULL DEFAULT '14:00',
     bedtime_routine TEXT DEFAULT '',
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

2. **Add Row Level Security Policies**
   ```sql
   -- Enable RLS on all tables
   ALTER TABLE public.sleep_entries8 ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.sleep_goals8 ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.sleep_environment_settings8 ENABLE ROW LEVEL SECURITY;

   -- Add policies to sleep_entries8
   CREATE POLICY "Users can view their own sleep entries"
     ON public.sleep_entries8 FOR SELECT
     USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert their own sleep entries"
     ON public.sleep_entries8 FOR INSERT
     WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update their own sleep entries"
     ON public.sleep_entries8 FOR UPDATE
     USING (auth.uid() = user_id);

   CREATE POLICY "Users can delete their own sleep entries"
     ON public.sleep_entries8 FOR DELETE
     USING (auth.uid() = user_id);

   -- Add similar policies to other tables
   -- [... policies for sleep_goals8 and sleep_environment_settings8 ...]
   ```

## Troubleshooting
- **Authentication Issues**: Ensure the user is logged in before using sleep features
- **Database Connection**: Verify Supabase connection is properly configured
- **Data Not Showing**: Check that SQL has been executed in Supabase
- **Session Management**: Session must be valid to access database tables 