import React, { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { BarcodeScanner } from './BarcodeScanner';
import { FoodLogEntry, MealType } from '@/types/nutrition';

interface FoodLogFormProps {
  onSuccess?: () => void;
}

export const FoodLogForm: React.FC<FoodLogFormProps> = ({ onSuccess }) => {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<FoodLogEntry>>({
    food_name: '',
    serving_size: 0,
    serving_unit: 'g',
    calories: 0,
    protein_g: 0,
    carbs_g: 0,
    fat_g: 0,
    meal_type: 'breakfast'
  });

  const handleChange = (field: keyof FoodLogEntry, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      
      const foodLog: Partial<FoodLogEntry> = {
        ...formData,
        user_id: session.user.id,
        log_date: format(new Date(), 'yyyy-MM-dd')
      };

      const { error } = await supabase
        .from('food_logs')
        .insert(foodLog);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Food log added successfully"
      });

      // Reset form
      setFormData({
        food_name: '',
        serving_size: 0,
        serving_unit: 'g',
        calories: 0,
        protein_g: 0,
        carbs_g: 0,
        fat_g: 0,
        meal_type: 'breakfast'
      });

      // Call onSuccess callback if provided
      onSuccess?.();
    } catch (err) {
      console.error('Error logging food:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log food"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Food</CardTitle>
        <CardDescription>Record your food intake with nutritional information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1">Food Name</label>
                <Input
                  value={formData.food_name}
                  onChange={(e) => handleChange('food_name', e.target.value)}
                  placeholder="Enter food name"
                  required
                />
              </div>
              <div className="w-1/3">
                <label className="text-sm font-medium mb-1">Meal Type</label>
                <Select 
                  value={formData.meal_type} 
                  onValueChange={(value: MealType) => handleChange('meal_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1">Serving Size</label>
                <Input
                  type="number"
                  value={formData.serving_size || ''}
                  onChange={(e) => handleChange('serving_size', Number(e.target.value))}
                  placeholder="Enter amount"
                  required
                />
              </div>
              <div className="w-1/3">
                <label className="text-sm font-medium mb-1">Unit</label>
                <Select
                  value={formData.serving_unit}
                  onValueChange={(value) => handleChange('serving_unit', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="g">grams (g)</SelectItem>
                    <SelectItem value="ml">milliliters (ml)</SelectItem>
                    <SelectItem value="oz">ounces (oz)</SelectItem>
                    <SelectItem value="cup">cups</SelectItem>
                    <SelectItem value="tbsp">tablespoons</SelectItem>
                    <SelectItem value="tsp">teaspoons</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-1">Calories</label>
                <Input
                  type="number"
                  value={formData.calories || ''}
                  onChange={(e) => handleChange('calories', Number(e.target.value))}
                  placeholder="kcal"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1">Protein</label>
                <Input
                  type="number"
                  value={formData.protein_g || ''}
                  onChange={(e) => handleChange('protein_g', Number(e.target.value))}
                  placeholder="grams"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1">Carbs</label>
                <Input
                  type="number"
                  value={formData.carbs_g || ''}
                  onChange={(e) => handleChange('carbs_g', Number(e.target.value))}
                  placeholder="grams"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1">Fat</label>
                <Input
                  type="number"
                  value={formData.fat_g || ''}
                  onChange={(e) => handleChange('fat_g', Number(e.target.value))}
                  placeholder="grams"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Logging..." : "Log Food"}
            </Button>
            <BarcodeScanner onScan={(data) => {
              // Handle barcode scan data
              console.log('Scanned:', data);
              if (data?.barcode) {
                handleChange('barcode', data.barcode);
              }
            }} />
          </div>
        </form>
      </CardContent>
    </Card>
  );
};