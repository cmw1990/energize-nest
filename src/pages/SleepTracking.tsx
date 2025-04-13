
import React, { useState } from "react";
import { TopNav } from "@/components/layout/TopNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SleepMetrics } from "@/components/sleep/SleepMetrics";
import { SleepScheduler } from "@/components/sleep/SleepScheduler";
import { SleepTrackingForm } from "@/components/sleep/SleepTrackingForm";
import { Moon, Clock, Calendar, Clipboard, AlarmClock, Bell, BarChart, BedDouble, Plus, ListChecks, Plus } from "lucide-react";

const SleepTracking = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center gap-2">
          <Moon className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Sleep Tracking</h1>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="scheduler" className="flex items-center gap-2">
                <AlarmClock className="h-4 w-4" />
                <span className="hidden sm:inline">Scheduler</span>
              </TabsTrigger>
              <TabsTrigger value="tracking" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Log Sleep</span>
              </TabsTrigger>
              <TabsTrigger value="hygiene" className="flex items-center gap-2">
                <ListChecks className="h-4 w-4" />
                <span className="hidden sm:inline">Sleep Hygiene</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="dashboard">
            <SleepMetrics />
          </TabsContent>
          
          <TabsContent value="scheduler">
            <SleepScheduler />
          </TabsContent>
          
          <TabsContent value="tracking">
            <SleepTrackingForm />
          </TabsContent>
          
          <TabsContent value="hygiene">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListChecks className="h-5 w-5 text-primary" />
                  Sleep Hygiene Checklist
                </CardTitle>
                <CardDescription>
                  Follow these recommendations for better sleep quality
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <SleepHygieneCategory 
                    title="Evening Routine" 
                    icon={<Moon className="h-5 w-5 text-indigo-500" />}
                    items={[
                      { text: "Avoid caffeine after 2pm", checked: false },
                      { text: "Avoid alcohol within 3 hours of bedtime", checked: false },
                      { text: "Avoid heavy meals within 2 hours of bedtime", checked: false },
                      { text: "Dim lights 1-2 hours before bed", checked: false },
                      { text: "Limit screens 1 hour before bed", checked: false },
                    ]}
                  />
                  
                  <SleepHygieneCategory 
                    title="Sleep Environment" 
                    icon={<BedDouble className="h-5 w-5 text-blue-500" />}
                    items={[
                      { text: "Keep bedroom dark", checked: false },
                      { text: "Keep bedroom quiet", checked: false },
                      { text: "Keep bedroom cool (65-68°F/18-20°C)", checked: false },
                      { text: "Use comfortable mattress and pillows", checked: false },
                      { text: "Remove electronics from bedroom", checked: false },
                    ]}
                  />
                  
                  <SleepHygieneCategory 
                    title="Daily Habits" 
                    icon={<Clock className="h-5 w-5 text-amber-500" />}
                    items={[
                      { text: "Maintain consistent sleep schedule", checked: false },
                      { text: "Get 15-30 minutes of morning sunlight", checked: false },
                      { text: "Exercise regularly (but not right before bed)", checked: false },
                      { text: "Limit daytime naps to 20-30 minutes", checked: false },
                      { text: "Practice stress management techniques", checked: false },
                    ]}
                  />
                  
                  <SleepHygieneCategory 
                    title="If You Can't Sleep" 
                    icon={<AlarmClock className="h-5 w-5 text-red-500" />}
                    items={[
                      { text: "If awake for >20 min, get up and do calm activity", checked: false },
                      { text: "Avoid checking the time", checked: false },
                      { text: "Use relaxation techniques", checked: false },
                      { text: "Avoid bright lights", checked: false },
                      { text: "Return to bed only when sleepy", checked: false },
                    ]}
                  />
                </div>
                
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                  <h3 className="font-medium mb-2">Sleep Science</h3>
                  <p className="text-sm text-muted-foreground">
                    Most adults need 7-9 hours of quality sleep. Sleep cycles last about 90 minutes, with each cycle 
                    containing light sleep, deep sleep, and REM sleep phases. Planning your sleep schedule around complete 
                    cycles can help you wake up feeling more refreshed.
                  </p>
                </div>
                
                <Button className="w-full">
                  Get Personalized Sleep Plan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface SleepHygieneCategoryProps {
  title: string;
  icon: React.ReactNode;
  items: { text: string; checked: boolean }[];
}

const SleepHygieneCategory: React.FC<SleepHygieneCategoryProps> = ({ title, icon, items }) => {
  const [checklist, setChecklist] = useState(items);
  
  const toggleItem = (index: number) => {
    const newChecklist = [...checklist];
    newChecklist[index].checked = !newChecklist[index].checked;
    setChecklist(newChecklist);
  };
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-medium">{title}</h3>
      </div>
      <ul className="space-y-2">
        {checklist.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <input 
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleItem(index)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className={`text-sm ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SleepTracking;
