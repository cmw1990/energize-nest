
import React, { useState } from 'react';
import { TopNav } from "@/components/layout/TopNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

const BrainMatch = () => {
  const [score, setScore] = useState(0);
  
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <CardTitle>Brain Match</CardTitle>
            </div>
            <CardDescription>
              Match patterns to improve your cognitive abilities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-6 text-center">
              <p className="mb-4">Game coming soon...</p>
              <Button onClick={() => setScore(prev => prev + 1)}>
                Score: {score}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BrainMatch;
