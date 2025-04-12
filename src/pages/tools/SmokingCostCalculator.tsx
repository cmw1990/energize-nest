import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LandingHeader } from "@/components/layout/LandingHeader"; // Changed import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolAnalyticsWrapper } from "@/components/tools/ToolAnalyticsWrapper"; // Added import
import { Cigarette, DollarSign, CalendarDays, Info, AlertCircle } from "lucide-react"; // Added AlertCircle
import { useToast } from "@/hooks/use-toast";

interface CostResult {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
}

export default function SmokingCostCalculator() {
  const [itemsPerDay, setItemsPerDay] = useState('');
  const [costPerPack, setCostPerPack] = useState('');
  const [itemsPerPack, setItemsPerPack] = useState('20'); // Default for cigarettes
  const [costResult, setCostResult] = useState<CostResult | null>(null);
  const [error, setError] = useState<string>(""); // Added error state
  const { toast } = useToast();

  const calculateCost = () => {
    setError(""); // Clear previous errors
    setCostResult(null); // Reset result

    const numItemsPerDay = parseFloat(itemsPerDay);
    const numCostPerPack = parseFloat(costPerPack);
    const numItemsPerPack = parseInt(itemsPerPack, 10);

    // Input Validation
    let errors: string[] = [];
    if (isNaN(numItemsPerDay) || numItemsPerDay <= 0) {
        errors.push("Items Smoked Per Day");
    }
     if (isNaN(numCostPerPack) || numCostPerPack <= 0) {
        errors.push("Cost Per Pack/Unit");
    }
     if (isNaN(numItemsPerPack) || numItemsPerPack <= 0) {
        errors.push("Items Per Pack/Unit");
    }

    if (errors.length > 0) {
      const errorMsg = `Please enter valid positive numbers for: ${errors.join(', ')}.`;
      setError(errorMsg);
      toast({
        title: "Invalid Input",
        description: errorMsg,
        variant: "destructive"
      });
      return;
    }

    const costPerItem = numCostPerPack / numItemsPerPack;
    const dailyCost = numItemsPerDay * costPerItem;
    const weeklyCost = dailyCost * 7;
    const monthlyCost = dailyCost * 30.44; // Average days in a month
    const yearlyCost = dailyCost * 365.25; // Account for leap years

    setCostResult({
      daily: parseFloat(dailyCost.toFixed(2)),
      weekly: parseFloat(weeklyCost.toFixed(2)),
      monthly: parseFloat(monthlyCost.toFixed(2)),
      yearly: parseFloat(yearlyCost.toFixed(2)),
    });
  };

  return (
    <ToolAnalyticsWrapper toolName="smoking-cost-calculator" toolType="nicotine">
      <div className="min-h-screen bg-background">
        <LandingHeader /> {/* Changed component */}
        <div className="container mx-auto p-4 space-y-6 max-w-3xl">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Cigarette className="h-6 w-6 text-orange-600" />
                <CardTitle>Smoking Cost Calculator</CardTitle>
              </div>
              <CardDescription>
                Calculate how much your smoking habit costs over time.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="itemsPerDay">Items Smoked Per Day</Label>
                  <Input
                    id="itemsPerDay"
                    type="number"
                    value={itemsPerDay}
                    onChange={(e) => setItemsPerDay(e.target.value)}
                    placeholder="e.g., 10"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="itemsPerPack">Items Per Pack/Unit</Label>
                  <Input
                    id="itemsPerPack"
                    type="number"
                    value={itemsPerPack}
                    onChange={(e) => setItemsPerPack(e.target.value)}
                    placeholder="e.g., 20"
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costPerPack">Cost Per Pack/Unit ($)</Label>
                  <Input
                    id="costPerPack"
                    type="number"
                    value={costPerPack}
                    onChange={(e) => setCostPerPack(e.target.value)}
                    placeholder="e.g., 8.50"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

               {error && (
                    <div className="text-red-500 flex items-center gap-2 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{error}</span>
                    </div>
                )}

              <Button onClick={calculateCost} className="w-full">
                Calculate Cost
              </Button>

              {costResult && (
                <Card className="mt-6 bg-muted/50">
                  <CardHeader>
                    <CardTitle>Estimated Smoking Costs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Daily</p>
                        <p className="text-xl font-bold">${costResult.daily.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Weekly</p>
                        <p className="text-xl font-bold">${costResult.weekly.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Monthly</p>
                        <p className="text-xl font-bold">${costResult.monthly.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Yearly</p>
                        <p className="text-xl font-bold">${costResult.yearly.toLocaleString()}</p>
                      </div>
                    </div>
                     <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 space-y-2">
                        <h3 className="font-medium flex items-center gap-2 text-blue-700 dark:text-blue-300">
                            <Info className="h-5 w-5" />
                            Consider This
                        </h3>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                            This calculator shows the direct cost. Quitting also brings significant health benefits and potential savings on healthcare costs.
                        </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolAnalyticsWrapper>
  );
}