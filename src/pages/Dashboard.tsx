
import React from 'react';
import { MoodOverview } from '@/components/MoodOverview';
import { EnergyPatternAnalysis } from '@/components/health/EnergyPatternAnalysis';
import { TailoredRecommendations } from '@/components/health/TailoredRecommendations';
import { ActivityTracker } from '@/components/health/ActivityTracker';
import { WaterIntakeTracker } from '@/components/health/WaterIntakeTracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Battery, Brain, Droplet, Heart, Zap } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Energy Dashboard</h1>
        <div className="flex items-center gap-2 text-primary">
          <Battery className="h-5 w-5" />
          <span className="font-medium">Energy Support</span>
        </div>
      </div>
      
      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/30 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5 text-emerald-500" />
              Today's Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Track your daily physical and mental activities</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/30 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Droplet className="h-5 w-5 text-blue-500" />
              Hydration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Monitor your water intake throughout the day</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/30 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="h-5 w-5 text-purple-500" />
              Mental Wellness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Keep track of your mental energy and focus</p>
          </CardContent>
        </Card>
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
      <Card className="border border-primary/10 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Your Energy Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TailoredRecommendations />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
