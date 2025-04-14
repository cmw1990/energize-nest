import React from "react";
// Removed TopNav import, assuming Layout provides navigation
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CBTThoughtRecord } from "@/components/cbt/CBTThoughtRecord"; // Import the actual component
import { Brain, BookOpen, Target, LineChart } from "lucide-react"; // Added icons

// Temporarily create stub components until the real ones are implemented
// const CBTThoughtRecord = () => <div>CBT Thought Record Component Coming Soon</div>; // Replaced with import
const CBTJournal = () => <div>CBT Journal Component Coming Soon</div>;
const CBTChallenges = () => <div>CBT Challenges Component Coming Soon</div>;
const CBTProgress = () => <div>CBT Progress Component Coming Soon</div>;

const CBT = () => {
  return (
    // Removed min-h-screen and bg-background, assuming Layout handles this
    <div className="space-y-6">
      {/* Removed TopNav */}
      {/* Header can be added if needed, or rely on Layout's header */}
       <div className="flex items-center justify-between">
         <h1 className="text-2xl font-bold flex items-center gap-2">
           <Brain className="h-6 w-6 text-primary" />
           CBT Tools
         </h1>
         {/* Optional: Add description or subtitle here */}
       </div>

      <Card className="border-primary/10">
        {/* Removed CardHeader as title is now above */}
        <CardContent className="pt-6"> {/* Added padding-top */}
          <Tabs defaultValue="thought-record" className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="thought-record" className="gap-1">
                 <BookOpen className="h-4 w-4" /> Thought Record
              </TabsTrigger>
              <TabsTrigger value="journal" className="gap-1">
                 <BookOpen className="h-4 w-4" /> Journal
              </TabsTrigger>
              <TabsTrigger value="challenges" className="gap-1">
                 <Target className="h-4 w-4" /> Challenges
              </TabsTrigger>
              <TabsTrigger value="progress" className="gap-1">
                 <LineChart className="h-4 w-4" /> Progress
              </TabsTrigger>
            </TabsList>
            <TabsContent value="thought-record">
              <CBTThoughtRecord /> {/* Use the imported component */}
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
  );
};

export default CBT;
