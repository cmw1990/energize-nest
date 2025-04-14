-- Create beverage types table
CREATE TABLE beverage_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  water_content DECIMAL NOT NULL CHECK (water_content >= 0 AND water_content <= 1),
  caffeine_content DECIMAL,
  alcohol_content DECIMAL CHECK (alcohol_content >= 0 AND alcohol_content <= 100),
  calories DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create beverage logs table
CREATE TABLE beverage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  beverage_type_id UUID REFERENCES beverage_types,
  custom_name TEXT,
  amount_ml INTEGER NOT NULL CHECK (amount_ml > 0),
  custom_caffeine_content DECIMAL,
  custom_alcohol_content DECIMAL CHECK (custom_alcohol_content >= 0 AND custom_alcohol_content <= 100),
  custom_calories DECIMAL,
  notes TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS policies
ALTER TABLE beverage_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE beverage_logs ENABLE ROW LEVEL SECURITY;

-- Everyone can read beverage types
CREATE POLICY "Allow public read access to beverage_types" ON beverage_types
  FOR SELECT
  USING (true);

-- Users can read their own beverage logs
CREATE POLICY "Users can read own beverage_logs" ON beverage_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own beverage logs
CREATE POLICY "Users can insert own beverage_logs" ON beverage_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own beverage logs
CREATE POLICY "Users can update own beverage_logs" ON beverage_logs
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own beverage logs
CREATE POLICY "Users can delete own beverage_logs" ON beverage_logs
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER handle_beverage_types_updated_at
  BEFORE UPDATE ON beverage_types
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_beverage_logs_updated_at
  BEFORE UPDATE ON beverage_logs
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Insert common beverage types
INSERT INTO beverage_types (name, water_content, caffeine_content, calories)
VALUES 
  ('Water', 1.0, 0, 0),
  ('Coffee', 0.99, 40, 1),
  ('Green Tea', 0.99, 25, 1),
  ('Black Tea', 0.99, 30, 1),
  ('Milk', 0.88, 0, 42),
  ('Orange Juice', 0.88, 0, 45),
  ('Cola', 0.89, 10, 42),
  ('Energy Drink', 0.89, 32, 45),
  ('Sports Drink', 0.94, 0, 24),
  ('Beer', 0.95, 0, 43),
  ('Wine', 0.98, 0, 83),
  ('Spirits', 0.60, 0, 230);

-- Update alcohol content for alcoholic beverages
UPDATE beverage_types 
SET alcohol_content = CASE 
  WHEN name = 'Beer' THEN 5.0
  WHEN name = 'Wine' THEN 12.0
  WHEN name = 'Spirits' THEN 40.0
  ELSE NULL
END
WHERE name IN ('Beer', 'Wine', 'Spirits');