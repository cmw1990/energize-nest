import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar, CigaretteOff, DollarSign, Heart } from "lucide-react";

export default function QuitPlan() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [targetDate, setTargetDate] = useState("");
  const [initialUsage, setInitialUsage] = useState("");
  const [targetUsage, setTargetUsage] = useState("");
  const [strategy, setStrategy] = useState<"cold_turkey" | "taper_down" | "nrt_assisted" | "harm_reduction">("taper_down");
  const [productType, setProductType] = useState("");
  const [isShiftWorker, setIsShiftWorker] = useState(false);
  const [shiftPattern, setShiftPattern] = useState("");

  const { data: currentPlan } = useQuery({
    queryKey: ['quit-plan'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quit_plans')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const createPlan = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) throw new Error("Must be logged in");
      
      const { error } = await supabase
        .from('quit_plans')
        .insert([{
          user_id: session.user.id,
          strategy_type: strategy,
          initial_daily_usage: Number(initialUsage),
          target_daily_usage: Number(targetUsage),
          target_date: targetDate,
          product_type: productType,
          is_shift_worker: isShiftWorker,
          shift_pattern: shiftPattern,
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quit-plan'] });
      toast({
        title: "Plan created",
        description: "Your quit plan has been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create quit plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quit Plan</h1>
        <Button variant="outline" onClick={() => navigate('/sobriety')}>
          Back to Dashboard
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CigaretteOff className="h-5 w-5" />
              Create Your Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="strategy">Quit Strategy</Label>
              <Select
                value={strategy}
                onValueChange={(value: typeof strategy) => setStrategy(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cold_turkey">Cold Turkey</SelectItem>
                  <SelectItem value="taper_down">Taper Down</SelectItem>
                  <SelectItem value="nrt_assisted">NRT Assisted</SelectItem>
                  <SelectItem value="harm_reduction">Harm Reduction</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productType">Product Type</Label>
              <Input
                id="productType"
                name="productType"
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                placeholder="e.g., Cigarettes, Vape"
                aria-label="Product type"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="initialUsage">Current Daily Usage</Label>
                <Input
                  id="initialUsage"
                  name="initialUsage"
                  type="number"
                  value={initialUsage}
                  onChange={(e) => setInitialUsage(e.target.value)}
                  placeholder="Amount per day"
                  aria-label="Current daily usage"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetUsage">Target Daily Usage</Label>
                <Input
                  id="targetUsage"
                  name="targetUsage"
                  type="number"
                  value={targetUsage}
                  onChange={(e) => setTargetUsage(e.target.value)}
                  placeholder="Target amount"
                  aria-label="Target daily usage"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetDate">Target Quit Date</Label>
              <Input
                id="targetDate"
                name="targetDate"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                aria-label="Target quit date"
              />
            </div>

            <div className="space-y-2">
              <Label>Work Pattern</Label>
              <div className="flex items-center space-x-2">
                <input
                  id="shift-worker"
                  name="shift-worker"
                  type="checkbox"
                  checked={isShiftWorker}
                  onChange={(e) => setIsShiftWorker(e.target.checked)}
                  title="Indicate if you are a shift worker"
                  aria-label="Shift worker status"
                />
                <Label htmlFor="shift-worker" className="cursor-pointer">
                  I am a shift worker
                </Label>
              </div>
              {isShiftWorker && (
                <Input
                  id="shift-pattern"
                  name="shift-pattern"
                  placeholder="Describe your shift pattern"
                  value={shiftPattern}
                  onChange={(e) => setShiftPattern(e.target.value)}
                  aria-label="Shift pattern description"
                />
              )}
            </div>

            <Button 
              className="w-full" 
              onClick={() => createPlan.mutate()}
              disabled={createPlan.isPending}
            >
              {createPlan.isPending ? "Saving..." : "Save Plan"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Health Benefits Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                  <p>20 minutes: Heart rate drops</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                  <p>12 hours: Carbon monoxide levels normalize</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                  <p>2-12 weeks: Circulation improves</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                  <p>1-9 months: Coughing and shortness of breath decrease</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                Money Saved Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentPlan && (
                <div className="space-y-4">
                  <p className="text-lg">
                    Based on your current usage of {currentPlan.initial_daily_usage} per day:
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly savings</p>
                      <p className="text-2xl font-bold">
                        ${(currentPlan.initial_daily_usage * 30 * 0.50).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Yearly savings</p>
                      <p className="text-2xl font-bold">
                        ${(currentPlan.initial_daily_usage * 365 * 0.50).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {currentPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Current Plan Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Strategy</p>
                <p className="font-medium capitalize">{currentPlan.strategy_type.replace(/_/g, ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Target Date</p>
                <p className="font-medium">{new Date(currentPlan.target_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Initial Usage</p>
                <p className="font-medium">{currentPlan.initial_daily_usage} per day</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Target Usage</p>
                <p className="font-medium">{currentPlan.target_daily_usage} per day</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}