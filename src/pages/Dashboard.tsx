
import React from 'react';
import { MoodOverview } from '@/components/MoodOverview';
import { EnergyPatternAnalysis } from '@/components/health/EnergyPatternAnalysis';
import { TailoredRecommendations } from '@/components/health/TailoredRecommendations';
import { ActivityTracker } from '@/components/health/ActivityTracker';
import { WaterIntakeTracker } from '@/components/health/WaterIntakeTracker';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { session } = useAuth();

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
        <h1 className="text-2xl font-bold">Welcome to Energy Support</h1>
        <p className="text-muted-foreground">Please sign in to access your dashboard</p>
        <Button asChild>
          <Link to="/auth">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      
      {/* Mood and Energy Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <MoodOverview />
        <WaterIntakeTracker />
      </div>
      
      {/* Health Tracking Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <ActivityTracker />
        <EnergyPatternAnalysis />
      </div>
      
      {/* Personalized Recommendations */}
      <TailoredRecommendations />
    </div>
  );
};

export default Dashboard;
