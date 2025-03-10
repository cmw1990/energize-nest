-- Food Database
CREATE TABLE IF NOT EXISTS food_database (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    brand TEXT,
    serving_size DECIMAL(8,2),
    serving_unit TEXT,
    calories INTEGER,
    protein_g DECIMAL(6,2),
    carbs_g DECIMAL(6,2),
    fat_g DECIMAL(6,2),
    fiber_g DECIMAL(6,2),
    sugar_g DECIMAL(6,2),
    sodium_mg INTEGER,
    potassium_mg INTEGER,
    vitamins JSONB,
    minerals JSONB,
    allergens TEXT[],
    ingredients TEXT[],
    barcode TEXT UNIQUE,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Meal Tracking
CREATE TABLE IF NOT EXISTS meal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    consumed_at TIMESTAMPTZ NOT NULL,
    location TEXT,
    hunger_level_before INTEGER CHECK (hunger_level_before BETWEEN 1 AND 10),
    fullness_after INTEGER CHECK (fullness_after BETWEEN 1 AND 10),
    mood_before TEXT,
    mood_after TEXT,
    energy_level_before INTEGER CHECK (energy_level_before BETWEEN 1 AND 10),
    energy_level_after INTEGER CHECK (energy_level_after BETWEEN 1 AND 10),
    social_context TEXT[],
    photos TEXT[],
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Meal Components
CREATE TABLE IF NOT EXISTS meal_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meal_id UUID REFERENCES meal_entries(id) ON DELETE CASCADE,
    food_id UUID REFERENCES food_database(id),
    servings DECIMAL(6,2),
    custom_food_name TEXT,
    custom_calories INTEGER,
    custom_macros JSONB,
    custom_micros JSONB,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Supplement Database
CREATE TABLE IF NOT EXISTS supplement_database (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    brand TEXT,
    category TEXT CHECK (category IN ('vitamin', 'mineral', 'herb', 'amino_acid', 'protein', 'other')),
    form TEXT CHECK (form IN ('pill', 'capsule', 'powder', 'liquid', 'gummy')),
    serving_size DECIMAL(6,2),
    serving_unit TEXT,
    ingredients JSONB,
    benefits TEXT[],
    warnings TEXT[],
    third_party_tested BOOLEAN,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Supplement Tracking
CREATE TABLE IF NOT EXISTS supplement_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    supplement_id UUID REFERENCES supplement_database(id),
    taken_at TIMESTAMPTZ NOT NULL,
    dosage DECIMAL(6,2),
    dosage_unit TEXT,
    taken_with_food BOOLEAN,
    effectiveness INTEGER CHECK (effectiveness BETWEEN 1 AND 10),
    side_effects TEXT[],
    mood_impact INTEGER CHECK (mood_impact BETWEEN -5 AND 5),
    energy_impact INTEGER CHECK (energy_impact BETWEEN -5 AND 5),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Nutrition Goals
CREATE TABLE IF NOT EXISTS nutrition_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    category TEXT CHECK (category IN ('weight', 'macros', 'calories', 'hydration', 'supplements')),
    target_value JSONB,
    start_date DATE,
    end_date DATE,
    progress JSONB,
    status TEXT CHECK (status IN ('active', 'completed', 'abandoned')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Hydration Tracking
CREATE TABLE IF NOT EXISTS hydration_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    amount_ml INTEGER,
    type TEXT CHECK (type IN ('water', 'coffee', 'tea', 'soda', 'juice', 'alcohol', 'other')),
    consumed_at TIMESTAMPTZ NOT NULL,
    caffeine_content_mg INTEGER,
    energy_impact INTEGER CHECK (energy_impact BETWEEN -5 AND 5),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Nutrition Analytics
CREATE TABLE IF NOT EXISTS nutrition_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date_recorded DATE NOT NULL,
    total_calories INTEGER,
    macros JSONB,
    micros JSONB,
    water_intake_ml INTEGER,
    meals_tracked INTEGER,
    supplements_taken INTEGER,
    energy_level_avg DECIMAL(3,1),
    mood_avg DECIMAL(3,1),
    hunger_patterns JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Add RLS policies
ALTER TABLE food_database ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplement_database ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplement_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE hydration_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view food database"
    ON food_database FOR SELECT
    USING (true);

CREATE POLICY "Users can view their own meal entries"
    ON meal_entries FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view components of their meals"
    ON meal_components FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM meal_entries
        WHERE meal_entries.id = meal_components.meal_id
        AND meal_entries.user_id = auth.uid()
    ));

CREATE POLICY "Anyone can view supplement database"
    ON supplement_database FOR SELECT
    USING (true);

CREATE POLICY "Users can view their own supplement tracking"
    ON supplement_tracking FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own nutrition goals"
    ON nutrition_goals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own hydration tracking"
    ON hydration_tracking FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own nutrition analytics"
    ON nutrition_analytics FOR SELECT
    USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_meal_entries_user ON meal_entries(user_id);
CREATE INDEX idx_meal_components_meal ON meal_components(meal_id);
CREATE INDEX idx_supplement_tracking_user ON supplement_tracking(user_id);
CREATE INDEX idx_nutrition_goals_user ON nutrition_goals(user_id);
CREATE INDEX idx_hydration_tracking_user ON hydration_tracking(user_id);
CREATE INDEX idx_nutrition_analytics_user ON nutrition_analytics(user_id);
