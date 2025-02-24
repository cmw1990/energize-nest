-- Insert comprehensive exercise categories
INSERT INTO exercise_categories (name, slug, description, target_audience, benefits) VALUES
-- Office Worker Specific
('Desk Exercises', 'desk-exercises', 'Quick exercises you can do at your desk to stay active and prevent stiffness', 
 ARRAY['office workers', 'remote workers', 'students'], 
 ARRAY['Improved posture', 'Reduced muscle tension', 'Better circulation', 'Increased energy']),

('Eye Health', 'eye-health', 'Exercises to reduce eye strain and maintain healthy vision',
 ARRAY['digital workers', 'designers', 'developers'], 
 ARRAY['Reduced eye strain', 'Better focus', 'Improved eye muscle strength']),

('Stress Relief', 'stress-relief', 'Physical and mental exercises to manage workplace stress',
 ARRAY['high-stress workers', 'executives', 'healthcare workers'], 
 ARRAY['Reduced stress', 'Better mood', 'Improved resilience']),

-- Specialized Health
('Reproductive Health', 'reproductive-health', 'Gender-specific exercises for reproductive health',
 ARRAY['all adults'], 
 ARRAY['Hormonal balance', 'Reproductive health', 'Overall wellbeing']),

('Circulation Boosters', 'circulation', 'Exercises to improve blood circulation, especially for sedentary workers',
 ARRAY['office workers', 'travelers', 'sedentary workers'], 
 ARRAY['Better circulation', 'Reduced swelling', 'Improved energy']),

('Back & Neck Care', 'back-neck-care', 'Targeted exercises for back and neck pain prevention and relief',
 ARRAY['office workers', 'manual workers', 'remote workers'], 
 ARRAY['Pain relief', 'Better posture', 'Stronger core']),

-- Mental Wellness
('Focus Enhancement', 'focus', 'Physical exercises designed to improve mental clarity and focus',
 ARRAY['knowledge workers', 'creative professionals', 'students'], 
 ARRAY['Better concentration', 'Mental clarity', 'Productivity']),

('Decision Fatigue Relief', 'decision-fatigue', 'Exercises to combat decision fatigue and mental exhaustion',
 ARRAY['executives', 'managers', 'decision makers'], 
 ARRAY['Mental refreshment', 'Better decision making', 'Reduced mental fatigue']),

-- Outdoor Activities
('Walking Wellness', 'walking', 'Guided walking exercises for health and mindfulness',
 ARRAY['all levels', 'beginners', 'seniors'], 
 ARRAY['Cardiovascular health', 'Mental clarity', 'Weight management']),

('Running Guide', 'running', 'Comprehensive running programs from beginner to advanced',
 ARRAY['all levels', 'fitness enthusiasts'], 
 ARRAY['Cardiovascular fitness', 'Endurance', 'Weight management']),

('Cycling Program', 'cycling', 'Indoor and outdoor cycling exercises and programs',
 ARRAY['all levels', 'commuters', 'fitness enthusiasts'], 
 ARRAY['Cardiovascular health', 'Lower body strength', 'Low-impact fitness']),

-- Specialized Conditions
('Night Shift Recovery', 'night-shift', 'Exercises designed for night shift workers to maintain health and energy',
 ARRAY['night shift workers', 'healthcare workers', 'security personnel'], 
 ARRAY['Better sleep', 'Energy management', 'Circadian adjustment']),

('Creative Energy', 'creative-energy', 'Movement exercises to boost creative energy and inspiration',
 ARRAY['artists', 'designers', 'creative professionals'], 
 ARRAY['Creative flow', 'Mental freshness', 'Artistic inspiration']),

('Extended Hours Wellness', 'extended-hours', 'Health maintenance exercises for those working long hours',
 ARRAY['overtime workers', 'startup employees', 'medical professionals'], 
 ARRAY['Sustained energy', 'Stress management', 'Work-life balance']),

-- Weight Management
('Weight Loss', 'weight-loss', 'Science-based exercises for healthy and sustainable weight loss',
 ARRAY['all levels', 'weight management goals'], 
 ARRAY['Fat loss', 'Muscle tone', 'Metabolic health']),

('Body Recomposition', 'body-recomp', 'Combined exercises for losing fat and gaining muscle',
 ARRAY['intermediate', 'advanced'], 
 ARRAY['Muscle gain', 'Fat loss', 'Strength increase']);

-- Add specialized exercise types
INSERT INTO exercise_types (category_id, name, slug, description, difficulty_level, duration_range, equipment_needed, space_required, is_outdoor) 
SELECT 
    c.id,
    'Quick Relief',
    'quick-relief',
    'Fast exercises for immediate relief and energy boost',
    'beginner',
    '[5,15]',
    ARRAY['none'],
    'minimal',
    FALSE
FROM exercise_categories c
WHERE c.slug IN ('desk-exercises', 'eye-health', 'stress-relief', 'back-neck-care');

-- Add specialized tracking fields
ALTER TABLE user_exercise_logs
ADD COLUMN IF NOT EXISTS focus_level_before INTEGER CHECK (focus_level_before BETWEEN 1 AND 10),
ADD COLUMN IF NOT EXISTS focus_level_after INTEGER CHECK (focus_level_after BETWEEN 1 AND 10),
ADD COLUMN IF NOT EXISTS stress_level_before INTEGER CHECK (stress_level_before BETWEEN 1 AND 10),
ADD COLUMN IF NOT EXISTS stress_level_after INTEGER CHECK (stress_level_after BETWEEN 1 AND 10),
ADD COLUMN IF NOT EXISTS creativity_level_before INTEGER CHECK (creativity_level_before BETWEEN 1 AND 10),
ADD COLUMN IF NOT EXISTS creativity_level_after INTEGER CHECK (creativity_level_after BETWEEN 1 AND 10);

-- Add specialized achievements
INSERT INTO exercise_achievements (name, description, criteria, icon_url)
VALUES 
('Eye Care Champion', 'Completed 30 days of eye exercises', 
 '{"type": "streak", "exercise_category": "eye-health", "days": 30}', '/icons/achievements/eye-care.svg'),
('Desk Warrior', 'Performed desk exercises consistently for 2 weeks', 
 '{"type": "completion", "exercise_category": "desk-exercises", "sessions": 20}', '/icons/achievements/desk-warrior.svg'),
('Mind-Body Balance', 'Achieved significant mood improvement through exercise', 
 '{"type": "improvement", "metric": "mood_impact", "threshold": 3}', '/icons/achievements/mind-body.svg');
