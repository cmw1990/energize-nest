
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TopNav } from "@/components/layout/TopNav";

const CreateEnergyPlanPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 pt-6">
        <h1 className="text-3xl font-bold mb-6">Create Energy Plan</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Create New Energy Plan</CardTitle>
            <CardDescription>Design a personalized energy plan to optimize your day</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Energy plan creation form will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateEnergyPlanPage;
