
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopNav } from "@/components/layout/TopNav";
import CBTExercises from "@/components/cbt/CBTExercises";
import CBTThoughtRecord from "@/components/cbt/CBTThoughtRecord";
import CBTJournal from "@/components/cbt/CBTJournal";
import CBTChallenges from "@/components/cbt/CBTChallenges";
import CBTProgress from "@/components/cbt/CBTProgress";
import { Brain, FileText, Star, BarChart, List } from "lucide-react";
import { motion } from "framer-motion";

const CBTPage = () => {
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
              <Brain className="h-7 w-7 text-primary" />
              Cognitive Behavioral Therapy
            </h1>
            <p className="text-muted-foreground mt-1">
              Evidence-based techniques to improve your thought patterns and emotional well-being
            </p>
          </div>
        </div>

        <Tabs defaultValue="exercises" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <TabsTrigger value="exercises" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span className="hidden md:inline">Exercises</span>
              <span className="md:hidden">Exercises</span>
            </TabsTrigger>
            <TabsTrigger value="thought-record" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Thought Record</span>
              <span className="md:hidden">Thoughts</span>
            </TabsTrigger>
            <TabsTrigger value="journal" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              <span className="hidden md:inline">CBT Journal</span>
              <span className="md:hidden">Journal</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span className="hidden md:inline">Daily Challenges</span>
              <span className="md:hidden">Challenges</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span className="hidden md:inline">Progress</span>
              <span className="md:hidden">Progress</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="exercises" className="space-y-6">
            <Card className="border-primary/10 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  CBT Exercises
                </CardTitle>
                <CardDescription>
                  Structured exercises to help you challenge negative thoughts and develop healthier thinking patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CBTExercises />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="thought-record" className="space-y-6">
            <Card className="border-primary/10 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Thought Record
                </CardTitle>
                <CardDescription>
                  Document and analyze your thoughts to identify patterns and challenge cognitive distortions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CBTThoughtRecord />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="journal" className="space-y-6">
            <Card className="border-primary/10 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <List className="h-5 w-5 text-primary" />
                  CBT Journal
                </CardTitle>
                <CardDescription>
                  Keep a journal of your thoughts, feelings, and the CBT techniques you're practicing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CBTJournal />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            <Card className="border-primary/10 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Daily Challenges
                </CardTitle>
                <CardDescription>
                  Daily activities to practice CBT skills and build mental resilience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CBTChallenges />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card className="border-primary/10 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-primary" />
                  Progress Tracking
                </CardTitle>
                <CardDescription>
                  Track your improvement and see how CBT is helping your mental well-being
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CBTProgress />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default CBTPage;
