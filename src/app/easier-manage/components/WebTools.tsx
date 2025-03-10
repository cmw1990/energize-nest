import React, { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { 
  Calculator, 
  Calendar, 
  Clock, 
  Search, 
  BarChart, 
  Check, 
  ChevronRight 
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Label } from '../../../components/ui/label';

interface WebToolsProps {
  session: Session | null;
}

export const WebTools: React.FC<WebToolsProps> = ({ session }) => {
  const [activeTab, setActiveTab] = useState('calculator');
  
  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Nutrition Tools</h1>
      </div>
      
      <Tabs defaultValue="calculator" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
          <TabsTrigger value="calculator">Calorie Calculator</TabsTrigger>
          <TabsTrigger value="search">Food Search</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calculator">
          <CalorieCalculator />
        </TabsContent>
        
        <TabsContent value="search">
          <FoodSearch />
        </TabsContent>
        
        <TabsContent value="insights">
          <NutritionInsights />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const CalorieCalculator: React.FC = () => {
  const [gender, setGender] = useState('female');
  const [age, setAge] = useState('30');
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('170');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [goal, setGoal] = useState('maintain');
  const [result, setResult] = useState<null | number>(null);
  
  const calculateCalories = () => {
    // Basic BMR calculation using Mifflin-St Jeor Equation
    const ageNum = parseInt(age);
    const weightNum = parseInt(weight);
    const heightNum = parseInt(height);
    
    if (isNaN(ageNum) || isNaN(weightNum) || isNaN(heightNum)) {
      return;
    }
    
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
    }
    
    // Activity multiplier
    let activityMultiplier;
    switch (activityLevel) {
      case 'sedentary':
        activityMultiplier = 1.2;
        break;
      case 'light':
        activityMultiplier = 1.375;
        break;
      case 'moderate':
        activityMultiplier = 1.55;
        break;
      case 'active':
        activityMultiplier = 1.725;
        break;
      case 'very':
        activityMultiplier = 1.9;
        break;
      default:
        activityMultiplier = 1.2;
    }
    
    let tdee = bmr * activityMultiplier;
    
    // Goal adjustment
    switch (goal) {
      case 'lose':
        tdee -= 500; // 500 calorie deficit
        break;
      case 'gain':
        tdee += 500; // 500 calorie surplus
        break;
      default:
        // maintain - no change
        break;
    }
    
    setResult(Math.round(tdee));
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Daily Calorie Calculator
        </CardTitle>
        <CardDescription>
          Calculate your recommended daily calorie intake based on your details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input 
                id="age" 
                type="number" 
                value={age} 
                onChange={(e) => setAge(e.target.value)} 
                min="18" 
                max="100" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input 
                id="weight" 
                type="number" 
                value={weight} 
                onChange={(e) => setWeight(e.target.value)} 
                min="30" 
                max="300" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input 
                id="height" 
                type="number" 
                value={height} 
                onChange={(e) => setHeight(e.target.value)} 
                min="100" 
                max="250" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="activity">Activity Level</Label>
              <Select value={activityLevel} onValueChange={setActivityLevel}>
                <SelectTrigger id="activity">
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (office job)</SelectItem>
                  <SelectItem value="light">Light Exercise (1-2 days/week)</SelectItem>
                  <SelectItem value="moderate">Moderate Exercise (3-5 days/week)</SelectItem>
                  <SelectItem value="active">Active Exercise (6-7 days/week)</SelectItem>
                  <SelectItem value="very">Very Active (physical job + exercise)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="goal">Goal</Label>
              <Select value={goal} onValueChange={setGoal}>
                <SelectTrigger id="goal">
                  <SelectValue placeholder="Select goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose">Lose Weight</SelectItem>
                  <SelectItem value="maintain">Maintain Weight</SelectItem>
                  <SelectItem value="gain">Gain Weight</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {result && (
            <div className="bg-primary/10 p-4 rounded-md mt-4">
              <h3 className="font-semibold text-lg text-center">Your Recommended Daily Calorie Intake</h3>
              <p className="text-3xl font-bold text-center text-primary mt-2">{result} calories</p>
              <p className="text-center text-sm text-muted-foreground mt-2">
                Based on your {gender === 'male' ? 'male' : 'female'} profile, {age} years old, {weight}kg, {height}cm,
                with {activityLevel} activity and goal to {goal === 'lose' ? 'lose' : goal === 'gain' ? 'gain' : 'maintain'} weight.
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={calculateCalories} className="w-full">
          Calculate Calories
        </Button>
      </CardFooter>
    </Card>
  );
};

const FoodSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [selectedFood, setSelectedFood] = useState<any>(null);
  
  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    // Mock food search results
    const mockResults = [
      'Apple',
      'Banana',
      'Chicken Breast',
      'Broccoli',
      'Brown Rice',
      'Salmon',
      'Sweet Potato',
      'Greek Yogurt'
    ].filter(food => food.toLowerCase().includes(searchTerm.toLowerCase()));
    
    setSearchResults(mockResults);
  };
  
  const handleSelectFood = (food: string) => {
    // Mock food data
    const mockFoodData: Record<string, any> = {
      'Apple': { calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4 },
      'Banana': { calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1 },
      'Chicken Breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
      'Broccoli': { calories: 55, protein: 3.7, carbs: 11, fat: 0.6, fiber: 5.2 },
      'Brown Rice': { calories: 216, protein: 5, carbs: 45, fat: 1.8, fiber: 3.5 },
      'Salmon': { calories: 206, protein: 22, carbs: 0, fat: 13, fiber: 0 },
      'Sweet Potato': { calories: 112, protein: 2, carbs: 26, fat: 0.1, fiber: 3.8 },
      'Greek Yogurt': { calories: 100, protein: 17, carbs: 6, fat: 0.4, fiber: 0 }
    };
    
    setSelectedFood({
      name: food,
      ...mockFoodData[food]
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Food Nutrition Search
        </CardTitle>
        <CardDescription>
          Search for foods to view their nutritional information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex space-x-2">
            <Input 
              placeholder="Search for foods (e.g. apple, chicken)" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>
          
          {searchResults.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Results</h3>
              <div className="divide-y border rounded-md">
                {searchResults.map((food, index) => (
                  <div 
                    key={index} 
                    className="p-3 hover:bg-slate-50 cursor-pointer flex justify-between items-center"
                    onClick={() => handleSelectFood(food)}
                  >
                    <span>{food}</span>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {selectedFood && (
            <div className="bg-slate-50 p-4 rounded-md">
              <h3 className="font-semibold text-lg">{selectedFood.name}</h3>
              <p className="text-sm text-muted-foreground">Nutrition per serving (100g)</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-4">
                <div className="text-center p-2 bg-white rounded shadow-sm">
                  <p className="text-sm text-muted-foreground">Calories</p>
                  <p className="font-bold">{selectedFood.calories}</p>
                </div>
                <div className="text-center p-2 bg-white rounded shadow-sm">
                  <p className="text-sm text-muted-foreground">Protein</p>
                  <p className="font-bold">{selectedFood.protein}g</p>
                </div>
                <div className="text-center p-2 bg-white rounded shadow-sm">
                  <p className="text-sm text-muted-foreground">Carbs</p>
                  <p className="font-bold">{selectedFood.carbs}g</p>
                </div>
                <div className="text-center p-2 bg-white rounded shadow-sm">
                  <p className="text-sm text-muted-foreground">Fat</p>
                  <p className="font-bold">{selectedFood.fat}g</p>
                </div>
                <div className="text-center p-2 bg-white rounded shadow-sm">
                  <p className="text-sm text-muted-foreground">Fiber</p>
                  <p className="font-bold">{selectedFood.fiber}g</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const NutritionInsights: React.FC = () => {
  const nutritionTips = [
    {
      title: "Protein for Muscle Recovery",
      description: "Consume 20-30g of protein within 30 minutes after exercise to optimize muscle recovery."
    },
    {
      title: "Complex Carbs for Sustained Energy",
      description: "Choose complex carbohydrates like whole grains and legumes for sustained energy throughout the day."
    },
    {
      title: "Healthy Fats for Brain Health",
      description: "Include sources of omega-3 fatty acids like fatty fish, walnuts, and flaxseeds to support brain function."
    },
    {
      title: "Hydration and Performance",
      description: "Even mild dehydration can impair performance. Aim for 8-10 glasses of water daily, more during exercise."
    },
    {
      title: "Meal Timing Strategy",
      description: "Eating smaller, more frequent meals can help maintain stable energy levels and prevent overeating."
    }
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          Nutrition Insights
        </CardTitle>
        <CardDescription>
          Evidence-based nutrition tips to improve your health and performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {nutritionTips.map((tip, index) => (
            <div key={index} className="flex space-x-3">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-base">{tip.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 