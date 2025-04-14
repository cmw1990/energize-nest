export interface BeverageType {
  id: string;
  name: string;
  water_content: number; // 0-1, percentage of water content
  caffeine_content?: number; // mg/100ml
  alcohol_content?: number; // percentage
  calories?: number; // per 100ml
  created_at: string;
  updated_at: string;
}

export interface BeverageLog {
  id: string;
  user_id: string;
  beverage_type_id?: string;
  beverage_type?: BeverageType;
  custom_name?: string;
  amount_ml: number;
  custom_caffeine_content?: number;
  custom_alcohol_content?: number;
  custom_calories?: number;
  notes?: string;
  timestamp: string;
  created_at: string;
  updated_at: string;
}

export interface WeeklyData {
  date: string;
  water: number;
  caffeine: number;
  alcohol: number;
  calories: number;
}

export interface BeverageAnalytics {
  totalWater: number;
  totalCaffeine: number;
  totalAlcohol: number;
  totalCalories: number;
  weeklyData: WeeklyData[];
  recentLogs: BeverageLog[];
}