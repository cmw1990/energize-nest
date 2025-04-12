import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LandingHeader } from "@/components/layout/LandingHeader"; // Changed import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, AlertCircle, Info } from "lucide-react"; // Added AlertCircle, Info
import { ToolAnalyticsWrapper } from "@/components/tools/ToolAnalyticsWrapper"; // Added import
import { useToast } from "@/hooks/use-toast"; // Added import
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Added Shadcn Select import

const BMRCalculator = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<string>('1.2');
  const [bmr, setBMR] = useState<number | null>(null);
  const [tdee, setTDEE] = useState<number | null>(null);
  const [error, setError] = useState<string>(""); // Added error state
  const { toast } = useToast(); // Added toast hook

  const calculateBMR = () => {
    setError(""); // Clear previous errors
    setBMR(null);
    setTDEE(null);

    const heightInCm = parseFloat(height);
    const weightInKg = parseFloat(weight);
    const ageInYears = parseFloat(age);
    const activity = parseFloat(activityLevel);

    // Input Validation
    let errors: string[] = [];
    if (isNaN(ageInYears) || ageInYears <= 0 || ageInYears > 120) {
      errors.push("Age (1-120)");
    }
    if (isNaN(heightInCm) || heightInCm <= 0) {
      errors.push("Height (>0 cm)");
    }
     if (isNaN(weightInKg) || weightInKg <= 0) {
      errors.push("Weight (>0 kg)");
    }
     if (isNaN(activity)) {
        errors.push("Activity Level"); // Should not happen with select
     }

     if (errors.length > 0) {
        const errorMsg = `Please enter valid positive values for: ${errors.join(', ')}.`;
        setError(errorMsg);
        toast({ title: "Invalid Input", description: errorMsg, variant: "destructive" });
        return;
     }


    let bmrValue: number;

    // Harris-Benedict Equation (Revised) - Often considered slightly more accurate than original
    if (gender === 'male') {
      bmrValue = (10 * weightInKg) + (6.25 * heightInCm) - (5 * ageInYears) + 5;
    } else {
      bmrValue = (10 * weightInKg) + (6.25 * heightInCm) - (5 * ageInYears) - 161;
    }

    setBMR(Math.round(bmrValue));
    setTDEE(Math.round(bmrValue * activity));
  };

  return (
    <ToolAnalyticsWrapper toolName="bmr-calculator" toolType="health">
        <div className="min-h-screen bg-background">
        <LandingHeader /> {/* Changed component */}
        <div className="container mx-auto p-4">
            <div className="max-w-2xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                <div className="flex items-center gap-2">
                    <Calculator className="w-6 h-6 text-primary" />
                    <CardTitle>BMR & TDEE Calculator</CardTitle>
                </div>
                <CardDescription>
                    Calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) using the revised Harris-Benedict equation.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Gender</Label>
                    <div className="flex gap-4">
                    <Button
                        type="button"
                        variant={gender === 'male' ? 'default' : 'outline'}
                        onClick={() => setGender('male')}
                    >
                        Male
                    </Button>
                    <Button
                        type="button"
                        variant={gender === 'female' ? 'default' : 'outline'}
                        onClick={() => setGender('female')}
                    >
                        Female
                    </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="age">Age (years)</Label>
                    <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="1"
                    max="120"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                    id="height"
                    type="number"
                    placeholder="Enter your height in centimeters"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    min="1"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                    id="weight"
                    type="number"
                    placeholder="Enter your weight in kilograms"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    min="1"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="activity">Activity Level</Label>
                    {/* Replaced standard select with Shadcn Select */}
                    <Select value={activityLevel} onValueChange={setActivityLevel}>
                        <SelectTrigger id="activity">
                            <SelectValue placeholder="Select activity level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1.2">Sedentary (little or no exercise)</SelectItem>
                            <SelectItem value="1.375">Lightly active (light exercise 1-3 days/week)</SelectItem>
                            <SelectItem value="1.55">Moderately active (moderate exercise 3-5 days/week)</SelectItem>
                            <SelectItem value="1.725">Very active (hard exercise 6-7 days/week)</SelectItem>
                            <SelectItem value="1.9">Extra active (very hard exercise & physical job)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                 {error && (
                    <div className="text-red-500 flex items-center gap-2 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{error}</span>
                    </div>
                )}

                <Button
                    className="w-full"
                    onClick={calculateBMR}
                    // Removed disabled prop, validation handled in function
                >
                    Calculate BMR & TDEE
                </Button>

                {bmr !== null && tdee !== null && (
                    <Card className="mt-4 bg-muted/50">
                    <CardHeader>
                        <CardTitle>Your Estimated Calorie Needs</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="text-center space-y-4">
                        <div>
                            <p className="text-lg font-medium">Basal Metabolic Rate (BMR):</p>
                            <p className="text-2xl font-bold text-primary">{bmr.toLocaleString()} calories/day</p>
                            <p className="text-sm text-muted-foreground">
                            Calories burned at complete rest.
                            </p>
                        </div>
                        <div>
                            <p className="text-lg font-medium">Total Daily Energy Expenditure (TDEE):</p>
                            <p className="text-2xl font-bold text-primary">{tdee.toLocaleString()} calories/day</p>
                            <p className="text-sm text-muted-foreground">
                            Estimated daily calorie needs including activity.
                            </p>
                        </div>
                        </div>
                    </CardContent>
                    </Card>
                )}
                 <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 space-y-2">
                    <h3 className="font-medium flex items-center gap-2 text-blue-700 dark:text-blue-300">
                        <Info className="h-5 w-5" />
                        About BMR & TDEE
                    </h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                        BMR represents the minimum calories your body needs to function at rest. TDEE estimates your total daily calorie burn based on your BMR and activity level. These are estimates; individual needs may vary.
                    </p>
                </div>
                </CardContent>
            </Card>
            </div>
        </div>
        </div>
    </ToolAnalyticsWrapper>
  );
};

export default BMRCalculator;