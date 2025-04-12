import React, { useState } from "react"; // Added React import
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LandingHeader } from "@/components/layout/LandingHeader"; // Changed import
import { ToolAnalyticsWrapper } from "@/components/tools/ToolAnalyticsWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Scale, AlertCircle, Info } from "lucide-react";

export default function BMICalculator() {
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [heightFeet, setHeightFeet] = useState<string>("");
  const [heightInches, setHeightInches] = useState<string>("");
  const [bmiResult, setBmiResult] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string>("");
  const [error, setError] = useState<string>("");

  const calculateBMI = () => {
    setError("");
    setBmiResult(null);
    setBmiCategory("");

    let heightInMeters: number;
    let weightInKg: number;

    if (unitSystem === "metric") {
      const h = parseFloat(height);
      const w = parseFloat(weight);
      if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
        setError("Please enter valid positive height (cm) and weight (kg).");
        return;
      }
      heightInMeters = h / 100;
      weightInKg = w;
    } else {
      const hFt = parseFloat(heightFeet);
      const hIn = parseFloat(heightInches);
      const w = parseFloat(weight);
      if (isNaN(hFt) || isNaN(hIn) || isNaN(w) || w <= 0 || (hFt <= 0 && hIn <= 0)) {
        setError("Please enter valid positive height (ft/in) and weight (lbs).");
        return;
      }
      const totalHeightInches = (hFt * 12) + hIn;
      heightInMeters = totalHeightInches * 0.0254;
      weightInKg = w * 0.453592;
    }

    if (heightInMeters <= 0 || weightInKg <= 0) {
        setError("Height and weight must be positive values.");
        return;
    }

    const bmi = weightInKg / (heightInMeters * heightInMeters);
    setBmiResult(bmi);
    setBmiCategory(getBMICategory(bmi));
  };

  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Healthy Weight";
    if (bmi < 30) return "Overweight";
    return "Obesity";
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "Underweight": return "text-blue-500";
      case "Healthy Weight": return "text-green-500";
      case "Overweight": return "text-yellow-600";
      case "Obesity": return "text-red-500";
      default: return "text-foreground";
    }
  };

  const handleUnitChange = (value: "metric" | "imperial") => {
    setUnitSystem(value);
    // Reset values on unit change
    setHeight("");
    setWeight("");
    setHeightFeet("");
    setHeightInches("");
    setBmiResult(null);
    setBmiCategory("");
    setError("");
  };

  return (
    <ToolAnalyticsWrapper
      toolName="bmi-calculator"
      toolType="health"
    >
      {/* Wrapped content inside ToolAnalyticsWrapper */}
      <div className="min-h-screen bg-background">
        <LandingHeader /> {/* Changed component */}
        <div className="container mx-auto p-4 space-y-6 max-w-3xl">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Scale className="h-6 w-6 text-blue-500" />
                <CardTitle>BMI Calculator</CardTitle>
              </div>
              <CardDescription>
                Calculate your Body Mass Index (BMI) to understand your weight category.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup defaultValue="metric" value={unitSystem} onValueChange={handleUnitChange} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="metric" id="metric" />
                  <Label htmlFor="metric">Metric (cm, kg)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="imperial" id="imperial" />
                  <Label htmlFor="imperial">Imperial (ft, in, lbs)</Label>
                </div>
              </RadioGroup>

              {unitSystem === "metric" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height-cm">Height (cm)</Label>
                    <Input id="height-cm" type="number" placeholder="e.g., 175" value={height} onChange={(e) => setHeight(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight-kg">Weight (kg)</Label>
                    <Input id="weight-kg" type="number" placeholder="e.g., 70" value={weight} onChange={(e) => setWeight(e.target.value)} />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height-ft">Height (ft)</Label>
                    <Input id="height-ft" type="number" placeholder="e.g., 5" value={heightFeet} onChange={(e) => setHeightFeet(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height-in">Height (in)</Label>
                    <Input id="height-in" type="number" placeholder="e.g., 9" value={heightInches} onChange={(e) => setHeightInches(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight-lbs">Weight (lbs)</Label>
                    <Input id="weight-lbs" type="number" placeholder="e.g., 154" value={weight} onChange={(e) => setWeight(e.target.value)} />
                  </div>
                </div>
              )}

              {error && (
                <div className="text-red-500 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <Button onClick={calculateBMI} className="w-full">Calculate BMI</Button>

              {bmiResult !== null && (
                <Card className="mt-6 bg-muted/50">
                  <CardHeader>
                    <CardTitle>Your BMI Result</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-2">
                    <p className="text-4xl font-bold">{bmiResult.toFixed(1)}</p>
                    <p className={`text-lg font-semibold ${getCategoryColor(bmiCategory)}`}>{bmiCategory}</p>
                  </CardContent>
                </Card>
              )}

              <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 space-y-2">
                <h3 className="font-medium flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <Info className="h-5 w-5" />
                  Understanding BMI
                </h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  BMI is a screening tool, not a diagnostic measure of body fatness or overall health. It provides a general indication based on weight and height. Factors like muscle mass can influence BMI. Consult a healthcare professional for a comprehensive health assessment.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolAnalyticsWrapper>
  );
}
