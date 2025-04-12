import React, { useState } from "react"; // Added React import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LandingHeader } from "@/components/layout/LandingHeader"; // Changed import
import { ToolAnalyticsWrapper } from "@/components/tools/ToolAnalyticsWrapper"; // Added import
import { PieChart, AlertCircle, Info } from "lucide-react"; // Added icons
import { useToast } from "@/hooks/use-toast"; // Added import

interface MacroSplit {
  protein: number;
  carbs: number;
  fats: number;
}

export default function MacroCalculator() {
  const [calories, setCalories] = useState("");
  const [dietType, setDietType] = useState("balanced");
  const [macros, setMacros] = useState<MacroSplit | null>(null);
  const [error, setError] = useState<string>(""); // Added error state
  const { toast } = useToast(); // Added toast hook

  const calculateMacros = () => {
    setError(""); // Clear previous errors
    setMacros(null); // Reset result

    const totalCalories = parseInt(calories, 10);

    if (isNaN(totalCalories) || totalCalories <= 0) {
      const msg = "Please enter a valid positive number for daily calories.";
      setError(msg);
      toast({ title: "Invalid Input", description: msg, variant: "destructive" });
      return;
    }

    let macroSplit: MacroSplit;

    // Calculate grams based on percentages and calorie values per gram
    switch (dietType) {
      case "lowCarb":
        macroSplit = {
          protein: Math.round((totalCalories * 0.30) / 4), // 30% protein
          carbs: Math.round((totalCalories * 0.20) / 4),   // 20% carbs
          fats: Math.round((totalCalories * 0.50) / 9)     // 50% fats
        };
        break;
      case "highProtein":
        macroSplit = {
          protein: Math.round((totalCalories * 0.40) / 4), // 40% protein
          carbs: Math.round((totalCalories * 0.40) / 4),   // 40% carbs
          fats: Math.round((totalCalories * 0.20) / 9)     // 20% fats
        };
        break;
      case "ketogenic":
        macroSplit = {
          protein: Math.round((totalCalories * 0.20) / 4), // 20% protein
          carbs: Math.round((totalCalories * 0.05) / 4),   // 5% carbs
          fats: Math.round((totalCalories * 0.75) / 9)     // 75% fats
        };
        break;
      default: // balanced
        macroSplit = {
          protein: Math.round((totalCalories * 0.30) / 4), // 30% protein
          carbs: Math.round((totalCalories * 0.45) / 4),   // 45% carbs
          fats: Math.round((totalCalories * 0.25) / 9)     // 25% fats
        };
    }

    setMacros(macroSplit);
  };

  return (
    <ToolAnalyticsWrapper toolName="macro-calculator" toolType="nutrition">
        <div className="min-h-screen bg-background">
        <LandingHeader /> {/* Changed component */}
        <div className="container mx-auto p-4 space-y-6 max-w-2xl">
            <Card>
            <CardHeader>
                 <div className="flex items-center gap-2">
                    <PieChart className="h-6 w-6 text-primary" />
                    <CardTitle>Macro Calculator</CardTitle>
                 </div>
                <CardDescription>
                Calculate your recommended macronutrient intake (in grams) based on your daily calorie goals and preferred diet type.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                <Label htmlFor="calories">Daily Calorie Target</Label>
                <Input
                    id="calories"
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="e.g., 2000"
                    min="1"
                />
                </div>

                <div className="space-y-2">
                <Label htmlFor="dietType">Diet Type / Goal</Label>
                <Select value={dietType} onValueChange={setDietType}>
                    <SelectTrigger id="dietType">
                    <SelectValue placeholder="Select diet type" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="balanced">Balanced (45C/30P/25F)</SelectItem>
                    <SelectItem value="lowCarb">Low Carb (20C/30P/50F)</SelectItem>
                    <SelectItem value="highProtein">High Protein (40C/40P/20F)</SelectItem>
                    <SelectItem value="ketogenic">Ketogenic (5C/20P/75F)</SelectItem>
                    </SelectContent>
                </Select>
                </div>

                 {error && (
                    <div className="text-red-500 flex items-center gap-2 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{error}</span>
                    </div>
                )}

                <Button onClick={calculateMacros} className="w-full">
                Calculate Macros
                </Button>

                {macros && (
                <Card className="mt-6 bg-muted/50">
                    <CardHeader>
                        <CardTitle>Estimated Daily Macro Targets</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-background rounded-lg shadow-sm">
                            <p className="text-2xl font-bold text-blue-600">{macros.protein}g</p>
                            <p className="text-sm font-medium text-muted-foreground">Protein</p>
                        </div>
                        <div className="text-center p-4 bg-background rounded-lg shadow-sm">
                            <p className="text-2xl font-bold text-orange-600">{macros.carbs}g</p>
                            <p className="text-sm font-medium text-muted-foreground">Carbs</p>
                        </div>
                        <div className="text-center p-4 bg-background rounded-lg shadow-sm">
                            <p className="text-2xl font-bold text-yellow-600">{macros.fats}g</p>
                            <p className="text-sm font-medium text-muted-foreground">Fats</p>
                        </div>
                        </div>

                        <div className="mt-4 text-xs text-muted-foreground">
                            <p>Based on a <span className="font-medium">{dietType}</span> distribution for <span className="font-medium">{calories}</span> calories.</p>
                            <ul className="list-disc list-inside mt-1">
                                <li>Protein: 4 kcal/g</li>
                                <li>Carbs: 4 kcal/g</li>
                                <li>Fats: 9 kcal/g</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
                )}
                 <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 space-y-2">
                    <h3 className="font-medium flex items-center gap-2 text-blue-700 dark:text-blue-300">
                        <Info className="h-5 w-5" />
                        Understanding Macros
                    </h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                        Macronutrients (protein, carbohydrates, and fats) are the main nutrients your body needs for energy and function. These targets are estimates based on common dietary approaches. Consult a nutritionist or dietitian for personalized macro recommendations based on your specific health goals and needs.
                    </p>
                </div>
            </CardContent>
            </Card>
        </div>
        </div>
    </ToolAnalyticsWrapper>
  )
}
