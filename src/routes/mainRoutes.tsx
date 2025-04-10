
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
    ],
  }
];
