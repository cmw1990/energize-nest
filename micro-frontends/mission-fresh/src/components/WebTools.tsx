import React, { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger,
  Input,
  Button,
  Label,
  Slider,
  Switch,
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  Checkbox,
  Textarea
} from './ui';
import { Battery, Coffee, Utensils, Droplet, Zap, ArrowUpCircle, ArrowDownCircle, Dumbbell } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface WebToolsProps {
  session: Session | null;
}

export const WebTools: React.FC<WebToolsProps> = ({ session }) => {
  // Meal planner state
  const [calories, setCalories] = useState(2000);
  const [dietType, setDietType] = useState('balanced');
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [mealPlanGenerated, setMealPlanGenerated] = useState(false);

  // BMI calculator state
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmiResult, setBmiResult] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState('');

  // Water intake calculator state
  const [weightForWater, setWeightForWater] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [climate, setClimate] = useState('temperate');
  const [waterRecommendation, setWaterRecommendation] = useState<number | null>(null);
  
  // Energy management state
  const [energyChallenges, setEnergyChallenges] = useState<string[]>([]);
  const [caffeineIntake, setCaffeineIntake] = useState(2);
  const [energyPlan, setEnergyPlan] = useState('');
  const [energyScheduleGenerated, setEnergyScheduleGenerated] = useState(false);
  const { toast } = useToast();
  
  // List of common energy challenges during quitting
  const energyChallengeOptions = [
    { id: 'morning-fatigue', label: 'Morning fatigue without cigarettes' },
    { id: 'afternoon-slump', label: 'Afternoon energy slump' },
    { id: 'withdrawal-tiredness', label: 'General tiredness from withdrawal' },
    { id: 'poor-sleep', label: 'Sleep disruption affecting energy' },
    { id: 'brain-fog', label: 'Brain fog or trouble concentrating' },
    { id: 'stress-response', label: 'Low energy from new stress responses' },
    { id: 'appetite-changes', label: 'Energy fluctuations from appetite changes' }
  ];

  // Calculate BMI
  const calculateBMI = () => {
    if (!height || !weight) return;
    
    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    
    if (heightInMeters <= 0 || weightInKg <= 0) return;
    
    const bmi = weightInKg / (heightInMeters * heightInMeters);
    setBmiResult(parseFloat(bmi.toFixed(1)));
    
    // Determine BMI category
    if (bmi < 18.5) {
      setBmiCategory('Underweight');
    } else if (bmi >= 18.5 && bmi < 25) {
      setBmiCategory('Normal weight');
    } else if (bmi >= 25 && bmi < 30) {
      setBmiCategory('Overweight');
    } else {
      setBmiCategory('Obese');
    }
  };

  // Calculate water intake
  const calculateWaterIntake = () => {
    if (!weightForWater) return;
    
    const weightInKg = parseFloat(weightForWater);
    
    if (weightInKg <= 0) return;
    
    // Base calculation: 35ml per kg of body weight
    let waterAmount = weightInKg * 35;
    
    // Adjust for activity level
    if (activityLevel === 'sedentary') {
      waterAmount *= 0.8;
    } else if (activityLevel === 'very_active') {
      waterAmount *= 1.2;
    }
    
    // Adjust for climate
    if (climate === 'hot') {
      waterAmount *= 1.1;
    }
    
    setWaterRecommendation(Math.round(waterAmount));
  };

  // Generate meal plan
  const generateMealPlan = () => {
    // This would typically call an API, but for demo we'll just set a state
    setMealPlanGenerated(true);
  };
  
  // Generate energy management plan
  const generateEnergyPlan = () => {
    // Based on selected challenges, generate a personalized energy management plan
    let planText = "# Your Energy Management Plan\n\n";
    
    if (energyChallenges.includes('morning-fatigue')) {
      planText += "## Morning Energy Boost 🌄\n";
      planText += "- Start with 5 minutes of gentle stretching to activate your muscles\n";
      planText += "- Take a cool shower to increase alertness\n";
      planText += "- Have a protein-rich breakfast with complex carbs\n";
      planText += "- Replace your morning cigarette with a 10-minute walk\n\n";
    }
    
    if (energyChallenges.includes('afternoon-slump')) {
      planText += "## Afternoon Slump Strategy 🕒\n";
      planText += "- Take a 10-minute power nap or meditation break\n";
      planText += "- Have a small protein snack with nuts and fruit\n";
      planText += "- Do 2-3 minutes of deep breathing exercises\n";
      planText += "- Step outside for natural light exposure\n\n";
    }
    
    if (energyChallenges.includes('withdrawal-tiredness')) {
      planText += "## Withdrawal Fatigue Management 🔋\n";
      planText += "- Break tasks into smaller, manageable chunks\n";
      planText += "- Schedule regular 5-minute mini-breaks throughout the day\n";
      planText += "- Stay hydrated - withdrawal symptoms worsen with dehydration\n";
      planText += "- Try the 'pomodoro technique' with 25-minute work periods\n\n";
    }
    
    if (energyChallenges.includes('poor-sleep')) {
      planText += "## Sleep Quality Improvement 😴\n";
      planText += "- Establish a consistent bedtime routine\n";
      planText += "- Avoid screens 1 hour before bed\n";
      planText += "- Keep bedroom cool (65-68°F/18-20°C) and dark\n";
      planText += "- Try a warm bath with magnesium salts before bed\n\n";
    }
    
    if (energyChallenges.includes('brain-fog')) {
      planText += "## Brain Fog Remedies 🧠\n";
      planText += "- Take omega-3 supplements or eat fatty fish 2-3 times weekly\n";
      planText += "- Do 'box breathing' exercises when focus wanes\n";
      planText += "- Try 'brain dumps' - writing all thoughts on paper to clear mental space\n";
      planText += "- Use the 'two-minute rule' - if a task takes under 2 minutes, do it immediately\n\n";
    }
    
    if (energyChallenges.includes('stress-response')) {
      planText += "## New Stress Response Techniques 🧘\n";
      planText += "- Practice progressive muscle relaxation when cravings hit\n";
      planText += "- Keep a stress ball or fidget toy at hand\n";
      planText += "- Try alternate nostril breathing for 2 minutes\n";
      planText += "- Create a playlist of calming or energizing songs\n\n";
    }
    
    if (energyChallenges.includes('appetite-changes')) {
      planText += "## Energy Stabilization With New Appetite 🍎\n";
      planText += "- Eat smaller, more frequent meals (every 3-4 hours)\n";
      planText += "- Keep healthy snacks ready (cut vegetables, Greek yogurt, nuts)\n";
      planText += "- Focus on foods with low glycemic index to avoid crashes\n";
      planText += "- Start meals with protein rather than carbohydrates\n\n";
    }
    
    // Caffeine intake recommendations
    planText += "## Caffeine Management Plan ☕\n";
    if (caffeineIntake <= 1) {
      planText += "- Your low caffeine intake is ideal during the quit process\n";
      planText += "- Consider green tea for gentle energy without jitters\n";
    } else if (caffeineIntake <= 3) {
      planText += "- Moderate your current caffeine intake - drink water between coffee/tea\n";
      planText += "- No caffeine after 2pm to protect sleep quality\n";
    } else {
      planText += "- Gradually reduce caffeine to prevent additional withdrawal symptoms\n";
      planText += "- Replace every other coffee with decaf or herbal tea\n";
      planText += "- High caffeine can amplify anxiety during nicotine withdrawal\n";
    }
    
    setEnergyPlan(planText);
    setEnergyScheduleGenerated(true);
    
    toast({
      title: "Energy plan generated",
      description: "Your personalized energy management plan is ready",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Wellness Tools</CardTitle>
          <CardDescription>
            Tools to optimize your health and energy during your quit smoking journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="energy-management" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="energy-management">
                <Zap className="h-4 w-4 mr-2" />
                Energy Management
              </TabsTrigger>
              <TabsTrigger value="meal-planner">
                <Utensils className="h-4 w-4 mr-2" />
                Meal Planner
              </TabsTrigger>
              <TabsTrigger value="bmi-calculator">
                <Dumbbell className="h-4 w-4 mr-2" />
                BMI Calculator
              </TabsTrigger>
              <TabsTrigger value="water-intake">
                <Droplet className="h-4 w-4 mr-2" />
                Water Intake
              </TabsTrigger>
            </TabsList>
            
            {/* Energy Management Tool - NEW */}
            <TabsContent value="energy-management" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Energy Management During Quitting</CardTitle>
                  <CardDescription>
                    Create a personalized energy management plan to help combat fatigue and maintain focus during your quit smoking journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-base">Select your energy challenges</Label>
                    <p className="text-sm text-muted-foreground">Choose all the energy issues you're experiencing while quitting</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      {energyChallengeOptions.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={option.id} 
                            checked={energyChallenges.includes(option.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setEnergyChallenges([...energyChallenges, option.id]);
                              } else {
                                setEnergyChallenges(energyChallenges.filter(id => id !== option.id));
                              }
                            }}
                          />
                          <label
                            htmlFor={option.id}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Coffee className="h-4 w-4 text-muted-foreground" />
                      <Label>Daily Caffeine Intake</Label>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Slider
                        value={[caffeineIntake]}
                        min={0}
                        max={6}
                        step={1}
                        onValueChange={(value) => setCaffeineIntake(value[0])}
                      />
                      <span className="w-12 text-sm font-medium">{caffeineIntake} {caffeineIntake === 1 ? 'cup' : 'cups'}</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>None</span>
                      <span>Moderate</span>
                      <span>High</span>
                    </div>
                  </div>
                  
                  <Button className="w-full" onClick={generateEnergyPlan}>
                    <Battery className="h-4 w-4 mr-2" />
                    Generate Energy Management Plan
                  </Button>
                  
                  {energyScheduleGenerated && (
                    <div className="space-y-3 mt-4">
                      <Label>Your Personalized Energy Management Plan</Label>
                      <div className="bg-muted p-4 rounded-md">
                        <div className="prose prose-sm max-w-none">
                          {energyPlan.split('\n').map((line, index) => {
                            if (line.startsWith('# ')) {
                              return <h2 key={index} className="text-xl font-bold mt-0 mb-3">{line.replace('# ', '')}</h2>;
                            } else if (line.startsWith('## ')) {
                              return <h3 key={index} className="text-lg font-semibold mt-4 mb-2">{line.replace('## ', '')}</h3>;
                            } else if (line.startsWith('- ')) {
                              return <li key={index} className="ml-5">{line.replace('- ', '')}</li>;
                            } else if (line === '') {
                              return <br key={index} />;
                            } else {
                              return <p key={index} className="my-2">{line}</p>;
                            }
                          })}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <Button variant="outline" 
                          onClick={() => {
                            // In a real app, this would save to the database
                            toast({
                              title: "Plan saved",
                              description: "Your energy management plan has been saved to your profile"
                            });
                          }}
                        >
                          Save Plan
                        </Button>
                        <Button variant="outline"
                          onClick={() => {
                            // In a real app, this would trigger a print dialog or PDF download
                            toast({
                              title: "Print prepared",
                              description: "Your plan is ready to print or save as PDF"
                            });
                          }}
                        >
                          Print Plan
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Energy FAQ During Quitting</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold flex items-center">
                        <ArrowDownCircle className="h-4 w-4 text-amber-500 mr-2" />
                        Why am I so tired after quitting smoking?
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Nicotine is a stimulant that affects brain chemistry. Your body is adjusting to functioning without it, 
                        which can cause temporary fatigue. Most people see energy improvements after 2-4 weeks.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold flex items-center">
                        <ArrowUpCircle className="h-4 w-4 text-green-500 mr-2" />
                        Will my energy ever improve?
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Yes! As your body heals, oxygen transport improves, inflammation decreases, and sleep quality gets better. 
                        Most ex-smokers report significantly higher energy levels after the initial withdrawal period.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold flex items-center">
                        <Coffee className="h-4 w-4 text-brown-500 mr-2" />
                        Should I drink more coffee to combat fatigue?
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Be cautious with caffeine during quitting. Nicotine affects how quickly your body processes caffeine, 
                        so the same amount may now have stronger effects. Excessive caffeine can worsen anxiety and sleep problems.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold flex items-center">
                        <Zap className="h-4 w-4 text-yellow-500 mr-2" />
                        What's the fastest way to boost energy naturally?
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Physical activity is the most effective natural energy booster. Even a 10-minute walk increases oxygen flow 
                        and releases endorphins. Stay hydrated, maintain regular eating patterns, and prioritize quality sleep.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Meal Planner Tool - existing */}
            <TabsContent value="meal-planner" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Meal Planner</CardTitle>
                  <CardDescription>
                    Generate a personalized meal plan based on your preferences and nutritional needs.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Daily Calorie Target</Label>
                    <div className="flex items-center space-x-4">
                      <Slider
                        value={[calories]}
                        min={1200}
                        max={3500}
                        step={50}
                        onValueChange={(value) => setCalories(value[0])}
                      />
                      <span className="w-12 text-sm font-medium">{calories}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Diet Type</Label>
                    <Select value={dietType} onValueChange={setDietType}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a diet type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="low-carb">Low Carb</SelectItem>
                        <SelectItem value="high-protein">High Protein</SelectItem>
                        <SelectItem value="keto">Ketogenic</SelectItem>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Dietary Restrictions</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Shellfish-Free', 'Soy-Free', 'Egg-Free'].map((restriction) => (
                        <div key={restriction} className="flex items-center space-x-2">
                          <Switch
                            checked={restrictions.includes(restriction)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setRestrictions([...restrictions, restriction]);
                              } else {
                                setRestrictions(restrictions.filter(r => r !== restriction));
                              }
                            }}
                          />
                          <Label>{restriction}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full" onClick={generateMealPlan}>
                    Generate Meal Plan
                  </Button>
                </CardContent>
              </Card>

              {mealPlanGenerated && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your 7-Day Meal Plan</CardTitle>
                    <CardDescription>
                      Based on {calories} calories per day, {dietType} diet
                      {restrictions.length > 0 ? `, ${restrictions.join(', ')} free` : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                        <div key={day} className="border-b pb-3 last:border-b-0 last:pb-0">
                          <h3 className="font-semibold text-lg mb-2">{day}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="p-3 bg-muted rounded-md">
                              <p className="font-medium">Breakfast</p>
                              <p className="text-sm text-muted-foreground">
                                Overnight oats with berries and almonds
                              </p>
                            </div>
                            <div className="p-3 bg-muted rounded-md">
                              <p className="font-medium">Lunch</p>
                              <p className="text-sm text-muted-foreground">
                                Grilled chicken salad with quinoa
                              </p>
                            </div>
                            <div className="p-3 bg-muted rounded-md">
                              <p className="font-medium">Dinner</p>
                              <p className="text-sm text-muted-foreground">
                                Baked salmon with roasted vegetables
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* BMI Calculator Tool */}
            <TabsContent value="bmi-calculator" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>BMI Calculator</CardTitle>
                  <CardDescription>
                    Calculate your Body Mass Index (BMI) to assess if your weight is in a healthy range.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="e.g., 175"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="e.g., 70"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>

                  <Button className="w-full" onClick={calculateBMI}>
                    Calculate BMI
                  </Button>

                  {bmiResult !== null && (
                    <div className="mt-4 p-4 bg-muted rounded-md">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{bmiResult}</p>
                        <p className={`text-lg font-medium ${
                          bmiCategory === 'Normal weight' ? 'text-green-500' : 'text-amber-500'
                        }`}>
                          {bmiCategory}
                        </p>
                      </div>
                      <div className="mt-4">
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 via-green-500 to-red-500"
                            style={{
                              width: '100%',
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <span>Underweight</span>
                          <span>Normal</span>
                          <span>Overweight</span>
                          <span>Obese</span>
                        </div>
                      </div>
                      <div className="mt-4 text-sm">
                        <p><strong>BMI Categories:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Underweight: BMI less than 18.5</li>
                          <li>Normal weight: BMI 18.5 to 24.9</li>
                          <li>Overweight: BMI 25 to 29.9</li>
                          <li>Obesity: BMI 30 or greater</li>
                        </ul>
                        <p className="mt-2 text-muted-foreground">
                          Note: BMI is a screening tool, not a diagnostic tool. Consult with a healthcare provider for a complete health assessment.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Water Intake Calculator */}
            <TabsContent value="water-intake" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Water Intake Calculator</CardTitle>
                  <CardDescription>
                    Calculate how much water you should drink each day based on your weight and activity level.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="weightForWater">Weight (kg)</Label>
                    <Input
                      id="weightForWater"
                      type="number"
                      placeholder="e.g., 70"
                      value={weightForWater}
                      onChange={(e) => setWeightForWater(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Activity Level</Label>
                    <Select value={activityLevel} onValueChange={setActivityLevel}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select activity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                        <SelectItem value="moderate">Moderate (exercise 3-5 days/week)</SelectItem>
                        <SelectItem value="very active">Very Active (exercise 6-7 days/week)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Climate</Label>
                    <Select value={climate} onValueChange={setClimate}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select climate" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="temperate">Temperate/Moderate</SelectItem>
                        <SelectItem value="hot">Hot/Humid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full" onClick={calculateWaterIntake}>
                    Calculate Water Needs
                  </Button>

                  {waterRecommendation !== null && (
                    <div className="mt-4 p-4 bg-muted rounded-md">
                      <div className="text-center">
                        <p className="text-sm font-medium">Recommended Daily Water Intake</p>
                        <p className="text-2xl font-bold mt-1">{waterRecommendation} ml</p>
                        <p className="text-md font-medium mt-1">({(waterRecommendation / 1000).toFixed(1)} liters)</p>
                        <div className="mt-3 flex items-center justify-center space-x-1">
                          {Array.from({ length: Math.ceil(waterRecommendation / 250) }).map((_, i) => (
                            <div 
                              key={i} 
                              className="w-4 h-12 bg-blue-400 rounded-sm"
                              style={{
                                opacity: i < Math.floor(waterRecommendation / 250) ? 1 : 0.5
                              }}
                            />
                          ))}
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          That's about {Math.ceil(waterRecommendation / 250)} glasses (250ml each)
                        </p>
                      </div>
                      <div className="mt-4 text-sm">
                        <p className="text-muted-foreground">
                          This is a general recommendation. Factors like health conditions, pregnancy, and breastfeeding may affect your water needs. Always consult with a healthcare provider for personalized advice.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
