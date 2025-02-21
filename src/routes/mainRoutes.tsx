
import { RouteObject } from "react-router-dom";
import CreateEnergyPlanPage from "@/pages/CreateEnergyPlanPage";
import EnergyPlans from "@/pages/EnergyPlans";
import Pregnancy from "@/pages/Pregnancy";
import LandingPage from "@/pages/LandingPage";
import { InsuranceDashboard } from "@/pages/insurance/Dashboard";
import { InsuranceClaimSubmission } from "@/pages/insurance/SubmitClaim";
import { InsuranceCoverageVerification } from "@/pages/insurance/VerifyCoverage";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Sleep from "@/pages/Sleep";
import Focus from "@/pages/Focus";
import Meditation from "@/pages/Meditation";
import Exercise from "@/pages/Exercise";
import Breathing from "@/pages/Breathing";
import EyeExercises from "@/pages/EyeExercises";
import Food from "@/pages/Food";
import Recovery from "@/pages/Recovery";
import Caffeine from "@/pages/Caffeine";
import Nicotine from "@/pages/Nicotine";
import Supplements from "@/pages/Supplements";

export const mainRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "sleep",
        element: <Sleep />,
      },
      {
        path: "focus",
        element: <Focus />,
      },
      {
        path: "meditation",
        element: <Meditation />,
      },
      {
        path: "exercise",
        element: <Exercise />,
      },
      {
        path: "breathing",
        element: <Breathing />,
      },
      {
        path: "eye-exercises",
        element: <EyeExercises />,
      },
      {
        path: "food",
        element: <Food />,
      },
      {
        path: "recovery",
        element: <Recovery />,
      },
      {
        path: "caffeine",
        element: <Caffeine />,
      },
      {
        path: "nicotine",
        element: <Nicotine />,
      },
      {
        path: "supplements",
        element: <Supplements />,
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
    ],
  },
  {
    path: "/landing",
    element: <LandingPage />,
  },
];

