
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Cigarette, Clock, Calendar as CalendarIcon, BarChart, Battery, Zap } from "lucide-react";
import { format } from "date-fns";

export function NicotineTracker() {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [date, setDate] = useState<Date>(new Date());
  const [amount, setAmount] = useState<number>(1);
  const [productType, setProductType] = useState<string>("cigarette");
  const [brand, setBrand] = useState<string>("");
  const [triggerType, setTriggerType] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [energyImpact, setEnergyImpact] = useState<number>(5);
  const [moodImpact, setMoodImpact] = useState<number>(5);
  const [notes, setNotes] = useState<string>("");
  
  const productTypes = [
    { value: "cigarette", label: "Cigarette" },
    { value: "vape", label: "Vape" },
    { value: "pouch", label: "Nicotine Pouch" },
    { value: "gum", label: "Nicotine Gum" },
    { value: "lozenge", label: "Nicotine Lozenge" },
    { value: "patch", label: "Nicotine Patch" },
    { value: "cigar", label: "Cigar" },
  ];
  
  const triggerTypes = [
    { value: "stress", label: "Stress / Anxiety" },
    { value: "social", label: "Social Situation" },
    { value: "habit", label: "Routine / Habit" },
    { value: "craving", label: "Strong Craving" },
    { value: "boredom", label: "Boredom" },
    { value: "mood", label: "Mood Enhancement" },
    { value: "focus", label: "Concentration Aid" },
  ];
  
  const { data: existingLog, isLoading } = useQuery({
    queryKey: ['nicotine-log', format(date, 'yyyy-MM-dd')],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('nicotine_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('date', format(date, 'yyyy-MM-dd'))
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
    onSuccess: (data) => {
      if (data) {
        setAmount(data.amount || 1);
        setProductType(data.product_type || "cigarette");
        setBrand(data.brand || "");
        setTriggerType(data.trigger_type || "");
        setLocation(data.location || "");
        setEnergyImpact(data.energy_impact || 5);
        setMoodImpact(data.mood_impact || 5);
        setNotes(data.notes || "");
      } else {
        // Reset form for new entries
        setAmount(1);
        setProductType("cigarette");
        setBrand("");
        setTriggerType("");
        setLocation("");
        setEnergyImpact(5);
        setMoodImpact(5);
        setNotes("");
      }
    }
  });
  
  const saveLog = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) return;
      
      const logData = {
        user_id: session.user.id,
        date: format(date, 'yyyy-MM-dd'),
        amount,
        product_type: productType,
        brand: brand || null,
        trigger_type: triggerType || null,
        location: location || null,
        energy_impact: energyImpact,
        mood_impact: moodImpact,
        notes: notes || null,
        created_at: new Date().toISOString(),
      };
      
      if (existingLog) {
        const { error } = await supabase
          .from('nicotine_logs')
          .update(logData)
          .eq('id', existingLog.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('nicotine_logs')
          .insert([logData]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nicotine-log'] });
      queryClient.invalidateQueries({ queryKey: ['nicotine-chart-data'] });
      toast({
        title: existingLog ? "Log Updated" : "Log Saved",
        description: "Your nicotine usage has been recorded.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error saving log",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const getProductIcon = () => {
    switch (productType) {
      case "cigarette":
        return <Cigarette className="h-5 w-5 text-red-500" />;
      case "vape":
        return <Battery className="h-5 w-5 text-blue-500" />;
      case "pouch":
        return <Zap className="h-5 w-5 text-purple-500" />;
      default:
        return <Cigarette className="h-5 w-5 text-red-500" />;
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getProductIcon()}
          Nicotine Usage Tracker
        </CardTitle>
        <CardDescription>
          Log your nicotine use to identify patterns and track progress
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Product Type</Label>
              <Select value={productType} onValueChange={setProductType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent>
                  {productTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Amount ({productType === "cigarette" ? "cigarettes" : "uses"})</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setAmount(Math.max(1, amount - 1))}
                  disabled={amount <= 1}
                >
                  -
                </Button>
                <Input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value) || 1)}
                  className="text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setAmount(amount + 1)}
                >
                  +
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Brand/Product Name (Optional)</Label>
              <Input
                placeholder="e.g., Marlboro, Juul"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>What triggered this use?</Label>
            <Select value={triggerType} onValueChange={setTriggerType}>
              <SelectTrigger>
                <SelectValue placeholder="Select a trigger" />
              </SelectTrigger>
              <SelectContent>
                {triggerTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Location (Optional)</Label>
            <Input
              placeholder="e.g., Home, Work, Bar"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Energy Impact</Label>
              <span className="text-sm font-medium">{energyImpact}/10</span>
            </div>
            <Slider
              value={[energyImpact]}
              onValueChange={([value]) => setEnergyImpact(value)}
              min={1}
              max={10}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Depleted</span>
              <span>Neutral</span>
              <span>Energized</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Mood Impact</Label>
              <span className="text-sm font-medium">{moodImpact}/10</span>
            </div>
            <Slider
              value={[moodImpact]}
              onValueChange={([value]) => setMoodImpact(value)}
              min={1}
              max={10}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Negative</span>
              <span>Neutral</span>
              <span>Positive</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Textarea
              placeholder="Any additional thoughts or observations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          
          <Button
            onClick={() => saveLog.mutate()}
            disabled={saveLog.isPending}
            className="w-full"
          >
            {existingLog ? "Update" : "Save"} Log
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
