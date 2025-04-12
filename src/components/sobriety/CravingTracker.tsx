
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ChartBar, Clock, MapPin, Brain, Calendar, AlertTriangle } from "lucide-react";
import { safeDbMutation, safeQueryExecute } from "@/utils/supabaseTypeUtils";
import { format, subDays } from "date-fns";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/components/AuthProvider";

interface CravingLog {
  id: string;
  intensity: number;
  location: string;
  activity: string;
  notes: string;
  trigger_type: string;
  created_at: string;
  user_id: string;
}

interface PatternInsight {
  type: string;
  value: string;
  count: number;
  avgIntensity: number;
}

export const CravingTracker = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const [intensity, setIntensity] = useState(5);
  const [location, setLocation] = useState("");
  const [activity, setActivity] = useState("");
  const [notes, setNotes] = useState("");
  const [triggerType, setTriggerType] = useState("emotional");
  const [selectedTab, setSelectedTab] = useState("log");

  const { data: recentCravings, isLoading } = useQuery<CravingLog[]>({
    queryKey: ['craving-logs'],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await safeQueryExecute<CravingLog>(() => 
        supabase
          .from('craving_logs')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(10)
      );

      if (error) {
        toast({
          title: "Error loading cravings",
          description: "Could not load your craving logs. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
      
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  // Extract pattern insights from craving logs
  const patternInsights = React.useMemo(() => {
    if (!recentCravings || recentCravings.length < 3) return null;
    
    const triggerTypes: Record<string, {count: number, totalIntensity: number}> = {};
    const locations: Record<string, {count: number, totalIntensity: number}> = {};
    const activities: Record<string, {count: number, totalIntensity: number}> = {};
    const timePatterns: Record<string, {count: number, totalIntensity: number}> = {};
    
    recentCravings.forEach(craving => {
      // Process trigger types
      const type = craving.trigger_type || 'unknown';
      if (!triggerTypes[type]) {
        triggerTypes[type] = { count: 0, totalIntensity: 0 };
      }
      triggerTypes[type].count += 1;
      triggerTypes[type].totalIntensity += craving.intensity;
      
      // Process locations
      if (craving.location) {
        if (!locations[craving.location]) {
          locations[craving.location] = { count: 0, totalIntensity: 0 };
        }
        locations[craving.location].count += 1;
        locations[craving.location].totalIntensity += craving.intensity;
      }
      
      // Process activities
      if (craving.activity) {
        if (!activities[craving.activity]) {
          activities[craving.activity] = { count: 0, totalIntensity: 0 };
        }
        activities[craving.activity].count += 1;
        activities[craving.activity].totalIntensity += craving.intensity;
      }
      
      // Process time patterns
      const hour = new Date(craving.created_at).getHours();
      const timeOfDay = 
        hour < 6 ? 'night (12am-6am)' :
        hour < 12 ? 'morning (6am-12pm)' :
        hour < 18 ? 'afternoon (12pm-6pm)' : 
        'evening (6pm-12am)';
      
      if (!timePatterns[timeOfDay]) {
        timePatterns[timeOfDay] = { count: 0, totalIntensity: 0 };
      }
      timePatterns[timeOfDay].count += 1;
      timePatterns[timeOfDay].totalIntensity += craving.intensity;
    });
    
    // Convert to arrays and sort by count
    const insights: {
      triggers: PatternInsight[];
      locations: PatternInsight[];
      activities: PatternInsight[];
      times: PatternInsight[];
    } = {
      triggers: [],
      locations: [],
      activities: [],
      times: []
    };
    
    // Process trigger types
    Object.entries(triggerTypes).forEach(([value, data]) => {
      insights.triggers.push({
        type: 'trigger',
        value,
        count: data.count,
        avgIntensity: +(data.totalIntensity / data.count).toFixed(1)
      });
    });
    
    // Process locations
    Object.entries(locations).forEach(([value, data]) => {
      insights.locations.push({
        type: 'location',
        value,
        count: data.count,
        avgIntensity: +(data.totalIntensity / data.count).toFixed(1)
      });
    });
    
    // Process activities
    Object.entries(activities).forEach(([value, data]) => {
      insights.activities.push({
        type: 'activity',
        value,
        count: data.count,
        avgIntensity: +(data.totalIntensity / data.count).toFixed(1)
      });
    });
    
    // Process time patterns
    Object.entries(timePatterns).forEach(([value, data]) => {
      insights.times.push({
        type: 'time',
        value,
        count: data.count,
        avgIntensity: +(data.totalIntensity / data.count).toFixed(1)
      });
    });
    
    // Sort all arrays by count (descending)
    insights.triggers.sort((a, b) => b.count - a.count);
    insights.locations.sort((a, b) => b.count - a.count);
    insights.activities.sort((a, b) => b.count - a.count);
    insights.times.sort((a, b) => b.count - a.count);
    
    return insights;
  }, [recentCravings]);

  const logCraving = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to log cravings.",
          variant: "destructive",
        });
        throw new Error("User not authenticated");
      }

      const { data, error } = await safeDbMutation(() => 
        supabase
          .from('craving_logs')
          .insert([{
            intensity,
            location,
            activity,
            notes,
            trigger_type: triggerType,
            user_id: session.user.id
          }])
      );

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['craving-logs'] });
      toast({
        title: "Craving logged",
        description: "Your craving has been recorded successfully.",
      });
      setLocation("");
      setActivity("");
      setNotes("");
      setIntensity(5);
      setTriggerType("emotional");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to log craving. Please try again.",
        variant: "destructive",
      });
      console.error("Error logging craving:", error);
    },
  });

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartBar className="h-5 w-5" />
          Craving Tracker
        </CardTitle>
        <CardDescription>
          Track and analyze your cravings to identify patterns and triggers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="log" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Log Craving
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <ChartBar className="h-4 w-4" />
              Insights
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="log" className="space-y-4">
            <div className="space-y-2">
              <Label>Intensity</Label>
              <Slider
                value={[intensity]}
                onValueChange={(value) => setIntensity(value[0])}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Mild</span>
                <span>Moderate</span>
                <span>Severe</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="trigger-type" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Trigger Type
              </Label>
              <Select value={triggerType} onValueChange={setTriggerType}>
                <SelectTrigger id="trigger-type">
                  <SelectValue placeholder="Select trigger type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emotional">Emotional</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="environmental">Environmental</SelectItem>
                  <SelectItem value="physical">Physical</SelectItem>
                  <SelectItem value="routine">Routine/Habit</SelectItem>
                  <SelectItem value="stress">Stress</SelectItem>
                  <SelectItem value="boredom">Boredom</SelectItem>
                  <SelectItem value="alcohol">After Alcohol</SelectItem>
                  <SelectItem value="caffeine">After Caffeine</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where are you?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activity" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Current Activity
              </Label>
              <Input
                id="activity"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                placeholder="What are you doing?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional notes or feelings..."
                rows={3}
              />
            </div>

            <Button 
              className="w-full"
              onClick={() => logCraving.mutate()}
              disabled={logCraving.isPending}
            >
              {logCraving.isPending ? "Logging..." : "Log Craving"}
            </Button>
            
            {recentCravings && recentCravings.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Recent Cravings</h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {recentCravings.map((craving) => (
                    <Card key={craving.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Intensity: {craving.intensity}/10</p>
                            <p className="text-sm text-muted-foreground">
                              Trigger: {craving.trigger_type}
                            </p>
                            {craving.location && (
                              <p className="text-sm text-muted-foreground">
                                Location: {craving.location}
                              </p>
                            )}
                            {craving.activity && (
                              <p className="text-sm text-muted-foreground">
                                Activity: {craving.activity}
                              </p>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(craving.created_at), 'MMM d, h:mm a')}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="insights">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Clock className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : recentCravings && recentCravings.length < 3 ? (
              <div className="text-center py-8 space-y-3">
                <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
                <p className="text-muted-foreground">
                  Log at least 3 cravings to see patterns and insights.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSelectedTab("log")}
                >
                  Log a Craving
                </Button>
              </div>
            ) : patternInsights ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      Top Triggers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {patternInsights.triggers.length > 0 ? (
                      <div className="space-y-3">
                        {patternInsights.triggers.slice(0, 3).map((insight, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <div>
                              <p className="font-medium capitalize">{insight.value}</p>
                              <p className="text-sm text-muted-foreground">
                                {insight.count} occurrences
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">Avg Intensity</p>
                              <p className="text-sm text-muted-foreground">
                                {insight.avgIntensity}/10
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Not enough data yet</p>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Location Patterns
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {patternInsights.locations.length > 0 ? (
                      <div className="space-y-3">
                        {patternInsights.locations.slice(0, 3).map((insight, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{insight.value}</p>
                              <p className="text-sm text-muted-foreground">
                                {insight.count} occurrences
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">Avg Intensity</p>
                              <p className="text-sm text-muted-foreground">
                                {insight.avgIntensity}/10
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Not enough location data yet</p>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Time Patterns
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {patternInsights.times.length > 0 ? (
                      <div className="space-y-3">
                        {patternInsights.times.map((insight, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <div>
                              <p className="font-medium capitalize">{insight.value}</p>
                              <p className="text-sm text-muted-foreground">
                                {insight.count} occurrences
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">Avg Intensity</p>
                              <p className="text-sm text-muted-foreground">
                                {insight.avgIntensity}/10
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Not enough time data yet</p>
                    )}
                  </CardContent>
                </Card>
                
                <div className="mt-6 text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Understanding your craving patterns helps you prepare for and manage them better.
                  </p>
                  <Button onClick={() => setSelectedTab("log")}>
                    Log Another Craving
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Something went wrong. Please try again.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
