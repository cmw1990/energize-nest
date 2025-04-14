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
  Beef,
  Calculator,
  Trash2
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

import { NutritionGoal, NutritionGoalRecord } from '@/types/nutrition'; // Import shared type

// Remove local NutritionGoal interface, use imported NutritionGoalRecord for DB interaction
// and NutritionGoal for the structure (which includes defaults)

export const NutritionGoals = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [goals, setGoals] = useState<NutritionGoalRecord[]>([]); // Use DB record type
  const [activeGoal, setActiveGoal] = useState<NutritionGoalRecord | null>(null); // Use DB record type
  const [creatingGoal, setCreatingGoal] = useState(false);
  const [showMacroAdjustment, setShowMacroAdjustment] = useState(false);
  
  const [newGoal, setNewGoal] = useState({
    goal_name: 'My Custom Goal', // Keep for naming the goal set
    goal_type: 'maintenance', // Keep for calculator logic
    // Use fields from shared NutritionGoal type
    calories: 2000,
    protein: 120,
    carbs: 200,
    fat: 65,
    fiber: 25, // Add missing fields
    sugar: 50,
    sodium: 2300,
    potassium: 3500,
    calcium: 1000,
    iron: 18,
    vitaminA: 3000,
    vitaminC: 90,
    vitaminD: 600,
    water_target: 3000, // Keep water target if separate
    // Add new weight goal fields
    target_weight_kg: null as number | null, // Explicitly type as number | null
    target_date: null as string | null, // Explicitly type as string | null
    weekly_weight_goal_kg: null as number | null, // e.g., -0.5 for loss, 0.25 for gain
    start_weight_kg: null as number | null, // To track progress
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
    if (!session?.user?.id) return;
    try {
      // Select all fields corresponding to NutritionGoalRecord
      const selectString = 'id, user_id, created_at, is_active, goal_name, goal_type, calories, protein, carbs, fat, fiber, sugar, sodium, potassium, calcium, iron, vitaminA, vitaminC, vitaminD, water_target, adjustments, target_weight_kg, target_date, weekly_weight_goal_kg, start_weight_kg';
      const { data, error } = await supabase
        .from('nutrition_goals')
        .select(selectString)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setGoals(data || []);
      
      // Find the active goal
      const active = data?.find(g => g.is_active);
      if (active) {
        setActiveGoal(active);
      } else if (data && data.length > 0) {
        // If no active goal, set the latest one as active (optional behavior)
        // setActiveGoal(data[0]); 
        // Or just leave it null
        setActiveGoal(null); 
      } else {
        setActiveGoal(null);
      }
    } catch (error) {
      console.error('Error fetching nutrition goals:', error);
      toast({
        title: "Error",
        description: "Could not fetch nutrition goals.",
        variant: "destructive",
      });
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
    
    // More precise calculation if weekly weight goal is set
    if (newGoal.weekly_weight_goal_kg !== null) {
        const calorieAdjustment = newGoal.weekly_weight_goal_kg * 7700 / 7; // 7700 kcal per kg approx.
        return Math.round(tdee + calorieAdjustment);
    }

    // Fallback to percentage based on goal type
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
    
    // Prioritize protein based on weight for muscle gain/loss
    if (personalInfo.goal === 'muscle_gain' || personalInfo.goal === 'weight_loss') {
        protein = Math.round(personalInfo.weight * 1.8); // 1.8g per kg bodyweight
        const proteinCalories = protein * 4;
        const remainingCalories = calories - proteinCalories;
        // Split remaining calories (e.g., 50% carbs, 50% fat for loss; 60% carbs, 40% fat for gain)
        const carbRatio = personalInfo.goal === 'muscle_gain' ? 0.60 : 0.50;
        carbs = Math.round((remainingCalories * carbRatio) / 4);
        fat = Math.round((remainingCalories * (1 - carbRatio)) / 9);
    } else { // Maintenance or default
        protein = Math.round((calories * 0.3) / 4); // 30% of calories from protein
        fat = Math.round((calories * 0.3) / 9); // 30% of calories from fat
        carbs = Math.round((calories * 0.4) / 4); // 40% of calories from carbs
    }
    
    return { protein, carbs, fat };
  };
  
  const applyCalculation = () => {
    const calories = calculateGoalCalories();
    const macros = calculateMacros(calories);
    
    setNewGoal({
      ...newGoal,
      // Update fields based on shared type
      calories: calories,
      protein: macros.protein,
      carbs: macros.carbs,
      fat: macros.fat, // Corrected field name
      goal_type: personalInfo.goal, // Sync goal_type with calculator selection
      // Set start weight if not already set
      start_weight_kg: newGoal.start_weight_kg === null ? personalInfo.weight : newGoal.start_weight_kg,
    });
  };
  
  const saveNewGoal = async () => {
    if (!session?.user?.id) return;
    
    try {
      // Ensure start weight is set if a weight goal exists
      const goalToSave = { ...newGoal };
      if ((goalToSave.target_weight_kg !== null || goalToSave.weekly_weight_goal_kg !== null) && goalToSave.start_weight_kg === null) {
          goalToSave.start_weight_kg = personalInfo.weight; // Use current weight from profile
      }

      const { data, error } = await supabase
        .from('nutrition_goals')
        .insert({
          user_id: session.user.id,
          goal_name: goalToSave.goal_name,
          goal_type: goalToSave.goal_type, 
          // Use shared NutritionGoal fields
          calories: goalToSave.calories,
          protein: goalToSave.protein,
          carbs: goalToSave.carbs,
          fat: goalToSave.fat,
          fiber: goalToSave.fiber,
          sugar: goalToSave.sugar,
          sodium: goalToSave.sodium,
          potassium: goalToSave.potassium,
          calcium: goalToSave.calcium,
          iron: goalToSave.iron,
          vitaminA: goalToSave.vitaminA,
          vitaminC: goalToSave.vitaminC,
          vitaminD: goalToSave.vitaminD,
          water_target: goalToSave.water_target,
          // Add new weight fields
          target_weight_kg: goalToSave.target_weight_kg,
          target_date: goalToSave.target_date,
          weekly_weight_goal_kg: goalToSave.weekly_weight_goal_kg,
          start_weight_kg: goalToSave.start_weight_kg, 
          is_active: true, // New goals are always active initially
          adjustments: goalToSave.adjustments,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Deactivate other goals if they exist
      const otherGoals = goals.filter(g => g.id !== data.id && g.is_active);
      if (otherGoals.length > 0) {
        await supabase
          .from('nutrition_goals')
          .update({ is_active: false })
          .eq('user_id', session.user.id)
          .neq('id', data.id); // Ensure we don't deactivate the new one
      }
      
      await fetchGoals(); // Refetch to update the list and active goal state
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
        description: (error as Error).message || "There was a problem saving your nutrition goal",
        variant: "destructive",
      });
    }
  };
  
  // Update function signature to use Partial<NutritionGoalRecord>
  const updateGoal = async (goalId: string, updates: Partial<NutritionGoalRecord>) => {
    if (!session?.user?.id) return;
    try {
      const { error } = await supabase
        .from('nutrition_goals')
        .update(updates)
        .eq('id', goalId)
        .eq('user_id', session.user.id);
      
      if (error) throw error;
      
      // Optimistically update local state
      setGoals(goals.map(goal => 
        goal.id === goalId ? { ...goal, ...updates } : goal
      ));
      
      if (activeGoal?.id === goalId) {
        setActiveGoal(prev => prev ? { ...prev, ...updates } : null);
      }
      
      // No toast on every minor adjustment, maybe only on explicit save?
      // toast({
      //   title: "Goal updated",
      //   description: "Your nutrition goal has been updated",
      // });
    } catch (error) {
      console.error('Error updating nutrition goal:', error);
       toast({
        title: "Error updating goal",
        description: (error as Error).message || "Could not update goal.",
        variant: "destructive",
      });
    }
  };
  
  const activateGoal = async (goalId: string) => {
     if (!session?.user?.id) return;
    try {
      // Deactivate all other goals first
      await supabase
        .from('nutrition_goals')
        .update({ is_active: false })
        .eq('user_id', session.user.id)
        .neq('id', goalId); // Don't deactivate the one we are activating
      
      // Activate selected goal
      const { error } = await supabase
        .from('nutrition_goals')
        .update({ is_active: true })
        .eq('id', goalId)
        .eq('user_id', session.user.id);
      
      if (error) throw error;
      
      await fetchGoals(); // Refetch to update UI
      
      toast({
        title: "Goal activated",
        description: "This nutrition goal is now your active goal",
      });
    } catch (error) {
      console.error('Error activating goal:', error);
       toast({
        title: "Error activating goal",
        description: (error as Error).message || "Could not activate goal.",
        variant: "destructive",
      });
    }
  };
  
  const deleteGoal = async (goalId: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;
    if (!session?.user?.id) return;
    
    try {
      const { error } = await supabase
        .from('nutrition_goals')
        .delete()
        .eq('id', goalId)
        .eq('user_id', session.user.id);
      
      if (error) throw error;
      
      // Update local state
      const remainingGoals = goals.filter(goal => goal.id !== goalId);
      setGoals(remainingGoals);
      
      // If the deleted goal was active, try to activate the latest remaining one, or set to null
      if (activeGoal?.id === goalId) {
         const latestRemaining = remainingGoals.length > 0 ? remainingGoals[0] : null; // Assuming fetchGoals orders by date desc
         if (latestRemaining) {
            await activateGoal(latestRemaining.id); // Activate the next latest one
         } else {
            setActiveGoal(null); // No goals left
         }
      }
      
      toast({
        title: "Goal deleted",
        description: "Your nutrition goal has been deleted",
      });
    } catch (error) {
      console.error('Error deleting goal:', error);
       toast({
        title: "Error deleting goal",
        description: (error as Error).message || "Could not delete goal.",
        variant: "destructive",
      });
    }
  };
  
  const resetNewGoal = () => {
    setNewGoal({
      goal_name: 'My Custom Goal',
      goal_type: 'maintenance',
      // Reset using shared NutritionGoal fields
      calories: 2000,
      protein: 120,
      carbs: 200,
      fat: 65,
      fiber: 25,
      sugar: 50,
      sodium: 2300,
      potassium: 3500,
      calcium: 1000,
      iron: 18,
      vitaminA: 3000,
      vitaminC: 90,
      vitaminD: 600,
      water_target: 3000,
      // Reset new weight fields
      target_weight_kg: null,
      target_date: null,
      weekly_weight_goal_kg: null,
      start_weight_kg: null,
      adjustments: {},
    });
     // Also reset personal info used by calculator? Optional.
    // setPersonalInfo({ weight: 70, height: 175, age: 30, gender: 'male', activity_level: 'moderate', goal: 'maintenance' });
  };
  
  // Update function signature and field names
  // Ensure goal is not null before accessing properties
  const calculateMacroPercentages = (goal: NutritionGoal | NutritionGoalRecord | null) => {
    if (!goal) return { protein: 0, carbs: 0, fat: 0 };
    const proteinCalories = (goal.protein || 0) * 4;
    const carbsCalories = (goal.carbs || 0) * 4;
    const fatCalories = (goal.fat || 0) * 9;
    const totalCalories = proteinCalories + carbsCalories + fatCalories;
    
    if (totalCalories === 0) return { protein: 33, carbs: 34, fat: 33 }; // Avoid division by zero, return rough thirds

    return {
      protein: Math.round((proteinCalories / totalCalories) * 100),
      carbs: Math.round((carbsCalories / totalCalories) * 100),
      fat: Math.round((fatCalories / totalCalories) * 100),
    };
  };
  
  // Update function signature
  // Ensure goal is not null
  const getMacroTargetsDisplay = (goal: NutritionGoal | NutritionGoalRecord | null) => {
    if (!goal) return { protein: 0, carbs: 0, fat: 0 };
    // Ensure the percentages add up to 100%
    const rawPercentages = calculateMacroPercentages(goal);
    
    // Adjust if they don't add up to 100%
    let { protein, carbs, fat } = rawPercentages;
    const total = protein + carbs + fat;
    
    if (total !== 100 && total !== 0) { // Avoid adjusting if total is 0
      const diff = 100 - total;
      // Distribute the difference, prioritizing the largest component
      if (Math.abs(diff) <= 3) { // Only adjust for small rounding errors
        if (protein >= carbs && protein >= fat) {
          protein += diff;
        } else if (carbs >= protein && carbs >= fat) {
          carbs += diff;
        } else {
          fat += diff;
        }
        // Ensure no negative percentages after adjustment
        protein = Math.max(0, protein);
        carbs = Math.max(0, carbs);
        fat = Math.max(0, fat);
        // Final check to ensure 100%
        const finalTotal = protein + carbs + fat;
        if (finalTotal !== 100) {
            // If still not 100, add remainder to largest component again
            const finalDiff = 100 - finalTotal;
             if (protein >= carbs && protein >= fat) protein += finalDiff;
             else if (carbs >= protein && carbs >= fat) carbs += finalDiff;
             else fat += finalDiff;
        }

      }
    }
    
    return { protein, carbs, fat };
  };
  
  const renderGoalTypeLabel = (goalType: string | null | undefined) => {
    if (!goalType) return 'Custom';
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

                {/* Add Weekly Weight Goal Input for Calculator */}
                 <div className="space-y-2">
                   <Label htmlFor="calc-weekly-goal">Desired Weekly Weight Change (kg)</Label>
                   <Input 
                     id="calc-weekly-goal" type="number" step="0.1"
                     placeholder="e.g., -0.5 for loss, 0.25 for gain, 0 for maintenance"
                     value={newGoal.weekly_weight_goal_kg ?? ''}
                     onChange={(e) => setNewGoal({...newGoal, weekly_weight_goal_kg: parseFloat(e.target.value) || null})}
                   />
                   <p className="text-xs text-muted-foreground">Overrides the 'Goal Type' selection for calorie calculation.</p>
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
                    value={newGoal.calories} 
                    onChange={(e) => setNewGoal({...newGoal, calories: parseInt(e.target.value) || 2000})}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="protein">Protein (g)</Label>
                    <Input 
                      id="protein"
                      type="number"
                      min="0"
                      value={newGoal.protein} 
                      onChange={(e) => setNewGoal({...newGoal, protein: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="carbs">Carbs (g)</Label>
                    <Input 
                      id="carbs"
                      type="number"
                      min="0"
                      value={newGoal.carbs} 
                      onChange={(e) => setNewGoal({...newGoal, carbs: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fat">Fat (g)</Label>
                    <Input 
                      id="fat"
                      type="number"
                      min="0"
                      value={newGoal.fat} 
                      onChange={(e) => setNewGoal({...newGoal, fat: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>

                 {/* Weight Goal Fields for Manual Entry */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="start-weight">Start Weight (kg)</Label>
                      <Input 
                        id="start-weight" type="number" step="0.1" min="0"
                        value={newGoal.start_weight_kg ?? ''}
                        onChange={(e) => setNewGoal({...newGoal, start_weight_kg: parseFloat(e.target.value) || null})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="target-weight">Target Weight (kg)</Label>
                      <Input 
                        id="target-weight" type="number" step="0.1" min="0"
                        value={newGoal.target_weight_kg ?? ''}
                        onChange={(e) => setNewGoal({...newGoal, target_weight_kg: parseFloat(e.target.value) || null})}
                      />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="weekly-goal">Weekly Goal (kg)</Label>
                      <Input 
                        id="weekly-goal" type="number" step="0.1"
                        placeholder="e.g., -0.5 or 0.25"
                        value={newGoal.weekly_weight_goal_kg ?? ''}
                        onChange={(e) => setNewGoal({...newGoal, weekly_weight_goal_kg: parseFloat(e.target.value) || null})}
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
                    value={newGoal.water_target || ''} 
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
                         {/* Preview Weight Goal */}
                         {newGoal.target_weight_kg && (
                           <p className="text-xs text-muted-foreground mt-1">
                             Weight: {newGoal.start_weight_kg || personalInfo.weight}kg → {newGoal.target_weight_kg}kg 
                             {newGoal.weekly_weight_goal_kg ? ` (${newGoal.weekly_weight_goal_kg > 0 ? '+' : ''}${newGoal.weekly_weight_goal_kg} kg/week)` : ''}
                           </p>
                        )}
                      </div>
                      <div className="text-right">
                        <h4 className="font-medium">{newGoal.calories}</h4>
                        <p className="text-sm text-muted-foreground">
                          Daily Calories
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Protein: {newGoal.protein}g</span>
                        <span>Carbs: {newGoal.carbs}g</span>
                        <span>Fat: {newGoal.fat}g</span>
                      </div>
                      <div className="flex h-2 overflow-hidden rounded-full bg-muted">
                        <div 
                          className="bg-blue-400" 
                          style={{ width: `${calculateMacroPercentages(newGoal as NutritionGoalRecord).protein}%` }}
                        ></div>
                        <div 
                          className="bg-green-400" 
                          style={{ width: `${calculateMacroPercentages(newGoal as NutritionGoalRecord).carbs}%` }}
                        ></div>
                        <div 
                          className="bg-red-400" 
                          style={{ width: `${calculateMacroPercentages(newGoal as NutritionGoalRecord).fat}%` }}
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
                    Create or activate a nutrition goal to track your daily targets.
                  </p>
                  <Button onClick={() => setCreatingGoal(true)}>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Create Goal
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="bg-muted/60 rounded-lg p-4 flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-lg">{activeGoal.goal_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {renderGoalTypeLabel(activeGoal.goal_type)} Goal
                          </p>
                           {/* Display Weight Goal Info */}
                           {activeGoal.target_weight_kg && (
                             <p className="text-xs text-muted-foreground mt-1">
                               Weight Goal: {activeGoal.start_weight_kg || 'N/A'}kg → {activeGoal.target_weight_kg}kg 
                               {activeGoal.weekly_weight_goal_kg ? ` (${activeGoal.weekly_weight_goal_kg > 0 ? '+' : ''}${activeGoal.weekly_weight_goal_kg} kg/week)` : ''}
                             </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="active-goal" className="text-sm">Active</Label>
                          <Switch 
                            id="active-goal" 
                            checked={activeGoal.is_active}
                            onCheckedChange={(checked) => {
                              if (checked && !activeGoal.is_active) { // Only activate if not already active
                                activateGoal(activeGoal.id);
                              }
                              // Cannot deactivate the only active goal via switch, use delete or activate another
                            }}
                            disabled={activeGoal.is_active && goals.length <= 1} // Disable if it's the only goal and active
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 mt-4">
                        <div className="text-center">
                          <h4 className="text-xl font-bold">{activeGoal.calories}</h4>
                          <p className="text-xs text-muted-foreground">Calories</p>
                        </div>
                        <div className="text-center">
                          <h4 className="text-xl font-bold">{activeGoal.protein}g</h4>
                          <p className="text-xs text-muted-foreground">Protein</p>
                        </div>
                        <div className="text-center">
                          <h4 className="text-xl font-bold">{activeGoal.carbs}g</h4>
                          <p className="text-xs text-muted-foreground">Carbs</p>
                        </div>
                        <div className="text-center">
                          <h4 className="text-xl font-bold">{activeGoal.fat}g</h4>
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
                            {getMacroTargetsDisplay(activeGoal).protein > 5 ? `${getMacroTargetsDisplay(activeGoal).protein}%` : ''}
                          </div>
                          <div 
                            className="bg-green-400 flex items-center justify-center text-xs text-white font-medium" 
                            style={{ width: `${getMacroTargetsDisplay(activeGoal).carbs}%` }}
                          >
                             {getMacroTargetsDisplay(activeGoal).carbs > 5 ? `${getMacroTargetsDisplay(activeGoal).carbs}%` : ''}
                          </div>
                          <div 
                            className="bg-red-400 flex items-center justify-center text-xs text-white font-medium" 
                            style={{ width: `${getMacroTargetsDisplay(activeGoal).fat}%` }}
                          >
                             {getMacroTargetsDisplay(activeGoal).fat > 5 ? `${getMacroTargetsDisplay(activeGoal).fat}%` : ''}
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
                    <CollapsibleContent className="mt-4 space-y-4 border p-4 rounded-md">
                      <div className="space-y-2">
                        <Label htmlFor="calories-target">Daily Calories Target</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            id="calories-target"
                            type="number"
                            min="1000"
                            max="10000"
                            value={activeGoal.calories} 
                            // Use debounce or onBlur for performance if needed
                            onChange={(e) => updateGoal(activeGoal.id, { calories: parseInt(e.target.value) || 2000 })}
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
                              value={activeGoal.protein} 
                              onChange={(e) => updateGoal(activeGoal.id, { protein: parseInt(e.target.value) || 0 })}
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
                              value={activeGoal.carbs} 
                              onChange={(e) => updateGoal(activeGoal.id, { carbs: parseInt(e.target.value) || 0 })}
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
                              value={activeGoal.fat} 
                              onChange={(e) => updateGoal(activeGoal.id, { fat: parseInt(e.target.value) || 0 })}
                            />
                            <span className="text-sm text-muted-foreground">g</span>
                          </div>
                        </div>
                      </div>

                       {/* Weight Goal Fields in Adjustment section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                          <div className="space-y-2">
                            <Label htmlFor="adj-start-weight">Start Weight (kg)</Label>
                            <Input 
                              id="adj-start-weight" type="number" step="0.1" min="0"
                              value={activeGoal.start_weight_kg ?? ''}
                              onChange={(e) => updateGoal(activeGoal.id, { start_weight_kg: parseFloat(e.target.value) || null})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="adj-target-weight">Target Weight (kg)</Label>
                            <Input 
                              id="adj-target-weight" type="number" step="0.1" min="0"
                              value={activeGoal.target_weight_kg ?? ''}
                              onChange={(e) => updateGoal(activeGoal.id, { target_weight_kg: parseFloat(e.target.value) || null})}
                            />
                          </div>
                           <div className="space-y-2">
                            <Label htmlFor="adj-weekly-goal">Weekly Goal (kg)</Label>
                            <Input 
                              id="adj-weekly-goal" type="number" step="0.1"
                              placeholder="e.g., -0.5 or 0.25"
                              value={activeGoal.weekly_weight_goal_kg ?? ''}
                              onChange={(e) => updateGoal(activeGoal.id, { weekly_weight_goal_kg: parseFloat(e.target.value) || null})}
                            />
                          </div>
                        </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="water-target">Daily Water Target</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            id="water-target"
                            type="number"
                            min="0"
                            value={activeGoal.water_target || ''} 
                            onChange={(e) => updateGoal(activeGoal.id, { water_target: parseInt(e.target.value) || 0 })} 
                          />
                          <span className="text-sm text-muted-foreground">ml</span>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              )}
              
              {goals.length > 0 && ( // Show "Other Goals" only if there are any goals
                <div className="pt-6 border-t">
                  <h3 className="font-medium mb-3">
                    {activeGoal ? 'Other Goals' : 'Saved Goals'} {/* Adjust title */}
                  </h3>
                  <div className="space-y-2">
                    {goals
                      .filter(goal => !goal.is_active) // Filter out the active goal
                      .map(goal => (
                        <div 
                          key={goal.id}
                          className="p-3 border rounded-lg flex justify-between items-center"
                        >
                          <div>
                            <div className="font-medium">{goal.goal_name}</div>
                            <div className="text-sm text-muted-foreground">
                              {goal.calories} cal • {renderGoalTypeLabel(goal.goal_type)}
                               {/* Show weight goal summary if exists */}
                               {goal.target_weight_kg && (
                                 ` • ${goal.start_weight_kg || 'N/A'}kg → ${goal.target_weight_kg}kg`
                               )}
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
                              className="text-red-500 hover:bg-red-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {goals.filter(goal => !goal.is_active).length === 0 && activeGoal && (
                         <p className="text-sm text-muted-foreground text-center py-4">No other goals saved.</p>
                      )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Static Info Cards - Consider making these dynamic or removing if redundant */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Beef className="h-5 w-5 text-red-500" />
                  Protein Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm">
                  <li className="flex justify-between"><span>Chicken Breast (100g)</span> <span className="font-medium">31g</span></li>
                  <li className="flex justify-between"><span>Greek Yogurt (1 cup)</span> <span className="font-medium">23g</span></li>
                  <li className="flex justify-between"><span>Salmon (100g)</span> <span className="font-medium">22g</span></li>
                  <li className="flex justify-between"><span>Eggs (2 large)</span> <span className="font-medium">12g</span></li>
                  <li className="flex justify-between"><span>Tofu (100g)</span> <span className="font-medium">8g</span></li>
                  <li className="flex justify-between"><span>Lentils (1 cup cooked)</span> <span className="font-medium">18g</span></li>
                </ul>
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
                 <ul className="space-y-1 text-sm">
                  <li className="flex justify-between"><span>Brown Rice (1 cup)</span> <span className="font-medium">45g</span></li>
                  <li className="flex justify-between"><span>Sweet Potato (1 medium)</span> <span className="font-medium">24g</span></li>
                  <li className="flex justify-between"><span>Oatmeal (1 cup)</span> <span className="font-medium">28g</span></li>
                  <li className="flex justify-between"><span>Quinoa (1 cup cooked)</span> <span className="font-medium">39g</span></li>
                  <li className="flex justify-between"><span>Banana (1 medium)</span> <span className="font-medium">27g</span></li>
                  <li className="flex justify-between"><span>Whole Wheat Bread (2 slices)</span> <span className="font-medium">24g</span></li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5 text-yellow-500" /> {/* Changed color */}
                  Healthy Fat Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                 <ul className="space-y-1 text-sm">
                  <li className="flex justify-between"><span>Avocado (1/2)</span> <span className="font-medium">15g</span></li>
                  <li className="flex justify-between"><span>Olive Oil (1 tbsp)</span> <span className="font-medium">14g</span></li>
                  <li className="flex justify-between"><span>Almonds (1 oz)</span> <span className="font-medium">14g</span></li>
                  <li className="flex justify-between"><span>Chia Seeds (2 tbsp)</span> <span className="font-medium">9g</span></li>
                  <li className="flex justify-between"><span>Salmon (100g)</span> <span className="font-medium">13g</span></li>
                  <li className="flex justify-between"><span>Peanut Butter (2 tbsp)</span> <span className="font-medium">16g</span></li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
