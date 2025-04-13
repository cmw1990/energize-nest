
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Moon, Smile, Activity } from "lucide-react";

interface SleepData {
  movements?: any[];
  startTime?: string;
  duration?: number;
  sensitivity?: number;
}

export const SleepAnalysis = ({ sleepData }: { sleepData: SleepData }) => {
  const { toast } = useToast();
  
  const calculateSleepQuality = () => {
    if (!sleepData.movements || sleepData.movements.length === 0) {
      return 70; // Default quality if no movement data
    }
    
    // Basic algorithm: fewer movements = higher quality sleep
    const movementCount = sleepData.movements.length;
    const hourlyMovements = movementCount / (sleepData.duration || 8);
    
    // Score from 0-100
    let quality = 100 - (hourlyMovements * 5);
    quality = Math.max(0, Math.min(100, quality));
    
    return Math.round(quality);
  };
  
  const getPhasePercentages = () => {
    return {
      deep: 25,
      light: 50,
      rem: 20,
      awake: 5
    };
  };
  
  const sleepQuality = calculateSleepQuality();
  const phases = getPhasePercentages();
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Sleep Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center">
              <div className="text-xl font-semibold">{sleepQuality}%</div>
              <div className="text-sm text-muted-foreground">Sleep Quality</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-xl font-semibold">{sleepData.duration || 0}h</div>
              <div className="text-sm text-muted-foreground">Duration</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex justify-between">
                <span className="text-sm">Deep Sleep</span>
                <span className="text-sm font-medium">{phases.deep}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Light Sleep</span>
                <span className="text-sm font-medium">{phases.light}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">REM Sleep</span>
                <span className="text-sm font-medium">{phases.rem}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Awake</span>
                <span className="text-sm font-medium">{phases.awake}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
