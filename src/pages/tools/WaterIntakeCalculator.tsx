import React, { useState } from "react"; // Added React import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LandingHeader } from "@/components/layout/LandingHeader"; // Changed import
import { ToolAnalyticsWrapper } from "@/components/tools/ToolAnalyticsWrapper"; // Added import
import { Droplets, AlertCircle, Info } from "lucide-react"; // Added AlertCircle, Info
import { useToast } from "@/hooks/use-toast"; // Added useToast

export default function WaterIntakeCalculator() {
  const [weight, setWeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [climate, setClimate] = useState("temperate");
  const [waterIntake, setWaterIntake] = useState<number | null>(null);
  const [error, setError] = useState<string>(""); // Added error state
  const { toast } = useToast(); // Added toast hook

  const calculateWaterIntake = () => {
    setError(""); // Clear previous errors
    setWaterIntake(null); // Reset result

    const weightKg = parseFloat(weight);

    if (isNaN(weightKg) || weightKg <= 0) {
      const msg = "Please enter a valid positive weight in kg.";
      setError(msg);
      toast({
        title: "Invalid Input",
        description: msg,
        variant: "destructive"
      });
      return;
    }

    // Base calculation: 30ml per kg of body weight
    let intake = weightKg * 30;

    // Activity level adjustments
    const activityMultipliers = {
      sedentary: 1,
      light: 1.1,
      moderate: 1.2,
      active: 1.3,
      veryActive: 1.4
    };

    intake *= activityMultipliers[activityLevel as keyof typeof activityMultipliers];

    // Climate adjustments
    const climateMultipliers = {
      cold: 0.9,
      temperate: 1,
      hot: 1.1,
      veryHot: 1.2
    };

    intake *= climateMultipliers[climate as keyof typeof climateMultipliers];

    // Convert to liters and round to 1 decimal
    setWaterIntake(Math.round(intake / 100) / 10);
  };

  return (
    <ToolAnalyticsWrapper toolName="water-intake-calculator" toolType="health">
      <div className="min-h-screen bg-background">
        <LandingHeader /> {/* Changed component */}
        <div className="container mx-auto p-4 space-y-6 max-w-2xl">
          <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Droplets className="h-6 w-6 text-blue-500" />
                    <CardTitle>Daily Water Intake Calculator</CardTitle>
                </div>
                <CardDescription>
                Calculate your recommended daily water intake based on your weight, activity level, and climate.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Enter your weight"
                    min="1" // Added min attribute
                />
                </div>

                <div className="space-y-2">
                <Label htmlFor="activityLevel">Activity Level</Label>
                <Select value={activityLevel} onValueChange={setActivityLevel}>
                    <SelectTrigger id="activityLevel">
                    <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                    <SelectItem value="light">Light Activity (1-3 days/week)</SelectItem>
                    <SelectItem value="moderate">Moderate Activity (3-5 days/week)</SelectItem>
                    <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                    <SelectItem value="veryActive">Very Active (intense exercise/physical job)</SelectItem>
                    </SelectContent>
                </Select>
                </div>

                <div className="space-y-2">
                <Label htmlFor="climate">Climate</Label>
                <Select value={climate} onValueChange={setClimate}>
                    <SelectTrigger id="climate">
                    <SelectValue placeholder="Select climate" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="cold">Cold</SelectItem>
                    <SelectItem value="temperate">Temperate</SelectItem>
                    <SelectItem value="hot">Hot</SelectItem>
                    <SelectItem value="veryHot">Very Hot</SelectItem>
                    </SelectContent>
                </Select>
                </div>

                 {error && (
                    <div className="text-red-500 flex items-center gap-2 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{error}</span>
                    </div>
                )}

                <Button onClick={calculateWaterIntake} className="w-full">
                Calculate Water Intake
                </Button>

                {waterIntake !== null && (
                <Card className="mt-6 bg-muted/50">
                    <CardHeader>
                        <CardTitle>Recommended Daily Water Intake</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <p className="text-3xl font-bold text-center mb-4">{waterIntake} liters</p>
                        <p className="text-center text-sm text-muted-foreground mb-4">This equals approximately:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground text-center">
                            <li>{Math.round(waterIntake * 4)} glasses (250ml each)</li>
                            <li>{Math.round(waterIntake * 1000)} milliliters</li>
                            <li>{Math.round(waterIntake * 33.8)} fluid ounces</li>
                        </ul>
                        <p className="mt-4 text-xs text-muted-foreground text-center">
                            Note: This is a general guideline. Actual needs may vary based on diet, health conditions, and other factors. Listen to your body and consult healthcare professionals for personalized advice.
                        </p>
                    </CardContent>
                </Card>
                )}
                 <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 space-y-2">
                    <h3 className="font-medium flex items-center gap-2 text-blue-700 dark:text-blue-300">
                        <Info className="h-5 w-5" />
                        Hydration Tips
                    </h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                        Carry a water bottle, drink before you feel thirsty, and consider electrolyte drinks during intense exercise or hot weather. Fruits and vegetables also contribute to hydration.
                    </p>
                </div>
            </CardContent>
            </Card>
        </div>
        </div>
    </ToolAnalyticsWrapper>
  )
}
