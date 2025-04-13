import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  PlusCircle, 
  Calendar, 
  Copy, 
  Check, 
  Trash2, 
  Utensils,
  ShoppingBag,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Printer,
  Share2,
  Save,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge";

interface MealPlan {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  created_at: string;
  is_favorite: boolean;
}

interface MealPlanDay {
  id: string;
  plan_id: string;
  day_index: number;
  date: string;
  day_name: string;
}

interface MealPlanItem {
  id: string;
  day_id: string;
  meal_type: string;
  food_name: string;
  recipe_id?: string;
  servings: number;
  notes?: string;
}

export const MealPlanner = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<MealPlan | null>(null);
  const [planDays, setPlanDays] = useState<MealPlanDay[]>([]);
  const [mealItems, setMealItems] = useState<MealPlanItem[]>([]);
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    days: 7,
  });
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [shoppingList, setShoppingList] = useState<{[key: string]: number}>({});
  
  useEffect(() => {
    if (session?.user?.id) {
      fetchMealPlans();
    }
  }, [session]);
  
  useEffect(() => {
    if (selectedPlan) {
      fetchPlanDays(selectedPlan.id);
    }
  }, [selectedPlan]);
  
  useEffect(() => {
    if (planDays.length > 0) {
      const dayIds = planDays.map(day => day.id);
      fetchMealItems(dayIds);
    }
  }, [planDays]);
  
  useEffect(() => {
    generateShoppingList();
  }, [mealItems]);
  
  const fetchMealPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setMealPlans(data || []);
      if (data && data.length > 0) {
        setSelectedPlan(data[0]);
      }
    } catch (error) {
      console.error('Error fetching meal plans:', error);
    }
  };
  
  const fetchPlanDays = async (planId: string) => {
    try {
      const { data, error } = await supabase
        .from('meal_plan_days')
        .select('*')
        .eq('plan_id', planId)
        .order('day_index', { ascending: true });
      
      if (error) throw error;
      
      setPlanDays(data || []);
      if (data && data.length > 0) {
        setExpandedDay(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching plan days:', error);
    }
  };
  
  const fetchMealItems = async (dayIds: string[]) => {
    try {
      const { data, error } = await supabase
        .from('meal_plan_items')
        .select('*')
        .in('day_id', dayIds);
      
      if (error) throw error;
      
      setMealItems(data || []);
    } catch (error) {
      console.error('Error fetching meal items:', error);
    }
  };
  
  const createNewPlan = async () => {
    if (!newPlan.name) {
      toast({
        title: "Plan name required",
        description: "Please provide a name for your meal plan",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Create the plan
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + newPlan.days - 1);
      
      const { data: planData, error: planError } = await supabase
        .from('meal_plans')
        .insert({
          user_id: session?.user?.id,
          name: newPlan.name,
          description: newPlan.description,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          is_favorite: false
        })
        .select()
        .single();
      
      if (planError) throw planError;
      
      // Create days for the plan
      const days = [];
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
      for (let i = 0; i < newPlan.days; i++) {
        const dayDate = new Date(startDate);
        dayDate.setDate(startDate.getDate() + i);
        const dayIndex = dayDate.getDay();
        
        days.push({
          plan_id: planData.id,
          day_index: i,
          date: dayDate.toISOString().split('T')[0],
          day_name: dayNames[dayIndex]
        });
      }
      
      const { data: daysData, error: daysError } = await supabase
        .from('meal_plan_days')
        .insert(days)
        .select();
      
      if (daysError) throw daysError;
      
      toast({
        title: "Meal plan created",
        description: "Your new meal plan has been created successfully",
      });
      
      setIsCreatingPlan(false);
      setNewPlan({
        name: '',
        description: '',
        days: 7,
      });
      
      // Refresh the meal plans
      fetchMealPlans();
      
      // Set the new plan as selected
      setSelectedPlan(planData);
      
      // Set the plan days
      setPlanDays(daysData);
      
      // Set the first day as expanded
      if (daysData.length > 0) {
        setExpandedDay(daysData[0].id);
      }
    } catch (error) {
      console.error('Error creating meal plan:', error);
      toast({
        title: "Error creating plan",
        description: "There was a problem creating your meal plan",
        variant: "destructive",
      });
    }
  };
  
  const addMealItem = async (dayId: string, mealType: string) => {
    try {
      const { data, error } = await supabase
        .from('meal_plan_items')
        .insert({
          day_id: dayId,
          meal_type: mealType,
          food_name: 'New item',
          servings: 1
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setMealItems([...mealItems, data]);
    } catch (error) {
      console.error('Error adding meal item:', error);
    }
  };
  
  const updateMealItem = async (itemId: string, updates: Partial<MealPlanItem>) => {
    try {
      const { error } = await supabase
        .from('meal_plan_items')
        .update(updates)
        .eq('id', itemId);
      
      if (error) throw error;
      
      setMealItems(
        mealItems.map(item => 
          item.id === itemId ? { ...item, ...updates } : item
        )
      );
    } catch (error) {
      console.error('Error updating meal item:', error);
    }
  };
  
  const deleteMealItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('meal_plan_items')
        .delete()
        .eq('id', itemId);
      
      if (error) throw error;
      
      setMealItems(mealItems.filter(item => item.id !== itemId));
      
      toast({
        title: "Item removed",
        description: "The meal item has been removed",
      });
    } catch (error) {
      console.error('Error deleting meal item:', error);
    }
  };
  
  const generateShoppingList = () => {
    const list: {[key: string]: number} = {};
    
    mealItems.forEach(item => {
      const foodName = item.food_name.trim();
      if (foodName && foodName !== 'New item') {
        if (list[foodName]) {
          list[foodName] += item.servings;
        } else {
          list[foodName] = item.servings;
        }
      }
    });
    
    setShoppingList(list);
  };
  
  const getItemsForDay = (dayId: string, mealType: string) => {
    return mealItems.filter(
      item => item.day_id === dayId && item.meal_type === mealType
    );
  };
  
  const toggleFavorite = async (planId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('meal_plans')
        .update({ is_favorite: !currentStatus })
        .eq('id', planId);
      
      if (error) throw error;
      
      setMealPlans(
        mealPlans.map(plan => 
          plan.id === planId ? { ...plan, is_favorite: !currentStatus } : plan
        )
      );
      
      if (selectedPlan && selectedPlan.id === planId) {
        setSelectedPlan({
          ...selectedPlan,
          is_favorite: !currentStatus
        });
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };
  
  const deletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this meal plan?')) return;
    
    try {
      // First, get all days for this plan
      const { data: days, error: daysError } = await supabase
        .from('meal_plan_days')
        .select('id')
        .eq('plan_id', planId);
      
      if (daysError) throw daysError;
      
      // Delete all meal items for those days
      if (days && days.length > 0) {
        const dayIds = days.map(day => day.id);
        
        const { error: itemsError } = await supabase
          .from('meal_plan_items')
          .delete()
          .in('day_id', dayIds);
        
        if (itemsError) throw itemsError;
      }
      
      // Delete all days
      const { error: deleteDaysError } = await supabase
        .from('meal_plan_days')
        .delete()
        .eq('plan_id', planId);
      
      if (deleteDaysError) throw deleteDaysError;
      
      // Finally delete the plan
      const { error: deletePlanError } = await supabase
        .from('meal_plans')
        .delete()
        .eq('id', planId);
      
      if (deletePlanError) throw deletePlanError;
      
      // Update state
      setMealPlans(mealPlans.filter(plan => plan.id !== planId));
      
      if (selectedPlan && selectedPlan.id === planId) {
        if (mealPlans.length > 1) {
          // Select another plan
          const newSelectedPlan = mealPlans.find(plan => plan.id !== planId);
          setSelectedPlan(newSelectedPlan || null);
        } else {
          setSelectedPlan(null);
          setPlanDays([]);
          setMealItems([]);
        }
      }
      
      toast({
        title: "Plan deleted",
        description: "The meal plan has been deleted",
      });
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast({
        title: "Error deleting plan",
        description: "There was a problem deleting the meal plan",
        variant: "destructive",
      });
    }
  };
  
  const duplicatePlan = async (planId: string) => {
    try {
      // Get the plan to duplicate
      const planToDuplicate = mealPlans.find(plan => plan.id === planId);
      if (!planToDuplicate) return;
      
      // Create a new plan with the same details
      const { data: newPlanData, error: planError } = await supabase
        .from('meal_plans')
        .insert({
          user_id: session?.user?.id,
          name: `${planToDuplicate.name} (Copy)`,
          description: planToDuplicate.description,
          start_date: planToDuplicate.start_date,
          end_date: planToDuplicate.end_date,
          is_favorite: false
        })
        .select()
        .single();
      
      if (planError) throw planError;
      
      // Get all days for the original plan
      const { data: days, error: daysError } = await supabase
        .from('meal_plan_days')
        .select('*')
        .eq('plan_id', planId)
        .order('day_index', { ascending: true });
      
      if (daysError) throw daysError;
      
      if (!days || days.length === 0) {
        toast({
          title: "Plan duplicated",
          description: "Your meal plan was duplicated successfully",
        });
        fetchMealPlans();
        return;
      }
      
      // Create new days for the new plan
      const newDaysData = days.map(day => ({
        plan_id: newPlanData.id,
        day_index: day.day_index,
        date: day.date,
        day_name: day.day_name
      }));
      
      const { data: newDays, error: newDaysError } = await supabase
        .from('meal_plan_days')
        .insert(newDaysData)
        .select();
      
      if (newDaysError) throw newDaysError;
      
      // Create a mapping from old day IDs to new day IDs
      const dayMapping: {[key: string]: string} = {};
      days.forEach((oldDay, index) => {
        if (newDays && newDays[index]) {
          dayMapping[oldDay.id] = newDays[index].id;
        }
      });
      
      // Get all meal items for the original days
      const { data: items, error: itemsError } = await supabase
        .from('meal_plan_items')
        .select('*')
        .in('day_id', days.map(day => day.id));
      
      if (itemsError) throw itemsError;
      
      if (items && items.length > 0) {
        // Create new meal items for the new days
        const newItemsData = items.map(item => ({
          day_id: dayMapping[item.day_id],
          meal_type: item.meal_type,
          food_name: item.food_name,
          servings: item.servings,
          notes: item.notes,
          recipe_id: item.recipe_id
        }));
        
        const { error: newItemsError } = await supabase
          .from('meal_plan_items')
          .insert(newItemsData);
        
        if (newItemsError) throw newItemsError;
      }
      
      toast({
        title: "Plan duplicated",
        description: "Your meal plan was duplicated successfully",
      });
      
      fetchMealPlans();
    } catch (error) {
      console.error('Error duplicating plan:', error);
      toast({
        title: "Error duplicating plan",
        description: "There was a problem duplicating the meal plan",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      {isCreatingPlan ? (
        <Card>
          <CardHeader>
            <CardTitle>Create New Meal Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="plan-name">Plan Name</Label>
              <Input 
                id="plan-name" 
                placeholder="e.g., Weekly Family Plan"
                value={newPlan.name}
                onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="plan-description">Description (optional)</Label>
              <Input 
                id="plan-description" 
                placeholder="Brief description of this meal plan"
                value={newPlan.description}
                onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="plan-days">Number of Days</Label>
              <Input 
                id="plan-days"
                type="number"
                min="1"
                max="30"
                value={newPlan.days}
                onChange={(e) => setNewPlan({...newPlan, days: parseInt(e.target.value) || 7})}
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsCreatingPlan(false)}
              >
                Cancel
              </Button>
              <Button onClick={createNewPlan}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <Card className="w-full md:w-80">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Meal Plans</span>
                <Button onClick={() => setIsCreatingPlan(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Plan
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mealPlans.length === 0 ? (
                <div className="text-center p-6 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-2 text-muted-foreground/60" />
                  <p>No meal plans yet</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => setIsCreatingPlan(true)}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Your First Plan
                  </Button>
                </div>
              ) : (
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-2">
                    {mealPlans.map((plan) => (
                      <div 
                        key={plan.id}
                        className={`p-3 border rounded-lg hover:bg-muted transition-colors cursor-pointer ${
                          selectedPlan?.id === plan.id ? 'bg-muted border-primary' : ''
                        }`}
                        onClick={() => setSelectedPlan(plan)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{plan.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {plan.start_date} to {plan.end_date}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(plan.id, plan.is_favorite);
                              }}
                            >
                              <svg 
                                viewBox="0 0 24 24" 
                                fill={plan.is_favorite ? "currentColor" : "none"} 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className={`h-4 w-4 ${plan.is_favorite ? 'text-yellow-500' : ''}`}
                              >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                              </svg>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                duplicatePlan(plan.id);
                              }}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                deletePlan(plan.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
          
          {selectedPlan && (
            <div className="flex-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{selectedPlan.name}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="plan" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="plan" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Meal Plan</span>
                      </TabsTrigger>
                      <TabsTrigger value="shopping" className="flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4" />
                        <span>Shopping List</span>
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="plan" className="space-y-4">
                      {planDays.length === 0 ? (
                        <div className="text-center p-6 text-muted-foreground">
                          <Calendar className="h-12 w-12 mx-auto mb-2 text-muted-foreground/60" />
                          <p>No days defined for this plan</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {planDays.map((day) => (
                            <Collapsible 
                              key={day.id}
                              open={expandedDay === day.id}
                              onOpenChange={() => setExpandedDay(expandedDay === day.id ? null : day.id)}
                            >
                              <div className="border rounded-lg overflow-hidden">
                                <CollapsibleTrigger asChild>
                                  <div className="p-4 bg-muted flex justify-between items-center cursor-pointer hover:bg-muted/80 transition-colors">
                                    <div className="flex items-center gap-3">
                                      <Badge variant="outline">Day {day.day_index + 1}</Badge>
                                      <h3 className="font-medium">
                                        {day.day_name} ({day.date})
                                      </h3>
                                    </div>
                                    {expandedDay === day.id ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4" />
                                    )}
                                  </div>
                                </CollapsibleTrigger>
                                
                                <CollapsibleContent>
                                  <div className="p-4 space-y-4">
                                    {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => (
                                      <div key={`${day.id}-${mealType}`} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                          <h4 className="font-medium capitalize">{mealType}</h4>
                                          <Button 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={() => addMealItem(day.id, mealType)}
                                          >
                                            <Plus className="h-4 w-4 mr-1" />
                                            Add Item
                                          </Button>
                                        </div>
                                        
                                        <div className="space-y-2">
                                          {getItemsForDay(day.id, mealType).length === 0 ? (
                                            <div className="p-2 text-sm text-muted-foreground text-center border border-dashed rounded-lg">
                                              No items for {mealType}
                                            </div>
                                          ) : (
                                            getItemsForDay(day.id, mealType).map((item) => (
                                              <div 
                                                key={item.id}
                                                className="flex items-center justify-between p-2 border rounded-lg"
                                              >
                                                <Input 
                                                  value={item.food_name}
                                                  onChange={(e) => updateMealItem(item.id, { food_name: e.target.value })}
                                                  className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto text-sm"
                                                />
                                                
                                                <div className="flex items-center gap-2">
                                                  <div className="flex items-center text-sm">
                                                    <Button 
                                                      variant="ghost" 
                                                      size="icon"
                                                      className="h-6 w-6"
                                                      onClick={() => updateMealItem(
                                                        item.id, 
                                                        { servings: Math.max(0.25, item.servings - 0.25) }
                                                      )}
                                                    >
                                                      -
                                                    </Button>
                                                    <span>{item.servings}</span>
                                                    <Button 
                                                      variant="ghost" 
                                                      size="icon"
                                                      className="h-6 w-6"
                                                      onClick={() => updateMealItem(
                                                        item.id, 
                                                        { servings: item.servings + 0.25 }
                                                      )}
                                                    >
                                                      +
                                                    </Button>
                                                  </div>
                                                  
                                                  <Button 
                                                    variant="ghost" 
                                                    size="icon"
                                                    onClick={() => deleteMealItem(item.id)}
                                                  >
                                                    <Trash2 className="h-4 w-4" />
                                                  </Button>
                                                </div>
                                              </div>
                                            ))
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </CollapsibleContent>
                              </div>
                            </Collapsible>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="shopping" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span>Shopping List</span>
                            <Button variant="outline" size="sm">
                              <Printer className="h-4 w-4 mr-2" />
                              Print List
                            </Button>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {Object.keys(shoppingList).length === 0 ? (
                            <div className="text-center p-6 text-muted-foreground">
                              <ShoppingBag className="h-12 w-12 mx-auto mb-2 text-muted-foreground/60" />
                              <p>No items in your shopping list</p>
                              <p className="text-sm mt-1">
                                Add meals to your plan to generate a shopping list
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="border rounded-lg overflow-hidden">
                                <div className="bg-muted p-3 font-medium">
                                  Items to Buy
                                </div>
                                <div className="divide-y">
                                  {Object.entries(shoppingList).map(([item, quantity]) => (
                                    <div 
                                      key={item}
                                      className="flex justify-between items-center p-3"
                                    >
                                      <div className="flex items-center gap-2">
                                        <input type="checkbox" id={`item-${item}`} className="rounded" />
                                        <label htmlFor={`item-${item}`}>{item}</label>
                                      </div>
                                      <span className="text-sm text-muted-foreground">
                                        {quantity} {quantity === 1 ? 'serving' : 'servings'}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <Button className="w-full">
                                <Save className="h-4 w-4 mr-2" />
                                Save Shopping List
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
