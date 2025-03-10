import React from 'react';
import { Session } from '@supabase/supabase-js';
import { BarChart2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';

interface NutritionTrackerProps {
  session: Session | null;
}

export const NutritionTracker: React.FC<NutritionTrackerProps> = ({ session }) => {
  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Nutrition Tracker</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5" />
            Food Logging
          </CardTitle>
          <CardDescription>
            Track your daily food intake and nutrition
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-20">
            Nutrition tracking functionality will be implemented here
          </p>
        </CardContent>
      </Card>
    </div>
  );
}; 