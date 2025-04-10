
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TopNav } from "@/components/layout/TopNav";

const Tracking = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 pt-6">
        <h1 className="text-3xl font-bold mb-6">Tracking</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Activity Tracking</CardTitle>
            <CardDescription>Monitor your progress and habits</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your tracking dashboard will be displayed here. You can monitor your progress, 
              track habits, and analyze patterns in your activities.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Tracking;
