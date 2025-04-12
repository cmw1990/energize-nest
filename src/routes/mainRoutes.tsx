
import { RouteObject } from "react-router-dom";
import CreateEnergyPlanPage from "@/pages/CreateEnergyPlanPage";
import EnergyPlans from "@/pages/EnergyPlans";
import Pregnancy from "@/pages/Pregnancy";
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import InsuranceDashboard from "@/pages/insurance/Dashboard";
import { InsuranceClaimSubmission } from "@/pages/insurance/SubmitClaim";
import { InsuranceCoverageVerification } from "@/pages/insurance/VerifyCoverage";
import Tools from "@/pages/tools/Tools";
import GamesHub from "@/pages/games/GamesHub";
import Tasks from "@/pages/Tasks";
import Calendar from "@/pages/Calendar";
import Tracking from "@/pages/Tracking";
import Focus from "@/pages/Focus";
import Auth from "@/pages/Auth";
import ErrorPage from "@/pages/ErrorPage";
import PregnancyLog from "@/pages/PregnancyLog";
import HealthDashboard from "@/pages/HealthDashboard";
import Recovery from "@/pages/Recovery";
import Sobriety from "@/pages/Sobriety";
import Nutrition from "@/pages/Nutrition";
import BMICalculator from "@/pages/tools/BMICalculator";
import WordScramble from "@/pages/tools/WordScramble";
import WithdrawalTracker from "@/pages/tools/WithdrawalTracker";
import SleepGuideArticle from "@/pages/tools/SleepGuideArticle";
import SleepTracking from "@/pages/tools/SleepTracking";
import StressCheck from "@/pages/tools/StressCheck";
import WhiteNoise from "@/pages/tools/WhiteNoise";
import StroopTest from "@/pages/tools/StroopTest";
import FocusTimer from "@/pages/tools/FocusTimer";
import SpeedMath from "@/pages/tools/SpeedMath";
import WaterIntakeCalculator from "@/pages/tools/WaterIntakeCalculator";

export const mainRoutes: RouteObject[] = [
  {
    path: "/",
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "app",
        element: <Dashboard />,
      },
      {
        path: "app/dashboard",
        element: <Dashboard />,
      },
      {
        path: "energy-plans",
        element: <EnergyPlans />,
      },
      {
        path: "energy-plans/create",
        element: <CreateEnergyPlanPage />,
      },
      {
        path: "pregnancy",
        element: <Pregnancy />,
      },
      {
        path: "pregnancy/log",
        element: <PregnancyLog />,
      },
      {
        path: "insurance/dashboard",
        element: <InsuranceDashboard />,
      },
      {
        path: "insurance/submit-claim",
        element: <InsuranceClaimSubmission />,
      },
      {
        path: "insurance/verify-coverage",
        element: <InsuranceCoverageVerification />,
      },
      {
        path: "tools",
        element: <Tools />,
      },
      {
        path: "tools/bmi-calculator",
        element: <BMICalculator />,
      },
      {
        path: "tools/word-scramble",
        element: <WordScramble />,
      },
      {
        path: "tools/withdrawal-tracker",
        element: <WithdrawalTracker />,
      },
      {
        path: "tools/sleep-guide",
        element: <SleepGuideArticle />,
      },
      {
        path: "tools/sleep-tracking",
        element: <SleepTracking />,
      },
      {
        path: "tools/stress-check",
        element: <StressCheck />,
      },
      {
        path: "tools/white-noise",
        element: <WhiteNoise />,
      },
      {
        path: "tools/stroop-test",
        element: <StroopTest />,
      },
      {
        path: "tools/focus-timer",
        element: <FocusTimer />,
      },
      {
        path: "tools/speed-math",
        element: <SpeedMath />,
      },
      {
        path: "tools/water-intake-calculator",
        element: <WaterIntakeCalculator />,
      },
      {
        path: "games",
        element: <GamesHub />,
      },
      {
        path: "tasks",
        element: <Tasks />,
      },
      {
        path: "calendar",
        element: <Calendar />,
      },
      {
        path: "tracking",
        element: <Tracking />,
      },
      {
        path: "health",
        element: <HealthDashboard />,
      },
      {
        path: "nutrition",
        element: <Nutrition />,
      },
      {
        path: "focus",
        element: <Focus />,
      },
      {
        path: "auth",
        element: <Auth />,
      },
      {
        path: "error",
        element: <ErrorPage />,
      },
      {
        path: "sobriety",
        element: <Sobriety />,
      },
      {
        path: "sobriety/recovery",
        element: <Recovery />,
      },
    ],
  }
];
