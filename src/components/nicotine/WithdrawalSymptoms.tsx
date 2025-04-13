
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  HeartPulse, 
  Frown, 
  Clock, 
  Activity, 
  Utensils,
  Plus,
  Calendar,
  BarChart4
} from 'lucide-react';
import { MetricCard } from "@/components/ui/metric-card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useAuth } from "@/components/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SymptomLog {
  id: string;
  created_at: string;
  anxiety: number;
  irritability: number;
  difficulty_concentrating: number;
  insomnia: number;
  increased_appetite: number;
  fatigue: number;
  headaches: number;
  notes: string;
}

export const WithdrawalSymptoms: React.FC = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showLogForm, setShowLogForm] = useState(false);
  const [activeChartMetric, setActiveChartMetric] = useState<string>('anxiety');
  const [formData, setFormData] = useState({
    anxiety: 0,
    irritability: 0,
    difficulty_concentrating: 0,
    insomnia: 0,
    increased_appetite: 0,
    fatigue: 0,
    headaches: 0,
    notes: '',
  });

  // Fetch symptom logs
  const { data: symptomLogs, isLoading } = useQuery({
    queryKey: ['symptom-logs', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('withdrawal_symptom_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(30);
      
      if (error) {
        toast({
          title: "Error loading logs",
          description: "Could not fetch your symptom logs",
          variant: "destructive",
        });
        throw error;
      }
      
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  // Submit symptom log
  const logSymptoms = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) {
        throw new Error("You must be logged in to log symptoms");
      }
      
      const { data, error } = await supabase
        .from('withdrawal_symptom_logs')
        .insert([
          {
            user_id: session.user.id,
            ...formData,
          }
        ]);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['symptom-logs', session?.user?.id] });
      toast({
        title: "Symptoms logged",
        description: "Your withdrawal symptoms have been recorded",
      });
      setShowLogForm(false);
      setFormData({
        anxiety: 0,
        irritability: 0,
        difficulty_concentrating: 0,
        insomnia: 0,
        increased_appetite: 0,
        fatigue: 0,
        headaches: 0,
        notes: '',
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to log symptoms. Please try again.",
        variant: "destructive",
      });
      console.error("Error logging symptoms:", error);
    },
  });

  // Prepare chart data
  const chartData = React.useMemo(() => {
    if (!symptomLogs || symptomLogs.length === 0) return [];
    
    return symptomLogs
      .slice()
      .reverse()
      .map(log => ({
        date: new Date(log.created_at).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}),
        anxiety: log.anxiety,
        irritability: log.irritability,
        "difficulty concentrating": log.difficulty_concentrating,
        insomnia: log.insomnia,
        "increased appetite": log.increased_appetite,
        fatigue: log.fatigue,
        headaches: log.headaches,
      }));
  }, [symptomLogs]);

  // Calculate average symptom intensities
  const averages = React.useMemo(() => {
    if (!symptomLogs || symptomLogs.length === 0) {
      return {
        anxiety: 0,
        irritability: 0,
        difficultyConcent: 0,
        insomnia: 0,
        increasedAppetite: 0,
        fatigue: 0,
        headaches: 0,
      };
    }
    
    return {
      anxiety: Math.round(symptomLogs.reduce((sum, log) => sum + log.anxiety, 0) / symptomLogs.length),
      irritability: Math.round(symptomLogs.reduce((sum, log) => sum + log.irritability, 0) / symptomLogs.length),
      difficultyConcent: Math.round(symptomLogs.reduce((sum, log) => sum + log.difficulty_concentrating, 0) / symptomLogs.length),
      insomnia: Math.round(symptomLogs.reduce((sum, log) => sum + log.insomnia, 0) / symptomLogs.length),
      increasedAppetite: Math.round(symptomLogs.reduce((sum, log) => sum + log.increased_appetite, 0) / symptomLogs.length),
      fatigue: Math.round(symptomLogs.reduce((sum, log) => sum + log.fatigue, 0) / symptomLogs.length),
      headaches: Math.round(symptomLogs.reduce((sum, log) => sum + log.headaches, 0) / symptomLogs.length),
    };
  }, [symptomLogs]);
  
  // Get most recent log
  const latestLog = symptomLogs && symptomLogs.length > 0 ? symptomLogs[0] : null;

  // Map value to descriptive text
  const getIntensityText = (value: number) => {
    if (value <= 1) return "None";
    if (value <= 3) return "Mild";
    if (value <= 6) return "Moderate";
    if (value <= 8) return "Severe";
    return "Extreme";
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logSymptoms.mutate();
  };

  // Handle form input changes
  const handleSliderChange = (name: string, value: number[]) => {
    setFormData(prev => ({
      ...prev,
      [name]: value[0],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Withdrawal Symptoms</h2>
        <Button 
          onClick={() => setShowLogForm(!showLogForm)} 
          variant={showLogForm ? "destructive" : "default"} 
          size="sm"
        >
          {showLogForm ? "Cancel" : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Log Symptoms
            </>
          )}
        </Button>
      </div>
      
      {showLogForm ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base">Log Your Withdrawal Symptoms</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {Object.entries({
                anxiety: { icon: <Brain className="h-4 w-4" />, label: "Anxiety" },
                irritability: { icon: <Frown className="h-4 w-4" />, label: "Irritability" },
                difficulty_concentrating: { icon: <Brain className="h-4 w-4" />, label: "Difficulty Concentrating" },
                insomnia: { icon: <Clock className="h-4 w-4" />, label: "Insomnia/Sleep Issues" },
                increased_appetite: { icon: <Utensils className="h-4 w-4" />, label: "Increased Appetite" },
                fatigue: { icon: <Activity className="h-4 w-4" />, label: "Fatigue" },
                headaches: { icon: <HeartPulse className="h-4 w-4" />, label: "Headaches" },
              }).map(([key, { icon, label }]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={key} className="flex items-center gap-2">
                      {icon} {label}
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {getIntensityText(formData[key as keyof typeof formData] as number)}
                    </span>
                  </div>
                  <Slider
                    id={key}
                    value={[formData[key as keyof typeof formData] as number]}
                    min={0}
                    max={10}
                    step={1}
                    onValueChange={(value) => handleSliderChange(key, value)}
                  />
                </div>
              ))}
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional notes about your symptoms or triggers..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
              
              <Button type="submit" className="w-full">
                Save Symptom Log
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard 
              icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
              title="Total Logs"
              value={symptomLogs?.length || 0}
              description="Times you've tracked symptoms"
            />
            
            <MetricCard 
              icon={<Activity className="h-4 w-4 text-muted-foreground" />}
              title="Most Common"
              value={
                symptomLogs && symptomLogs.length > 0
                  ? Object.entries({
                      Anxiety: averages.anxiety,
                      Irritability: averages.irritability,
                      "Difficulty Concentrating": averages.difficultyConcent,
                      Insomnia: averages.insomnia,
                      "Increased Appetite": averages.increasedAppetite,
                      Fatigue: averages.fatigue,
                      Headaches: averages.headaches,
                    }).sort((a, b) => b[1] - a[1])[0][0]
                  : "None"
              }
              description="Your primary symptom"
            />
            
            <MetricCard 
              icon={<BarChart4 className="h-4 w-4 text-muted-foreground" />}
              title="Trend"
              value={
                symptomLogs && symptomLogs.length >= 3
                  ? symptomLogs[0].anxiety < symptomLogs[2].anxiety
                    ? "Improving"
                    : symptomLogs[0].anxiety > symptomLogs[2].anxiety
                    ? "Worsening"
                    : "Stable"
                  : "Not enough data"
              }
              description="Overall symptom trend"
            />
            
            <MetricCard 
              icon={<Brain className="h-4 w-4 text-muted-foreground" />}
              title="Last Logged"
              value={
                latestLog
                  ? new Date(latestLog.created_at).toLocaleDateString()
                  : "Never"
              }
              description="Your most recent check-in"
            />
          </div>
          
          {symptomLogs && symptomLogs.length > 0 ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart4 className="h-4 w-4" /> Current Symptom Intensity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[{
                          name: "Current",
                          anxiety: latestLog?.anxiety || 0,
                          irritability: latestLog?.irritability || 0,
                          "difficulty concentrating": latestLog?.difficulty_concentrating || 0,
                          insomnia: latestLog?.insomnia || 0,
                          "increased appetite": latestLog?.increased_appetite || 0,
                          fatigue: latestLog?.fatigue || 0,
                          headaches: latestLog?.headaches || 0,
                        }]}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" domain={[0, 10]} />
                        <YAxis dataKey="name" type="category" hide />
                        <Tooltip />
                        <Bar dataKey="anxiety" name="Anxiety" fill="#8884d8" />
                        <Bar dataKey="irritability" name="Irritability" fill="#82ca9d" />
                        <Bar dataKey="difficulty concentrating" name="Difficulty Concentrating" fill="#ffc658" />
                        <Bar dataKey="insomnia" name="Insomnia" fill="#ff8042" />
                        <Bar dataKey="increased appetite" name="Increased Appetite" fill="#0088fe" />
                        <Bar dataKey="fatigue" name="Fatigue" fill="#00C49F" />
                        <Bar dataKey="headaches" name="Headaches" fill="#FFBB28" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Activity className="h-4 w-4" /> Symptom Trends Over Time
                    </CardTitle>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant={activeChartMetric === "anxiety" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setActiveChartMetric("anxiety")}
                      >
                        Anxiety
                      </Button>
                      <Button 
                        variant={activeChartMetric === "irritability" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setActiveChartMetric("irritability")}
                      >
                        Irritability
                      </Button>
                      <Button 
                        variant={activeChartMetric === "difficulty concentrating" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setActiveChartMetric("difficulty concentrating")}
                      >
                        Focus
                      </Button>
                      <Button 
                        variant={activeChartMetric === "fatigue" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setActiveChartMetric("fatigue")}
                      >
                        Fatigue
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey={activeChartMetric}
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-muted/50">
              <CardContent className="p-6 text-center">
                <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-2">No Symptom Logs Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start tracking your withdrawal symptoms to see patterns and improvements over time.
                </p>
                <Button onClick={() => setShowLogForm(true)}>Log Your First Symptoms</Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
