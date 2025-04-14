
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Pill, Database, BarChart, Coffee, Calculator, NotebookPen } from "lucide-react";
import { SupplementGuide } from "@/components/energy/SupplementGuide";
import { SupplementTracker } from "@/components/energy/SupplementTracker";
import { SupplementAnalytics } from "@/components/energy/SupplementAnalytics";
import { StackBuilder } from "@/components/energy/StackBuilder";

export default function Supplements() {
  const [activeTab, setActiveTab] = useState('guide');

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Pill className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Supplements & Nootropics</h1>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList className="grid grid-cols-4 w-[600px]">
            <TabsTrigger value="guide" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span>Guide</span>
            </TabsTrigger>
            <TabsTrigger value="tracker" className="flex items-center gap-2">
              <NotebookPen className="h-4 w-4" />
              <span>Tracker</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="stacks" className="flex items-center gap-2">
              <Coffee className="h-4 w-4" />
              <span>Stack Builder</span>
            </TabsTrigger>
          </TabsList>
          
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Calculator className="h-4 w-4 mr-2" />
            Dosage Calculator
          </Button>
        </div>

        <TabsContent value="guide" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Supplement & Nootropic Directory</CardTitle>
              <CardDescription>
                Explore, search, and save information on supplements and nootropics to enhance your wellness journey.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SupplementGuide />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracker" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Supplement Tracker</CardTitle>
              <CardDescription>
                Track your supplement intake and monitor effects over time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <Pill className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-lg font-medium">Supplement Tracker Coming Soon</h3>
                <p className="text-muted-foreground mt-1 max-w-md mx-auto">
                  We're building a comprehensive supplement tracking system to help you monitor the effectiveness of your supplements over time.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setActiveTab('guide')}
                >
                  Explore Supplement Guide
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Supplement Analytics</CardTitle>
              <CardDescription>
                Visualize the impact of supplements on your health metrics.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <BarChart className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-lg font-medium">Analytics Coming Soon</h3>
                <p className="text-muted-foreground mt-1 max-w-md mx-auto">
                  We're developing advanced analytics to help you understand how your supplements affect your health metrics over time.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setActiveTab('guide')}
                >
                  Explore Supplement Guide
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stacks" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Stack Builder</CardTitle>
              <CardDescription>
                Create and manage your supplement stacks for different goals.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <Coffee className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-lg font-medium">Stack Builder Coming Soon</h3>
                <p className="text-muted-foreground mt-1 max-w-md mx-auto">
                  We're working on a smart stack builder that will help you create optimized supplement combinations for different goals.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setActiveTab('guide')}
                >
                  Explore Supplement Guide
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
