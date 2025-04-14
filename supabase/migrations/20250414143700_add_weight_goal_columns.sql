-- Add height tracking to weight_logs
ALTER TABLE IF EXISTS weight_logs 
ADD COLUMN IF NOT EXISTS height_m numeric(4, 2) CHECK (height_m > 0);

-- Add measurement type tracking
ALTER TABLE IF EXISTS weight_logs
ADD COLUMN IF NOT EXISTS measurement_type text CHECK (measurement_type IN ('morning', 'evening', 'other')) DEFAULT 'morning';

-- Add notes column
ALTER TABLE IF EXISTS weight_logs
ADD COLUMN IF NOT EXISTS notes text;

-- Add indices for faster querying
CREATE INDEX IF NOT EXISTS weight_logs_user_date_idx ON weight_logs (user_id, log_date);
CREATE INDEX IF NOT EXISTS weight_logs_type_idx ON weight_logs (measurement_type);

-- Add columns to nutrition_goals for weight tracking
ALTER TABLE IF EXISTS nutrition_goals
ADD COLUMN IF NOT EXISTS start_weight_kg numeric(5, 2) CHECK (start_weight_kg > 0),
ADD COLUMN IF NOT EXISTS target_weight_kg numeric(5, 2) CHECK (target_weight_kg > 0),
ADD COLUMN IF NOT EXISTS weekly_weight_goal_kg numeric(4, 2),
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS goal_start_date date DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS goal_end_date date;

-- Add constraint to ensure end date is after start date
ALTER TABLE IF EXISTS nutrition_goals
ADD CONSTRAINT goal_dates_check CHECK (goal_end_date IS NULL OR goal_end_date > goal_start_date);

-- Add trigger to ensure only one active goal per user
CREATE OR REPLACE FUNCTION check_active_goal()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active THEN
    UPDATE nutrition_goals
    SET is_active = false
    WHERE user_id = NEW.user_id
    AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ensure_single_active_goal ON nutrition_goals;
CREATE TRIGGER ensure_single_active_goal
BEFORE INSERT OR UPDATE ON nutrition_goals
FOR EACH ROW
EXECUTE FUNCTION check_active_goal();