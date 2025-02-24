-- AI Food Recognition
CREATE TABLE IF NOT EXISTS food_recognition (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    recognized_items JSONB,
    confidence_scores JSONB,
    nutritional_estimates JSONB,
    portion_sizes JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Smart Recipe Suggestions
CREATE TABLE IF NOT EXISTS recipe_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    recipe_name TEXT NOT NULL,
    category TEXT CHECK (category IN ('breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout')),
    ingredients JSONB,
    nutrition_profile JSONB,
    preparation_time_minutes INTEGER,
    energy_boost_rating INTEGER CHECK (energy_boost_rating BETWEEN 1 AND 10),
    meal_timing_recommendation TEXT[],
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Meal Planning
CREATE TABLE IF NOT EXISTS meal_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    daily_calorie_target INTEGER,
    macro_targets JSONB,
    dietary_restrictions TEXT[],
    meal_schedule JSONB,
    shopping_list JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Restaurant Menu Analysis
CREATE TABLE IF NOT EXISTS restaurant_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_name TEXT NOT NULL,
    item_name TEXT NOT NULL,
    category TEXT,
    nutrition_info JSONB,
    health_score INTEGER CHECK (health_score BETWEEN 1 AND 100),
    energy_impact INTEGER CHECK (energy_impact BETWEEN -5 AND 5),
    alternatives TEXT[],
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Supplement Stacks
CREATE TABLE IF NOT EXISTS supplement_stacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    stack_name TEXT NOT NULL,
    purpose TEXT CHECK (purpose IN ('energy', 'focus', 'sleep', 'recovery', 'immunity', 'general_health')),
    supplements JSONB,
    timing_schedule JSONB,
    interactions_checked BOOLEAN DEFAULT false,
    effectiveness_rating INTEGER CHECK (effectiveness_rating BETWEEN 1 AND 10),
    side_effects TEXT[],
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Nutrient Timing
CREATE TABLE IF NOT EXISTS nutrient_timing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nutrient_type TEXT NOT NULL,
    optimal_timing TEXT[],
    absorption_factors JSONB,
    interaction_warnings JSONB,
    effectiveness_score INTEGER CHECK (effectiveness_score BETWEEN 1 AND 100),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Food Mood Correlation
CREATE TABLE IF NOT EXISTS food_mood_correlations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    food_category TEXT NOT NULL,
    mood_impact JSONB,
    energy_impact INTEGER CHECK (energy_impact BETWEEN -5 AND 5),
    timing_factors JSONB,
    frequency_of_occurrence INTEGER,
    confidence_score INTEGER CHECK (confidence_score BETWEEN 1 AND 100),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Fasting Tracking
CREATE TABLE IF NOT EXISTS fasting_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    fasting_type TEXT CHECK (fasting_type IN ('16/8', '18/6', '20/4', '24', '36', 'custom')),
    duration_hours DECIMAL(5,2),
    energy_levels JSONB,
    mood_tracking JSONB,
    physical_symptoms TEXT[],
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Smart Grocery Lists
CREATE TABLE IF NOT EXISTS smart_grocery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    list_name TEXT NOT NULL,
    items JSONB,
    nutritional_goals JSONB,
    budget_constraints DECIMAL(10,2),
    store_recommendations JSONB,
    shopping_frequency TEXT CHECK (shopping_frequency IN ('weekly', 'biweekly', 'monthly')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Nutrition Education
CREATE TABLE IF NOT EXISTS nutrition_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT CHECK (category IN ('basics', 'advanced', 'science', 'practical')),
    content TEXT,
    quiz_questions JSONB,
    resources TEXT[],
    completion_time_minutes INTEGER,
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Add RLS policies
ALTER TABLE food_recognition ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplement_stacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrient_timing ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_mood_correlations ENABLE ROW LEVEL SECURITY;
ALTER TABLE fasting_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_grocery ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_lessons ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own food recognition"
    ON food_recognition FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own recipe suggestions"
    ON recipe_suggestions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own meal plans"
    ON meal_plans FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view restaurant items"
    ON restaurant_items FOR SELECT
    USING (true);

CREATE POLICY "Users can view their own supplement stacks"
    ON supplement_stacks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own nutrient timing"
    ON nutrient_timing FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own food mood correlations"
    ON food_mood_correlations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own fasting sessions"
    ON fasting_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own smart grocery lists"
    ON smart_grocery FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view nutrition lessons"
    ON nutrition_lessons FOR SELECT
    USING (true);

-- Create indexes
CREATE INDEX idx_food_recognition_user ON food_recognition(user_id);
CREATE INDEX idx_recipe_suggestions_user ON recipe_suggestions(user_id);
CREATE INDEX idx_meal_plans_user ON meal_plans(user_id);
CREATE INDEX idx_supplement_stacks_user ON supplement_stacks(user_id);
CREATE INDEX idx_nutrient_timing_user ON nutrient_timing(user_id);
CREATE INDEX idx_food_mood_correlations_user ON food_mood_correlations(user_id);
CREATE INDEX idx_fasting_sessions_user ON fasting_sessions(user_id);
CREATE INDEX idx_smart_grocery_user ON smart_grocery(user_id);
