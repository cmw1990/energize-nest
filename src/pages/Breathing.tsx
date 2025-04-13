
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BreathingExercises } from "@/components/relax/BreathingExercises";
import { SmartBreakSuggestions } from "@/components/focus/SmartBreakSuggestions";
import { Wind, Brain, Activity, Lungs, Flower2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Breathing = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Breathing Techniques</h1>
        <div className="flex items-center gap-2 text-primary">
          <Wind className="h-5 w-5" />
          <span className="font-medium">Breath Control</span>
        </div>
      </div>
      
      {/* Quick Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="bg-white/80 dark:bg-white/10 rounded-full p-3">
                <Wind className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="font-medium">Calm Breathing</h3>
              <p className="text-sm text-muted-foreground">
                Techniques to reduce stress and anxiety
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => document.getElementById('breathing-exercises')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Start Practice
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="bg-white/80 dark:bg-white/10 rounded-full p-3">
                <Brain className="h-5 w-5 text-emerald-500" />
              </div>
              <h3 className="font-medium">Focus Breathing</h3>
              <p className="text-sm text-muted-foreground">
                Breath patterns for enhanced concentration
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => document.getElementById('breathing-exercises')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Begin Session
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="bg-white/80 dark:bg-white/10 rounded-full p-3">
                <Activity className="h-5 w-5 text-amber-500" />
              </div>
              <h3 className="font-medium">Energy Breathing</h3>
              <p className="text-sm text-muted-foreground">
                Techniques to boost energy and alertness
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => document.getElementById('breathing-exercises')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Energize
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card id="breathing-exercises" className="border border-primary/10 scroll-mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lungs className="h-5 w-5 text-primary" />
                Breathing Exercises
              </CardTitle>
              <CardDescription>
                Control your breath to reduce stress and improve focus
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BreathingExercises />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="border border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Breathing Benefits
              </CardTitle>
              <CardDescription>
                The science behind controlled breathing techniques
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full shrink-0">
                    <Brain className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Stress Reduction</h3>
                    <p className="text-sm text-muted-foreground">
                      Deep, slow breathing activates the parasympathetic nervous system, reducing stress hormones and promoting relaxation.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full shrink-0">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Improved Focus</h3>
                    <p className="text-sm text-muted-foreground">
                      Controlled breathing increases oxygen to your brain, enhancing cognitive function and mental clarity.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full shrink-0">
                    <Lungs className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Better Sleep</h3>
                    <p className="text-sm text-muted-foreground">
                      Calming breathing exercises before bed can help quiet the mind and prepare the body for restful sleep.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full shrink-0">
                    <Wind className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Energy Regulation</h3>
                    <p className="text-sm text-muted-foreground">
                      Different breathing patterns can either energize your body or calm it down, helping regulate energy levels throughout the day.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wind className="h-5 w-5 text-primary" />
                Mindful Breaks
              </CardTitle>
              <CardDescription>
                Take short breaks with guided breathing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SmartBreakSuggestions />
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => navigate("/app/meditation")}
        >
          <Flower2 className="h-4 w-4" />
          Explore Meditation
        </Button>
      </div>
    </div>
  );
};

function Lungs(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.081 20C6.026 20 5.971 20 5.916 20c-1.28-.68-1.831-5.612-1.831-9.5C4.085 7 4 4.5 5.815 4.5c1.963 0 2.946 3.928 2.946 4.5"/><path d="M17.919 20c.055 0 .11 0 .165 0 1.28-.68 1.831-5.612 1.831-9.5C19.915 7 20 4.5 18.185 4.5c-1.963 0-2.946 3.928-2.946 4.5"/><path d="M11.753 18.579A2.895 2.895 0 0 0 15.349 20c1.675 0 2.248-.679 3.231-4.183"/><path d="M12.247 18.579A2.895 2.895 0 0 1 8.651 20c-1.675 0-2.248-.679-3.231-4.183"/><path d="M9 11.5c.5.323 2.267.613 3 .5"/><path d="M9.5 10c1.614.086 2.681 0 3.25-.5"/><path d="M15 11.5c-.5.323-2.267.613-3 .5"/><path d="M14.5 10c-1.614.086-2.681 0-3.25-.5"/><path d="M12 4v5.5"/></svg>
}
