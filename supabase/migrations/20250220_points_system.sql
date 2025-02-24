-- Create points-related tables
CREATE TABLE step_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  steps INTEGER NOT NULL,
  points_earned INTEGER NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  source TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE user_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_points INTEGER NOT NULL DEFAULT 0,
  lifetime_points INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_update TIMESTAMP WITH TIME ZONE DEFAULT now(),
  step_goal INTEGER NOT NULL DEFAULT 10000,
  preferences JSONB NOT NULL DEFAULT '{"stepSource": "manual", "notifications": true, "autoRedeem": false}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE points_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  points_cost INTEGER NOT NULL,
  value INTEGER NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  limited_quantity INTEGER,
  remaining_quantity INTEGER,
  conditions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE store_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  image_url TEXT NOT NULL,
  points_discount JSONB,
  inventory INTEGER NOT NULL DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create function to update user points
CREATE OR REPLACE FUNCTION update_user_points(user_id UUID, points_change INTEGER)
RETURNS void AS $$
BEGIN
  INSERT INTO user_points (user_id, total_points, lifetime_points)
  VALUES (user_id, GREATEST(0, points_change), GREATEST(0, points_change))
  ON CONFLICT (user_id) DO UPDATE
  SET total_points = GREATEST(0, user_points.total_points + points_change),
      lifetime_points = user_points.lifetime_points + GREATEST(0, points_change),
      updated_at = now();
END;
$$ LANGUAGE plpgsql;

-- Create function to update step streak
CREATE OR REPLACE FUNCTION update_step_streak(user_id UUID)
RETURNS void AS $$
DECLARE
  last_step_date DATE;
  current_date DATE := CURRENT_DATE;
BEGIN
  -- Get the last step date
  SELECT date::date INTO last_step_date
  FROM step_points
  WHERE step_points.user_id = update_step_streak.user_id
  ORDER BY date DESC
  LIMIT 1;

  -- Update streak
  IF last_step_date = current_date - INTERVAL '1 day' THEN
    UPDATE user_points
    SET current_streak = current_streak + 1,
        longest_streak = GREATEST(longest_streak, current_streak + 1),
        updated_at = now()
    WHERE user_points.user_id = update_step_streak.user_id;
  ELSIF last_step_date != current_date THEN
    UPDATE user_points
    SET current_streak = 1,
        updated_at = now()
    WHERE user_points.user_id = update_step_streak.user_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to redeem reward
CREATE OR REPLACE FUNCTION redeem_reward(user_id UUID, reward_id UUID)
RETURNS void AS $$
DECLARE
  reward_record rewards%ROWTYPE;
  user_points_record user_points%ROWTYPE;
BEGIN
  -- Get reward and user points
  SELECT * INTO reward_record FROM rewards WHERE id = reward_id FOR UPDATE;
  SELECT * INTO user_points_record FROM user_points WHERE user_id = redeem_reward.user_id FOR UPDATE;

  -- Validate
  IF reward_record.remaining_quantity = 0 THEN
    RAISE EXCEPTION 'Reward no longer available';
  END IF;

  IF user_points_record.total_points < reward_record.points_cost THEN
    RAISE EXCEPTION 'Insufficient points';
  END IF;

  -- Update points and reward quantity
  UPDATE user_points
  SET total_points = total_points - reward_record.points_cost,
      updated_at = now()
  WHERE user_id = redeem_reward.user_id;

  UPDATE rewards
  SET remaining_quantity = remaining_quantity - 1,
      updated_at = now()
  WHERE id = reward_id;

  -- Record transaction
  INSERT INTO points_transactions (
    user_id,
    amount,
    type,
    description,
    category,
    metadata
  ) VALUES (
    redeem_reward.user_id,
    reward_record.points_cost,
    'spent',
    'Redeemed reward: ' || reward_record.title,
    'reward',
    jsonb_build_object('reward_id', reward_id)
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to purchase product
CREATE OR REPLACE FUNCTION purchase_product(user_id UUID, product_id UUID, use_points BOOLEAN)
RETURNS void AS $$
DECLARE
  product_record store_products%ROWTYPE;
  user_points_record user_points%ROWTYPE;
  points_needed INTEGER;
BEGIN
  -- Get product and user points
  SELECT * INTO product_record FROM store_products WHERE id = product_id FOR UPDATE;
  SELECT * INTO user_points_record FROM user_points WHERE user_id = purchase_product.user_id FOR UPDATE;

  -- Validate
  IF product_record.inventory = 0 THEN
    RAISE EXCEPTION 'Product out of stock';
  END IF;

  IF use_points THEN
    points_needed := (product_record.points_discount->>'pointsCost')::INTEGER;
    IF user_points_record.total_points < points_needed THEN
      RAISE EXCEPTION 'Insufficient points';
    END IF;

    -- Update points
    UPDATE user_points
    SET total_points = total_points - points_needed,
        updated_at = now()
    WHERE user_id = purchase_product.user_id;

    -- Record transaction
    INSERT INTO points_transactions (
      user_id,
      amount,
      type,
      description,
      category,
      metadata
    ) VALUES (
      purchase_product.user_id,
      points_needed,
      'spent',
      'Purchased product: ' || product_record.name,
      'store',
      jsonb_build_object('product_id', product_id)
    );
  END IF;

  -- Update inventory
  UPDATE store_products
  SET inventory = inventory - 1,
      updated_at = now()
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;

-- Add RLS policies
ALTER TABLE step_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own step points"
  ON step_points FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own step points"
  ON step_points FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own points"
  ON user_points FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read their own transactions"
  ON points_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read available rewards"
  ON rewards FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read available products"
  ON store_products FOR SELECT
  USING (true);
