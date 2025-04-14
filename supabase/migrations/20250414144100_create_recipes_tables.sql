CREATE TABLE IF NOT EXISTS recipes (
  id BIGSERIAL PRIMARY KEY,
  recipe_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  instructions TEXT[] NOT NULL,
  prep_time INTEGER,
  cook_time INTEGER,
  servings INTEGER NOT NULL DEFAULT 1,
  difficulty TEXT,
  tags TEXT[],
  notes TEXT,
  total_calories INTEGER,
  total_protein DECIMAL(10,2),
  total_carbs DECIMAL(10,2),
  total_fat DECIMAL(10,2),
  total_fiber DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id BIGSERIAL PRIMARY KEY,
  recipe_id UUID NOT NULL,
  food_name TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL,
  calories INTEGER,
  protein_grams DECIMAL(10,2),
  carbs_grams DECIMAL(10,2),
  fat_grams DECIMAL(10,2),
  fiber_grams DECIMAL(10,2),
  food_api_id TEXT,
  selected_measure_uri TEXT,
  is_main_ingredient BOOLEAN DEFAULT false,
  alternative_ingredients TEXT[],
  notes TEXT,
  prep_instructions TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_recipes_recipe_id ON recipes(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe_id ON recipe_ingredients(recipe_id);

-- Add recipes RLS policies
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own recipes"
  ON recipes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recipes"
  ON recipes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recipes"
  ON recipes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipes"
  ON recipes FOR DELETE
  USING (auth.uid() = user_id);

-- Add recipe_ingredients RLS policies
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view recipe ingredients"
  ON recipe_ingredients FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.recipe_id = recipe_ingredients.recipe_id
    AND recipes.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert recipe ingredients"
  ON recipe_ingredients FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.recipe_id = recipe_ingredients.recipe_id
    AND recipes.user_id = auth.uid()
  ));

CREATE POLICY "Users can update recipe ingredients"
  ON recipe_ingredients FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.recipe_id = recipe_ingredients.recipe_id
    AND recipes.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.recipe_id = recipe_ingredients.recipe_id
    AND recipes.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete recipe ingredients"
  ON recipe_ingredients FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM recipes
    WHERE recipes.recipe_id = recipe_ingredients.recipe_id
    AND recipes.user_id = auth.uid()
  ));

-- Create function to update recipes updated_at timestamp
CREATE OR REPLACE FUNCTION update_recipes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_recipes_updated_at();