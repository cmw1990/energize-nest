
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { ToolAnalyticsWrapper } from "@/components/tools/ToolAnalyticsWrapper";
import { Calculator, FastForward, Flame, BrainCircuit, Scale, Clock, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CaloriesNeededCalculator() {
  const { toast } = useToast();
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<string>("male");
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(175);
  const [activityLevel, setActivityLevel] = useState<string>("moderate");
  const [goal, setGoal] = useState<string>("maintain");
  const [result, setResult] = useState<number | null>(null);
  const [macros, setMacros] = useState<{protein: number, carbs: number, fat: number} | null>(null);

  const calculateCalories = () => {
    // BMR calculation using Mifflin-St Jeor Equation
    let bmr = 0;
    
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    // Activity multiplier
    const activityMultipliers = {
      sedentary: 1.2,     // Little or no exercise
      light: 1.375,       // Light exercise 1-3 days/week
      moderate: 1.55,     // Moderate exercise 3-5 days/week
      active: 1.725,      // Hard exercise 6-7 days/week
      veryActive: 1.9     // Very hard exercise & physical job or 2x training
    };
    
    let tdee = bmr * activityMultipliers[activityLevel as keyof typeof activityMultipliers];
    
    // Adjust based on goal
    let finalCalories = tdee;
    switch (goal) {
      case "lose":
        finalCalories = tdee * 0.8; // 20% deficit
        break;
      case "mild-lose":
        finalCalories = tdee * 0.9; // 10% deficit
        break;
      case "mild-gain":
        finalCalories = tdee * 1.1; // 10% surplus
        break;
      case "gain":
        finalCalories = tdee * 1.2; // 20% surplus
        break;
    }
    
    setResult(Math.round(finalCalories));
    
    // Calculate macros (protein: 30%, carbs: 40%, fat: 30% as default)
    let proteinPercentage = 0.3;
    let carbsPercentage = 0.4;
    let fatPercentage = 0.3;
    
    // Adjust macros based on goal
    if (goal === "lose" || goal === "mild-lose") {
      proteinPercentage = 0.4;
      carbsPercentage = 0.3;
      fatPercentage = 0.3;
    } else if (goal === "gain" || goal === "mild-gain") {
      proteinPercentage = 0.25;
      carbsPercentage = 0.5;
      fatPercentage = 0.25;
    }
    
    const proteinCals = finalCalories * proteinPercentage;
    const carbsCals = finalCalories * carbsPercentage;
    const fatCals = finalCalories * fatPercentage;
    
    // Convert calories to grams
    const proteinGrams = Math.round(proteinCals / 4); // 4 cals per gram of protein
    const carbsGrams = Math.round(carbsCals / 4);     // 4 cals per gram of carbs
    const fatGrams = Math.round(fatCals / 9);         // 9 cals per gram of fat
    
    setMacros({
      protein: proteinGrams,
      carbs: carbsGrams,
      fat: fatGrams
    });
    
    toast({
      title: "Calculation Complete",
      description: "Your daily calorie needs have been calculated.",
    });
  };

  return (
    <ToolAnalyticsWrapper toolName="calories-needed-calculator" toolType="nutrition">
      <div className="min-h-screen bg-background">
        <LandingHeader />
        <div className="container mx-auto p-4 pt-6 max-w-4xl">
          <Card className="border-primary/10">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Flame className="h-6 w-6 text-primary" />
                <CardTitle>Daily Calories Needed Calculator</CardTitle>
              </div>
              <CardDescription>
                Calculate your optimal daily calorie intake based on your age, gender, activity level, and fitness goals.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="calculator" className="space-y-6">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="calculator" className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    <span>Calculator</span>
                  </TabsTrigger>
                  <TabsTrigger value="info" className="flex items-center gap-2">
                    <BrainCircuit className="h-4 w-4" />
                    <span>Information</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="calculator" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          min="15"
                          max="100"
                          value={age}
                          onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Gender</Label>
                        <RadioGroup value={gender} onValueChange={setGender} className="flex space-x-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="male" />
                            <Label htmlFor="male">Male</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="female" />
                            <Label htmlFor="female">Female</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          min="30"
                          max="250"
                          value={weight}
                          onChange={(e) => setWeight(parseInt(e.target.value) || 0)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input
                          id="height"
                          type="number"
                          min="100"
                          max="250"
                          value={height}
                          onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="activity">Activity Level</Label>
                        <Select value={activityLevel} onValueChange={setActivityLevel}>
                          <SelectTrigger id="activity">
                            <SelectValue placeholder="Select activity level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                            <SelectItem value="light">Lightly active (light exercise 1-3 days/week)</SelectItem>
                            <SelectItem value="moderate">Moderately active (moderate exercise 3-5 days/week)</SelectItem>
                            <SelectItem value="active">Very active (hard exercise 6-7 days/week)</SelectItem>
                            <SelectItem value="veryActive">Extremely active (very hard exercise & physical job)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="goal">Your Goal</Label>
                        <Select value={goal} onValueChange={setGoal}>
                          <SelectTrigger id="goal">
                            <SelectValue placeholder="Select your goal" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lose">Weight Loss (20% calorie deficit)</SelectItem>
                            <SelectItem value="mild-lose">Mild Weight Loss (10% calorie deficit)</SelectItem>
                            <SelectItem value="maintain">Maintain Weight</SelectItem>
                            <SelectItem value="mild-gain">Mild Weight Gain (10% calorie surplus)</SelectItem>
                            <SelectItem value="gain">Weight Gain (20% calorie surplus)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button 
                        onClick={calculateCalories} 
                        className="w-full mt-6"
                        size="lg"
                      >
                        Calculate
                      </Button>
                    </div>
                  </div>
                  
                  {result && (
                    <Card className="mt-8 bg-primary/5 border-primary/10">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Your Results</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-primary mb-2">{result} calories</div>
                          <p className="text-muted-foreground">Daily calories needed to {goal === "maintain" ? "maintain your weight" : 
                            (goal === "lose" || goal === "mild-lose") ? "reach your weight loss goal" : "reach your weight gain goal"}</p>
                        </div>
                        
                        {macros && (
                          <div className="grid grid-cols-3 gap-4 pt-4">
                            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                              <div className="text-xl font-semibold text-green-600 dark:text-green-400">{macros.protein}g</div>
                              <div className="text-sm text-muted-foreground">Protein</div>
                            </div>
                            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <div className="text-xl font-semibold text-blue-600 dark:text-blue-400">{macros.carbs}g</div>
                              <div className="text-sm text-muted-foreground">Carbs</div>
                            </div>
                            <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                              <div className="text-xl font-semibold text-amber-600 dark:text-amber-400">{macros.fat}g</div>
                              <div className="text-sm text-muted-foreground">Fat</div>
                            </div>
                          </div>
                        )}
                        
                        <div className="pt-4">
                          <p className="text-sm text-muted-foreground">
                            These values are estimates based on the Mifflin-St Jeor equation and your selected goals. 
                            Your actual needs may vary based on genetics, medical conditions, and other factors.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="info" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Flame className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <h3 className="text-base font-medium">Basal Metabolic Rate (BMR)</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          BMR is the number of calories your body needs to maintain basic functions like breathing, 
                          cell production, and heart rate while at rest. It's the minimum energy your body requires 
                          to stay alive.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <FastForward className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <h3 className="text-base font-medium">Total Daily Energy Expenditure (TDEE)</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          TDEE is the total number of calories you burn in a day, including your BMR plus 
                          additional calories burned through physical activity and digestion. This calculator uses 
                          the Mifflin-St Jeor equation, which is one of the most accurate formulas.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Scale className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <h3 className="text-base font-medium">Calorie Deficit & Surplus</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          To lose weight, you need to create a calorie deficit by consuming fewer calories than 
                          you burn. A deficit of 500-1000 calories per day can lead to 1-2 pounds of weight loss per week. 
                          For weight gain, you need a surplus of calories. A surplus of 250-500 calories per day is 
                          often recommended for steady weight gain.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <h3 className="text-base font-medium">Best Practices</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          For sustainable results, it's recommended to aim for a moderate deficit or surplus. 
                          Extreme calorie restriction can slow your metabolism and lead to muscle loss. 
                          Regular reassessment of your calorie needs is important as your weight changes. 
                          Always combine calorie management with quality nutrition and regular exercise for best results.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolAnalyticsWrapper>
  );
}
