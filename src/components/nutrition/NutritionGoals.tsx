
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  Target, 
  Save,
  ArrowRight, 
  Dumbbell, 
  ActivitySquare,
  Scale,
  Minus,
  Plus,
  ChevronDown,
  ChevronUp,
  Percent,
  Heart,
  Apple,
  Beef
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface NutritionGoal {
  id: string;
  user_id: string;
  calories_target: number;
  protein_target: number;
  carbs_target: number;
  fat_target: number;
  water_target: number;
  is_active: boolean;
  created_at: string;
  goal_type: string;
  goal_name: string;
  adjustments: Record<string, any>;
}

export const NutritionGoals = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [goals, setGoals] = useState<NutritionGoal[]>([]);
  const [activeGoal, setActiveGoal] = useState<NutritionGoal | null>(null);
  const [creatingGoal, setCreatingGoal] = useState(false);
  const [showMacroAdjustment, setShowMacroAdjustment] = useState(false);
  
  const [newGoal, setNewGoal] = useState({
    goal_name: 'My Custom Goal',
    goal_type: 'maintenance',
    calories_target: 2000,
    protein_target: 120,
    carbs_target: 200,
    fat_target: 65,
    water_target: 3000,
    adjustments: {},
  });
  
  const [personalInfo, setPersonalInfo] = useState({
    weight: 70, // kg
    height: 175, // cm
    age: 30,
    gender: 'male' as 'male' | 'female',
    activity_level: 'moderate' as 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active',
    goal: 'maintenance' as 'weight_loss' | 'maintenance' | 'muscle_gain',
  });
  
  useEffect(() => {
    if (session?.user?.id) {
      fetchGoals();
    }
  }, [session]);
  
  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('nutrition_goals')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setGoals(data || []);
      
      // Find the active goal
      const active = data?.find(g => g.is_active);
      if (active) {
        setActiveGoal(active);
      } else if (data && data.length > 0) {
        setActiveGoal(data[0]);
      }
    } catch (error) {
      console.error('Error fetching nutrition goals:', error);
    }
  };
  
  const calculateBMR = () => {
    // Mifflin-St Jeor Equation
    if (personalInfo.gender === 'male') {
      return 10 * personalInfo.weight + 6.25 * personalInfo.height - 5 * personalInfo.age + 5;
    } else {
      return 10 * personalInfo.weight + 6.25 * personalInfo.height - 5 * personalInfo.age - 161;
    }
  };
  
  const calculateTDEE = () => {
    const bmr = calculateBMR();
    const activityMultipliers = {
      sedentary: 1.2, // Little or no exercise
      light: 1.375, // Light exercise 1-3 days/week
      moderate: 1.55, // Moderate exercise 3-5 days/week
      active: 1.725, // Hard exercise 6-7 days/week
      very_active: 1.9, // Very hard exercise, physical job or training twice/day
    };
    
    return Math.round(bmr * activityMultipliers[personalInfo.activity_level]);
  };
  
  const calculateGoalCalories = () => {
    const tdee = calculateTDEE();
    
    switch (personalInfo.goal) {
      case 'weight_loss':
        return Math.round(tdee * 0.8); // 20% deficit
      case 'maintenance':
        return tdee;
      case 'muscle_gain':
        return Math.round(tdee * 1.1); // 10% surplus
      default:
        return tdee;
    }
  };
  
  const calculateMacros = (calories: number) => {
    let protein, carbs, fat;
    
    switch (personalInfo.goal) {
      case 'weight_loss':
        protein = Math.round((calories * 0.35) / 4); // 35% of calories from protein
        fat = Math.round((calories * 0.3) / 9); // 30% of calories from fat
        carbs = Math.round((calories * 0.35) / 4); // 35% of calories from carbs
        break;
      case 'maintenance':
        protein = Math.round((calories * 0.3) / 4); // 30% of calories from protein
        fat = Math.round((calories * 0.3) / 9); // 30% of calories from fat
        carbs = Math.round((calories * 0.4) / 4); // 40% of calories from carbs
        break;
      case 'muscle_gain':
        protein = Math.round((calories * 0.3) / 4); // 30% of calories from protein
        fat = Math.round((calories * 0.25) / 9); // 25% of calories from fat
        carbs = Math.round((calories * 0.45) / 4); // 45% of calories from carbs
        break;
      default:
        protein = Math.round((calories * 0.3) / 4);
        fat = Math.round((calories * 0.3) / 9);
        carbs = Math.round((calories * 0.4) / 4);
    }
    
    return { protein, carbs, fat };
  };
  
  const applyCalculation = () => {
    const calories = calculateGoalCalories();
    const macros = calculateMacros(calories);
    
    setNewGoal({
      ...newGoal,
      calories_target: calories,
      protein_target: macros.protein,
      carbs_target: macros.carbs,
      fat_target: macros.fat,
    });
  };
  
  const saveNewGoal = async () => {
    if (!session?.user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('nutrition_goals')
        .insert({
          user_id: session.user.id,
          goal_name: newGoal.goal_name,
          goal_type: newGoal.goal_type,
          calories_target: newGoal.calories_target,
          protein_target: newGoal.protein_target,
          carbs_target: newGoal.carbs_target,
          fat_target: newGoal.fat_target,
          water_target: newGoal.water_target,
          is_active: true,
          adjustments: newGoal.adjustments,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Deactivate other goals
      if (goals.some(g => g.is_active)) {
        await supabase
          .from('nutrition_goals')
          .update({ is_active: false })
          .eq('user_id', session.user.id)
          .neq('id', data.id);
      }
      
      await fetchGoals();
      setCreatingGoal(false);
      resetNewGoal();
      
      toast({
        title: "Goal created",
        description: "Your nutrition goal has been created and activated",
      });
    } catch (error) {
      console.error('Error saving nutrition goal:', error);
      toast({
        title: "Error saving goal",
        description: "There was a problem saving your nutrition goal",
        variant: "destructive",
      });
    }
  };
  
  const updateGoal = async (goalId: string, updates: Partial<NutritionGoal>) => {
    try {
      const { error } = await supabase
        .from('nutrition_goals')
        .update(updates)
        .eq('id', goalId)
        .eq('user_id', session?.user?.id);
      
      if (error) throw error;
      
      setGoals(goals.map(goal => 
        goal.id === goalId ? { ...goal, ...updates } : goal
      ));
      
      if (activeGoal?.id === goalId) {
        setActiveGoal(prev => prev ? { ...prev, ...updates } : null);
      }
      
      toast({
        title: "Goal updated",
        description: "Your nutrition goal has been updated",
      });
    } catch (error) {
      console.error('Error updating nutrition goal:', error);
    }
  };
  
  const activateGoal = async (goalId: string) => {
    try {
      // Deactivate all goals
      await supabase
        .from('nutrition_goals')
        .update({ is_active: false })
        .eq('user_id', session?.user?.id);
      
      // Activate selected goal
      const { error } = await supabase
        .from('nutrition_goals')
        .update({ is_active: true })
        .eq('id', goalId)
        .eq('user_id', session?.user?.id);
      
      if (error) throw error;
      
      await fetchGoals();
      
      toast({
        title: "Goal activated",
        description: "This nutrition goal is now your active goal",
      });
    } catch (error) {
      console.error('Error activating goal:', error);
    }
  };
  
  const deleteGoal = async (goalId: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;
    
    try {
      const { error } = await supabase
        .from('nutrition_goals')
        .delete()
        .eq('id', goalId)
        .eq('user_id', session?.user?.id);
      
      if (error) throw error;
      
      setGoals(goals.filter(goal => goal.id !== goalId));
      
      if (activeGoal?.id === goalId) {
        setActiveGoal(null);
      }
      
      toast({
        title: "Goal deleted",
        description: "Your nutrition goal has been deleted",
      });
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };
  
  const resetNewGoal = () => {
    setNewGoal({
      goal_name: 'My Custom Goal',
      goal_type: 'maintenance',
      calories_target: 2000,
      protein_target: 120,
      carbs_target: 200,
      fat_target: 65,
      water_target: 3000,
      adjustments: {},
    });
  };
  
  const calculateMacroPercentages = (goal: NutritionGoal) => {
    const proteinCalories = goal.protein_target * 4;
    const carbsCalories = goal.carbs_target * 4;
    const fatCalories = goal.fat_target * 9;
    const totalCalories = proteinCalories + carbsCalories + fatCalories;
    
    return {
      protein: Math.round((proteinCalories / totalCalories) * 100),
      carbs: Math.round((carbsCalories / totalCalories) * 100),
      fat: Math.round((fatCalories / totalCalories) * 100),
    };
  };
  
  const getMacroTargetsDisplay = (goal: NutritionGoal) => {
    // Ensure the percentages add up to 100%
    const rawPercentages = calculateMacroPercentages(goal);
    
    // Adjust if they don't add up to 100%
    let { protein, carbs, fat } = rawPercentages;
    const total = protein + carbs + fat;
    
    if (total !== 100) {
      const diff = 100 - total;
      // Distribute the difference proportionally
      if (Math.abs(diff) <= 3) {
        if (protein >= carbs && protein >= fat) {
          protein += diff;
        } else if (carbs >= protein && carbs >= fat) {
          carbs += diff;
        } else {
          fat += diff;
        }
      }
    }
    
    return { protein, carbs, fat };
  };
  
  const renderGoalTypeLabel = (goalType: string) => {
    switch (goalType) {
      case 'weight_loss':
        return 'Weight Loss';
      case 'maintenance':
        return 'Maintenance';
      case 'muscle_gain':
        return 'Muscle Gain';
      default:
        return goalType.charAt(0).toUpperCase() + goalType.slice(1);
    }
  };
  
  return (
    <div className="space-y-6">
      {creatingGoal ? (
        <Card>
          <CardHeader>
            <CardTitle>Create New Nutrition Goal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="calculator" className="space-y-4">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="calculator">
                  <ActivitySquare className="h-4 w-4 mr-2" />
                  Goal Calculator
                </TabsTrigger>
                <TabsTrigger value="manual">
                  <Target className="h-4 w-4 mr-2" />
                  Manual Entry
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="calculator" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goal-name">Goal Name</Label>
                  <Input 
                    id="goal-name" 
                    placeholder="e.g., Weight Loss Plan"
                    value={newGoal.goal_name}
                    onChange={(e) => setNewGoal({...newGoal, goal_name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Goal Type</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant={personalInfo.goal === 'weight_loss' ? 'default' : 'outline'}
                      onClick={() => setPersonalInfo({...personalInfo, goal: 'weight_loss'})}
                      className="flex flex-col items-center h-auto py-3"
                    >
                      <Minus className="h-5 w-5 mb-1" />
                      <span>Weight Loss</span>
                    </Button>
                    <Button 
                      variant={personalInfo.goal === 'maintenance' ? 'default' : 'outline'}
                      onClick={() => setPersonalInfo({...personalInfo, goal: 'maintenance'})}
                      className="flex flex-col items-center h-auto py-3"
                    >
                      <Scale className="h-5 w-5 mb-1" />
                      <span>Maintenance</span>
                    </Button>
                    <Button 
                      variant={personalInfo.goal === 'muscle_gain' ? 'default' : 'outline'}
                      onClick={() => setPersonalInfo({...personalInfo, goal: 'muscle_gain'})}
                      className="flex flex-col items-center h-auto py-3"
                    >
                      <Dumbbell className="h-5 w-5 mb-1" />
                      <span>Muscle Gain</span>
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input 
                      id="weight"
                      type="number"
                      step="0.1"
                      min="30"
                      max="250"
                      value={personalInfo.weight}
                      onChange={(e) => setPersonalInfo({...personalInfo, weight: parseFloat(e.target.value) || 70})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input 
                      id="height"
                      type="number"
                      min="100"
                      max="250"
                      value={personalInfo.height}
                      onChange={(e) => setPersonalInfo({...personalInfo, height: parseFloat(e.target.value) || 175})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input 
                      id="age"
                      type="number"
                      min="12"
                      max="120"
                      value={personalInfo.age}
                      onChange={(e) => setPersonalInfo({...personalInfo, age: parseInt(e.target.value) || 30})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <select 
                      id="gender"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                      value={personalInfo.gender}
                      onChange={(e) => setPersonalInfo({...personalInfo, gender: e.target.value as any})}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="activity">Activity Level</Label>
                  <select 
                    id="activity"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                    value={personalInfo.activity_level}
                    onChange={(e) => setPersonalInfo({...personalInfo, activity_level: e.target.value as any})}
                  >
                    <option value="sedentary">Sedentary (little or no exercise)</option>
                    <option value="light">Lightly Active (light exercise 1-3 days/week)</option>
                    <option value="moderate">Moderately Active (moderate exercise 3-5 days/week)</option>
                    <option value="active">Very Active (hard exercise 6-7 days/week)</option>
                    <option value="very_active">Extra Active (very hard exercise, physical job)</option>
                  </select>
                </div>
                
                <div className="pt-4">
                  <Button 
                    onClick={applyCalculation}
                    className="w-full"
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Goals
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="manual" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="manual-goal-name">Goal Name</Label>
                  <Input 
                    id="manual-goal-name" 
                    placeholder="e.g., Custom Nutrition Plan"
                    value={newGoal.goal_name}
                    onChange={(e) => setNewGoal({...newGoal, goal_name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="goal-type">Goal Type</Label>
                  <select 
                    id="goal-type"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                    value={newGoal.goal_type}
                    onChange={(e) => setNewGoal({...newGoal, goal_type: e.target.value})}
                  >
                    <option value="weight_loss">Weight Loss</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="calories">Calories Target</Label>
                  <Input 
                    id="calories"
                    type="number"
                    min="500"
                    max="10000"
                    value={newGoal.calories_target}
                    onChange={(e) => setNewGoal({...newGoal, calories_target: parseInt(e.target.value) || 2000})}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="protein">Protein (g)</Label>
                    <Input 
                      id="protein"
                      type="number"
                      min="0"
                      value={newGoal.protein_target}
                      onChange={(e) => setNewGoal({...newGoal, protein_target: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="carbs">Carbs (g)</Label>
                    <Input 
                      id="carbs"
                      type="number"
                      min="0"
                      value={newGoal.carbs_target}
                      onChange={(e) => setNewGoal({...newGoal, carbs_target: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fat">Fat (g)</Label>
                    <Input 
                      id="fat"
                      type="number"
                      min="0"
                      value={newGoal.fat_target}
                      onChange={(e) => setNewGoal({...newGoal, fat_target: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="water">Daily Water Target (ml)</Label>
                  <Input 
                    id="water"
                    type="number"
                    min="500"
                    max="10000"
                    value={newGoal.water_target}
                    onChange={(e) => setNewGoal({...newGoal, water_target: parseInt(e.target.value) || 3000})}
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="pt-4 border-t">
              <h3 className="font-medium text-lg mb-3">Preview</h3>
              <Card className="bg-muted/40">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium">{newGoal.goal_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {renderGoalTypeLabel(newGoal.goal_type)} Goal
                        </p>
                      </div>
                      <div className="text-right">
                        <h4 className="font-medium">{newGoal.calories_target}</h4>
                        <p className="text-sm text-muted-foreground">
                          Daily Calories
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Protein: {newGoal.protein_target}g</span>
                        <span>Carbs: {newGoal.carbs_target}g</span>
                        <span>Fat: {newGoal.fat_target}g</span>
                      </div>
                      <div className="flex h-2 overflow-hidden rounded-full bg-muted">
                        <div 
                          className="bg-blue-400" 
                          style={{ width: `${calculateMacroPercentages(newGoal as NutritionGoal).protein}%` }}
                        ></div>
                        <div 
                          className="bg-green-400" 
                          style={{ width: `${calculateMacroPercentages(newGoal as NutritionGoal).carbs}%` }}
                        ></div>
                        <div 
                          className="bg-red-400" 
                          style={{ width: `${calculateMacroPercentages(newGoal as NutritionGoal).fat}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setCreatingGoal(false);
                  resetNewGoal();
                }}
              >
                Cancel
              </Button>
              <Button onClick={saveNewGoal}>
                <Save className="h-4 w-4 mr-2" />
                Save Goal
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Nutrition Goals</span>
                <Button onClick={() => setCreatingGoal(true)}>
                  <Target className="h-4 w-4 mr-2" />
                  Create New Goal
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!activeGoal ? (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
                  <h3 className="text-lg font-medium mb-2">No Active Goal</h3>
                  <p className="text-muted-foreground mb-4">
                    Create a nutrition goal to track your daily targets
                  </p>
                  <Button onClick={() => setCreatingGoal(true)}>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Get Started
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="bg-muted/60 rounded-lg p-4 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{activeGoal.goal_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {renderGoalTypeLabel(activeGoal.goal_type)} Goal
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="active-goal" className="text-sm">Active</Label>
                          <Switch 
                            id="active-goal" 
                            checked={activeGoal.is_active}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                activateGoal(activeGoal.id);
                              }
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 mt-4">
                        <div className="text-center">
                          <h4 className="text-xl font-bold">{activeGoal.calories_target}</h4>
                          <p className="text-xs text-muted-foreground">Calories</p>
                        </div>
                        <div className="text-center">
                          <h4 className="text-xl font-bold">{activeGoal.protein_target}g</h4>
                          <p className="text-xs text-muted-foreground">Protein</p>
                        </div>
                        <div className="text-center">
                          <h4 className="text-xl font-bold">{activeGoal.carbs_target}g</h4>
                          <p className="text-xs text-muted-foreground">Carbs</p>
                        </div>
                        <div className="text-center">
                          <h4 className="text-xl font-bold">{activeGoal.fat_target}g</h4>
                          <p className="text-xs text-muted-foreground">Fat</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/60 rounded-lg p-4 md:w-80">
                      <h3 className="font-medium text-center mb-3">Macro Split</h3>
                      <div className="relative mb-4 pt-2">
                        <div className="flex h-8 overflow-hidden rounded-lg">
                          <div 
                            className="bg-blue-400 flex items-center justify-center text-xs text-white font-medium" 
                            style={{ width: `${getMacroTargetsDisplay(activeGoal).protein}%` }}
                          >
                            {getMacroTargetsDisplay(activeGoal).protein}%
                          </div>
                          <div 
                            className="bg-green-400 flex items-center justify-center text-xs text-white font-medium" 
                            style={{ width: `${getMacroTargetsDisplay(activeGoal).carbs}%` }}
                          >
                            {getMacroTargetsDisplay(activeGoal).carbs}%
                          </div>
                          <div 
                            className="bg-red-400 flex items-center justify-center text-xs text-white font-medium" 
                            style={{ width: `${getMacroTargetsDisplay(activeGoal).fat}%` }}
                          >
                            {getMacroTargetsDisplay(activeGoal).fat}%
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-1 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                          <span>Protein</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                          <span>Carbs</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          <span>Fat</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Collapsible
                    open={showMacroAdjustment}
                    onOpenChange={setShowMacroAdjustment}
                  >
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full"
                      >
                        {showMacroAdjustment ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-2" />
                            Hide Adjustments
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-2" />
                            Adjust Goal
                          </>
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="calories-target">Daily Calories Target</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            id="calories-target"
                            type="number"
                            min="1000"
                            max="10000"
                            value={activeGoal.calories_target}
                            onChange={(e) => updateGoal(activeGoal.id, { calories_target: parseInt(e.target.value) || 2000 })}
                          />
                          <span className="text-sm text-muted-foreground">calories</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="protein-target">Protein Target</Label>
                          <div className="flex items-center gap-2">
                            <Input 
                              id="protein-target"
                              type="number"
                              min="0"
                              value={activeGoal.protein_target}
                              onChange={(e) => updateGoal(activeGoal.id, { protein_target: parseInt(e.target.value) || 0 })}
                            />
                            <span className="text-sm text-muted-foreground">g</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="carbs-target">Carbs Target</Label>
                          <div className="flex items-center gap-2">
                            <Input 
                              id="carbs-target"
                              type="number"
                              min="0"
                              value={activeGoal.carbs_target}
                              onChange={(e) => updateGoal(activeGoal.id, { carbs_target: parseInt(e.target.value) || 0 })}
                            />
                            <span className="text-sm text-muted-foreground">g</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fat-target">Fat Target</Label>
                          <div className="flex items-center gap-2">
                            <Input 
                              id="fat-target"
                              type="number"
                              min="0"
                              value={activeGoal.fat_target}
                              onChange={(e) => updateGoal(activeGoal.id, { fat_target: parseInt(e.target.value) || 0 })}
                            />
                            <span className="text-sm text-muted-foreground">g</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="water-target">Daily Water Target</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            id="water-target"
                            type="number"
                            min="0"
                            value={activeGoal.water_target}
                            onChange={(e) => updateGoal(activeGoal.id, { water_target: parseInt(e.target.value) || 0 })}
                          />
                          <span className="text-sm text-muted-foreground">ml</span>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              )}
              
              {goals.length > 1 && (
                <div className="pt-6 border-t">
                  <h3 className="font-medium mb-3">Other Goals</h3>
                  <div className="space-y-2">
                    {goals
                      .filter(goal => !goal.is_active)
                      .map(goal => (
                        <div 
                          key={goal.id}
                          className="p-3 border rounded-lg flex justify-between items-center"
                        >
                          <div>
                            <div className="font-medium">{goal.goal_name}</div>
                            <div className="text-sm text-muted-foreground">
                              {goal.calories_target} cal • {renderGoalTypeLabel(goal.goal_type)}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => activateGoal(goal.id)}
                            >
                              Activate
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => deleteGoal(goal.id)}
                              className="text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Beef className="h-5 w-5 text-red-500" />
                  Protein Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 border-b">
                    <span>Chicken Breast (100g)</span>
                    <span className="font-medium">31g</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border-b">
                    <span>Greek Yogurt (1 cup)</span>
                    <span className="font-medium">23g</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border-b">
                    <span>Salmon (100g)</span>
                    <span className="font-medium">22g</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border-b">
                    <span>Eggs (2 large)</span>
                    <span className="font-medium">12g</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border-b">
                    <span>Tofu (100g)</span>
                    <span className="font-medium">8g</span>
                  </div>
                  <div className="flex justify-between items-center p-2">
                    <span>Lentils (1 cup cooked)</span>
                    <span className="font-medium">18g</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Apple className="h-5 w-5 text-green-500" />
                  Carb Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 border-b">
                    <span>Brown Rice (1 cup)</span>
                    <span className="font-medium">45g</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border-b">
                    <span>Sweet Potato (1 medium)</span>
                    <span className="font-medium">24g</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border-b">
                    <span>Oatmeal (1 cup)</span>
                    <span className="font-medium">28g</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border-b">
                    <span>Quinoa (1 cup cooked)</span>
                    <span className="font-medium">39g</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border-b">
                    <span>Banana (1 medium)</span>
                    <span className="font-medium">27g</span>
                  </div>
                  <div className="flex justify-between items-center p-2">
                    <span>Whole Wheat Bread (2 slices)</span>
                    <span className="font-medium">24g</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Healthy Fat Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 border-b">
                    <span>Avocado (1/2)</span>
                    <span className="font-medium">15g</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border-b">
                    <span>Olive Oil (1 tbsp)</span>
                    <span className="font-medium">14g</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border-b">
                    <span>Almonds (1 oz)</span>
                    <span className="font-medium">14g</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border-b">
                    <span>Chia Seeds (2 tbsp)</span>
                    <span className="font-medium">9g</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border-b">
                    <span>Salmon (100g)</span>
                    <span className="font-medium">13g</span>
                  </div>
                  <div className="flex justify-between items-center p-2">
                    <span>Peanut Butter (2 tbsp)</span>
                    <span className="font-medium">16g</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
