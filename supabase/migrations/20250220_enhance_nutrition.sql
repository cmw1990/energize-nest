-- Enhanced Nutrition Tracking
ALTER TABLE nutrition_logs
ADD COLUMN IF NOT EXISTS mood_before TEXT,
ADD COLUMN IF NOT EXISTS mood_after TEXT,
ADD COLUMN IF NOT EXISTS hunger_level INTEGER CHECK (hunger_level BETWEEN 1 AND 10),
ADD COLUMN IF NOT EXISTS satisfaction_level INTEGER CHECK (satisfaction_level BETWEEN 1 AND 10),
ADD COLUMN IF NOT EXISTS eating_location TEXT,
ADD COLUMN IF NOT EXISTS eating_company TEXT[],
ADD COLUMN IF NOT EXISTS mindfulness_notes TEXT;

-- Food Database
CREATE TABLE IF NOT EXISTS food_database (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    barcode TEXT UNIQUE,
    name TEXT NOT NULL,
    brand TEXT,
    serving_size TEXT,
    calories INTEGER,
    protein_grams DECIMAL(8,2),
    carbs_grams DECIMAL(8,2),
    fats_grams DECIMAL(8,2),
    fiber_grams DECIMAL(8,2),
    sugar_grams DECIMAL(8,2),
    sodium_mg DECIMAL(8,2),
    ingredients TEXT[],
    allergens TEXT[],
    nutrition_score INTEGER CHECK (nutrition_score BETWEEN 0 AND 100),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Smart Grocery Lists
CREATE TABLE IF NOT EXISTS grocery_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    is_template BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS grocery_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    list_id UUID REFERENCES grocery_lists(id) ON DELETE CASCADE,
    food_id UUID REFERENCES food_database(id),
    name TEXT NOT NULL,
    quantity INTEGER,
    unit TEXT,
    category TEXT,
    is_purchased BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- AI Food Analysis
CREATE TABLE IF NOT EXISTS food_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nutrition_log_id UUID REFERENCES nutrition_logs(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    ai_analysis JSONB,
    confidence_score DECIMAL(4,2),
    detected_items TEXT[],
    estimated_calories INTEGER,
    estimated_macros JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Recipe Recommendations
CREATE TABLE IF NOT EXISTS recipe_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
    reason TEXT,
    nutritional_match_score INTEGER CHECK (nutritional_match_score BETWEEN 0 AND 100),
    preference_match_score INTEGER CHECK (preference_match_score BETWEEN 0 AND 100),
    is_viewed BOOLEAN DEFAULT false,
    is_saved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Add RLS policies
ALTER TABLE food_database ENABLE ROW LEVEL SECURITY;
ALTER TABLE grocery_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE grocery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view food database"
    ON food_database FOR SELECT
    USING (true);

CREATE POLICY "Users can view their own grocery lists"
    ON grocery_lists FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own grocery items"
    ON grocery_items FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM grocery_lists
        WHERE grocery_lists.id = list_id
        AND grocery_lists.user_id = auth.uid()
    ));

CREATE POLICY "Users can view their own food photos"
    ON food_photos FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own recipe recommendations"
    ON recipe_recommendations FOR SELECT
    USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_food_database_barcode ON food_database(barcode);
CREATE INDEX idx_food_database_name ON food_database(name);
CREATE INDEX idx_grocery_lists_user ON grocery_lists(user_id);
CREATE INDEX idx_grocery_items_list ON grocery_items(list_id);
CREATE INDEX idx_food_photos_user ON food_photos(user_id);
CREATE INDEX idx_recipe_recommendations_user ON recipe_recommendations(user_id);
