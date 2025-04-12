import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LandingHeader } from "@/components/layout/LandingHeader"; // Changed import
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ToolAnalyticsWrapper } from "@/components/tools/ToolAnalyticsWrapper"; // Added import
import { PersonStanding, AlertCircle, Info } from "lucide-react"; // Changed icon, added AlertCircle, Info

const BodyFatCalculator = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [waist, setWaist] = useState('');
  const [neck, setNeck] = useState('');
  const [height, setHeight] = useState('');
  const [hip, setHip] = useState(''); // Only for females
  const [bodyFat, setBodyFat] = useState<number | null>(null);
  const [error, setError] = useState<string>(""); // Added error state
  const { toast } = useToast();

  const calculateBodyFat = () => {
    setError(""); // Clear previous errors
    setBodyFat(null); // Reset result

    const w = parseFloat(waist);
    const n = parseFloat(neck);
    const h = parseFloat(height);
    const hipMeasurement = gender === 'female' ? parseFloat(hip) : 0; // Parse hip only for female

    // Input Validation
    let missingFields: string[] = []; // Changed to string array
    if (isNaN(w) || w <= 0) missingFields.push("Waist");
    if (isNaN(n) || n <= 0) missingFields.push("Neck");
    if (isNaN(h) || h <= 0) missingFields.push("Height");
    if (gender === 'female' && (isNaN(hipMeasurement) || hipMeasurement <= 0)) missingFields.push("Hip");

    if (missingFields.length > 0) {
        const errorMsg = `Please enter valid positive measurements for: ${missingFields.join(', ')}.`;
        setError(errorMsg);
        toast({
            title: "Invalid Input",
            description: errorMsg,
            variant: "destructive"
        });
        return;
    }

    // Additional check for male: waist > neck
    if (gender === 'male' && w <= n) {
        const errorMsg = "For males, waist measurement must be greater than neck measurement.";
         setError(errorMsg);
         toast({ title: "Invalid Input", description: errorMsg, variant: "destructive" });
         return;
    }
     // Additional check for female: waist + hip > neck
    if (gender === 'female' && (w + hipMeasurement) <= n) {
        const errorMsg = "For females, the sum of waist and hip measurements must be greater than neck measurement.";
         setError(errorMsg);
         toast({ title: "Invalid Input", description: errorMsg, variant: "destructive" });
         return;
    }


    let bodyFatPercentage: number;

    if (gender === 'male') {
      // U.S. Navy Method for males
      // Ensure log10 arguments are positive
      if (w - n <= 0 || h <= 0) {
          setError("Invalid measurements for calculation (log requires positive values).");
          toast({ title: "Calculation Error", description: "Invalid measurements for calculation.", variant: "destructive" });
          return;
      }
      bodyFatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
    } else {
      // U.S. Navy Method for females
       // Ensure log10 arguments are positive
      if (w + hipMeasurement - n <= 0 || h <= 0) {
          setError("Invalid measurements for calculation (log requires positive values).");
          toast({ title: "Calculation Error", description: "Invalid measurements for calculation.", variant: "destructive" });
          return;
      }
      bodyFatPercentage = 495 / (1.29579 - 0.35004 * Math.log10(w + hipMeasurement - n) + 0.22100 * Math.log10(h)) - 450;
    }

    // Clamp result to a reasonable range (e.g., 1% to 70%)
    const clampedBf = Math.max(1, Math.min(70, bodyFatPercentage));
    if (isNaN(clampedBf)) { // Check if calculation resulted in NaN
        setError("Could not calculate body fat with the provided measurements.");
        toast({ title: "Calculation Error", description: "Could not calculate body fat.", variant: "destructive" });
        return;
    }
    setBodyFat(parseFloat(clampedBf.toFixed(1)));
  };

  const getCategory = (bf: number): string => {
    if (gender === 'male') {
      if (bf < 6) return 'Essential Fat';
      if (bf < 14) return 'Athletes';
      if (bf < 18) return 'Fitness';
      if (bf < 25) return 'Average';
      return 'Obese'; // Changed from Above Average
    } else {
      if (bf < 14) return 'Essential Fat';
      if (bf < 21) return 'Athletes';
      if (bf < 25) return 'Fitness';
      if (bf < 32) return 'Average';
      return 'Obese'; // Changed from Above Average
    }
  };

   const getCategoryColor = (category: string): string => {
    switch (category) {
      case "Essential Fat": return "text-blue-500";
      case "Athletes": return "text-green-600";
      case "Fitness": return "text-green-500";
      case "Average": return "text-yellow-600";
      case "Obese": return "text-red-500";
      default: return "text-foreground";
    }
  };


  return (
    <ToolAnalyticsWrapper toolName="body-fat-calculator" toolType="health">
        <div className="min-h-screen bg-background">
        <LandingHeader /> {/* Changed component */}
        <div className="container mx-auto p-4 space-y-4">
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-3xl md:text-4xl font-bold text-center">Body Fat Calculator</h1>
                <p className="text-center text-muted-foreground">Estimate your body fat percentage using the U.S. Navy method.</p>

                <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                    <CardTitle>Enter Your Measurements</CardTitle>
                    <CardDescription>
                        Use a tape measure. Ensure measurements are in centimeters (cm).
                    </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Gender</Label>
                        <div className="flex gap-4">
                        <Button
                            variant={gender === 'male' ? 'default' : 'outline'}
                            onClick={() => setGender('male')}
                        >
                            Male
                        </Button>
                        <Button
                            variant={gender === 'female' ? 'default' : 'outline'}
                            onClick={() => setGender('female')}
                        >
                            Female
                        </Button>
                        </div>
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

                    <div className="space-y-2">
                        <Label htmlFor="neck">Neck Circumference (cm)</Label>
                        <Input
                        id="neck"
                        type="number"
                        value={neck}
                        onChange={(e) => setNeck(e.target.value)}
                        placeholder="Measure below larynx"
                         min="1"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="waist">Waist Circumference (cm)</Label>
                        <Input
                        id="waist"
                        type="number"
                        value={waist}
                        onChange={(e) => setWaist(e.target.value)}
                        placeholder={gender === 'male' ? "Measure at navel level" : "Measure at narrowest point"}
                         min="1"
                        />
                    </div>

                    {gender === 'female' && (
                        <div className="space-y-2">
                        <Label htmlFor="hip">Hip Circumference (cm)</Label>
                        <Input
                            id="hip"
                            type="number"
                            value={hip}
                            onChange={(e) => setHip(e.target.value)}
                            placeholder="Measure at widest point"
                             min="1"
                        />
                        </div>
                    )}

                     {error && (
                        <div className="text-red-500 flex items-center gap-2 text-sm">
                            <AlertCircle className="h-4 w-4" />
                            <span>{error}</span>
                        </div>
                    )}


                    <Button className="w-full" onClick={calculateBodyFat}>
                        Calculate Body Fat %
                    </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                    <CardTitle>Results</CardTitle>
                    <CardDescription>
                        Estimated Body Fat Percentage
                    </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center h-full">
                    {bodyFat !== null ? (
                        <div className="space-y-4 text-center">
                        <div className="text-5xl font-bold">
                            {bodyFat}%
                        </div>
                        <div className={`text-xl font-semibold ${getCategoryColor(getCategory(bodyFat))}`}>
                            Category: {getCategory(bodyFat)}
                        </div>
                        <div className="text-xs text-muted-foreground pt-4">
                            <p className="font-medium mb-1">Body Fat Categories ({gender === 'male' ? 'Men' : 'Women'}):</p>
                            <ul className="list-none space-y-1">
                            {gender === 'male' ? (
                                <>
                                <li>Essential Fat: 2-5%</li>
                                <li>Athletes: 6-13%</li>
                                <li>Fitness: 14-17%</li>
                                <li>Average: 18-24%</li>
                                <li>Obese: 25%+</li>
                                </>
                            ) : (
                                <>
                                <li>Essential Fat: 10-13%</li>
                                <li>Athletes: 14-20%</li>
                                <li>Fitness: 21-24%</li>
                                <li>Average: 25-31%</li>
                                <li>Obese: 32%+</li>
                                </>
                            )}
                            </ul>
                        </div>
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground">
                            Enter your measurements to see results.
                        </div>
                    )}
                    </CardContent>
                </Card>
                </div>
                 <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 space-y-2">
                    <h3 className="font-medium flex items-center gap-2 text-blue-700 dark:text-blue-300">
                        <Info className="h-5 w-5" />
                        About This Calculation
                    </h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                        This calculator uses the U.S. Navy method, which relies on circumference measurements. It's an estimation and may not be as accurate as methods like DEXA scans or hydrostatic weighing. Body fat percentage can be influenced by factors like hydration and recent exercise.
                    </p>
                </div>
            </div>
        </div>
        </div>
    </ToolAnalyticsWrapper>
  );
};

export default BodyFatCalculator;