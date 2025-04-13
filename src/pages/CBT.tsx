
import React from "react";
import { TopNav } from "@/components/layout/TopNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

// Temporarily create stub components until the real ones are implemented
const CBTThoughtRecord = () => <div>CBT Thought Record Component Coming Soon</div>;
const CBTJournal = () => <div>CBT Journal Component Coming Soon</div>;
const CBTChallenges = () => <div>CBT Challenges Component Coming Soon</div>;
const CBTProgress = () => <div>CBT Progress Component Coming Soon</div>;

const CBT = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 space-y-6">
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Cognitive Behavioral Therapy (CBT)</CardTitle>
            <CardDescription>
              Explore CBT techniques to manage thoughts and feelings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="thought-record" className="space-y-4">
              <TabsList>
                <TabsTrigger value="thought-record">Thought Record</TabsTrigger>
                <TabsTrigger value="journal">Journal</TabsTrigger>
                <TabsTrigger value="challenges">Challenges</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
              </TabsList>
              <TabsContent value="thought-record">
                <CBTThoughtRecord />
              </TabsContent>
              <TabsContent value="journal">
                <CBTJournal />
              </TabsContent>
              <TabsContent value="challenges">
                <CBTChallenges />
              </TabsContent>
              <TabsContent value="progress">
                <CBTProgress />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CBT;
