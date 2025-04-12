
// Define types for the task table missing in the default Supabase types
export interface TasksTable {
  Row: {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    due_date?: string;
    priority: string; // 'urgent', 'important', 'regular', 'low'
    status: string; // 'todo', 'in-progress', 'done'
    created_at: string;
    updated_at?: string;
  };
  Insert: {
    id?: string;
    user_id: string;
    title: string;
    description?: string;
    due_date?: string;
    priority?: string;
    status?: string;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    user_id?: string;
    title?: string;
    description?: string;
    due_date?: string;
    priority?: string;
    status?: string;
    created_at?: string;
    updated_at?: string;
  };
}

// Export a type that can be used to extend the Database interface
export interface CustomTables {
  tasks: TasksTable;
}

// Add a Task type for easier consumption
export type Task = TasksTable['Row'];

// Add missing types from energyPlans.d.ts
export type ConsultationSession = {
  id: string;
  client_id: string;
  professional_id: string;
  session_type: string;
  status: string;
  scheduled_start: string;
  duration_minutes: number;
  session_date: string;
  meeting_link: string;
  notes: string;
  feedback_submitted: boolean;
  created_at: string;
  professional: {
    id: string;
    full_name: string;
    avatar_url: string;
  };
};

export type JournalEntry = {
  id: string;
  title: string;
  content: string;
  entry_type: string;
  mood_rating: number;
  tags: string[];
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type FoodItem = {
  id: string;
  food_name: string;
  calories: number;
  protein_grams: number;
  carbs_grams: number;
  fat_grams: number;
  serving_size?: string;
  image_url?: string;
  meal_type?: string;
  meal_time?: string;
  user_id?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  ai_analysis?: string;
  fiber_grams?: number;
};

export type NutritionGoals = {
  id: string;
  user_id: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  water: number;
  created_at?: string;
  updated_at?: string;
};

// Add missing type for Visibility
export type Visibility = "private" | "public";
