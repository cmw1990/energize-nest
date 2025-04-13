import React from "react";
import { useAuth } from "@/components/AuthProvider";
import { TopNav } from "@/components/layout/TopNav";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Heart, Bell, Settings } from "lucide-react";

// Temporarily create stub components until the real ones are implemented
const CycleMoodAnalysis = () => <div>CycleMoodAnalysis Component Coming Soon</div>;
const CycleNotifications = () => <div>CycleNotifications Component Coming Soon</div>;
const CycleSettings = () => <div>CycleSettings Component Coming Soon</div>;

const Cycle = () => {
  const { session } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500" />
            <h1 className="text-3xl font-bold">Cycle Tracking</h1>
          </div>
          <Button>
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </Button>
        </div>

        <Card className="border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Your Cycle Insights</CardTitle>
            <CardDescription>
              Track your menstrual cycle and understand your body better
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="mood" className="space-y-4">
              <TabsList>
                <TabsTrigger value="mood">Mood Analysis</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="mood">
                <CycleMoodAnalysis />
              </TabsContent>
              
              <TabsContent value="notifications">
                <CycleNotifications />
              </TabsContent>
              
              <TabsContent value="settings">
                <CycleSettings />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cycle;
