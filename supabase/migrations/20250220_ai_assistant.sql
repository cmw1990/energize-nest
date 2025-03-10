-- Create wellness_conversations table
CREATE TABLE IF NOT EXISTS wellness_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create wellness_recommendations table
CREATE TABLE IF NOT EXISTS wellness_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty VARCHAR(50) NOT NULL,
    duration VARCHAR(50),
    benefits TEXT[],
    completed BOOLEAN DEFAULT FALSE,
    due_date TIMESTAMPTZ,
    completion_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create wellness_ai_models table
CREATE TABLE IF NOT EXISTS wellness_ai_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_name VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL,
    parameters JSONB,
    training_data JSONB,
    performance_metrics JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create wellness_ai_feedback table
CREATE TABLE IF NOT EXISTS wellness_ai_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    conversation_id UUID REFERENCES wellness_conversations(id) ON DELETE CASCADE,
    recommendation_id UUID REFERENCES wellness_recommendations(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create recommendation_effectiveness view
CREATE OR REPLACE VIEW recommendation_effectiveness AS
SELECT 
    r.category,
    r.difficulty,
    COUNT(*) as total_recommendations,
    COUNT(*) FILTER (WHERE r.completed) as completed_recommendations,
    AVG(f.rating) as average_rating,
    ROUND((COUNT(*) FILTER (WHERE r.completed)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2) as completion_rate
FROM wellness_recommendations r
LEFT JOIN wellness_ai_feedback f ON r.id = f.recommendation_id
GROUP BY r.category, r.difficulty;

-- Create conversation_analytics view
CREATE OR REPLACE VIEW conversation_analytics AS
SELECT 
    user_id,
    DATE_TRUNC('day', timestamp) as day,
    COUNT(*) as total_messages,
    COUNT(*) FILTER (WHERE role = 'user') as user_messages,
    COUNT(*) FILTER (WHERE role = 'assistant') as assistant_messages,
    COUNT(*) FILTER (WHERE type = 'recommendation') as recommendations_given,
    COUNT(*) FILTER (WHERE type = 'insight') as insights_shared,
    COUNT(*) FILTER (WHERE type = 'exercise') as exercises_suggested
FROM wellness_conversations
GROUP BY user_id, DATE_TRUNC('day', timestamp);

-- Create function to get personalized recommendations
CREATE OR REPLACE FUNCTION get_personalized_recommendations(
    p_user_id UUID,
    p_category VARCHAR,
    p_limit INTEGER DEFAULT 5
)
RETURNS TABLE (
    id UUID,
    category VARCHAR,
    title VARCHAR,
    description TEXT,
    difficulty VARCHAR,
    predicted_effectiveness NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH user_preferences AS (
        SELECT 
            category,
            AVG(CASE WHEN completed THEN 1 ELSE 0 END) as completion_rate,
            AVG(f.rating) as avg_rating
        FROM wellness_recommendations r
        LEFT JOIN wellness_ai_feedback f ON r.id = f.recommendation_id
        WHERE r.user_id = p_user_id
        GROUP BY category
    )
    SELECT 
        r.id,
        r.category,
        r.title,
        r.description,
        r.difficulty,
        COALESCE(
            (up.completion_rate * 0.7 + COALESCE(up.avg_rating, 3) * 0.3)::NUMERIC,
            0.5
        ) as predicted_effectiveness
    FROM wellness_recommendations r
    LEFT JOIN user_preferences up ON r.category = up.category
    WHERE 
        r.user_id = p_user_id
        AND (p_category IS NULL OR r.category = p_category)
        AND NOT r.completed
    ORDER BY predicted_effectiveness DESC
    LIMIT p_limit;
END;
$$;

-- Add RLS policies
ALTER TABLE wellness_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_ai_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own conversations"
    ON wellness_conversations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations"
    ON wellness_conversations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own recommendations"
    ON wellness_recommendations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own recommendations"
    ON wellness_recommendations FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback"
    ON wellness_ai_feedback FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feedback"
    ON wellness_ai_feedback FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_conversations_user_timestamp ON wellness_conversations(user_id, timestamp);
CREATE INDEX idx_recommendations_user_category ON wellness_recommendations(user_id, category);
CREATE INDEX idx_feedback_user ON wellness_ai_feedback(user_id);
CREATE INDEX idx_conversations_type ON wellness_conversations(type);
CREATE INDEX idx_recommendations_completed ON wellness_recommendations(completed);

-- Create triggers for updated_at
CREATE TRIGGER update_conversations_updated_at
    BEFORE UPDATE ON wellness_conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recommendations_updated_at
    BEFORE UPDATE ON wellness_recommendations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_models_updated_at
    BEFORE UPDATE ON wellness_ai_models
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_feedback_updated_at
    BEFORE UPDATE ON wellness_ai_feedback
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
