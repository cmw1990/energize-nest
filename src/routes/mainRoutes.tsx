import { RouteObject } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import { InsuranceDashboard } from "@/pages/insurance/Dashboard";
import { SubmitClaim } from "@/pages/insurance/SubmitClaim";
import { VerifyCoverage } from "@/pages/insurance/VerifyCoverage";
import EnergyPlans from "@/pages/EnergyPlans";
import { EnergyPlanDetailsPage } from "@/pages/EnergyPlanDetailsPage";
import { CreateEnergyPlanPage } from "@/pages/CreateEnergyPlanPage";
import { EditEnergyPlanPage } from "@/pages/EditEnergyPlanPage";
import { AdBlockerPage } from "@/pages/AdBlockerPage";
import { devRoutes } from './devRoutes';

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
        path: "insurance",
        element: <InsuranceDashboard />,
      },
      {
        path: "insurance/submit-claim",
        element: <SubmitClaim />,
      },
      {
        path: "insurance/verify",
        element: <VerifyCoverage />,
      },
      {
        path: "energy-plans",
        element: <EnergyPlans />,
      },
      {
        path: "energy-plans/:id",
        element: <EnergyPlanDetailsPage />,
      },
      {
        path: "energy-plans/create",
        element: <CreateEnergyPlanPage />,
      },
      {
        path: "energy-plans/:id/edit",
        element: <EditEnergyPlanPage />,
      },
      {
        path: "ad-blocker",
        element: <AdBlockerPage />,
      }
    ],
  },
  ...devRoutes,
];
