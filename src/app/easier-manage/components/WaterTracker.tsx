import React from 'react';
import { Session } from '@supabase/supabase-js';
import { Droplet } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';

interface WaterTrackerProps {
  session: Session | null;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({ session }) => {
  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Water Tracker</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplet className="h-5 w-5" />
            Hydration Tracking
          </CardTitle>
          <CardDescription>
            Monitor your daily water intake
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-20">
            Water tracking functionality will be implemented here
          </p>
        </CardContent>
      </Card>
    </div>
  );
}; 