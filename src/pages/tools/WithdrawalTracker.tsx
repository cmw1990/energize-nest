
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WithdrawalTimeline } from "@/components/nicotine/WithdrawalTimeline";
import { WithdrawalSymptoms } from "@/components/nicotine/WithdrawalSymptoms";
import { WithdrawalCopingTools } from "@/components/nicotine/WithdrawalCopingTools";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Calendar, 
  Clock, 
  Zap, 
  Activity, 
  Target, 
  Award, 
  TrendingUp, 
  Cigarette 
} from "lucide-react";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { MetricCard } from "@/components/ui/metric-card";
import { ToolAnalyticsWrapper } from "@/components/tools/ToolAnalyticsWrapper";

interface WithdrawalMilestone {
  id: string;
  day: number;
  title: string;
  description: string;
}

const WithdrawalTracker = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("timeline");
  const [substance, setSubstance] = useState("nicotine");
  const [showQuitDateForm, setShowQuitDateForm] = useState(false);
  const [quitDate, setQuitDate] = useState<string>("");
  const [daysSinceQuit, setDaysSinceQuit] = useState<number>(0);

  // Get user's quit tracking info
  const { data: quitInfo, isLoading: isQuitInfoLoading } = useQuery({
    queryKey: ['quit-tracking', session?.user?.id, substance],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('quit_tracking')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('substance', substance)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching quit info:", error);
        return null;
      }
      
      if (data) {
        const quitDateObj = new Date(data.quit_date);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - quitDateObj.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysSinceQuit(diffDays);
        setQuitDate(data.quit_date.split('T')[0]);
      }
      
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Save quit date
  const saveQuitDate = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id || !quitDate) {
        throw new Error("User not logged in or quit date not set");
      }
      
      // Check if record exists to update or insert
      const { data: existingData } = await supabase
        .from('quit_tracking')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('substance', substance)
        .maybeSingle();
      
      if (existingData) {
        // Update existing record
        const { error } = await supabase
          .from('quit_tracking')
          .update({
            quit_date: new Date(quitDate).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingData.id);
        
        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('quit_tracking')
          .insert({
            user_id: session.user.id,
            substance,
            quit_date: new Date(quitDate).toISOString(),
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quit-tracking', session?.user?.id, substance] });
      toast({
        title: "Quit date saved",
        description: "Your quit date has been updated successfully",
      });
      setShowQuitDateForm(false);
    },
    onError: (error) => {
      toast({
        title: "Error saving quit date",
        description: "Could not save your quit date. Please try again.",
        variant: "destructive",
      });
      console.error("Error saving quit date:", error);
    },
  });

  const handleSubmitQuitDate = (e: React.FormEvent) => {
    e.preventDefault();
    saveQuitDate.mutate();
  };

  // Get substances for selection
  const substances = [
    { value: "nicotine", label: "Nicotine (Cigarettes, Vaping, etc.)" },
    { value: "alcohol", label: "Alcohol" },
    { value: "caffeine", label: "Caffeine" },
    { value: "sugar", label: "Sugar" },
    { value: "other", label: "Other" },
  ];

  // Component for setting up withdrawal tracking
  const WithdrawalSetup = () => (
    <Card className="bg-muted/50">
      <CardContent className="p-6 text-center">
        <Cigarette className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">Set Up Withdrawal Tracking</h3>
        <p className="text-muted-foreground mb-4">
          Track your journey to becoming free from {substance} dependency by setting your quit date.
        </p>
        <Button onClick={() => setShowQuitDateForm(true)}>Set Quit Date</Button>
      </CardContent>
    </Card>
  );

  return (
    <ToolAnalyticsWrapper toolName="withdrawal-tracker" toolType="recovery">
      <div className="min-h-screen bg-background">
        <LandingHeader />
        <div className="container mx-auto p-4 space-y-6 max-w-5xl">
          <Card className="border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Withdrawal Tracker
              </CardTitle>
              <CardDescription>
                Track your recovery journey and manage withdrawal symptoms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <Select value={substance} onValueChange={setSubstance}>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Select substance" />
                    </SelectTrigger>
                    <SelectContent>
                      {substances.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {quitInfo && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowQuitDateForm(true)}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Change Quit Date
                  </Button>
                )}
              </div>
              
              {showQuitDateForm && (
                <Card className="mb-6 border-dashed">
                  <CardHeader>
                    <CardTitle className="text-base">
                      {quitInfo ? "Update" : "Set"} Your Quit Date
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitQuitDate} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="quitDate">When did you quit {substance}?</Label>
                        <Input
                          id="quitDate"
                          type="date"
                          value={quitDate}
                          onChange={(e) => setQuitDate(e.target.value)}
                          max={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1">
                          Save Quit Date
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setShowQuitDateForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
              
              {!isQuitInfoLoading && !quitInfo && !showQuitDateForm && (
                <WithdrawalSetup />
              )}
              
              {quitInfo && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <MetricCard
                      icon={<Clock className="h-4 w-4 text-muted-foreground" />}
                      title="Days Since Quitting"
                      value={daysSinceQuit}
                      description="Your fresh journey"
                    />
                    <MetricCard
                      icon={<Target className="h-4 w-4 text-muted-foreground" />}
                      title="Next Milestone"
                      value={daysSinceQuit < 3 ? "3 Days" : daysSinceQuit < 7 ? "1 Week" : daysSinceQuit < 30 ? "1 Month" : "3 Months"}
                      description={`${daysSinceQuit < 3 ? "Nicotine-free body" : daysSinceQuit < 7 ? "Physical symptoms decrease" : daysSinceQuit < 30 ? "Habit breaking point" : "Significant recovery"}`}
                    />
                    <MetricCard
                      icon={<Award className="h-4 w-4 text-muted-foreground" />}
                      title="Achievement"
                      value={
                        daysSinceQuit < 1 ? "Just Started" :
                        daysSinceQuit < 3 ? "Day 1 Complete" :
                        daysSinceQuit < 7 ? "3 Days Milestone" :
                        daysSinceQuit < 14 ? "1 Week Milestone" :
                        daysSinceQuit < 30 ? "2 Weeks Milestone" :
                        daysSinceQuit < 90 ? "1 Month Milestone" :
                        daysSinceQuit < 180 ? "3 Months Milestone" :
                        daysSinceQuit < 365 ? "6 Months Milestone" :
                        "1 Year Milestone"
                      }
                      description="Your journey progress"
                    />
                    <MetricCard
                      icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
                      title="Recovery Progress"
                      value={`${Math.min(Math.round((daysSinceQuit / 90) * 100), 100)}%`}
                      description="Physical recovery estimate"
                    />
                  </div>
                  
                  <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-3">
                      <TabsTrigger value="timeline" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Timeline</span>
                      </TabsTrigger>
                      <TabsTrigger value="symptoms" className="flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        <span>Symptoms</span>
                      </TabsTrigger>
                      <TabsTrigger value="coping" className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        <span>Coping Tools</span>
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="timeline" className="space-y-4">
                      <WithdrawalTimeline daysSinceQuit={daysSinceQuit} substance={substance} />
                    </TabsContent>
                    <TabsContent value="symptoms" className="space-y-4">
                      <WithdrawalSymptoms />
                    </TabsContent>
                    <TabsContent value="coping" className="space-y-4">
                      <WithdrawalCopingTools substance={substance} />
                    </TabsContent>
                  </Tabs>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolAnalyticsWrapper>
  );
};

export default WithdrawalTracker;
