
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BeverageAnalyticsChart } from "./BeverageAnalyticsChart";
import { BeverageType, BeverageLog, BeverageAnalytics } from "@/types/beverages";
import { format, parseISO, subDays, subHours } from "date-fns";
import { CupSoda, Droplet, Coffee, Wine, CircleDollarSign, Plus, FileText, BarChart3 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function BeverageTracker({ supabase }: { supabase: any }) {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("log");
  
  // Form state
  const [selectedBeverageType, setSelectedBeverageType] = useState<string>("");
  const [customName, setCustomName] = useState<string>("");
  const [amount, setAmount] = useState<string>("250");
  const [customCaffeine, setCustomCaffeine] = useState<string>("");
  const [customAlcohol, setCustomAlcohol] = useState<string>("");
  const [customCalories, setCustomCalories] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // Fetch beverage types
  const { data: beverageTypes, isLoading: typesLoading } = useQuery({
    queryKey: ["beverageTypes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("beverage_types")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as BeverageType[];
    }
  });

  // Fetch user's beverage logs
  const { data: beverageLogs, isLoading: logsLoading } = useQuery({
    queryKey: ["beverageLogs", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("beverage_logs")
        .select("*, beverage_type:beverage_types(*)")
        .eq("user_id", session?.user?.id)
        .order("timestamp", { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as BeverageLog[];
    },
    enabled: !!session?.user?.id
  });

  // Fetch analytics data
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["beverageAnalytics", session?.user?.id],
    queryFn: async () => {
      // Get logs for the past 7 days
      const startDate = subDays(new Date(), 7).toISOString();
      
      const { data, error } = await supabase
        .from("beverage_logs")
        .select("*, beverage_type:beverage_types(*)")
        .eq("user_id", session?.user?.id)
        .gte("timestamp", startDate)
        .order("timestamp", { ascending: true });
      
      if (error) throw error;
      
      // Process analytics data
      const logs = data as BeverageLog[];
      
      // Prepare daily totals
      const dailyTotals: Record<string, { water: number; caffeine: number; alcohol: number; calories: number }> = {};
      
      // Initialize past 7 days
      for (let i = 0; i < 7; i++) {
        const date = format(subDays(new Date(), i), "yyyy-MM-dd");
        dailyTotals[date] = { water: 0, caffeine: 0, alcohol: 0, calories: 0 };
      }
      
      // Calculate totals
      let totalWater = 0;
      let totalCaffeine = 0;
      let totalAlcohol = 0;
      let totalCalories = 0;
      
      logs.forEach(log => {
        const date = format(parseISO(log.timestamp), "yyyy-MM-dd");
        
        // Skip if date is not in our range
        if (!dailyTotals[date]) return;
        
        // Calculate water content
        const waterAmount = log.amount_ml * (log.beverage_type?.water_content || 1);
        
        // Calculate caffeine content
        let caffeineAmount = 0;
        if (log.custom_caffeine_content !== null && log.custom_caffeine_content !== undefined) {
          caffeineAmount = (log.amount_ml / 100) * log.custom_caffeine_content;
        } else if (log.beverage_type?.caffeine_content) {
          caffeineAmount = (log.amount_ml / 100) * log.beverage_type.caffeine_content;
        }
        
        // Calculate alcohol content
        let alcoholAmount = 0;
        if (log.custom_alcohol_content !== null && log.custom_alcohol_content !== undefined) {
          alcoholAmount = (log.amount_ml / 100) * log.custom_alcohol_content;
        } else if (log.beverage_type?.alcohol_content) {
          alcoholAmount = (log.amount_ml / 100) * log.beverage_type.alcohol_content;
        }
        
        // Calculate calories
        let caloriesAmount = 0;
        if (log.custom_calories !== null && log.custom_calories !== undefined) {
          caloriesAmount = (log.amount_ml / 100) * log.custom_calories;
        } else if (log.beverage_type?.calories) {
          caloriesAmount = (log.amount_ml / 100) * log.beverage_type.calories;
        }
        
        // Add to daily totals
        dailyTotals[date].water += waterAmount;
        dailyTotals[date].caffeine += caffeineAmount;
        dailyTotals[date].alcohol += alcoholAmount;
        dailyTotals[date].calories += caloriesAmount;
        
        // Add to overall totals
        totalWater += waterAmount;
        totalCaffeine += caffeineAmount;
        totalAlcohol += alcoholAmount;
        totalCalories += caloriesAmount;
      });
      
      // Convert dailyTotals to array format for chart
      const weeklyData = Object.entries(dailyTotals).map(([date, values]) => ({
        date: format(parseISO(date), "MMM dd"),
        water: Math.round(values.water),
        caffeine: Math.round(values.caffeine),
        alcohol: Math.round(values.alcohol * 10) / 10, // One decimal place
        calories: Math.round(values.calories)
      })).reverse();
      
      return {
        totalWater: Math.round(totalWater),
        totalCaffeine: Math.round(totalCaffeine),
        totalAlcohol: Math.round(totalAlcohol * 10) / 10,
        totalCalories: Math.round(totalCalories),
        weeklyData,
        recentLogs: logs.slice(0, 10)
      } as BeverageAnalytics;
    },
    enabled: !!session?.user?.id
  });

  // Log beverage mutation
  const logBeverage = useMutation({
    mutationFn: async () => {
      // Validate inputs
      if (!amount || parseInt(amount) <= 0) {
        throw new Error("Please enter a valid amount");
      }
      
      if (!selectedBeverageType && !customName) {
        throw new Error("Please select a beverage type or enter a custom name");
      }
      
      const logData: any = {
        user_id: session?.user?.id,
        amount_ml: parseInt(amount),
        timestamp: new Date().toISOString(),
        notes: notes || undefined
      };
      
      if (selectedBeverageType) {
        logData.beverage_type_id = selectedBeverageType;
      }
      
      if (customName) {
        logData.custom_name = customName;
      }
      
      if (customCaffeine) {
        logData.custom_caffeine_content = parseFloat(customCaffeine);
      }
      
      if (customAlcohol) {
        logData.custom_alcohol_content = parseFloat(customAlcohol);
      }
      
      if (customCalories) {
        logData.custom_calories = parseFloat(customCalories);
      }
      
      const { error } = await supabase
        .from("beverage_logs")
        .insert([logData]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beverageLogs"] });
      queryClient.invalidateQueries({ queryKey: ["beverageAnalytics"] });
      toast({
        title: "Beverage logged",
        description: "Your beverage has been recorded successfully."
      });
      
      // Reset form
      setSelectedBeverageType("");
      setCustomName("");
      setAmount("250");
      setCustomCaffeine("");
      setCustomAlcohol("");
      setCustomCalories("");
      setNotes("");
    },
    onError: (error: any) => {
      toast({
        title: "Error logging beverage",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    }
  });

  // Find selected beverage type details
  const selectedBeverage = beverageTypes?.find(b => b.id === selectedBeverageType);

  // Helper function to calculate water intake progress
  const calculateWaterProgress = () => {
    const targetWater = 2500; // 2.5L recommended daily intake
    const todayWater = analytics?.weeklyData[0]?.water || 0;
    return Math.min(Math.round((todayWater / targetWater) * 100), 100);
  };

  // Helper function to calculate caffeine progress
  const calculateCaffeineProgress = () => {
    const maxCaffeine = 400; // 400mg recommended max
    const todayCaffeine = analytics?.weeklyData[0]?.caffeine || 0;
    return Math.min(Math.round((todayCaffeine / maxCaffeine) * 100), 100);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Droplet className="h-4 w-4 mr-2 text-blue-500" />
              Today's Water
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">
              {analytics ? `${analytics.weeklyData[0]?.water || 0}ml` : "Loading..."}
            </div>
            {analytics && (
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Goal: 2500ml</span>
                  <span>{calculateWaterProgress()}%</span>
                </div>
                <Progress value={calculateWaterProgress()} className="h-1.5" />
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Coffee className="h-4 w-4 mr-2 text-amber-700" />
              Caffeine
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">
              {analytics ? `${analytics.weeklyData[0]?.caffeine || 0}mg` : "Loading..."}
            </div>
            {analytics && (
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Max: 400mg</span>
                  <span>{calculateCaffeineProgress()}%</span>
                </div>
                <Progress value={calculateCaffeineProgress()} className="h-1.5" />
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Wine className="h-4 w-4 mr-2 text-red-500" />
              Alcohol
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">
              {analytics ? `${analytics.weeklyData[0]?.alcohol || 0}g` : "Loading..."}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Weekly: {analytics ? `${analytics.totalAlcohol}g` : "Loading..."}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CircleDollarSign className="h-4 w-4 mr-2 text-green-500" />
              Calories
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">
              {analytics ? `${analytics.weeklyData[0]?.calories || 0}` : "Loading..."}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From beverages only
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="log" className="flex items-center gap-1.5">
            <Plus className="h-4 w-4" />
            <span>Log Beverage</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            <span>History</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1.5">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="log" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Log Beverage Intake</CardTitle>
              <CardDescription>
                Track your hydration, caffeine, and other beverage consumption
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="beverageType">Beverage Type</Label>
                <Select 
                  value={selectedBeverageType} 
                  onValueChange={setSelectedBeverageType}
                >
                  <SelectTrigger id="beverageType">
                    <SelectValue placeholder="Select beverage type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Custom Beverage</SelectItem>
                    {beverageTypes?.map((beverage) => (
                      <SelectItem key={beverage.id} value={beverage.id}>
                        {beverage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {!selectedBeverageType && (
                <div className="space-y-2">
                  <Label htmlFor="customName">Custom Beverage Name</Label>
                  <Input
                    id="customName"
                    placeholder="e.g., Green Smoothie"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (ml)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="amount"
                    type="number"
                    placeholder="250"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-24"
                  />
                  <div className="flex-1">
                    <Slider
                      value={[parseInt(amount) || 0]}
                      min={0}
                      max={1000}
                      step={50}
                      onValueChange={(values) => setAmount(values[0].toString())}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setAmount("250")}
                    >
                      250ml
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setAmount("330")}
                    >
                      330ml
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setAmount("500")}
                    >
                      500ml
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Show beverage information if a type is selected */}
              {selectedBeverage && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Beverage Information:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Water Content:</p>
                      <p>{Math.round(selectedBeverage.water_content * 100)}%</p>
                    </div>
                    {selectedBeverage.caffeine_content !== null && (
                      <div>
                        <p className="text-muted-foreground">Caffeine:</p>
                        <p>{selectedBeverage.caffeine_content} mg/100ml</p>
                      </div>
                    )}
                    {selectedBeverage.alcohol_content !== null && (
                      <div>
                        <p className="text-muted-foreground">Alcohol:</p>
                        <p>{selectedBeverage.alcohol_content}%</p>
                      </div>
                    )}
                    {selectedBeverage.calories !== null && (
                      <div>
                        <p className="text-muted-foreground">Calories:</p>
                        <p>{selectedBeverage.calories} per 100ml</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Custom nutrition information for custom beverages */}
              {!selectedBeverageType && (
                <div className="space-y-4">
                  <h4 className="font-medium">Custom Information (Optional):</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customCaffeine">Caffeine (mg/100ml)</Label>
                      <Input
                        id="customCaffeine"
                        type="number"
                        placeholder="0"
                        value={customCaffeine}
                        onChange={(e) => setCustomCaffeine(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customAlcohol">Alcohol %</Label>
                      <Input
                        id="customAlcohol"
                        type="number"
                        placeholder="0"
                        value={customAlcohol}
                        onChange={(e) => setCustomAlcohol(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customCalories">Calories (per 100ml)</Label>
                      <Input
                        id="customCalories"
                        type="number"
                        placeholder="0"
                        value={customCalories}
                        onChange={(e) => setCustomCalories(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about this beverage..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={() => logBeverage.mutate()} 
                disabled={logBeverage.isPending}
                className="w-full"
              >
                <CupSoda className="mr-2 h-4 w-4" />
                {logBeverage.isPending ? "Logging..." : "Log Beverage"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Beverage History</CardTitle>
              <CardDescription>
                Your most recent beverage consumption
              </CardDescription>
            </CardHeader>
            <CardContent>
              {logsLoading ? (
                <div className="flex justify-center p-4">
                  <p>Loading history...</p>
                </div>
              ) : beverageLogs?.length === 0 ? (
                <div className="text-center p-4 text-muted-foreground">
                  No beverage logs found. Start tracking your hydration!
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {beverageLogs?.map((log) => (
                      <div key={log.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted">
                        <Avatar className="h-10 w-10">
                          {log.beverage_type_id ? (
                            <AvatarImage 
                              src={`/icons/${log.beverage_type?.name.toLowerCase().replace(/ /g, "-")}.svg`} 
                              alt={log.beverage_type?.name || "Custom"} 
                            />
                          ) : null}
                          <AvatarFallback>
                            {log.beverage_type?.name ? 
                              log.beverage_type.name.substring(0, 2).toUpperCase() : 
                              (log.custom_name ? log.custom_name.substring(0, 2).toUpperCase() : "BV")}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between">
                            <p className="font-medium">
                              {log.beverage_type?.name || log.custom_name || "Custom Beverage"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {format(parseISO(log.timestamp), "MMM d, h:mm a")}
                            </p>
                          </div>
                          
                          <div className="flex flex-wrap gap-x-4 text-sm text-muted-foreground">
                            <span>{log.amount_ml}ml</span>
                            
                            {(log.beverage_type?.caffeine_content || log.custom_caffeine_content) && (
                              <span>
                                {Math.round((log.amount_ml / 100) * 
                                  (log.custom_caffeine_content !== null ? 
                                    log.custom_caffeine_content : 
                                    (log.beverage_type?.caffeine_content || 0)))}mg caffeine
                              </span>
                            )}
                            
                            {(log.beverage_type?.alcohol_content || log.custom_alcohol_content) && (
                              <span>
                                {(log.beverage_type?.alcohol_content || log.custom_alcohol_content)}% alcohol
                              </span>
                            )}
                          </div>
                          
                          {log.notes && (
                            <p className="text-sm italic">{log.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Beverage Analytics</CardTitle>
              <CardDescription>
                Insights into your hydration and beverage consumption
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {analyticsLoading ? (
                <div className="flex justify-center p-4">
                  <p>Loading analytics...</p>
                </div>
              ) : !analytics ? (
                <div className="text-center p-4 text-muted-foreground">
                  No data available yet. Start tracking your beverages!
                </div>
              ) : (
                <>
                  <div className="h-[300px]">
                    <BeverageAnalyticsChart data={analytics.weeklyData} />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Weekly Summary</h3>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Total Water Intake:</span>
                          <span className="font-medium">{analytics.totalWater.toLocaleString()}ml</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Caffeine:</span>
                          <span className="font-medium">{analytics.totalCaffeine.toLocaleString()}mg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Alcohol:</span>
                          <span className="font-medium">{analytics.totalAlcohol}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Calories from Beverages:</span>
                          <span className="font-medium">{analytics.totalCalories.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">Insights</h3>
                      <div className="space-y-2">
                        {analytics.totalWater < 17500 && (
                          <Alert variant="warning" className="py-2">
                            <AlertDescription>
                              Your weekly water intake averages {Math.round(analytics.totalWater / 7).toLocaleString()}ml per day. 
                              Try to reach at least 2,500ml daily.
                            </AlertDescription>
                          </Alert>
                        )}
                        
                        {analytics.totalCaffeine > 2800 && (
                          <Alert variant="warning" className="py-2">
                            <AlertDescription>
                              Your weekly caffeine intake averages {Math.round(analytics.totalCaffeine / 7)}mg per day. 
                              Consider reducing to below 400mg daily.
                            </AlertDescription>
                          </Alert>
                        )}
                        
                        {analytics.totalAlcohol > 0 && (
                          <Alert variant="info" className="py-2">
                            <AlertDescription>
                              You've consumed {analytics.totalAlcohol}g of alcohol this week. 
                              Remember to stay hydrated when consuming alcohol.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
