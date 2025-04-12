
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopNav } from "@/components/layout/TopNav";
import { Scale, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const BMICalculator = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [heightUnit, setHeightUnit] = useState("cm");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [bmiResult, setBmiResult] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState("");
  const { toast } = useToast();

  const calculateBMI = () => {
    if (!height || !weight) {
      toast({
        title: "Please enter both height and weight",
        variant: "destructive",
      });
      return;
    }

    try {
      // Convert to metric if necessary
      let heightInMeters: number;
      let weightInKg: number;

      if (heightUnit === "cm") {
        heightInMeters = parseFloat(height) / 100;
      } else if (heightUnit === "ft") {
        // Convert feet to meters
        heightInMeters = parseFloat(height) * 0.3048;
      } else {
        throw new Error("Invalid height unit");
      }

      if (weightUnit === "kg") {
        weightInKg = parseFloat(weight);
      } else if (weightUnit === "lbs") {
        // Convert pounds to kg
        weightInKg = parseFloat(weight) * 0.453592;
      } else {
        throw new Error("Invalid weight unit");
      }

      // Calculate BMI: weight (kg) / height² (m)
      const bmi = weightInKg / (heightInMeters * heightInMeters);
      setBmiResult(parseFloat(bmi.toFixed(1)));

      // Determine BMI category
      if (bmi < 18.5) {
        setBmiCategory("Underweight");
      } else if (bmi >= 18.5 && bmi < 25) {
        setBmiCategory("Normal weight");
      } else if (bmi >= 25 && bmi < 30) {
        setBmiCategory("Overweight");
      } else {
        setBmiCategory("Obesity");
      }
    } catch (error) {
      toast({
        title: "Error calculating BMI",
        description: "Please check your input values",
        variant: "destructive",
      });
    }
  };

  const getBmiColor = () => {
    if (!bmiResult) return "bg-gray-200";
    if (bmiResult < 18.5) return "bg-blue-500";
    if (bmiResult >= 18.5 && bmiResult < 25) return "bg-green-500";
    if (bmiResult >= 25 && bmiResult < 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getBmiProgress = () => {
    if (!bmiResult) return 0;
    if (bmiResult < 10) return 10;
    if (bmiResult > 40) return 100;
    return ((bmiResult - 10) / 30) * 100;
  };

  const getHealthRisks = () => {
    if (!bmiCategory) return [];
    
    switch (bmiCategory) {
      case "Underweight":
        return [
          "Malnutrition",
          "Decreased immune function",
          "Osteoporosis",
          "Anemia",
          "Fertility issues"
        ];
      case "Normal weight":
        return [
          "Lowest risk of health problems related to weight",
          "Better energy levels",
          "Improved immune function",
          "Lower risk of heart disease and diabetes"
        ];
      case "Overweight":
        return [
          "High blood pressure",
          "Heart disease",
          "Type 2 diabetes",
          "Joint problems",
          "Sleep apnea"
        ];
      case "Obesity":
        return [
          "Higher risk of heart disease and stroke",
          "Type 2 diabetes",
          "Certain cancers",
          "Respiratory problems",
          "Gallbladder disease",
          "Joint problems",
          "Metabolic syndrome"
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 pt-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Scale className="h-6 w-6 text-primary" />
              <CardTitle>BMI Calculator</CardTitle>
            </div>
            <CardDescription>
              Calculate your Body Mass Index (BMI) to determine if you're at a healthy weight
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="metric" className="space-y-4">
              <TabsList>
                <TabsTrigger 
                  value="metric" 
                  onClick={() => {
                    setHeightUnit("cm");
                    setWeightUnit("kg");
                  }}
                >
                  Metric (cm/kg)
                </TabsTrigger>
                <TabsTrigger 
                  value="imperial" 
                  onClick={() => {
                    setHeightUnit("ft");
                    setWeightUnit("lbs");
                  }}
                >
                  Imperial (ft/lbs)
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="metric" className="space-y-4">
                <div>
                  <Label htmlFor="height-cm">Height (cm)</Label>
                  <Input
                    id="height-cm"
                    type="number"
                    placeholder="Enter height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="weight-kg">Weight (kg)</Label>
                  <Input
                    id="weight-kg"
                    type="number"
                    placeholder="Enter weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="imperial" className="space-y-4">
                <div>
                  <Label htmlFor="height-ft">Height (ft)</Label>
                  <Input
                    id="height-ft"
                    type="number"
                    placeholder="Enter height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="weight-lbs">Weight (lbs)</Label>
                  <Input
                    id="weight-lbs"
                    type="number"
                    placeholder="Enter weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <Button onClick={calculateBMI} className="w-full">
              Calculate BMI
            </Button>
            
            {bmiResult && (
              <div className="mt-6 space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Your BMI Result</h3>
                  <div className="text-4xl font-bold">{bmiResult}</div>
                  <div className={cn(
                    "text-lg font-medium mt-2",
                    bmiCategory === "Normal weight" ? "text-green-600" :
                    bmiCategory === "Underweight" ? "text-blue-600" :
                    bmiCategory === "Overweight" ? "text-yellow-600" : "text-red-600"
                  )}>
                    {bmiCategory}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Underweight</span>
                    <span>Normal</span>
                    <span>Overweight</span>
                    <span>Obese</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full relative">
                    <div className="absolute top-0 left-0 h-full w-[18.5%] border-r border-gray-400"></div>
                    <div className="absolute top-0 left-[18.5%] h-full w-[6.5%] border-r border-gray-400"></div>
                    <div className="absolute top-0 left-[25%] h-full w-[5%] border-r border-gray-400"></div>
                    <div className={cn("h-full rounded-full", getBmiColor())} style={{ width: `${getBmiProgress()}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>16</span>
                    <span>18.5</span>
                    <span>25</span>
                    <span>30</span>
                    <span>40</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Health Implications</h3>
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Potential health risks associated with your BMI category:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          {getHealthRisks().map((risk, index) => (
                            <li key={index} className="text-sm">{risk}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">About BMI</h3>
                  <p className="text-sm text-muted-foreground">
                    BMI is a measure of body fat based on height and weight. While it's a useful screening tool, 
                    it doesn't diagnose body fatness or health. Factors like muscle mass, bone density, 
                    and ethnic differences can affect BMI interpretation. For a complete assessment, 
                    consult a healthcare provider.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BMICalculator;
