
import React, { useState } from 'react';
import { TopNav } from "@/components/layout/TopNav";
import { WithdrawalTracker as WithdrawalTrackerComponent } from "@/components/sobriety/WithdrawalTracker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Brain, Calendar, Heart, Pill, Trophy } from "lucide-react";
import { WithdrawalTimeline } from "@/components/sobriety/WithdrawalTimeline";
import { WithdrawalSymptoms } from "@/components/sobriety/WithdrawalSymptoms";
import { WithdrawalCopingTools } from "@/components/sobriety/WithdrawalCopingTools";
import { WithdrawalMilestones } from "@/components/sobriety/WithdrawalMilestones";
import { motion } from "framer-motion";

export default function WithdrawalTracker() {
  const [selectedSubstance, setSelectedSubstance] = useState<string>("nicotine");

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <motion.div 
        className="container mx-auto p-4 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Activity className="h-7 w-7 text-primary" />
              Withdrawal Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Track, manage, and overcome withdrawal symptoms with comprehensive support
            </p>
          </div>
        </div>

        <Tabs defaultValue="tracker" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <TabsTrigger value="tracker" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden md:inline">Withdrawal Tracker</span>
              <span className="md:hidden">Tracker</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden md:inline">Timeline</span>
              <span className="md:hidden">Timeline</span>
            </TabsTrigger>
            <TabsTrigger value="symptoms" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span className="hidden md:inline">Symptoms Guide</span>
              <span className="md:hidden">Symptoms</span>
            </TabsTrigger>
            <TabsTrigger value="coping" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden md:inline">Coping Tools</span>
              <span className="md:hidden">Coping</span>
            </TabsTrigger>
            <TabsTrigger value="milestones" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span className="hidden md:inline">Milestones</span>
              <span className="md:hidden">Milestones</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center justify-center space-x-2 mb-4">
            <button
              onClick={() => setSelectedSubstance("nicotine")}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedSubstance === "nicotine"
                  ? "bg-primary text-white"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              Nicotine
            </button>
            <button
              onClick={() => setSelectedSubstance("alcohol")}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedSubstance === "alcohol"
                  ? "bg-primary text-white"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              Alcohol
            </button>
            <button
              onClick={() => setSelectedSubstance("caffeine")}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedSubstance === "caffeine"
                  ? "bg-primary text-white"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              Caffeine
            </button>
            <button
              onClick={() => setSelectedSubstance("other")}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedSubstance === "other"
                  ? "bg-primary text-white"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              Other
            </button>
          </div>

          <TabsContent value="tracker" className="space-y-6">
            <Card className="border-primary/10 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  {selectedSubstance.charAt(0).toUpperCase() + selectedSubstance.slice(1)} Withdrawal Tracker
                </CardTitle>
                <CardDescription>
                  Track and manage your withdrawal symptoms in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WithdrawalTrackerComponent substance={selectedSubstance} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <Card className="border-primary/10 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Withdrawal Timeline
                </CardTitle>
                <CardDescription>
                  Understand what to expect during your recovery journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WithdrawalTimeline substance={selectedSubstance} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="symptoms" className="space-y-6">
            <Card className="border-primary/10 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Symptoms Guide
                </CardTitle>
                <CardDescription>
                  Learn about common withdrawal symptoms and how to manage them
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WithdrawalSymptoms substance={selectedSubstance} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coping" className="space-y-6">
            <Card className="border-primary/10 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Coping Tools
                </CardTitle>
                <CardDescription>
                  Strategies and tools to help you through difficult withdrawal periods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WithdrawalCopingTools substance={selectedSubstance} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="milestones" className="space-y-6">
            <Card className="border-primary/10 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Recovery Milestones
                </CardTitle>
                <CardDescription>
                  Celebrate your progress with meaningful milestones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WithdrawalMilestones substance={selectedSubstance} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
