import React from 'react';
import { Session } from '@supabase/supabase-js';
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';

interface MealPlannerProps {
  session: Session | null;
}

export const MealPlanner: React.FC<MealPlannerProps> = ({ session }) => {
  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Meal Planner</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Meal Plan
          </CardTitle>
          <CardDescription>
            Plan and schedule your meals for the week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-20">
            Meal planning functionality will be implemented here
          </p>
        </CardContent>
      </Card>
    </div>
  );
}; 