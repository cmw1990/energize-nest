
-- Craving logs for tracking nicotine/substance cravings
CREATE TABLE IF NOT EXISTS craving_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  craving_level INTEGER NOT NULL CHECK (craving_level >= 1 AND craving_level <= 10),
  trigger TEXT,
  coping_strategy TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  location TEXT,
  duration_minutes INTEGER,
  success BOOLEAN
);

-- Trigger patterns to identify usage patterns
CREATE TABLE IF NOT EXISTS trigger_patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  trigger_type TEXT NOT NULL,
  location_patterns TEXT[],
  time_patterns JSONB,
  emotional_state TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Withdrawal symptom tracking
CREATE TABLE IF NOT EXISTS withdrawal_symptoms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  symptom_type TEXT NOT NULL,
  intensity INTEGER NOT NULL CHECK (intensity >= 1 AND intensity <= 10),
  duration_hours INTEGER,
  coping_methods TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recovery milestones for tracking health improvements
CREATE TABLE IF NOT EXISTS recovery_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  milestone_type TEXT NOT NULL,
  days_since_quit INTEGER,
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  health_improvements TEXT[],
  notes TEXT
);

-- Products directory for nicotine replacement and alternatives
CREATE TABLE IF NOT EXISTS nicotine_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  type TEXT NOT NULL,
  strength_mg NUMERIC NOT NULL,
  flavor TEXT,
  price_range TEXT,
  rating NUMERIC CHECK (rating >= 0 AND rating <= 5),
  chemical_concerns TEXT[],
  gum_health_rating INTEGER,
  availability TEXT[],
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vendors directory for where to buy products
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  website TEXT NOT NULL,
  countries_served TEXT[] NOT NULL,
  product_types TEXT[] NOT NULL,
  shipping_time TEXT,
  price_range TEXT,
  rating NUMERIC CHECK (rating >= 0 AND rating <= 5),
  reviews_count INTEGER DEFAULT 0,
  has_verified_reviews BOOLEAN DEFAULT FALSE,
  special_offers TEXT[],
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE craving_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own craving logs" 
  ON craving_logs FOR SELECT 
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own craving logs" 
  ON craving_logs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

ALTER TABLE trigger_patterns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own trigger patterns" 
  ON trigger_patterns FOR SELECT 
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own trigger patterns" 
  ON trigger_patterns FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

ALTER TABLE withdrawal_symptoms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own withdrawal symptoms" 
  ON withdrawal_symptoms FOR SELECT 
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own withdrawal symptoms" 
  ON withdrawal_symptoms FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

ALTER TABLE recovery_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own recovery milestones" 
  ON recovery_milestones FOR SELECT 
  USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own recovery milestones" 
  ON recovery_milestones FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Products and vendors are publicly viewable
ALTER TABLE nicotine_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view nicotine products" 
  ON nicotine_products FOR SELECT 
  TO PUBLIC;

ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view vendors" 
  ON vendors FOR SELECT 
  TO PUBLIC;

-- Allow authenticated users to create products and vendors for community contributions
CREATE POLICY "Authenticated users can insert nicotine products" 
  ON nicotine_products FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert vendors" 
  ON vendors FOR INSERT 
  TO authenticated 
  WITH CHECK (true);
