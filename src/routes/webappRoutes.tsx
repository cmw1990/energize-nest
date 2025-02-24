import { RouteObject } from "react-router-dom";
import { WebAppLayout } from "@/layouts/WebAppLayout";
import { WebappDashboard } from "@/pages/webapp/WebappDashboard";
import { WebappEnergy } from "@/pages/webapp/WebappEnergy";
import { WebappFocus } from "@/pages/webapp/WebappFocus";
import { WebappSleep } from "@/pages/webapp/WebappSleep";
import { WebappPerformance } from "@/pages/webapp/WebappPerformance";
import { WebappMentalHealth } from "@/pages/webapp/WebappMentalHealth";
import { WebappExercise } from "@/pages/webapp/wellness/WebappExercise";
import { WebappNutrition } from "@/pages/webapp/wellness/WebappNutrition";
import { WebappSupplements } from "@/pages/webapp/wellness/WebappSupplements";
import { WebappCycle } from "@/pages/webapp/wellness/WebappCycle";
import { WebappBreathing } from "@/pages/webapp/tools/WebappBreathing";
import { WebappMeditation } from "@/pages/webapp/tools/WebappMeditation";
import { WebappEyeExercises } from "@/pages/webapp/tools/WebappEyeExercises";
import { WebappCaffeine } from "@/pages/webapp/tools/WebappCaffeine";
import { WebappGuides } from "@/pages/webapp/WebappGuides";
import { WebappConsultation } from "@/pages/webapp/support/WebappConsultation";
import { WebappSettings } from "@/pages/webapp/WebappSettings";
import { WebappProfile } from "@/pages/webapp/WebappProfile";

// New Cognitive Training Components
import { WebappMemoryTraining } from '@/pages/webapp/cognitive/WebappMemoryTraining';
import { WebappLogicGames } from '@/pages/webapp/cognitive/WebappLogicGames';
import { WebappStrategyGames } from '@/pages/webapp/cognitive/WebappStrategyGames';
import { WebappLanguageSkills } from '@/pages/webapp/cognitive/WebappLanguageSkills';

// New Focus Components
import { WebappFocusTimer } from '@/pages/webapp/focus/WebappFocusTimer';
import { WebappDistractionBlocker } from '@/pages/webapp/focus/WebappDistractionBlocker';
import { WebappFocusAnalytics } from '@/pages/webapp/focus/WebappFocusAnalytics';

// New Mental Health Components
import { WebappMoodTracking } from '@/pages/webapp/mental-health/WebappMoodTracking';
import { WebappMentalMeditation } from '@/pages/webapp/mental-health/WebappMentalMeditation';
import { WebappMentalBreathing } from '@/pages/webapp/mental-health/WebappMentalBreathing';
import { WebappJournal } from '@/pages/webapp/mental-health/WebappJournal';

// New Motivation Components
import { WebappGoalSetting } from '@/pages/webapp/motivation/WebappGoalSetting';
import { WebappHabitTracking } from '@/pages/webapp/motivation/WebappHabitTracking';
import { WebappAchievements } from '@/pages/webapp/motivation/WebappAchievements';
import { WebappRewards } from '@/pages/webapp/motivation/WebappRewards';

// New Office Wellness Components
import { WebappDeskExercises } from '@/pages/webapp/office/WebappDeskExercises';
import { WebappDeskYoga } from '@/pages/webapp/office/WebappDeskYoga';
import { WebappOfficeEyeCare } from '@/pages/webapp/office/WebappOfficeEyeCare';
import { WebappBreakTimer } from '@/pages/webapp/office/WebappBreakTimer';

// Nutrition Components
import { WebappMealLog } from '@/pages/webapp/nutrition/WebappMealLog';
import { WebappMealPlanner } from '@/pages/webapp/nutrition/WebappMealPlanner';
import { WebappEnergyRecipes } from '@/pages/webapp/nutrition/WebappEnergyRecipes';
import { WebappNutritionAnalytics } from '@/pages/webapp/nutrition/WebappNutritionAnalytics';
import { WebappMacroTracking } from '@/pages/webapp/nutrition/WebappMacroTracking';
import { WebappTeaTracking } from '@/pages/webapp/nutrition/WebappTeaTracking';
import { WebappCommunityRecipes } from '@/pages/webapp/nutrition/WebappCommunityRecipes';

// Supplement Components
import { WebappSupplementTracker } from '@/pages/webapp/supplements/WebappSupplementTracker';
import { WebappSupplementStacks } from '@/pages/webapp/supplements/WebappSupplementStacks';
import { WebappSupplementInventory } from '@/pages/webapp/supplements/WebappSupplementInventory';
import { WebappSupplementInteractions } from '@/pages/webapp/supplements/WebappSupplementInteractions';
import { WebappSupplementGuide } from '@/pages/webapp/supplements/WebappSupplementGuide';
import { WebappCreatineTracker } from '@/pages/webapp/supplements/WebappCreatineTracker';
import { WebappSupplementAnalysis } from '@/pages/webapp/supplements/WebappSupplementAnalysis';
import { WebappSupplementCommunity } from '@/pages/webapp/supplements/WebappSupplementCommunity';

export const webappRoutes: RouteObject[] = [
  {
    path: "/webapp",
    element: <WebAppLayout />,
    children: [
      // Main Routes
      { path: 'dashboard', element: <WebappDashboard /> },
      { path: 'energy', element: <WebappEnergy /> },
      { path: 'focus', element: <WebappFocus /> },
      { path: 'sleep', element: <WebappSleep /> },
      { path: 'performance', element: <WebappPerformance /> },

      // Wellness Routes
      { path: 'mental-health', element: <WebappMentalHealth /> },
      { path: 'exercise', element: <WebappExercise /> },
      { path: 'nutrition', element: <WebappNutrition /> },
      { path: 'supplements', element: <WebappSupplements /> },
      { path: 'cycle', element: <WebappCycle /> },

      // Cognitive Training Routes
      { path: 'cognitive/memory', element: <WebappMemoryTraining /> },
      { path: 'cognitive/logic', element: <WebappLogicGames /> },
      { path: 'cognitive/strategy', element: <WebappStrategyGames /> },
      { path: 'cognitive/language', element: <WebappLanguageSkills /> },

      // Focus Routes
      { path: 'focus/timer', element: <WebappFocusTimer /> },
      { path: 'focus/blocker', element: <WebappDistractionBlocker /> },
      { path: 'focus/analytics', element: <WebappFocusAnalytics /> },

      // Mental Health Routes
      { path: 'mental-health/mood', element: <WebappMoodTracking /> },
      { path: 'mental-health/meditation', element: <WebappMentalMeditation /> },
      { path: 'mental-health/breathing', element: <WebappMentalBreathing /> },
      { path: 'mental-health/journal', element: <WebappJournal /> },

      // Motivation Routes
      { path: 'motivation/goals', element: <WebappGoalSetting /> },
      { path: 'motivation/habits', element: <WebappHabitTracking /> },
      { path: 'motivation/achievements', element: <WebappAchievements /> },
      { path: 'motivation/rewards', element: <WebappRewards /> },

      // Office Wellness Routes
      { path: 'office/desk-exercises', element: <WebappDeskExercises /> },
      { path: 'office/desk-yoga', element: <WebappDeskYoga /> },
      { path: 'office/eye-care', element: <WebappOfficeEyeCare /> },
      { path: 'office/break-timer', element: <WebappBreakTimer /> },

      // Nutrition Routes
      { path: 'nutrition/meal-log', element: <WebappMealLog /> },
      { path: 'nutrition/meal-planner', element: <WebappMealPlanner /> },
      { path: 'nutrition/recipes', element: <WebappEnergyRecipes /> },
      { path: 'nutrition/analytics', element: <WebappNutritionAnalytics /> },
      { path: 'nutrition/macros', element: <WebappMacroTracking /> },
      { path: 'nutrition/tea', element: <WebappTeaTracking /> },
      { path: 'nutrition/community', element: <WebappCommunityRecipes /> },

      // Supplement Routes
      { path: 'supplements/tracker', element: <WebappSupplementTracker /> },
      { path: 'supplements/stacks', element: <WebappSupplementStacks /> },
      { path: 'supplements/inventory', element: <WebappSupplementInventory /> },
      { path: 'supplements/interactions', element: <WebappSupplementInteractions /> },
      { path: 'supplements/guide', element: <WebappSupplementGuide /> },
      { path: 'supplements/creatine', element: <WebappCreatineTracker /> },
      { path: 'supplements/analysis', element: <WebappSupplementAnalysis /> },
      { path: 'supplements/community', element: <WebappSupplementCommunity /> },

      // Support Routes
      { path: 'guides', element: <WebappGuides /> },
      { path: 'consultation', element: <WebappConsultation /> },
      { path: 'settings', element: <WebappSettings /> },
      { path: 'profile', element: <WebappProfile /> },
    ],
  },
];
