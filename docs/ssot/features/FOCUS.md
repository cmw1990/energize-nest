# Focus Management System

## Overview
The Focus Management System is a comprehensive suite of tools designed to help users optimize their focus, manage distractions, and support ADHD-specific needs. It integrates with other Well-Charged features to provide a holistic approach to energy and attention management.

## Core Components

### 1. Focus Timer & Session Management
**Location**: `src/components/focus/FocusTimerTools.tsx`
**Database**: `focus_sessions8`, `focus_interruption_logs8`
- Customizable Pomodoro timer
- Multiple timer techniques (25/5, 50/10, 90/20)
- Session tracking and analytics
- Break reminders and suggestions
- Focus score calculation

### 2. ADHD Support Tools
**Location**: `src/components/focus/tasks/ADHDTaskBreakdown.tsx`
**Database**: `executive_function_tools8`, `medication_reminders8`
- Task breakdown assistance
- Visual organization tools
- Body doubling sessions
- Medication reminders
- Executive function enhancement tools

### 3. Distraction Management
**Location**: 
- `src/components/focus/FocusInterruptionTracker.tsx`
- `src/components/focus/blocking/DistractionBlocker.tsx`
- `src/lib/focus-extension.ts`
**Database**: `focus_interruption_logs8`, `focus_blocked_sites8`, `focus_blocking_settings8`
- Website and app blocking
- Ad blocking integration
- Notification control
- Environmental noise monitoring
- Focus mode automation
- Distraction pattern analysis

#### Features
1. **Website Blocking**
   - Custom domain blocking
   - Social media blocking
   - Allowlist support
   - Scheduling options

2. **Ad Blocking**
   - Built-in ad blocker
   - Custom filter rules
   - Performance tracking
   - Exception management

3. **Notification Control**
   - System notification blocking
   - App notification management
   - Priority notifications
   - Quiet hours

4. **Browser Extension**
   - Real-time blocking
   - Usage statistics
   - Quick toggle controls
   - Visual feedback

5. **Focus Mode**
   - One-click activation
   - Customizable rules
   - Automatic scheduling
   - Break management

#### Database Schema

1. `focus_blocked_sites8`
   - id: UUID (Primary Key)
   - user_id: UUID (Foreign Key)
   - domain: TEXT
   - is_blocked: BOOLEAN
   - created_at: TIMESTAMP
   - updated_at: TIMESTAMP

2. `focus_blocking_settings8`
   - id: UUID (Primary Key)
   - user_id: UUID (Foreign Key)
   - block_ads: BOOLEAN
   - block_social_media: BOOLEAN
   - block_notifications: BOOLEAN
   - allowlist: TEXT[]
   - schedule_enabled: BOOLEAN
   - schedule_start: TIME
   - schedule_end: TIME
   - created_at: TIMESTAMP
   - updated_at: TIMESTAMP

#### Integration Points
1. **Browser Extension**
   - Chrome Extension API
   - Firefox Add-on API
   - Safari Extension API

2. **Operating System**
   - System Notifications API
   - Focus Assist API (Windows)
   - Do Not Disturb API (macOS)

3. **Third-Party Services**
   - Ad blocking filter lists
   - Social media APIs
   - Analytics services

#### Security & Privacy
- Local data storage
- Encrypted settings sync
- Anonymous usage stats
- GDPR compliance

### 4. Focus Environment
**Location**: `src/components/focus/FocusEnvironment.tsx`
**Database**: `focus_environment8`
- White noise generator
- Ambient sounds
- Focus music integration
- Lighting recommendations
- Temperature optimization

### 5. Focus Analytics
**Location**: `src/components/focus/analytics/FocusAnalyticsDashboard.tsx`
**Database**: `focus_analytics8`, `energy_focus_logs8`
- Productivity trends
- Focus patterns
- Distraction analysis
- Energy level correlation
- AI-powered insights

### 6. Task & Time Management
**Location**: 
- `src/components/focus/priority/FocusPriorityQueue.tsx`
- `src/components/focus/TimeBlockingTools.tsx`
**Database**: `focus_priority_queue8`
- Time blocking
- Smart scheduling
- Priority management
- Deadline tracking
- Calendar integration

### 7. Focus Zones & Routines
**Location**: 
- `src/components/focus/zones/FocusZoneCard.tsx`
- `src/components/focus/routines/FocusRoutineCard.tsx`
**Database**: `focus_routines8`, `focus_habits8`
- Customizable work spaces
- Environment presets
- Zone-specific rules
- Location-based automation
- Focus mode triggers

### 8. Focus Gamification
**Location**: `src/components/focus/gamification/FocusGamificationCard.tsx`
**Database**: `focus_achievements8`
- Achievement system
- Progress tracking
- Reward mechanisms
- Challenge system
- Streak tracking

### 9. Focus Journal
**Location**: `src/components/focus/journal/FocusJournal.tsx`
**Database**: `focus_journal8`
- Productivity reflection
- Distraction logging
- Success celebration
- Challenge documentation
- Strategy refinement

## Database Schema

### Tables with "8" Suffix
1. `focus_sessions8`
   - user_id: UUID
   - start_time: TIMESTAMP
   - end_time: TIMESTAMP
   - session_type: TEXT
   - focus_score: INTEGER
   - energy_level: INTEGER

2. `focus_interruption_logs8`
   - user_id: UUID
   - session_id: UUID
   - interruption_type: TEXT
   - timestamp: TIMESTAMP
   - duration: INTEGER
   - impact_level: INTEGER

3. `executive_function_tools8`
   - user_id: UUID
   - tool_type: TEXT
   - settings: JSONB
   - usage_stats: JSONB
   - last_used: TIMESTAMP

4. `medication_reminders8`
   - user_id: UUID
   - medication_name: TEXT
   - dosage: TEXT
   - frequency: TEXT
   - reminder_time: TIME[]
   - last_taken: TIMESTAMP

5. `focus_environment8`
   - user_id: UUID
   - noise_type: TEXT[]
   - light_preference: TEXT
   - temperature: INTEGER
   - ambient_sounds: TEXT[]

6. `focus_analytics8`
   - user_id: UUID
   - date: DATE
   - total_focus_time: INTEGER
   - interruptions: INTEGER
   - focus_score: INTEGER
   - energy_correlation: FLOAT

7. `focus_priority_queue8`
   - user_id: UUID
   - task_name: TEXT
   - priority: INTEGER
   - deadline: TIMESTAMP
   - energy_required: INTEGER

8. `focus_routines8`
   - user_id: UUID
   - routine_name: TEXT
   - steps: JSONB[]
   - duration: INTEGER
   - preferred_time: TIME

9. `focus_habits8`
   - user_id: UUID
   - habit_name: TEXT
   - frequency: TEXT
   - streak: INTEGER
   - last_completed: TIMESTAMP

10. `focus_achievements8`
    - user_id: UUID
    - achievement_type: TEXT
    - earned_at: TIMESTAMP
    - progress: INTEGER
    - metadata: JSONB

11. `focus_journal8`
    - user_id: UUID
    - entry_date: DATE
    - productivity_rating: INTEGER
    - challenges: TEXT[]
    - successes: TEXT[]
    - strategies: TEXT[]

12. `focus_blocked_sites8`
    - id: UUID (Primary Key)
    - user_id: UUID (Foreign Key)
    - domain: TEXT
    - is_blocked: BOOLEAN
    - created_at: TIMESTAMP
    - updated_at: TIMESTAMP

13. `focus_blocking_settings8`
    - id: UUID (Primary Key)
    - user_id: UUID (Foreign Key)
    - block_ads: BOOLEAN
    - block_social_media: BOOLEAN
    - block_notifications: BOOLEAN
    - allowlist: TEXT[]
    - schedule_enabled: BOOLEAN
    - schedule_start: TIME
    - schedule_end: TIME
    - created_at: TIMESTAMP
    - updated_at: TIMESTAMP

## Integration Points

### 1. Browser Extension
- Website and ad blocking
- Focus mode activation
- Distraction tracking
- Productivity analytics

### 2. External Services
- Calendar systems (Google Calendar, Apple Calendar)
- Task management tools (Todoist, Trello)
- Music streaming services (Spotify, Apple Music)
- Smart home devices (Phillips Hue, Nest)

### 3. Other Well-Charged Features
- Sleep tracking for energy correlation
- Exercise data for focus optimization
- Mental health metrics for holistic analysis
- Recovery recommendations based on focus patterns

## Security & Privacy
- End-to-end encryption for sensitive data
- GDPR and HIPAA compliance for medication tracking
- Secure storage of browser extension data
- Privacy-focused analytics

## AI Features
- Focus pattern recognition
- Break timing optimization
- Environment recommendations
- Productivity predictions
- Personalized strategies
- Task difficulty estimation
- Energy level optimization
- Distraction pattern analysis
