import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Lazy load dashboard pages
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'));

import SleepTrack from "@/pages/SleepTrack";
import Exercise from "@/pages/Exercise";
import Focus from "@/pages/Focus";
import MentalHealth from "@/pages/MentalHealth";
import EnergyPlans from "@/pages/EnergyPlans";
import Recovery from "@/pages/Recovery";
import Consultation from "@/pages/Consultation";
import Recipes from "@/pages/Recipes";
import Analytics from "@/pages/Analytics";
import Settings from "@/pages/Settings";

// Import tool pages
import WhiteNoise from "@/pages/tools/WhiteNoise";
import FocusTimer from "@/pages/tools/FocusTimer";
import NatureSounds from "@/pages/tools/NatureSounds";
import BreathingExercises from "@/pages/tools/BreathingExercises";
import SleepSounds from "@/pages/tools/NatureSounds"; // We'll use NatureSounds for sleep sounds
import MeditationTimer from "@/pages/tools/FocusTimer"; // We'll use FocusTimer for meditation

export const wellnessRoutes: RouteObject[] = [
  {
    path: 'dashboard',
    element: <Dashboard />,
  },
  {
    path: 'sleep',
    element: <SleepTrack />,
  },
  {
    path: 'exercise',
    element: <Exercise />,
  },
  {
    path: 'focus',
    element: <Focus />,
  },
  {
    path: 'mental-health',
    element: <MentalHealth />,
  },
  {
    path: 'energy-plans',
    element: <EnergyPlans />,
  },
  {
    path: 'recovery',
    element: <Recovery />,
  },
  {
    path: 'consultation',
    element: <Consultation />,
  },
  {
    path: 'recipes',
    element: <Recipes />,
  },
  {
    path: 'analytics',
    element: <Analytics />,
  },
  {
    path: 'settings',
    element: <Settings />,
  },
  // Tool routes
  {
    path: 'tools',
    children: [
      {
        path: 'white-noise',
        element: <WhiteNoise />,
      },
      {
        path: 'pomodoro',
        element: <FocusTimer />,
      },
      {
        path: 'distraction-blocker',
        element: <Focus />, // Using Focus page for now as distraction blocker
      },
      {
        path: 'sleep-sounds',
        element: <SleepSounds />,
      },
      {
        path: 'meditation',
        element: <MeditationTimer />,
      },
      {
        path: 'breathing-exercises',
        element: <BreathingExercises />,
      },
    ]
  },
];
