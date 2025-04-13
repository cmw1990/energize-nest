
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Coffee, Wine, Dumbbell } from "lucide-react";

const SleepHabits = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sleep Habits</CardTitle>
        <CardDescription>Track habits that influence your sleep quality</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Coffee className="h-5 w-5 text-brown-500" />
                <h3 className="font-medium">Caffeine Intake</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Limit caffeine 6-8 hours before bedtime for better sleep quality.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Wine className="h-5 w-5 text-red-500" />
                <h3 className="font-medium">Alcohol Consumption</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Avoid alcohol 4 hours before sleep as it disrupts REM sleep.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Dumbbell className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium">Exercise</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Regular exercise improves sleep quality, but avoid intense workouts before bed.
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sun className="h-5 w-5 text-yellow-500" />
                <h3 className="font-medium">Light Exposure</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Get sunlight during the day and limit blue light exposure before bed.
              </p>
            </div>
          </div>
          
          <Button className="w-full">Track Today's Habits</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SleepHabits;
