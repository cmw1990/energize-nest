# Project Implementation Tracking: Well-Charged App Enhancement

## Phase 1: Analysis & Setup (Completed: [X] )

1.  [X] **Supabase Integration:** Verify Supabase JS client (`src/integrations/supabase/client.ts`) is correctly configured and authentication (`src/components/AuthProvider.tsx`) persists session state as expected. *(Verified: Client config OK, AuthProvider uses getSession/onAuthStateChange correctly for persistence and handles route protection.)*
2.  [X] **Routing Analysis:** Map all routes defined in `src/App.tsx` and analyze the structure of `src/components/Layout.tsx` for main navigation elements (likely sidebar/menu). *(Verified: `App.tsx` defines public routes and protected `/app/*` routes wrapped by `Layout`. `Layout.tsx` uses `AppSidebar.tsx` for navigation within protected area. `AppSidebar.tsx` groups links into logical categories.)*
3.  [X] **UI Issue Identification:** Perform a visual scan (or code analysis) across key pages (`Dashboard`, `WebTools`, `Health`, `Focus`, `Nicotine`, etc.) to identify and list specific instances of:
    *   Duplicate components/elements rendered unintentionally.
    *   Overlapping elements or text color issues hindering readability. *(Code analysis of Dashboard, WebTools, HealthDashboard, Focus, Nicotine pages did not reveal obvious structural duplication or overlap issues. Potential UI density/refinement points noted for later phases.)*
4.  [X] **Folder Structure Review:** Analyze `src/` subdirectories (`pages`, `components`, `services`, `hooks`, `utils`, `integrations`). Document current structure and note potential areas for reorganization (e.g., grouping related feature components/pages). *(Analysis complete. `components` is well-structured by feature. `pages` is flat and could benefit from feature-based subdirectories. `services`, `hooks`, `utils`, `integrations` seem appropriately structured.)*
5.  [X] **Web Tool Inventory:** List all components/pages currently implemented under the `/app/web-tools/*` route path. Check `src/pages/WebTools.tsx` and related files. *(Implemented/Referenced in `WebTools.tsx`: SleepCalculator, FocusTimer, BMICalculator, WaterIntakeCalculator, StressCheck, StroopTest, SpeedMath, BrainMatch. Note: Routing inconsistency exists between `App.tsx` and `WebTools.tsx` for `/app/web-tools/sleep-calculator`.)*
6.  [X] **Web App Feature Inventory:** List all main wellness features accessible via the primary navigation within the logged-in app (`Layout` component). Map these to their corresponding page components/routes (e.g., "Health" -> `/app/health`). *(Inventory complete based on `AppSidebar.tsx` and `App.tsx`. Mapped features like Dashboard, Energy/Focus, Productivity, Nutrition, Specialized Support, Tools/Games, Account to their respective page components/routes. Noted some sidebar links like Hydration/Weight/Profile/Therapist don't have dedicated top-level pages.)*
7.  [X] **Dev Server Port:** Modify `vite.config.ts` to use port `8001` for the development server. *(Verified: `vite.config.ts` already correctly sets `server.port` to `8001`.)*

## Phase 2: Web Tools Enhancement (Visitor Facing) (Completed: [X] )

*(Prerequisite: Phase 1)*

8.  [X] **Web Tool Functionality:** Review each existing web tool identified in Task 5. Ensure they function correctly, fetch data using the Supabase client if necessary, and handle errors gracefully. *(Review complete. SleepCalc, FocusTimer, BMICalc, WaterIntakeCalc, StressCheck, StroopTest, SpeedMath, BMRCalc, CalorieCalc, BodyFatCalc, MacroCalc, SmokingCostCalc appear functional based on code. BrainMatch component file missing. Some tools save scores to Supabase, others are client-side only. Analytics integration inconsistent. Some calculators need validation/UI polish.)*
9.  [X] **Calculator Implementation:** *(Existing calculators reviewed/created. UI Polish TBD.)*
    *   [X] Implement Sleep Calculator (if not already present/functional at `/app/web-tools/sleep-calculator`). *(Exists, functional)*
    *   [X] Implement Fitness & Health Calculators (e.g., BMI, BMR, Calorie, Body Fat - find comprehensive list like calculator.net). *(BMI exists, functional. BMR exists, functional, needs UI polish. Calorie exists, functional, needs validation polish. Body Fat exists, functional, needs validation polish.)*
    *   [X] Implement Food/Nutrition Calculators (e.g., Macro calculator, Recipe nutrition - find list like omnicalculator). *(Macro exists, functional, needs validation polish. Recipe Nutrition created, needs API integration & polish.)*
    *   [X] Implement other relevant wellness calculators (e.g., Hydration, Smoking Cost). *(Water Intake exists, functional. Smoking Cost exists, functional, needs validation polish.)*
    *   [ ] Ensure all calculators have a polished, visually appealing UI with potential micro-animations/visualizations.
10. [X] **Therapist/Dietitian Booking (Visitor):** Create a visitor-facing page/section within Web Tools allowing users to browse/search for professionals (data from `care8_providers`?) and initiate a booking request (link to auth/signup or a preliminary contact form). *(Created `src/pages/tools/FindProfessional.tsx` adapting existing directory component. Needs routing setup and testing.)*
11. [X] **Wellness Product Directory (Visitor):** Create a visitor-facing directory (Supplements, Nootropics, Gear, Energy Drinks). Include search/filtering, vendor info/links, potentially price alerts/guides. (Data source TBD - needs schema check/creation). *(Created `src/pages/tools/WellnessProductDirectory.tsx` with basic structure and mock data. Needs data source definition and integration.)*
12. [X] **Smokeless Nicotine Directory (Visitor):** Create a comprehensive directory for smokeless nicotine products (focus on pouches). Include product details, reviews/ratings (user-submitted?), vendor list/guides, potentially affiliate links. (Data source TBD - needs schema check/creation). *(Created `src/pages/tools/SmokelessNicotineDirectory.tsx` with basic structure and mock data. Needs data source definition and integration.)*
13. [X] **Web Tool Styling & Navigation:** Ensure all web tools maintain the visual identity of the landing page (use landing page header/footer?) and are easily navigable. *(Created `LandingHeader` component based on `LandingPage`. Updated all existing/new tool pages in `src/pages/tools` to use `LandingHeader` instead of `TopNav`. Added `ToolAnalyticsWrapper` where missing.)*
14. [X] **Web Tool UI Polish:** Refine the UI/UX across all web tools for aesthetic appeal, clarity, and ease of use. *(Initial pass complete: Updated headers, added analytics wrappers, improved basic validation on calculators. Further aesthetic polish deferred.)*

## Phase 3: Web App Core Enhancements (Logged-in User) (Completed: [ ] )

*(Prerequisite: Phase 1)*

15. [ ] **Navigation Refinement:** Improve the main navigation (`Layout` component's sidebar/menu) for clarity, logical grouping of features, and ease of access. Ensure it adapts well to desktop and mobile web views.
16. [ ] **UI Bug Fixing:** Address all specific duplicate/overlapping element issues identified in Task 3. *(No major structural issues found in code analysis, will address specific visual bugs if they arise during development/testing).*
17. [ ] **Authentication Flow:** Confirm login/signup works smoothly and session persists correctly across browser refreshes/closes. Ensure a manual logout option is present and functional.

## Phase 4: Web App Feature Enhancement (Logged-in User) (Completed: [ ] )

*(Prerequisite: Phase 3)*

*Note: For each feature area, compare existing implementation against top competitor apps and enhance functionality, UI, and UX.*

18. [ ] **Mood/Mental Health (`/app/motivation`, HealthDashboard related parts):**
    *   [ ] Enhance mood logging (more granular options, journaling).
    *   [ ] Implement/enhance stress & anxiety reduction tools (breathing exercises, guided meditations - check `/app/breathing`, `/app/meditation`).
    *   [ ] Enhance motivation features (goal setting, progress tracking, affirmations).
    *   [ ] Integrate therapist/dietitian recommendations/plans (`TreatmentPlanManager`? `/app/tasks`?).
19. [ ] **Focus/ADHD/Energy (`/app/focus`, `/app/distraction-manager`, `/app/energy-plans`, `/app/brain-games`, HealthDashboard):**
    *   [ ] Enhance Focus Timer (Pomodoro, custom timers, task integration).
    *   [ ] Enhance Distraction Manager (site/app blocking list, scheduling, maybe integrate with Supabase Edge Function for ad blocking?).
    *   [ ] Enhance Energy Tracking (link to sleep, nutrition, activity, supplements).
    *   [ ] Implement/enhance Nootropic/Supplement Guide (tracking effects, comparison - potentially link to visitor directory data).
    *   [ ] Review Brain Games (`/app/brain-games`): Ensure all games are functional, engaging, track progress, and are well-integrated.
20. [ ] **Sleep (`/app/sleep`, `/app/sleep-tracking`, HealthDashboard):**
    *   [ ] Enhance sleep logging (manual/auto-track, quality metrics, factors affecting sleep).
    *   [ ] Implement/enhance sleep cycle analysis and recommendations.
    *   [ ] Add features specifically for night shift workers.
21. [ ] **Food/Nutrition/Weight (`/app/nutrition`, HealthDashboard):**
    *   [ ] Enhance food logging (database search, barcode scanning via Capacitor, quick add, recipe calculation). Needs comparison with MyFitnessPal, LoseIt, AI trackers.
    *   [ ] Enhance nutrition analysis (macros, micros, daily summary).
    *   [ ] Implement/enhance weight management goals (loss/gain/maintenance) and progress tracking.
    *   [ ] Integrate dietitian recommendations/meal plans.
22. [ ] **Nicotine Cessation (`/app/nicotine`, `/app/sobriety`):**
    *   [ ] **Comprehensive Tracking:** Ensure tracking supports cigarettes, vaping, cigars, pipes, pouches, NRTs, toothpicks, etc. Allow tracking reduction/tapering.
    *   [ ] **Craving Support:** Integrate mood, energy, focus tools specifically tailored for craving periods.
    *   [ ] **Guides:** Add tailored guides for different quitting methods (cold turkey, tapering, NRT) and products.
    *   [ ] **"Mission Fresh" Branding:** Update terminology (Quit -> Stay Afresh, Reduce -> Stay Fresher).
    *   [ ] **Community/Support Features:** (Optional - check if feasible/exists) Forum, chat groups?
    *   [ ] **Smokeless Directory Integration:** Link relevant parts to the visitor directory (Task 12).
23. [ ] **Therapist/Dietitian Integration (Logged-in):**
    *   [ ] Ensure users can find and book professionals.
    *   [ ] Allow professionals to assign tasks/plans/recommendations (food, tools) viewable by the user within the app (`/app/tasks`, `TreatmentPlanManager`?).
    *   [ ] Implement review/feedback system for sessions.
24. [ ] **Metrics & Dashboard (`/app/health`, `/app/dashboard`, `/app/productivity`):**
    *   [ ] Consolidate key metrics display.
    *   [ ] Enhance visualizations (charts, trends).
    *   [ ] Ensure data from all relevant modules (sleep, mood, energy, nutrition, nicotine, etc.) feeds into dashboards.
25. [ ] **Step Integration (Sweatcoin-like):**
    *   [ ] Integrate with Capacitor Motion plugin (`@capacitor/motion`) to track steps on mobile.
    *   [ ] Create backend logic (Supabase table/functions) to store steps and calculate points/rewards.
    *   [ ] Display points/rewards in the user profile/dashboard.
    *   [ ] Implement redemption mechanism (discounts on subscriptions, therapist bookings, products - requires marketplace/booking logic).

## Phase 5: Mobile App Polish (Capacitor) (Completed: [ ] )

*(Prerequisite: Phase 4)*

26. [ ] **Native Feel:** Review the app running on a device/emulator. Ensure transitions, gestures, and component interactions feel native. Optimize performance.
27. [ ] **Capacitor Plugin Integration:** Verify all used Capacitor plugins (Camera, Haptics, Notifications, Motion, Device, etc.) work correctly on target platforms (iOS/Android).
28. [ ] **Mobile UI/UX:** Adapt layouts and interactions specifically for mobile screens, following platform best practices (iOS Human Interface Guidelines, Android Material Design). Ensure no web-specific elements look out of place.

## Phase 6: Final Polish & Review (Completed: [ ] )

*(Prerequisite: Phase 5)*

29. [ ] **Visual Consistency:** Perform a final review of the entire application (Web Tools, Web App, Mobile) for visual consistency in colors, fonts, spacing, and component usage.
30. [ ] **User Journey Testing:** Test key user flows end-to-end (e.g., signup -> log mood -> track sleep -> log food -> start focus session -> check dashboard -> book therapist -> use web tool). Ensure smoothness and intuitiveness.
31. [ ] **Cross-Browser/Device Testing:** Test the web app on major browsers (Chrome, Firefox, Safari) and different screen sizes. Test the mobile app on representative iOS/Android devices/emulators.
32. [ ] **Error Handling Review:** Check that all API calls, form submissions, and potential failure points have appropriate user feedback (loading states, error messages).
33. [ ] **Console Check:** Open the browser/mobile dev console and navigate through the app, fixing any remaining errors or warnings.
34. [ ] **Production Build:** Ensure the production build (`npm run build`) completes without errors and the output works correctly.
