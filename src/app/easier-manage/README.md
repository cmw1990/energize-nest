# Easier Manage Micro-Frontend

A nutrition and diet management application integrated with the Well-Charged platform. This micro-frontend shares the same authentication and database infrastructure as the main application while maintaining its own routing and component structure.

## Features

- **Dashboard**: Monitor daily nutrition, macro tracking, and meal planning all in one view
- **Meal Planner**: Plan and schedule meals for the day, week, or month
- **Nutrition Tracker**: Log and analyze food intake and nutritional values
- **Recipe Collection**: Discover, save, and organize healthy recipes
- **Grocery List**: Generate shopping lists based on meal plans
- **Water Tracker**: Monitor daily water intake with reminders
- **Nutrition Tools**: Calculate calories, search food nutrition data, and get nutrition insights

## Directory Structure

```
easier-manage/
├── components/
│   ├── Dashboard.tsx            # Main nutrition dashboard
│   ├── MealPlanner.tsx          # Meal planning interface
│   ├── NutritionTracker.tsx     # Food logging and tracking
│   ├── Recipes.tsx              # Recipe collection and management
│   ├── GroceryList.tsx          # Shopping list generation
│   ├── WaterTracker.tsx         # Hydration tracking
│   ├── WebTools.tsx             # Nutrition calculation tools
│   ├── Settings.tsx             # User preferences and settings
│   ├── LandingPage.tsx          # Public landing page
│   └── EasierManageLayout.tsx   # Shared layout component
├── page.tsx                     # Entry point component
├── EasierManageApp.tsx          # Main app component with routing
└── capacitor.config.ts          # Capacitor configuration for mobile
```

## Database Schema

The application uses the following Supabase tables:

- `nutrition_summary`: User's daily nutrition records
- `meal_plans`: Saved meal plans and schedules
- `recipes`: Recipe collection with nutritional data
- `food_logs`: Detailed food intake records
- `grocery_lists`: Shopping lists linked to meal plans
- `water_logs`: Water intake tracking
- `nutrition_goals`: User's personalized nutrition targets

## Integration with Main App

The micro-frontend is integrated into the main application through:

1. Shared authentication using the singleton Supabase client
2. Dedicated routing at `/easier-manage/*`
3. Shared UI components from the main application
4. Common database infrastructure

## Mobile App (Capacitor)

Easier Manage is also available as a standalone mobile application built with Capacitor. The mobile app includes:

- Offline functionality for food logging
- Native notifications for reminders
- Camera integration for food scanning
- Biometric authentication options

## Development

To run the application:

```bash
npm run dev
```

Access the micro-frontend at: `http://localhost:8002/easier-manage`

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