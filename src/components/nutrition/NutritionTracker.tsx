import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { FoodItem, NutritionGoals } from "@/types/database";
import { safeArrayCast } from "@/utils/typeSafeUtils";

export const NutritionTracker = () => {
  const { session } = useAuth();
  
  const { data: foodItems, refetch } = useQuery({
    queryKey: ["food_items", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from("food_items")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      return safeArrayCast<FoodItem>(data || []);
    },
    enabled: !!session?.user?.id,
  });
  
  const { data: nutritionGoals } = useQuery({
    queryKey: ["nutrition_goals", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from("nutrition_goals")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();
        
      if (error) throw error;
      
      return data as NutritionGoals;
    },
    enabled: !!session?.user?.id,
  });
  
  const addFoodItemsMutation = useMutation({
    mutationFn: async (newItems: {
      food_name: string;
      calories: number;
      protein_grams: number;
      carbs_grams: number;
      fat_grams: number;
      serving_size?: string;
      meal_type?: string;
      meal_time?: string;
      notes?: string;
    }[]) => {
      if (!session?.user?.id) {
        throw new Error("User not authenticated");
      }
      
      const itemsWithUserId = newItems.map(item => ({
        ...item,
        user_id: session.user.id
      }));
      
      const { data, error } = await supabase
        .from("food_items")
        .insert(itemsWithUserId)
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      refetch();
    }
  });
  
  return <div>Nutrition Tracker - Fixed</div>;
};
