
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CravingTracker } from "@/components/sobriety/CravingTracker";
import { WithdrawalTracker } from "@/components/sobriety/WithdrawalTracker";
import { TriggerPatternAnalysis } from "@/components/sobriety/TriggerPatternAnalysis";
import { HealthImprovements } from "@/components/sobriety/HealthImprovements";
import { Award, CalendarDays, TrendingUp, Activity, Brain, Hand, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Sobriety = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Sobriety Tracker</h1>
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => navigate("/tools/smoking-cost-calculator")}
        >
          <DollarSign className="h-4 w-4" />
          Cost Calculator
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg mb-1">Staying Fresh</h3>
                <p className="text-sm text-muted-foreground">Track your journey to a fresher life</p>
              </div>
              <CalendarDays className="h-8 w-8 text-green-500 opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg mb-1">Craving Management</h3>
                <p className="text-sm text-muted-foreground">Tools to handle cravings effectively</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500 opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg mb-1">Health Restoration</h3>
                <p className="text-sm text-muted-foreground">Track your body's recovery</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500 opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg mb-1">Pattern Recognition</h3>
                <p className="text-sm text-muted-foreground">Identify and overcome triggers</p>
              </div>
              <Brain className="h-8 w-8 text-orange-500 opacity-75" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="cravings" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <TabsTrigger value="cravings" className="flex items-center gap-2">
            <Hand className="h-4 w-4" />
            Craving Tracker
          </TabsTrigger>
          <TabsTrigger value="withdrawal" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Withdrawal Symptoms
          </TabsTrigger>
          <TabsTrigger value="triggers" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Trigger Patterns
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Health Improvements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cravings">
          <CravingTracker />
        </TabsContent>

        <TabsContent value="withdrawal">
          <WithdrawalTracker />
        </TabsContent>

        <TabsContent value="triggers">
          <TriggerPatternAnalysis />
        </TabsContent>

        <TabsContent value="health">
          <HealthImprovements />
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-500" />
              Product Directory & Guides
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Find the right products to support your journey to a fresher life. Browse our comprehensive directory of nicotine replacement therapies and other helpful products.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                className="bg-white/50 dark:bg-white/5"
                onClick={() => navigate("/nicotine-products")}
              >
                NRT Products Directory
              </Button>
              <Button 
                variant="outline" 
                className="bg-white/50 dark:bg-white/5"
                onClick={() => navigate("/vendors")}
              >
                Vendor Listings
              </Button>
              <Button 
                variant="outline" 
                className="bg-white/50 dark:bg-white/5"
                onClick={() => navigate("/tapering-guide")}
              >
                Tapering Guide
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Sobriety;
