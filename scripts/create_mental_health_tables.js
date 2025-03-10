import fetch from 'node-fetch';

const supabaseUrl = 'https://zoubqdwxemivxrjruvam.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvdWJxZHd4ZW1pdnhyanJ1dmFtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODQyMDE5NywiZXhwIjoyMDUzOTk2MTk3fQ.VMGEmVXub9PA-lQiE4b1XJu-dqjdUq1UpqVnppynYFw';

// Function to make a Supabase REST API call
async function supabaseRestCall(endpoint, options = {}) {
  const response = await fetch(`${supabaseUrl}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseServiceRoleKey,
      'Authorization': `Bearer ${supabaseServiceRoleKey}`,
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || response.statusText);
  }

  return await response.json();
}

const createTables = async () => {
  try {
    // Create mood tracking table
    await supabaseRestCall('/rest/v1/rpc/exec_sql', {
      method: 'POST',
      body: JSON.stringify({
        query: `
          CREATE TABLE IF NOT EXISTS mood_tracking8 (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            timestamp TIMESTAMPTZ NOT NULL,
            mood_score INTEGER NOT NULL CHECK (mood_score >= 0 AND mood_score <= 10),
            energy_level INTEGER NOT NULL CHECK (energy_level >= 0 AND energy_level <= 10),
            activities TEXT[] DEFAULT '{}',
            triggers TEXT[] DEFAULT '{}',
            notes TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );

          ALTER TABLE mood_tracking8 ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Users can view own mood entries" ON mood_tracking8
            FOR SELECT USING (auth.uid() = user_id);
          CREATE POLICY "Users can insert own mood entries" ON mood_tracking8
            FOR INSERT WITH CHECK (auth.uid() = user_id);
        `
      })
    });

    // Create anxiety tracking table
    await supabaseRestCall('/rest/v1/rpc/exec_sql', {
      method: 'POST',
      body: JSON.stringify({
        query: `
          CREATE TABLE IF NOT EXISTS anxiety_tracking8 (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            timestamp TIMESTAMPTZ NOT NULL,
            anxiety_level INTEGER NOT NULL CHECK (anxiety_level >= 0 AND anxiety_level <= 10),
            physical_symptoms TEXT[] DEFAULT '{}',
            triggers TEXT[] DEFAULT '{}',
            coping_strategies TEXT[] DEFAULT '{}',
            effectiveness_score INTEGER CHECK (effectiveness_score >= 0 AND effectiveness_score <= 10),
            notes TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );

          ALTER TABLE anxiety_tracking8 ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Users can view own anxiety entries" ON anxiety_tracking8
            FOR SELECT USING (auth.uid() = user_id);
          CREATE POLICY "Users can insert own anxiety entries" ON anxiety_tracking8
            FOR INSERT WITH CHECK (auth.uid() = user_id);
        `
      })
    });

    // Create mindfulness sessions table
    await supabaseRestCall('/rest/v1/rpc/exec_sql', {
      method: 'POST',
      body: JSON.stringify({
        query: `
          CREATE TABLE IF NOT EXISTS mindfulness_sessions8 (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            timestamp TIMESTAMPTZ NOT NULL,
            session_type TEXT NOT NULL CHECK (session_type IN ('meditation', 'breathing', 'body_scan', 'visualization', 'grounding')),
            duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
            focus_quality INTEGER CHECK (focus_quality >= 0 AND focus_quality <= 10),
            calm_level_before INTEGER CHECK (calm_level_before >= 0 AND calm_level_before <= 10),
            calm_level_after INTEGER CHECK (calm_level_after >= 0 AND calm_level_after <= 10),
            notes TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );

          ALTER TABLE mindfulness_sessions8 ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Users can view own mindfulness sessions" ON mindfulness_sessions8
            FOR SELECT USING (auth.uid() = user_id);
          CREATE POLICY "Users can insert own mindfulness sessions" ON mindfulness_sessions8
            FOR INSERT WITH CHECK (auth.uid() = user_id);
        `
      })
    });

    // Create therapy goals table
    await supabaseRestCall('/rest/v1/rpc/exec_sql', {
      method: 'POST',
      body: JSON.stringify({
        query: `
          CREATE TABLE IF NOT EXISTS therapy_goals8 (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            goal_type TEXT NOT NULL CHECK (goal_type IN ('mood', 'anxiety', 'depression', 'ocd', 'mindfulness', 'general')),
            title TEXT NOT NULL,
            description TEXT,
            target_date TIMESTAMPTZ,
            progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
            status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'on_hold')),
            notes TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );

          ALTER TABLE therapy_goals8 ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Users can view own therapy goals" ON therapy_goals8
            FOR SELECT USING (auth.uid() = user_id);
          CREATE POLICY "Users can insert own therapy goals" ON therapy_goals8
            FOR INSERT WITH CHECK (auth.uid() = user_id);
          CREATE POLICY "Users can update own therapy goals" ON therapy_goals8
            FOR UPDATE USING (auth.uid() = user_id);
        `
      })
    });

    // Create updated_at function and triggers
    await supabaseRestCall('/rest/v1/rpc/exec_sql', {
      method: 'POST',
      body: JSON.stringify({
        query: `
          CREATE OR REPLACE FUNCTION update_updated_at_column()
          RETURNS TRIGGER AS $$
          BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
          END;
          $$ language 'plpgsql';

          CREATE TRIGGER update_mood_tracking8_updated_at
            BEFORE UPDATE ON mood_tracking8
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();

          CREATE TRIGGER update_anxiety_tracking8_updated_at
            BEFORE UPDATE ON anxiety_tracking8
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();

          CREATE TRIGGER update_mindfulness_sessions8_updated_at
            BEFORE UPDATE ON mindfulness_sessions8
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();

          CREATE TRIGGER update_therapy_goals8_updated_at
            BEFORE UPDATE ON therapy_goals8
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        `
      })
    });

    // Create indexes for better performance
    await supabaseRestCall('/rest/v1/rpc/exec_sql', {
      method: 'POST',
      body: JSON.stringify({
        query: `
          CREATE INDEX IF NOT EXISTS idx_mood_tracking8_user_timestamp ON mood_tracking8 (user_id, timestamp DESC);
          CREATE INDEX IF NOT EXISTS idx_anxiety_tracking8_user_timestamp ON anxiety_tracking8 (user_id, timestamp DESC);
          CREATE INDEX IF NOT EXISTS idx_mindfulness_sessions8_user_timestamp ON mindfulness_sessions8 (user_id, timestamp DESC);
          CREATE INDEX IF NOT EXISTS idx_therapy_goals8_user_status ON therapy_goals8 (user_id, status);
        `
      })
    });

    console.log('Successfully created all mental health tables!');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

createTables();
