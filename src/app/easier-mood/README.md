# Easier Mood Micro-Frontend

A mood tracking and emotional wellbeing application integrated with the Well-Charged platform. This micro-frontend shares the same authentication and database infrastructure as the main application while maintaining its own routing and component structure.

## Features

- **Dashboard**: Monitor your mood trends, emotional patterns, and wellbeing metrics
- **Mood Tracker**: Log and track your daily moods and emotions with detailed insights
- **Journal**: Express your thoughts and feelings through guided journaling exercises
- **Community**: Connect with others in a supportive environment to share experiences
- **Resources**: Access articles, videos, and tools to improve emotional wellbeing
- **Settings**: Customize your mood tracking preferences and notification settings

## Directory Structure

```
easier-mood/
├── components/
│   ├── Dashboard.tsx          # Main mood analytics dashboard
│   ├── MoodTracker.tsx        # Mood and emotion tracking interface
│   ├── Journal.tsx            # Journaling and reflection tools
│   ├── Community.tsx          # Community support and interaction
│   ├── Resources.tsx          # Educational resources and tools
│   ├── Settings.tsx           # User preferences and settings
│   ├── LandingPage.tsx        # Public landing page
│   └── EasierMoodLayout.tsx   # Shared layout component
├── page.tsx                   # Entry point component
├── EasierMoodApp.tsx          # Main app component with routing
└── capacitor.config.ts        # Capacitor configuration for mobile
```

## Database Schema

The application uses the following Supabase tables:

- `mood_entries`: User's mood and emotion tracking records
- `journal_entries`: Personal journal entries and reflections
- `community_posts`: Community interaction and support posts
- `community_comments`: Comments on community posts
- `resource_bookmarks`: Saved educational resources
- `mood_settings`: User preferences for mood tracking

## Integration with Main App

The micro-frontend is integrated into the main application through:

1. Shared authentication using the singleton Supabase client
2. Dedicated routing at `/easier-mood/*`
3. Shared UI components from the main application
4. Common database infrastructure

## Mobile App (Capacitor)

Easier Mood is also available as a standalone mobile application built with Capacitor. The mobile app includes:

- Offline mood tracking
- Push notifications for mood check-ins
- Biometric authentication for journal privacy
- Native sharing capabilities

## Development

To run the application:

```bash
npm run dev
```

Access the micro-frontend at: `http://localhost:8002/easier-mood`

To build and run the mobile app:

```bash
# Build the web app
npm run build

# Sync with Capacitor
npx cap sync

# Open in Android Studio
npx cap open android

# Open in Xcode
npx cap open ios
```

## Security

- Row Level Security (RLS) policies ensure data privacy
- Authentication handled through the main app's AuthProvider
- All database operations use the singleton Supabase client
- Journal entries can be encrypted for additional privacy 