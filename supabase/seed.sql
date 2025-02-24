-- Seed data for recipes
INSERT INTO recipes (title, description, ingredients, instructions, energy_impact, tags)
VALUES
  (
    'Morning Energy Smoothie',
    'A nutrient-rich smoothie to kickstart your day with sustained energy',
    ARRAY['1 banana', '1 cup spinach', '1 tbsp chia seeds', '1 cup almond milk', '1 tbsp honey'],
    ARRAY['Blend all ingredients until smooth', 'Serve immediately', 'Best consumed within 15 minutes'],
    85,
    ARRAY['breakfast', 'quick', 'vegetarian', 'high-energy']
  ),
  (
    'Power-Packed Quinoa Bowl',
    'A balanced meal with complex carbs, protein, and healthy fats',
    ARRAY['1 cup quinoa', '2 cups water', '1 avocado', '2 eggs', 'Mixed vegetables'],
    ARRAY['Cook quinoa in water', 'Prepare vegetables', 'Poach eggs', 'Assemble bowl', 'Add seasoning to taste'],
    90,
    ARRAY['lunch', 'protein-rich', 'meal-prep', 'gluten-free']
  ),
  (
    'Recovery Green Tea',
    'An antioxidant-rich tea blend for mental clarity and focus',
    ARRAY['Green tea leaves', 'Fresh mint', 'Lemon slice', 'Ginger', 'Honey'],
    ARRAY['Steep tea for 3 minutes', 'Add fresh mint and ginger', 'Sweeten with honey', 'Serve hot or cold'],
    70,
    ARRAY['beverage', 'focus', 'afternoon', 'antioxidants']
  );

-- When we get the service role token, we'll add:
-- 1. Test users
-- 2. Energy metrics data
-- 3. Activity records
-- 4. User preferences
-- 5. Consultation requests
