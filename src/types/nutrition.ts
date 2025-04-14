export interface NutritionGoalRecord {
  id: string;
  user_id: string;
  calories_goal?: number;
  protein_goal_g?: number;
  carbs_goal_g?: number;
  fat_goal_g?: number;
  fiber_goal_g?: number;
  start_weight_kg: number;
  target_weight_kg: number;
  weekly_weight_goal_kg: number;
  is_active: boolean;
  goal_start_date: string;
  goal_end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface FoodLogEntry {
  id: string;
  user_id: string;
  food_name: string;
  serving_size: number;
  serving_unit: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g?: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  log_date: string;
  created_at: string;
  notes?: string;
  barcode?: string;
  image_url?: string;
}

export interface NutritionSummary {
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  total_fiber: number;
  meals: {
    breakfast: FoodLogEntry[];
    lunch: FoodLogEntry[];
    dinner: FoodLogEntry[];
    snack: FoodLogEntry[];
  };
  goal_progress: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

export interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  potassium: number;
  calcium: number;
  iron: number;
  vitaminA: number;
  vitaminC: number;
  vitaminD: number;
  meals: Array<{
    timestamp: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }>;
  weeklyData: Array<{
    date: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
  }>;
}

export interface NutritionGoal {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar?: number;
  sodium?: number;
  potassium?: number;
  calcium?: number;
  iron?: number;
  vitaminA?: number;
  vitaminC?: number;
  vitaminD?: number;
}

export interface NutritionScore {
  overall: number;
  macros: number;
  micros: number;
  timing: number;
  balance: number;
}

export interface NutritionTrend {
  date: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  goal_met: boolean;
}

export interface WeightLog {
  id: string;
  user_id: string;
  weight_kg: number;
  height_m: number | null;
  log_date: string;
  measurement_type: 'morning' | 'evening' | 'other';
  notes?: string;
  created_at: string;
}

export interface BMIData {
  bmi: number;
  category: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
  ideal_weight_range: {
    min: number;
    max: number;
  };
}

export interface WeightTrend {
  date: string;
  weight: number;
  bmi?: number;
  goal_weight?: number;
  notes?: string;
}

export interface MacroBreakdown {
  protein_pct: number;
  carbs_pct: number;
  fat_pct: number;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface NutrientGoals {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
}

export interface NutritionGoalProgress {
  current: number;
  target: number;
  percentage: number;
}

export interface RecipeNutrition {
  name: string;
  servings: number;
  serving_size: string;
  total_calories: number;
  nutrients: {
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    fiber_g: number;
    sugar_g?: number;
    sodium_mg?: number;
  };
  ingredients: Array<{
    name: string;
    amount: number;
    unit: string;
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    fiber_g?: number;
  }>;
}

export interface Recipe {
  id: string;
  recipe_id: string;
  user_id: string;
  name: string;
  description?: string;
  instructions: string[];
  prep_time?: number;
  cook_time?: number;
  servings: number;
  difficulty?: string;
  tags?: string[];
  notes?: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  total_fiber: number;
  created_at: string;
  updated_at: string;
}

export interface RecipeIngredient {
  id: string;
  recipe_id: string;
  food_name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein_grams: number;
  carbs_grams: number;
  fat_grams: number;
  fiber_grams?: number;
  food_api_id?: string;
  selected_measure_uri?: string;
  is_main_ingredient: boolean;
  alternative_ingredients?: string[];
  notes?: string;
  prep_instructions?: string[];
  created_at: string;
} 