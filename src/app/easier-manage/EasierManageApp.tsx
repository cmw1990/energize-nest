import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { EasierManageLayout } from './components/EasierManageLayout';
import { Dashboard } from './components/Dashboard';
import { MealPlanner } from './components/MealPlanner';
import { NutritionTracker } from './components/NutritionTracker';
import { Recipes } from './components/Recipes';
import { GroceryList } from './components/GroceryList';
import { WaterTracker } from './components/WaterTracker';
import { Settings } from './components/Settings';
import { LandingPage } from './components/LandingPage';
import { WebTools } from './components/WebTools';

interface EasierManageAppProps {
  session: Session | null;
}

export const EasierManageApp: React.FC<EasierManageAppProps> = ({ session }) => {
  // Check if we're on the landing page route
  const isLandingPage = window.location.pathname === '/easier-manage';
  
  // If we're on the landing page, show it without the app layout
  if (isLandingPage) {
    return <LandingPage session={session} />;
  }
  
  // Otherwise show the app with its layout
  return (
    <EasierManageLayout>
      <Routes>
        <Route path="app" element={<Dashboard session={session} />} />
        <Route path="app/meal-planner" element={<MealPlanner session={session} />} />
        <Route path="app/nutrition-tracker" element={<NutritionTracker session={session} />} />
        <Route path="app/recipes" element={<Recipes session={session} />} />
        <Route path="app/grocery-list" element={<GroceryList session={session} />} />
        <Route path="app/water-tracker" element={<WaterTracker session={session} />} />
        <Route path="app/tools" element={<WebTools session={session} />} />
        <Route path="app/settings" element={<Settings session={session} />} />
      </Routes>
    </EasierManageLayout>
  );
}; 