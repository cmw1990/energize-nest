-- Migration to add height and BMI columns to weight_logs table

-- Add new columns
ALTER TABLE public.weight_logs
ADD COLUMN height_m numeric(3,2) NULL,
ADD COLUMN bmi numeric(4,1) NULL,
ADD COLUMN measurement_type text NOT NULL DEFAULT 'morning',
ADD COLUMN last_updated timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;

-- Add check constraint for measurement_type
ALTER TABLE public.weight_logs
ADD CONSTRAINT weight_logs_measurement_type_check
CHECK (measurement_type IN ('morning', 'evening', 'other'));

-- Add comments for new columns
COMMENT ON COLUMN public.weight_logs.height_m IS 'User''s height in meters';
COMMENT ON COLUMN public.weight_logs.bmi IS 'Calculated Body Mass Index';
COMMENT ON COLUMN public.weight_logs.measurement_type IS 'When the measurement was taken (morning/evening/other)';
COMMENT ON COLUMN public.weight_logs.last_updated IS 'Timestamp when the record was last updated';

-- Create index for querying by measurement_type
CREATE INDEX idx_weight_logs_measurement_type ON public.weight_logs(user_id, measurement_type, log_date DESC);

-- Create function to automatically calculate BMI
CREATE OR REPLACE FUNCTION public.calculate_bmi()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.weight_kg IS NOT NULL AND NEW.height_m IS NOT NULL THEN
    NEW.bmi := ROUND((NEW.weight_kg / (NEW.height_m * NEW.height_m))::numeric, 1);
  ELSE
    NEW.bmi := NULL;
  END IF;
  NEW.last_updated := timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically calculate BMI on insert or update
CREATE TRIGGER tr_calculate_bmi
  BEFORE INSERT OR UPDATE OF weight_kg, height_m
  ON public.weight_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_bmi();

-- Update table comment
COMMENT ON TABLE public.weight_logs IS 'Stores user weight entries over time with BMI calculations and measurement metadata.';