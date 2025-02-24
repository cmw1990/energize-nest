-- Insert exercise categories
INSERT INTO exercise_categories (id, name, description) VALUES
  ('c001', 'Strength Training', 'Build muscle, increase strength, and improve bone density'),
  ('c002', 'Cardio', 'Improve heart health, endurance, and burn calories'),
  ('c003', 'Flexibility', 'Enhance range of motion, reduce muscle tension, and prevent injuries'),
  ('c004', 'Balance & Stability', 'Improve coordination, posture, and core strength'),
  ('c005', 'Mind-Body', 'Connect physical movement with mental wellness'),
  ('c006', 'High-Intensity', 'Maximize calorie burn and improve cardiovascular fitness'),
  ('c007', 'Recovery', 'Active recovery and injury prevention exercises');

-- Insert exercises
INSERT INTO exercises (
  id, category_id, name, description, difficulty, duration, calories,
  target_muscles, benefits, animation_url, video_url, image_urls
) VALUES
  (
    'e001',
    'c001',
    'Perfect Push-Up',
    'Master the fundamental push-up with proper form and progression',
    'beginner',
    10,
    100,
    ARRAY['chest', 'shoulders', 'triceps', 'core'],
    ARRAY[
      'Builds upper body strength',
      'Improves core stability',
      'Enhances shoulder mobility',
      'No equipment needed'
    ],
    'https://well-charged-assets.com/animations/push-up.webm',
    'https://well-charged-assets.com/videos/push-up-guide.mp4',
    ARRAY[
      'https://well-charged-assets.com/images/push-up-start.jpg',
      'https://well-charged-assets.com/images/push-up-down.jpg',
      'https://well-charged-assets.com/images/push-up-up.jpg'
    ]
  ),
  (
    'e002',
    'c001',
    'Bodyweight Squat',
    'Learn proper squat form to build lower body strength',
    'beginner',
    15,
    150,
    ARRAY['quadriceps', 'hamstrings', 'glutes', 'core'],
    ARRAY[
      'Strengthens lower body',
      'Improves mobility',
      'Enhances core stability',
      'Builds functional strength'
    ],
    'https://well-charged-assets.com/animations/squat.webm',
    'https://well-charged-assets.com/videos/squat-guide.mp4',
    ARRAY[
      'https://well-charged-assets.com/images/squat-start.jpg',
      'https://well-charged-assets.com/images/squat-down.jpg',
      'https://well-charged-assets.com/images/squat-up.jpg'
    ]
  ),
  (
    'e003',
    'c002',
    'High Knees',
    'Dynamic cardio exercise to elevate heart rate and improve coordination',
    'intermediate',
    20,
    200,
    ARRAY['quadriceps', 'hip flexors', 'calves', 'core'],
    ARRAY[
      'Improves cardiovascular endurance',
      'Enhances coordination',
      'Strengthens lower body',
      'Burns calories effectively'
    ],
    'https://well-charged-assets.com/animations/high-knees.webm',
    'https://well-charged-assets.com/videos/high-knees-guide.mp4',
    ARRAY[
      'https://well-charged-assets.com/images/high-knees-start.jpg',
      'https://well-charged-assets.com/images/high-knees-up.jpg'
    ]
  ),
  (
    'e004',
    'c003',
    'Dynamic Hip Stretch',
    'Improve hip mobility and flexibility',
    'beginner',
    10,
    50,
    ARRAY['hip flexors', 'glutes', 'lower back'],
    ARRAY[
      'Increases hip mobility',
      'Reduces lower back pain',
      'Improves posture',
      'Prevents injury'
    ],
    'https://well-charged-assets.com/animations/hip-stretch.webm',
    'https://well-charged-assets.com/videos/hip-stretch-guide.mp4',
    ARRAY[
      'https://well-charged-assets.com/images/hip-stretch-start.jpg',
      'https://well-charged-assets.com/images/hip-stretch-extend.jpg'
    ]
  ),
  (
    'e005',
    'c004',
    'Single-Leg Balance',
    'Enhance balance and stability through controlled movements',
    'beginner',
    15,
    75,
    ARRAY['core', 'glutes', 'ankles', 'calves'],
    ARRAY[
      'Improves balance',
      'Strengthens stabilizer muscles',
      'Enhances proprioception',
      'Prevents falls'
    ],
    'https://well-charged-assets.com/animations/single-leg-balance.webm',
    'https://well-charged-assets.com/videos/single-leg-balance-guide.mp4',
    ARRAY[
      'https://well-charged-assets.com/images/single-leg-balance-start.jpg',
      'https://well-charged-assets.com/images/single-leg-balance-hold.jpg'
    ]
  ),
  (
    'e006',
    'c005',
    'Sun Salutation Flow',
    'Classic yoga sequence to energize body and mind',
    'intermediate',
    20,
    120,
    ARRAY['full body', 'core', 'shoulders', 'hamstrings'],
    ARRAY[
      'Improves flexibility',
      'Reduces stress',
      'Enhances mind-body connection',
      'Increases energy levels'
    ],
    'https://well-charged-assets.com/animations/sun-salutation.webm',
    'https://well-charged-assets.com/videos/sun-salutation-guide.mp4',
    ARRAY[
      'https://well-charged-assets.com/images/sun-salutation-1.jpg',
      'https://well-charged-assets.com/images/sun-salutation-2.jpg',
      'https://well-charged-assets.com/images/sun-salutation-3.jpg'
    ]
  ),
  (
    'e007',
    'c006',
    'Burpee Challenge',
    'Full-body, high-intensity exercise for maximum calorie burn',
    'advanced',
    25,
    300,
    ARRAY['full body', 'core', 'chest', 'legs'],
    ARRAY[
      'Maximizes calorie burn',
      'Improves cardiovascular fitness',
      'Builds explosive power',
      'Enhances endurance'
    ],
    'https://well-charged-assets.com/animations/burpee.webm',
    'https://well-charged-assets.com/videos/burpee-guide.mp4',
    ARRAY[
      'https://well-charged-assets.com/images/burpee-start.jpg',
      'https://well-charged-assets.com/images/burpee-plank.jpg',
      'https://well-charged-assets.com/images/burpee-jump.jpg'
    ]
  );

-- Insert exercise steps
INSERT INTO exercise_steps (
  exercise_id, step_number, description, duration, image_url
) VALUES
  -- Push-up steps
  (
    'e001',
    1,
    'Start in a high plank position with hands slightly wider than shoulders',
    10,
    'https://well-charged-assets.com/images/push-up-start.jpg'
  ),
  (
    'e001',
    2,
    'Lower your body by bending your elbows, keeping core tight',
    15,
    'https://well-charged-assets.com/images/push-up-down.jpg'
  ),
  (
    'e001',
    3,
    'Push back up to starting position, maintaining proper form',
    15,
    'https://well-charged-assets.com/images/push-up-up.jpg'
  ),
  -- Squat steps
  (
    'e002',
    1,
    'Stand with feet shoulder-width apart, toes slightly pointed out',
    10,
    'https://well-charged-assets.com/images/squat-start.jpg'
  ),
  (
    'e002',
    2,
    'Lower your body by bending knees and hips, keeping chest up',
    15,
    'https://well-charged-assets.com/images/squat-down.jpg'
  ),
  (
    'e002',
    3,
    'Drive through heels to return to standing position',
    15,
    'https://well-charged-assets.com/images/squat-up.jpg'
  ),
  -- High Knees steps
  (
    'e003',
    1,
    'Stand tall with feet hip-width apart',
    10,
    'https://well-charged-assets.com/images/high-knees-start.jpg'
  ),
  (
    'e003',
    2,
    'Alternate driving knees up towards chest while staying light on toes',
    20,
    'https://well-charged-assets.com/images/high-knees-up.jpg'
  ),
  -- Hip Stretch steps
  (
    'e004',
    1,
    'Start in a lunge position with back knee on the ground',
    15,
    'https://well-charged-assets.com/images/hip-stretch-start.jpg'
  ),
  (
    'e004',
    2,
    'Gently shift weight forward while maintaining upright posture',
    20,
    'https://well-charged-assets.com/images/hip-stretch-extend.jpg'
  ),
  -- Single-Leg Balance steps
  (
    'e005',
    1,
    'Stand tall with feet together',
    10,
    'https://well-charged-assets.com/images/single-leg-balance-start.jpg'
  ),
  (
    'e005',
    2,
    'Lift one foot off ground and hold position, engaging core',
    30,
    'https://well-charged-assets.com/images/single-leg-balance-hold.jpg'
  ),
  -- Sun Salutation steps
  (
    'e006',
    1,
    'Start in mountain pose, hands at heart center',
    15,
    'https://well-charged-assets.com/images/sun-salutation-1.jpg'
  ),
  (
    'e006',
    2,
    'Sweep arms up and back into gentle backbend',
    15,
    'https://well-charged-assets.com/images/sun-salutation-2.jpg'
  ),
  (
    'e006',
    3,
    'Forward fold with straight legs',
    15,
    'https://well-charged-assets.com/images/sun-salutation-3.jpg'
  ),
  -- Burpee steps
  (
    'e007',
    1,
    'Start standing, then drop into a squat position',
    10,
    'https://well-charged-assets.com/images/burpee-start.jpg'
  ),
  (
    'e007',
    2,
    'Kick feet back into plank position',
    10,
    'https://well-charged-assets.com/images/burpee-plank.jpg'
  ),
  (
    'e007',
    3,
    'Perform push-up, then jump feet forward and explode up into jump',
    15,
    'https://well-charged-assets.com/images/burpee-jump.jpg'
  );
