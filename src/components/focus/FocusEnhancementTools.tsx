
import React from 'react';
import { Button } from "@/components/ui/button";
import { Clock, Focus, Target } from "lucide-react";

export const FocusEnhancementTools = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg flex flex-col items-center">
          <Clock className="h-8 w-8 text-primary mb-2" />
          <h3 className="font-medium">Pomodoro Timer</h3>
          <p className="text-sm text-muted-foreground text-center my-2">
            Work in focused intervals with short breaks
          </p>
          <Button size="sm" className="mt-2">Start Timer</Button>
        </div>
        
        <div className="p-4 border rounded-lg flex flex-col items-center">
          <Target className="h-8 w-8 text-primary mb-2" />
          <h3 className="font-medium">Focus Mode</h3>
          <p className="text-sm text-muted-foreground text-center my-2">
            Block distractions and improve concentration
          </p>
          <Button size="sm" className="mt-2">Activate</Button>
        </div>
      </div>
      
      <div className="text-center py-2">
        <p className="text-sm text-muted-foreground">
          Start using these tools to improve your focus and productivity
        </p>
      </div>
    </div>
  );
};
