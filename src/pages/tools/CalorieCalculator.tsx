import React, { useState } from "react"; // Added React import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LandingHeader } from "@/components/layout/LandingHeader"; // Changed import
import { ToolAnalyticsWrapper } from "@/components/tools/ToolAnalyticsWrapper"; // Added import
import { Calculator, AlertCircle, Info } from "lucide-react"; // Added icons
import { useToast } from "@/hooks/use-toast"; // Added import

export default function CalorieCalculator() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("1.2"); // Default to sedentary multiplier
  const [goal, setGoal] = useState("maintain");
  const [calories, setCalories] = useState<number | null>(null);
  const [error, setError] = useState<string>(""); // Added error state
  const { toast } = useToast(); // Added toast hook

  const calculateCalories = () => {
    setError(""); // Clear previous errors
    setCalories(null); // Reset result

    const ageNum = parseInt(age, 10);
    const weightKg = parseFloat(weight);
    const heightCm = parseFloat(height);
    const activityMultiplier = parseFloat(activityLevel);

    // Input Validation
    let errors: string[] = [];
    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      errors.push("Age (1-120)");
    }
    if (isNaN(weightKg) || weightKg <= 0) {
      errors.push("Weight (>0 kg)");
    }
    if (isNaN(heightCm) || heightCm <= 0) {
      errors.push("Height (>0 cm)");
    }
     if (isNaN(activityMultiplier)) {
        errors.push("Activity Level"); // Should not happen with select
     }

     if (errors.length > 0) {
        const errorMsg = `Please enter valid positive values for: ${errors.join(', ')}.`;
        setError(errorMsg);
        toast({ title: "Invalid Input", description: errorMsg, variant: "destructive" });
        return;
     }


    // BMR calculation using Mifflin-St Jeor Equation
    let bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum;
    bmr = gender === "male" ? bmr + 5 : bmr - 161;

    let tdee = bmr * activityMultiplier;

    // Adjust based on goal
    switch (goal) {
      case "lose":
        tdee -= 500; // Create a 500 calorie deficit
        break;
      case "gain":
        tdee += 500; // Create a 500 calorie surplus
        break;
      // Maintain case doesn't need adjustment
    }

    // Ensure calories don't go below a reasonable minimum (e.g., 1200)
    const calculatedCalories = Math.max(1200, Math.round(tdee));
    setCalories(calculatedCalories);
  };

  return (
    <ToolAnalyticsWrapper toolName="calorie-calculator" toolType="nutrition">
        <div className="min-h-screen bg-background">
        <LandingHeader /> {/* Changed component */}
        <div className="container mx-auto p-4 space-y-6 max-w-3xl">
            <Card>
            <CardHeader>
                 <div className="flex items-center gap-2">
                    <Calculator className="h-6 w-6 text-primary" />
                    <CardTitle>Daily Calorie Calculator</CardTitle>
                 </div>
                <CardDescription>
                Estimate your daily calorie needs based on your goals and activity level using the Mifflin-St Jeor equation.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <RadioGroup
                value={gender}
                onValueChange={(value) => setGender(value as "male" | "female")}
                className="flex space-x-4"
                >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                </div>
                </RadioGroup>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="age">Age (years)</Label>
                    <Input
                    id="age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g., 30"
                    min="1"
                    max="120"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g., 70"
                    min="1"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                    id="height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g., 175"
                    min="1"
                    />
                </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="activityLevel">Activity Level</Label>
                        <Select value={activityLevel} onValueChange={setActivityLevel}>
                        <SelectTrigger id="activityLevel">
                            <SelectValue placeholder="Select activity level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1.2">Sedentary (little or no exercise)</SelectItem>
                            <SelectItem value="1.375">Light (exercise 1-3 days/week)</SelectItem>
                            <SelectItem value="1.55">Moderate (exercise 3-5 days/week)</SelectItem>
                            <SelectItem value="1.725">Active (exercise 6-7 days/week)</SelectItem>
                            <SelectItem value="1.9">Very Active (hard exercise/physical job)</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="goal">Goal</Label>
                        <Select value={goal} onValueChange={setGoal}>
                        <SelectTrigger id="goal">
                            <SelectValue placeholder="Select your goal" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="lose">Lose Weight (~0.5kg/week)</SelectItem>
                            <SelectItem value="maintain">Maintain Weight</SelectItem>
                            <SelectItem value="gain">Gain Weight (~0.5kg/week)</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                </div>

                 {error && (
                    <div className="text-red-500 flex items-center gap-2 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{error}</span>
                    </div>
                )}

                <Button onClick={calculateCalories} className="w-full">
                Calculate Daily Calories
                </Button>

                {calories !== null && (
                <Card className="mt-6 bg-muted/50">
                     <CardHeader>
                        <CardTitle>Estimated Daily Calorie Needs</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 text-center">
                        <p className="text-3xl font-bold text-primary mb-2">{calories.toLocaleString()} calories</p>
                        <p className="text-sm text-muted-foreground">
                            To {goal === 'lose' ? 'lose ~0.5kg/week' : goal === 'gain' ? 'gain ~0.5kg/week' : 'maintain weight'}.
                        </p>
                        <p className="mt-4 text-xs text-muted-foreground">
                            This is an estimate. Adjust based on progress and consult professionals for personalized advice.
                        </p>
                    </CardContent>
                </Card>
                )}
                 <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 space-y-2">
                    <h3 className="font-medium flex items-center gap-2 text-blue-700 dark:text-blue-300">
                        <Info className="h-5 w-5" />
                        About Calorie Needs
                    </h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                        This calculator uses the Mifflin-St Jeor equation for BMR and adjusts for activity level (TDEE). Weight loss/gain goals assume a 500 calorie deficit/surplus per day, aiming for ~0.5kg (~1lb) change per week. Individual results vary.
                    </p>
                </div>
            </CardContent>
            </Card>
        </div>
        </div>
    </ToolAnalyticsWrapper>
  )
}
