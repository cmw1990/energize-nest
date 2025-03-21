# Mission Fresh - L1 Core Edition

This is the streamlined L1 Core version of the Mission Fresh application, containing only the essential components needed for deployment.

## Overview

Mission Fresh is a smoking cessation application that helps users track and manage their quitting journey. This L1 Core Edition includes only the essential components for a working application:

- Database schema for all required tables
- Migration scripts to set up the database
- Verification tools to ensure proper setup

## Database Tables

The application relies on the following core tables:

- `user_settings8` - User configuration and preferences
- `guide_articles8` - Educational content for quitting journey
- `nrt_products8` - Nicotine replacement therapy products directory
- `progress8` - User progress tracking for their quit journey
- `consumption_logs8` - Records of nicotine consumption
- `quit_plans8` - User's personalized quitting plans
- `financial_tracking8` - Financial impacts and savings from quitting
- `craving_logs8` - User's cravings records and response strategies
- `connected_devices` - Health tracking device connections

## Setup Instructions

1. Clone this repository
2. Install dependencies: `npm install`
3. Run the database migrations: `node micro-frontends/mission-fresh/scripts/l1-migrations.js`
4. Verify tables exist: `node micro-frontends/mission-fresh/scripts/verify-tables.js`
5. Start the application: `npm run dev`

## Deployment

This L1 Core edition is specifically designed for streamlined deployment with minimal dependencies.

To deploy to GitHub:

```bash
git remote add origin https://github.com/yourusername/mission-fresh.git
git push -u origin l1-essentials
```

## License

This project is proprietary and confidential.
